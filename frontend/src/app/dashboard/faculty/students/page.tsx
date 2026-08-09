'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  Eye,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Download,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  batch: string;
  section: string;
  semester: string;
  course: string;
  attendance: number;
  cgpa: number;
  avatar?: string;
  parentName: string;
  parentPhone: string;
}

const students: Student[] = [
  { id: 's1', name: 'Ahmed Ali', rollNo: 'CS-2024-001', email: 'ahmed.ali@campus.edu', phone: '+91 98765 43201', batch: '2024-2028', section: 'A', semester: 'Sem 4', course: 'CS-301', attendance: 92, cgpa: 8.5, parentName: 'Mr. Ali Khan', parentPhone: '+91 98765 43200' },
  { id: 's2', name: 'Fatima Noor', rollNo: 'CS-2024-002', email: 'fatima.noor@campus.edu', phone: '+91 98765 43202', batch: '2024-2028', section: 'A', semester: 'Sem 4', course: 'CS-301', attendance: 88, cgpa: 7.8, parentName: 'Mr. Noor Ahmed', parentPhone: '+91 98765 43210' },
  { id: 's3', name: 'Rahul Sharma', rollNo: 'CS-2024-003', email: 'rahul.sharma@campus.edu', phone: '+91 98765 43203', batch: '2024-2028', section: 'B', semester: 'Sem 4', course: 'CS-302', attendance: 95, cgpa: 9.2, parentName: 'Mr. Rajesh Sharma', parentPhone: '+91 98765 43220' },
  { id: 's4', name: 'Priya Singh', rollNo: 'CS-2024-004', email: 'priya.singh@campus.edu', phone: '+91 98765 43204', batch: '2024-2028', section: 'B', semester: 'Sem 4', course: 'CS-302', attendance: 78, cgpa: 7.0, parentName: 'Mr. Vikram Singh', parentPhone: '+91 98765 43230' },
  { id: 's5', name: 'Omar Hassan', rollNo: 'CS-2024-005', email: 'omar.hassan@campus.edu', phone: '+91 98765 43205', batch: '2024-2028', section: 'A', semester: 'Sem 4', course: 'CS-301', attendance: 85, cgpa: 8.1, parentName: 'Mr. Hassan Iqbal', parentPhone: '+91 98765 43240' },
  { id: 's6', name: 'Sneha Patel', rollNo: 'CS-2024-006', email: 'sneha.patel@campus.edu', phone: '+91 98765 43206', batch: '2024-2028', section: 'A', semester: 'Sem 4', course: 'CS-303', attendance: 72, cgpa: 6.5, parentName: 'Mr. Amit Patel', parentPhone: '+91 98765 43250' },
  { id: 's7', name: 'Arjun Nair', rollNo: 'CS-2024-007', email: 'arjun.nair@campus.edu', phone: '+91 98765 43207', batch: '2023-2027', section: 'A', semester: 'Sem 6', course: 'CS-401', attendance: 90, cgpa: 8.8, parentName: 'Mr. Suresh Nair', parentPhone: '+91 98765 43260' },
  { id: 's8', name: 'Aisha Khan', rollNo: 'CS-2024-008', email: 'aisha.khan@campus.edu', phone: '+91 98765 43208', batch: '2024-2028', section: 'B', semester: 'Sem 4', course: 'CS-302', attendance: 65, cgpa: 5.9, parentName: 'Mr. Imran Khan', parentPhone: '+91 98765 43270' },
];

const courses = ['All', 'CS-301', 'CS-302', 'CS-303', 'CS-401'];
const sections = ['All', 'A', 'B'];

function FacultyStudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'All' || s.course === courseFilter;
    const matchSection = sectionFilter === 'All' || s.section === sectionFilter;
    return matchSearch && matchCourse && matchSection;
  });

  const avgAttendance = Math.round(filtered.reduce((a, s) => a + s.attendance, 0) / filtered.length);
  const avgCgpa = (filtered.reduce((a, s) => a + s.cgpa, 0) / filtered.length).toFixed(1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">View and manage students across courses</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} /> Export List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{students.length}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{avgAttendance}%</p>
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{avgCgpa}</p>
            <p className="text-xs text-muted-foreground">Avg CGPA</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{students.filter(s => s.attendance < 75).length}</p>
            <p className="text-xs text-muted-foreground">Low Attendance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name or roll no..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-56" />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>
                  {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="h-9 w-28"><SelectValue placeholder="Section" /></SelectTrigger>
                <SelectContent>
                  {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">{filtered.length} students found</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Batch/Section</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{student.rollNo}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <p className="text-sm">{student.batch}</p>
                    <p className="text-xs text-muted-foreground">Sec {student.section} • {student.semester}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${student.phone}`} className="text-muted-foreground hover:text-primary"><Phone size={12} /></a>
                      <a href={`mailto:${student.email}`} className="text-muted-foreground hover:text-primary"><Mail size={12} /></a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.attendance} className="h-2 w-16" />
                      <span className={cn('text-xs font-medium', student.attendance >= 75 ? 'text-emerald-500' : 'text-red-500')}>
                        {student.attendance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('font-semibold', student.cgpa >= 8 ? 'text-emerald-500' : student.cgpa >= 7 ? 'text-blue-500' : student.cgpa >= 6 ? 'text-amber-500' : 'text-red-500')}>
                      {student.cgpa}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedStudent(student)}>
                          <Eye size={14} />
                        </Button>
                      </DialogTrigger>
                      {selectedStudent && selectedStudent.id === student.id && (
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{selectedStudent.name}</p>
                                <p className="text-sm font-normal text-muted-foreground">{selectedStudent.rollNo}</p>
                              </div>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{selectedStudent.email}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="text-sm font-medium">{selectedStudent.phone}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <p className="text-xs text-muted-foreground">Course</p>
                                <p className="text-sm font-medium">{selectedStudent.course}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <p className="text-xs text-muted-foreground">Semester</p>
                                <p className="text-sm font-medium">{selectedStudent.semester}</p>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Performance</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.attendance}%</p>
                                  <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedStudent.cgpa}</p>
                                  <p className="text-xs text-muted-foreground">CGPA</p>
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Parent/Guardian</h4>
                              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 space-y-2">
                                <p className="text-sm">{selectedStudent.parentName}</p>
                                <p className="text-sm text-muted-foreground">{selectedStudent.parentPhone}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default FacultyStudentsPage;
