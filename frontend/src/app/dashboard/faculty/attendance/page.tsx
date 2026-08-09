'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Save,
  BarChart3,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  status: AttendanceStatus;
}

const courses = [
  { id: '1', code: 'CS-301', name: 'Data Structures', batch: 'CS-A' },
  { id: '2', code: 'CS-302', name: 'Database Systems', batch: 'CS-B' },
  { id: '3', code: 'CS-303', name: 'Algorithm Lab', batch: 'CS-A' },
];

const sessions = ['Morning (9:00 - 10:30)', 'Mid-Day (11:00 - 12:30)', 'Afternoon (2:00 - 4:00)'];

const initialStudents: Student[] = [
  { id: 's1', name: 'Ahmed Ali', rollNo: 'CS-2024-001', attendance: 92, status: 'present' },
  { id: 's2', name: 'Fatima Noor', rollNo: 'CS-2024-002', attendance: 88, status: 'present' },
  { id: 's3', name: 'Rahul Sharma', rollNo: 'CS-2024-003', attendance: 95, status: 'present' },
  { id: 's4', name: 'Priya Singh', rollNo: 'CS-2024-004', attendance: 78, status: 'absent' },
  { id: 's5', name: 'Omar Hassan', rollNo: 'CS-2024-005', attendance: 85, status: 'present' },
  { id: 's6', name: 'Sneha Patel', rollNo: 'CS-2024-006', attendance: 72, status: 'late' },
  { id: 's7', name: 'Arjun Nair', rollNo: 'CS-2024-007', attendance: 90, status: 'present' },
  { id: 's8', name: 'Aisha Khan', rollNo: 'CS-2024-008', attendance: 65, status: 'absent' },
];

const statusIcons: Record<AttendanceStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  present: { icon: <Check size={14} />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  absent: { icon: <X size={14} />, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  late: { icon: <Clock size={14} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
};

const previousAttendance = [
  { date: 'Jul 15, 2026', course: 'Data Structures', session: 'Morning', present: 42, total: 48, markedBy: 'Self' },
  { date: 'Jul 14, 2026', course: 'Database Systems', session: 'Mid-Day', present: 45, total: 52, markedBy: 'Self' },
  { date: 'Jul 12, 2026', course: 'Algorithm Lab', session: 'Afternoon', present: 40, total: 48, markedBy: 'Self' },
];

function FacultyAttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState('');
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [bulkAction, setBulkAction] = useState<AttendanceStatus | ''>('');
  const [submitted, setSubmitted] = useState(false);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const markAll = (status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    setBulkAction('');
  };

  const markStudent = (id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const attendancePercent = Math.round(((presentCount + lateCount) / students.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground mt-1">Record student attendance for your courses</p>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.code} - {c.name} ({c.batch})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Date</label>
              <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                <SelectContent>
                  {sessions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2">
                <Search size={14} /> Load Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Student List</CardTitle>
                    <CardDescription>{students.length} students enrolled</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search student..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-8 h-9 w-40"
                      />
                    </div>
                    <Select value={bulkAction} onValueChange={(v) => v && markAll(v as AttendanceStatus)}>
                      <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Bulk mark" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Mark All Present</SelectItem>
                        <SelectItem value="absent">Mark All Absent</SelectItem>
                        <SelectItem value="late">Mark All Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Overall Attendance</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, i) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{student.rollNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={student.attendance}
                              className="h-2 w-20"
                            />
                            <span className={cn(
                              'text-xs font-medium',
                              student.attendance >= 75 ? 'text-emerald-500' :
                              student.attendance >= 60 ? 'text-amber-500' : 'text-red-500'
                            )}>
                              {student.attendance}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {(['present', 'absent', 'late'] as AttendanceStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() => markStudent(student.id, status)}
                                className={cn(
                                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                                  student.status === status
                                    ? statusIcons[status].bg + ' ' + statusIcons[status].color + ' ring-2 ring-offset-1 ring-' +
                                      (status === 'present' ? 'emerald' : status === 'absent' ? 'red' : 'amber') + '-500'
                                    : 'bg-white/50 dark:bg-gray-800/50 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                )}
                                title={status.charAt(0).toUpperCase() + status.slice(1)}
                              >
                                {statusIcons[status].icon}
                              </button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between py-3">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredStudents.length} of {students.length} students
                </p>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setSubmitted(true)}
                  disabled={!selectedCourse || !selectedSession}
                >
                  <Save size={14} /> Submit Attendance
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Previous Attendance Records</CardTitle>
                <CardDescription>Recently marked attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previousAttendance.map((record, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{record.course}</p>
                          <p className="text-xs text-muted-foreground">{record.date} • {record.session}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{record.present}/{record.total}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today&apos;s Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{attendancePercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Attendance Rate</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Present</span>
                    <span className="text-sm font-semibold text-emerald-500">{presentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><X size={14} className="text-red-500" /> Absent</span>
                    <span className="text-sm font-semibold text-red-500">{absentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Clock size={14} className="text-amber-500" /> Late</span>
                    <span className="text-sm font-semibold text-amber-500">{lateCount}</span>
                  </div>
                </div>
                <Progress value={attendancePercent} className="h-2.5" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle size={12} />
                  <span>{students.filter(s => s.attendance < 75).length} students below 75% threshold</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Attendance Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <span className="text-xs text-muted-foreground">This Week</span>
                  <span className="text-xs font-semibold">91%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <span className="text-xs text-muted-foreground">This Month</span>
                  <span className="text-xs font-semibold">88%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSubmitted(false)}
        >
          <Card className="w-96 mx-4" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Attendance Submitted</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Attendance for {students.length} students has been recorded successfully.
              </p>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-500">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-500">{absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-500">{lateCount}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setSubmitted(false)}>Done</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FacultyAttendancePage;
