'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  GraduationCap, Search, Filter, Plus, MoreVertical, Edit2, Trash2, Upload,
  Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail, Phone,
  MapPin, Calendar, BookOpen, UserCheck, UserX, FileText, SlidersHorizontal,
  CheckCircle2, XCircle, AlertCircle, Loader2, Eye, RefreshCw, FileSpreadsheet,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Student {
  id: string; fullName: string; email: string; phone: string; rollNo: string;
  department: string; course: string; batch: string; semester: number;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: string; cgpa: number; attendance: number;
  avatar?: string;
}

const sampleStudents: Student[] = [
  { id: '1', fullName: 'Ahmed Ali', email: 'ahmed.ali@campus.edu', phone: '+91 98765 43210', rollNo: 'CS-2024-001', department: 'Computer Science', course: 'B.Tech CSE', batch: '2024-2028', semester: 4, status: 'active', enrollmentDate: '2024-09-01', cgpa: 8.5, attendance: 92 },
  { id: '2', fullName: 'Fatima Noor', email: 'fatima.noor@campus.edu', phone: '+91 98765 43211', rollNo: 'BA-2024-002', department: 'Business Admin', course: 'BBA', batch: '2024-2027', semester: 4, status: 'active', enrollmentDate: '2024-09-01', cgpa: 7.8, attendance: 88 },
  { id: '3', fullName: 'Robert Chen', email: 'robert.chen@campus.edu', phone: '+91 98765 43212', rollNo: 'EN-2024-003', department: 'Engineering', course: 'B.Tech ME', batch: '2024-2028', semester: 4, status: 'suspended', enrollmentDate: '2024-09-01', cgpa: 5.2, attendance: 65 },
  { id: '4', fullName: 'Priya Sharma', email: 'priya.sharma@campus.edu', phone: '+91 98765 43213', rollNo: 'CS-2024-004', department: 'Computer Science', course: 'B.Tech CSE', batch: '2024-2028', semester: 4, status: 'active', enrollmentDate: '2024-09-01', cgpa: 9.1, attendance: 96 },
  { id: '5', fullName: 'Mohammed Khan', email: 'mohammed.khan@campus.edu', phone: '+91 98765 43214', rollNo: 'MA-2024-005', department: 'Mathematics', course: 'B.Sc Math', batch: '2024-2027', semester: 4, status: 'active', enrollmentDate: '2024-09-01', cgpa: 7.5, attendance: 85 },
  { id: '6', fullName: 'Sara Williams', email: 'sara.williams@campus.edu', phone: '+91 98765 43215', rollNo: 'CS-2023-006', department: 'Computer Science', course: 'B.Tech CSE', batch: '2023-2027', semester: 6, status: 'active', enrollmentDate: '2023-09-01', cgpa: 8.9, attendance: 94 },
  { id: '7', fullName: 'Arjun Reddy', email: 'arjun.reddy@campus.edu', phone: '+91 98765 43216', rollNo: 'EN-2024-007', department: 'Engineering', course: 'B.Tech EE', batch: '2024-2028', semester: 4, status: 'inactive', enrollmentDate: '2024-09-01', cgpa: 6.8, attendance: 72 },
  { id: '8', fullName: 'Lisa Park', email: 'lisa.park@campus.edu', phone: '+91 98765 43217', rollNo: 'BA-2023-008', department: 'Business Admin', course: 'MBA', batch: '2023-2025', semester: 4, status: 'graduated', enrollmentDate: '2023-09-01', cgpa: 8.2, attendance: 90 },
];

const departments = ['All Departments', 'Computer Science', 'Mathematics', 'Business Admin', 'Engineering', 'Physics', 'Arts'];
const courses = ['All Courses', 'B.Tech CSE', 'B.Tech ME', 'B.Tech EE', 'BBA', 'MBA', 'B.Sc Math', 'B.Sc Physics'];
const batches = ['All Batches', '2024-2028', '2024-2027', '2023-2027', '2023-2025'];
const statuses = ['All', 'Active', 'Inactive', 'Suspended', 'Graduated'];

