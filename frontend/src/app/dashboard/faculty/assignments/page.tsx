'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  Send,
  Calendar,
  BookOpen,
  Award,
  ChevronDown,
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
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  maxMarks: number;
  totalSubmissions: number;
  totalStudents: number;
  gradedCount: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

interface Submission {
  id: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late';
  marks?: number;
  grade?: string;
  file?: string;
}

const assignments: Assignment[] = [
  { id: 'a1', title: 'Binary Search Tree Implementation', course: 'Data Structures', courseCode: 'CS-301', dueDate: 'Jul 25, 2026', maxMarks: 100, totalSubmissions: 42, totalStudents: 48, gradedCount: 30, status: 'active', createdAt: 'Jul 10, 2026' },
  { id: 'a2', title: 'SQL Query Optimization', course: 'Database Systems', courseCode: 'CS-302', dueDate: 'Jul 28, 2026', maxMarks: 50, totalSubmissions: 35, totalStudents: 52, gradedCount: 0, status: 'active', createdAt: 'Jul 12, 2026' },
  { id: 'a3', title: 'Sorting Algorithm Analysis', course: 'Algorithm Lab', courseCode: 'CS-303', dueDate: 'Jul 20, 2026', maxMarks: 75, totalSubmissions: 48, totalStudents: 48, gradedCount: 48, status: 'closed', createdAt: 'Jul 1, 2026' },
  { id: 'a4', title: 'Draft: Graph Theory Notes', course: 'Data Structures', courseCode: 'CS-301', dueDate: 'Aug 1, 2026', maxMarks: 30, totalSubmissions: 0, totalStudents: 48, gradedCount: 0, status: 'draft', createdAt: 'Jul 15, 2026' },
];

const submissions: Submission[] = [
  { id: 'sub1', studentName: 'Ahmed Ali', rollNo: 'CS-2024-001', submittedAt: 'Jul 22, 2026 11:45 AM', status: 'submitted', file: 'bst_implementation.pdf' },
  { id: 'sub2', studentName: 'Fatima Noor', rollNo: 'CS-2024-002', submittedAt: 'Jul 22, 2026 10:30 AM', status: 'graded', marks: 85, grade: 'A' },
  { id: 'sub3', studentName: 'Rahul Sharma', rollNo: 'CS-2024-003', submittedAt: 'Jul 21, 2026 2:15 PM', status: 'graded', marks: 92, grade: 'A+' },
  { id: 'sub4', studentName: 'Priya Singh', rollNo: 'CS-2024-004', submittedAt: 'Jul 23, 2026 9:00 AM', status: 'late', marks: 0 },
  { id: 'sub5', studentName: 'Omar Hassan', rollNo: 'CS-2024-005', submittedAt: 'Jul 22, 2026 4:20 PM', status: 'submitted', file: 'bst_analysis.pdf' },
  { id: 'sub6', studentName: 'Sneha Patel', rollNo: 'CS-2024-006', submittedAt: 'Jul 20, 2026 11:00 AM', status: 'graded', marks: 78, grade: 'B+' },
];

const newAssignmentDefault = { title: '', description: '', course: '', dueDate: '', maxMarks: 100 };

function FacultyAssignmentsPage() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>('a1');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState(newAssignmentDefault);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState(0);

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  const currentAssignment = assignments.find(a => a.id === selectedAssignment);

  const handleCreateAssignment = () => {
    setShowCreateDialog(false);
    setNewAssignment(newAssignmentDefault);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground mt-1">Create and manage assignments, view submissions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus size={16} /> Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Set up a new assignment for your course</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Assignment Title</label>
                <Input
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g., Binary Search Tree Implementation"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Course</label>
                <Select value={newAssignment.course} onValueChange={v => setNewAssignment({ ...newAssignment, course: v })}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS-301">CS-301 Data Structures</SelectItem>
                    <SelectItem value="CS-302">CS-302 Database Systems</SelectItem>
                    <SelectItem value="CS-303">CS-303 Algorithm Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea
                  value={newAssignment.description}
                  onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Provide detailed instructions for the assignment..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Due Date</label>
                  <Input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Max Marks</label>
                  <Input
                    type="number"
                    value={newAssignment.maxMarks}
                    onChange={e => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAssignment}>Create Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assignments" className="gap-2"><FileText size={14} /> Assignments</TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2"><Users size={14} /> Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4 mt-4">
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">All Assignments</CardTitle>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead className="text-center">Submissions</TableHead>
                    <TableHead className="text-center">Graded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((a) => (
                    <TableRow key={a.id} className={cn('cursor-pointer', selectedAssignment === a.id && 'bg-primary/5')} onClick={() => setSelectedAssignment(a.id)}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell className="text-muted-foreground">{a.courseCode}</TableCell>
                      <TableCell>{a.dueDate}</TableCell>
                      <TableCell>{a.maxMarks}</TableCell>
                      <TableCell className="text-center">{a.totalSubmissions}/{a.totalStudents}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn('font-medium', a.gradedCount === a.totalSubmissions && a.totalSubmissions > 0 ? 'text-emerald-500' : 'text-amber-500')}>
                          {a.gradedCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'active' ? 'success' : a.status === 'closed' ? 'secondary' : 'outline'}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {currentAssignment && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{currentAssignment.title}</CardTitle>
                  <CardDescription>{currentAssignment.course} • Due: {currentAssignment.dueDate} • Max Marks: {currentAssignment.maxMarks}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{currentAssignment.totalSubmissions}</p>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{currentAssignment.gradedCount}</p>
                      <p className="text-xs text-muted-foreground">Graded</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{currentAssignment.totalSubmissions - currentAssignment.gradedCount}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  <Progress value={(currentAssignment.gradedCount / currentAssignment.totalSubmissions) * 100} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4 mt-4">
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Student Submissions</CardTitle>
                  <CardDescription>View and grade submissions</CardDescription>
                </div>
                <Select defaultValue="a1">
                  <SelectTrigger className="w-64"><SelectValue placeholder="Select assignment" /></SelectTrigger>
                  <SelectContent>
                    {assignments.filter(a => a.status !== 'draft').map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {sub.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{sub.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{sub.rollNo}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{sub.submittedAt}</TableCell>
                      <TableCell>
                        <Badge variant={sub.status === 'graded' ? 'success' : sub.status === 'late' ? 'destructive' : 'warning'}>
                          {sub.status === 'late' ? <><AlertTriangle size={10} className="mr-1" /> Late</> : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {gradingId === sub.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <Input type="number" value={gradeValue} onChange={e => setGradeValue(Number(e.target.value))} className="h-7 w-16 text-center text-xs" min={0} max={100} />
                            <button onClick={() => setGradingId(null)} className="text-emerald-500"><CheckCircle2 size={14} /></button>
                            <button onClick={() => setGradingId(null)} className="text-red-500"><XCircle size={14} /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setGradingId(sub.id); setGradeValue(sub.marks || 0); }} className="font-mono text-sm font-medium hover:text-primary">
                            {sub.marks ?? '-'}
                          </button>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.grade && <Badge variant="outline" className="font-mono">{sub.grade}</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {sub.file && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Download submission">
                              <Download size={12} />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default FacultyAssignmentsPage;
