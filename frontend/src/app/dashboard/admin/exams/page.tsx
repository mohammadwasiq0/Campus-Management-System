'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ScrollText, Search, Plus, Edit2, Trash2, Calendar, Clock, Users, Building2,
  ChevronLeft, ChevronRight, Download, Upload, Printer, BarChart3, FileSpreadsheet,
  CheckCircle2, XCircle, AlertTriangle, Loader2, MoreHorizontal, Eye,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface Exam {
  id: string; name: string; type: string; department: string; course: string;
  semester: number; date: string; time: string; duration: string; venue: string;
  totalStudents: number; appeared: number; status: 'scheduled' | 'ongoing' | 'completed' | 'published';
  invigilators: string[];
}

const sampleExams: Exam[] = [
  { id: '1', name: 'Data Structures - Mid Term', type: 'Mid Term', department: 'Computer Science', course: 'B.Tech CSE', semester: 4, date: '2026-07-15', time: '09:00', duration: '3 hours', venue: 'Auditorium A', totalStudents: 120, appeared: 0, status: 'scheduled', invigilators: ['Dr. Sarah Khan', 'Dr. Lisa Chen'] },
  { id: '2', name: 'Calculus II - Final', type: 'Final', department: 'Mathematics', course: 'B.Sc Math', semester: 4, date: '2026-07-18', time: '14:00', duration: '3 hours', venue: 'Hall 101', totalStudents: 60, appeared: 0, status: 'scheduled', invigilators: ['Prof. John Smith'] },
  { id: '3', name: 'Physics Lab Practical', type: 'Practical', department: 'Physics', course: 'B.Sc Physics', semester: 2, date: '2026-07-10', time: '10:00', duration: '2 hours', venue: 'Physics Lab', totalStudents: 45, appeared: 42, status: 'ongoing', invigilators: ['Dr. Aisha Patel'] },
  { id: '4', name: 'Principles of Management', type: 'Mid Term', department: 'Business Admin', course: 'BBA', semester: 2, date: '2026-07-05', time: '11:00', duration: '2 hours', venue: 'Hall 201', totalStudents: 90, appeared: 88, status: 'completed', invigilators: ['Prof. David Kim'] },
  { id: '5', name: 'Computer Networks - Final', type: 'Final', department: 'Computer Science', course: 'B.Tech CSE', semester: 6, date: '2026-07-01', time: '09:00', duration: '3 hours', venue: 'Auditorium B', totalStudents: 85, appeared: 83, status: 'published', invigilators: ['Dr. Lisa Chen'] },
  { id: '6', name: 'Thermodynamics Quiz', type: 'Quiz', department: 'Engineering', course: 'B.Tech ME', semester: 3, date: '2026-07-20', time: '15:00', duration: '1 hour', venue: 'Room 305', totalStudents: 55, appeared: 0, status: 'scheduled', invigilators: ['Prof. Robert Brown'] },
];

const examTypes = ['All Types', 'Mid Term', 'Final', 'Quiz', 'Practical', 'Viva'];
const statusFilters = ['All', 'Scheduled', 'Ongoing', 'Completed', 'Published'];

function ExamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showGradeCardDialog, setShowGradeCardDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = sampleExams.filter(e => {
    const m1 = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.course.toLowerCase().includes(searchQuery.toLowerCase());
    const m2 = typeFilter === 'All Types' || e.type === typeFilter;
    const m3 = statusFilter === 'All' || e.status === statusFilter.toLowerCase();
    return m1 && m2 && m3;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'scheduled': return 'info';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'published': return 'success';
      default: return 'outline';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Exam Management</h1><p className="text-muted-foreground mt-1">Schedule exams, publish results, manage grade cards</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowGradeCardDialog(true)}><FileSpreadsheet size={14} /> Grade Cards</Button>
          <Button variant="outline" size="sm" className="gap-2"><Printer size={14} /> Results</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Schedule Exam</Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search exams..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{examTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statusFilters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Venue</TableHead>
                <TableHead className="hidden lg:table-cell">Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((exam, i) => (
                <motion.tr key={exam.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><ScrollText size={16} className="text-amber-600" /></div>
                      <div><p className="text-sm font-medium">{exam.name}</p><p className="text-xs text-muted-foreground">{exam.type} | Sem {exam.semester}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{exam.course}</TableCell>
                  <TableCell className="hidden md:table-cell"><p className="text-sm">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p><p className="text-xs text-muted-foreground">{exam.time} | {exam.duration}</p></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{exam.venue}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={exam.appeared > 0 ? `${exam.appeared}/${exam.totalStudents}` : '—'} />
                    {exam.appeared > 0 && <Progress value={(exam.appeared / exam.totalStudents) * 100} className="h-1 mt-1 w-16" />}
                  </TableCell>
                  <TableCell><Badge variant={statusVariant(exam.status)} className="text-xs capitalize">{exam.status}</Badge></TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing filtered results</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<Button key={p} variant={currentPage === p ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(p)}>{p}</Button>))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>Schedule New Exam</DialogTitle><DialogDescription>Create a new exam schedule</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2"><Label>Exam Name</Label><Input placeholder="e.g., Data Structures - Mid Term" /></div>
            <div className="space-y-2"><Label>Exam Type</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Mid Term">Mid Term</SelectItem><SelectItem value="Final">Final</SelectItem><SelectItem value="Quiz">Quiz</SelectItem><SelectItem value="Practical">Practical</SelectItem><SelectItem value="Viva">Viva</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Business">Business Admin</SelectItem><SelectItem value="Engineering">Engineering</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Course</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="BTCS">B.Tech CSE</SelectItem><SelectItem value="BBA">BBA</SelectItem><SelectItem value="BSM">B.Sc Math</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Semester</Label><Select defaultValue="1"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
            <div className="space-y-2"><Label>Duration</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="1">1 hour</SelectItem><SelectItem value="2">2 hours</SelectItem><SelectItem value="3">3 hours</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Venue</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Auditorium A">Auditorium A</SelectItem><SelectItem value="Auditorium B">Auditorium B</SelectItem><SelectItem value="Hall 101">Hall 101</SelectItem><SelectItem value="Hall 201">Hall 201</SelectItem></SelectContent></Select></div>
            <div className="space-y-2 col-span-2"><Label>Invigilators</Label><Input placeholder="Assign invigilators (comma separated)" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button>Schedule Exam</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGradeCardDialog} onOpenChange={setShowGradeCardDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Generate Grade Cards</DialogTitle><DialogDescription>Select course and semester to generate grade cards</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Course</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="BTCS">B.Tech CSE</SelectItem><SelectItem value="BBA">BBA</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Semester</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="1">Semester 1</SelectItem><SelectItem value="2">Semester 2</SelectItem><SelectItem value="3">Semester 3</SelectItem></SelectContent></Select></div>
            <div className="flex gap-2">
              <Button className="flex-1"><Download size={14} className="mr-1" /> PDF</Button>
              <Button variant="outline" className="flex-1"><FileSpreadsheet size={14} className="mr-1" /> Excel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default ExamsPage;