function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const perPage = 8;

  const filtered = sampleStudents.filter(s => {
    const m1 = !searchQuery || s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const m2 = deptFilter === 'All Departments' || s.department === deptFilter;
    const m3 = courseFilter === 'All Courses' || s.course === courseFilter;
    const m4 = batchFilter === 'All Batches' || s.batch === batchFilter;
    const m5 = statusFilter === 'All' || s.status === statusFilter.toLowerCase();
    return m1 && m2 && m3 && m4 && m5;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: string) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedStudents(prev => prev.length === paginated.length ? [] : paginated.map(s => s.id));

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      case 'graduated': return 'info';
      default: return 'outline';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage student records, enrollments, and academic information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowImportDialog(true)}><Upload size={14} /> Import CSV</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Add Student</Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or roll number..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            <Select value={courseFilter} onValueChange={v => { setCourseFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Course" /></SelectTrigger><SelectContent>{courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            <Select value={batchFilter} onValueChange={v => { setBatchFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Batch" /></SelectTrigger><SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      {selectedStudents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-0 bg-primary/5 border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedStudents.length} student(s) selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Email</Button>
                  <Button variant="outline" size="sm" className="gap-1"><UserCheck size={14} /> Activate</Button>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive"><UserX size={14} /> Deactivate</Button>
                  <Button variant="destructive" size="sm" className="gap-1"><Trash2 size={14} /> Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"><input type="checkbox" checked={selectedStudents.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden md:table-cell">Batch</TableHead>
                <TableHead className="hidden lg:table-cell">Semester</TableHead>
                <TableHead className="hidden lg:table-cell">CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedStudent(s); setShowDetailsDialog(true); }}>
                  <TableCell onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleSelect(s.id)} className="rounded" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{s.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{s.fullName}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{s.rollNo}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{s.course}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{s.batch}</TableCell>
                  <TableCell className="hidden lg:table-cell">Sem {s.semester}</TableCell>
                  <TableCell className="hidden lg:table-cell"><span className={cn('font-medium', s.cgpa >= 8 ? 'text-emerald-500' : s.cgpa >= 6 ? 'text-amber-500' : 'text-red-500')}>{s.cgpa}</span></TableCell>
                  <TableCell><Badge variant={getStatusVariant(s.status)} className="text-xs capitalize">{s.status}</Badge></TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedStudent(s); setShowEditDialog(true); }}><Edit2 size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={currentPage === p ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Add New Student</DialogTitle><DialogDescription>Enter student details to create a new record</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@campus.edu" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
            <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Business">Business Admin</SelectItem><SelectItem value="Engineering">Engineering</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Course</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem><SelectItem value="BBA">BBA</SelectItem><SelectItem value="B.Sc Math">B.Sc Math</SelectItem><SelectItem value="B.Tech ME">B.Tech ME</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Batch</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="2024-2028">2024-2028</SelectItem><SelectItem value="2024-2027">2024-2027</SelectItem><SelectItem value="2023-2027">2023-2027</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Semester</Label><Select defaultValue="1"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Address</Label><Input placeholder="Full address" className="col-span-2" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button>Create Student</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Import Students (CSV)</DialogTitle><DialogDescription>Upload a CSV file with student data</DialogDescription></DialogHeader>
          <div className="py-6">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drop CSV file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports .csv files up to 10MB</p>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium mb-1">Required columns:</p>
              <p className="text-xs text-muted-foreground">fullName, email, phone, department, course, batch (optional: rollNo, address)</p>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button><Button disabled><Upload size={14} className="mr-1" /> Import</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Student</DialogTitle><DialogDescription>Update student information</DialogDescription></DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue={selectedStudent.fullName} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={selectedStudent.email} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue={selectedStudent.phone} /></div>
              <div className="space-y-2"><Label>Course</Label><Select defaultValue={selectedStudent.course}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem><SelectItem value="BBA">BBA</SelectItem><SelectItem value="B.Sc Math">B.Sc Math</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Batch</Label><Select defaultValue={selectedStudent.batch}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024-2028">2024-2028</SelectItem><SelectItem value="2023-2027">2023-2027</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Semester</Label><Select defaultValue={selectedStudent.semester.toString()}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2 col-span-2"><Label>Status</Label><Select defaultValue={selectedStudent.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="graduated">Graduated</SelectItem></SelectContent></Select></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button><Button>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>Student Details</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="text-lg bg-primary/10 text-primary">{selectedStudent.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><h3 className="text-lg font-semibold">{selectedStudent.fullName}</h3><p className="text-sm text-muted-foreground">{selectedStudent.rollNo}</p><Badge variant={getStatusVariant(selectedStudent.status)} className="mt-1 capitalize">{selectedStudent.status}</Badge></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email</span><p>{selectedStudent.email}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p>{selectedStudent.phone}</p></div>
                <div><span className="text-muted-foreground">Department</span><p>{selectedStudent.department}</p></div>
                <div><span className="text-muted-foreground">Course</span><p>{selectedStudent.course}</p></div>
                <div><span className="text-muted-foreground">Batch</span><p>{selectedStudent.batch}</p></div>
                <div><span className="text-muted-foreground">Semester</span><p>Semester {selectedStudent.semester}</p></div>
                <div><span className="text-muted-foreground">CGPA</span><p className={cn('font-medium', selectedStudent.cgpa >= 8 ? 'text-emerald-500' : selectedStudent.cgpa >= 6 ? 'text-amber-500' : 'text-red-500')}>{selectedStudent.cgpa}</p></div>
                <div><span className="text-muted-foreground">Attendance</span><p className="font-medium">{selectedStudent.attendance}%</p></div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Attendance Progress</p>
                <div className="flex items-center gap-3">
                  <Progress value={selectedStudent.attendance} className="h-2.5 flex-1" />
                  <span className={cn('text-sm font-medium', selectedStudent.attendance >= 75 ? 'text-emerald-500' : 'text-red-500')}>{selectedStudent.attendance}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Send Email</Button>
                <Button variant="outline" size="sm" className="gap-1"><FileText size={14} /> View Academic Record</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default StudentsPage;
