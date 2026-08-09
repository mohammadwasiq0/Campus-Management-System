-- Smart AI Campus Management System - Database Initialization Script
-- Developed by Mohammad Wasiq

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_students_student_code ON students(student_code);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_faculty_employee_code ON faculties(employee_code);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_accounts_student ON fee_accounts(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_library_items_isbn ON library_items(isbn);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(student_id, subject_id, date);
CREATE INDEX IF NOT EXISTS idx_exam_results_composite ON exam_results(exam_id, student_id);

-- Create view for student attendance summary
CREATE OR REPLACE VIEW student_attendance_summary AS
SELECT 
  s.id AS student_id, s.student_code, u.full_name, d.name AS department,
  sub.name AS subject,
  COUNT(a.id) AS total_classes,
  COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) AS present,
  COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) AS absent,
  COUNT(CASE WHEN a.status = 'LATE' THEN 1 END) AS late,
  ROUND((COUNT(CASE WHEN a.status IN ('PRESENT', 'LATE') THEN 1 END) * 100.0 / NULLIF(COUNT(a.id), 0)), 2) AS attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN departments d ON s.department_id = d.id
LEFT JOIN attendance a ON s.id = a.student_id
LEFT JOIN subjects sub ON a.subject_id = sub.id
GROUP BY s.id, s.student_code, u.full_name, d.name, sub.name;

-- Create view for fee summary
CREATE OR REPLACE VIEW fee_summary AS
SELECT 
  s.id AS student_id, s.student_code, u.full_name,
  COUNT(fa.id) AS total_accounts,
  SUM(fa.total_fees) AS total_fees,
  SUM(fa.paid_amount) AS total_paid,
  SUM(fa.due_amount) AS total_due,
  COUNT(CASE WHEN fa.fee_status = 'PAID' THEN 1 END) AS paid_accounts,
  COUNT(CASE WHEN fa.fee_status = 'OVERDUE' THEN 1 END) AS overdue_accounts
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN fee_accounts fa ON s.id = fa.student_id
GROUP BY s.id, s.student_code, u.full_name;

-- Create function to calculate CGPA
CREATE OR REPLACE FUNCTION calculate_cgpa(p_student_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_credits INTEGER;
  v_total_grade_points NUMERIC;
  v_cgpa NUMERIC;
BEGIN
  SELECT COALESCE(SUM(er.credit_hours), 0), COALESCE(SUM(er.grade_point * er.credit_hours), 0)
  INTO v_total_credits, v_total_grade_points
  FROM exam_results er
  WHERE er.student_id = p_student_id AND er.status = 'PUBLISHED';
  IF v_total_credits > 0 THEN v_cgpa := ROUND((v_total_grade_points / v_total_credits)::NUMERIC, 2);
  ELSE v_cgpa := 0; END IF;
  RETURN v_cgpa;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_trails(entity_type, entity_id, action, old_value, new_value, changed_by, ip_address)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id)::TEXT, TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    current_user, inet_client_addr()::TEXT);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for room occupancy
CREATE OR REPLACE FUNCTION update_room_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active THEN
    UPDATE hostel_rooms SET current_occupancy = current_occupancy + 1,
      status = CASE WHEN current_occupancy + 1 >= capacity THEN 'OCCUPIED'::text::hostel_room_status ELSE status END
    WHERE id = NEW.room_id;
  ELSIF TG_OP = 'UPDATE' AND NOT NEW.is_active AND OLD.is_active THEN
    UPDATE hostel_rooms SET current_occupancy = GREATEST(current_occupancy - 1, 0),
      status = 'AVAILABLE'::text::hostel_room_status
    WHERE id = NEW.room_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function for department stats
CREATE OR REPLACE FUNCTION get_department_stats(p_department_id UUID)
RETURNS TABLE(total_students BIGINT, total_faculty BIGINT, total_courses BIGINT, active_students BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM students WHERE department_id = p_department_id) AS total_students,
    (SELECT COUNT(*) FROM faculties WHERE department_id = p_department_id) AS total_faculty,
    (SELECT COUNT(*) FROM courses WHERE department_id = p_department_id) AS total_courses,
    (SELECT COUNT(*) FROM students WHERE department_id = p_department_id AND enrollment_status = 'ACTIVE') AS active_students;
END;
$$ LANGUAGE plpgsql;

-- Create function to check attendance threshold
CREATE OR REPLACE FUNCTION check_attendance_threshold()
RETURNS TABLE(student_id UUID, student_name TEXT, attendance_percentage NUMERIC, below_threshold BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, u.full_name::TEXT,
    ROUND((COUNT(CASE WHEN a.status IN ('PRESENT', 'LATE') THEN 1 END) * 100.0 / NULLIF(COUNT(a.id), 0)), 2),
    (COUNT(CASE WHEN a.status IN ('PRESENT', 'LATE') THEN 1 END) * 100.0 / NULLIF(COUNT(a.id), 0)) < 75
  FROM students s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN attendance a ON s.id = a.student_id
  GROUP BY s.id, u.full_name
  HAVING (COUNT(CASE WHEN a.status IN ('PRESENT', 'LATE') THEN 1 END) * 100.0 / NULLIF(COUNT(a.id), 0)) < 75;
END;
$$ LANGUAGE plpgsql;

-- Create student portal view
CREATE OR REPLACE VIEW student_portal_view AS
SELECT s.id, s.student_code, s.roll_number, s.batch_year, s.current_semester,
  s.enrollment_status, u.full_name, u.email, u.phone, u.profile_picture,
  d.name AS department, c.name AS course, b.name AS batch, sec.name AS section
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN departments d ON s.department_id = d.id
LEFT JOIN courses c ON s.course_id = c.id
LEFT JOIN batches b ON s.batch_id = b.id
LEFT JOIN sections sec ON s.section_id = sec.id;

-- Create function for transcript
CREATE OR REPLACE FUNCTION generate_transcript(p_student_id UUID)
RETURNS TABLE(semester INTEGER, subject_code TEXT, subject_name TEXT, credit_hours INTEGER, marks_obtained NUMERIC, grade TEXT, grade_point NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT ex.semester, sub.code::TEXT, sub.name::TEXT, er.credit_hours, er.marks_obtained, er.grade, er.grade_point
  FROM exam_results er
  JOIN exams ex ON er.exam_id = ex.id
  JOIN subjects sub ON ex.subject_id = sub.id
  WHERE er.student_id = p_student_id AND er.status = 'PUBLISHED'
  ORDER BY ex.semester, sub.code;
END;
$$ LANGUAGE plpgsql;

-- Set PostgreSQL performance parameters
ALTER SYSTEM SET max_connections = '200';
ALTER SYSTEM SET shared_buffers = '2GB';
ALTER SYSTEM SET effective_cache_size = '6GB';
ALTER SYSTEM SET work_mem = '64MB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET random_page_cost = '1.1';
ALTER SYSTEM SET effective_io_concurrency = '200';
ALTER SYSTEM SET wal_buffers = '64MB';
ALTER SYSTEM SET default_statistics_target = '100';
SELECT pg_reload_conf();

-- Verify initialization
SELECT 'Database initialization completed successfully' AS status;
