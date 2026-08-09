'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Search,
  Download,
  Save,
  Send,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  Award,
  BookOpen,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface MarkEntry {
  id: string;
  name: string;
  rollNo: string;
  marks: number;
  grade: string;
}

const exams = [
  { id: 'e1', name: 'Midterm Examination', subject: 'CS-301', maxMarks: 100 },
  { id: 'e2', name: 'Quiz 1', subject: 'CS-302', maxMarks: 20 },
  { id: 'e3', name: 'Lab Practical', subject: 'CS-303', maxMarks: 50 },
];

const subjects = [
  { id: 'CS-301', name: 'Data Structures' },
  { id: 'CS-302', name: 'Database Systems' },
  { id: 'CS-303', name: 'Algorithm Lab' },
];

const studentMarks: MarkEntry[] = [
  { id: 's1', name: 'Ahmed Ali', rollNo: 'CS-2024-001', marks: 85, grade: 'A' },
  { id: 's2', name: 'Fatima Noor', rollNo: 'CS-2024-002', marks: 72, grade: 'B+' },
  { id: 's3', name: 'Rahul Sharma', rollNo: 'CS-2024-003', marks: 91, grade: 'A+' },
  { id: 's4', name: 'Priya Singh', rollNo: 'CS-2024-004', marks: 65, grade: 'B' },
  { id: 's5', name: 'Omar Hassan', rollNo: 'CS-2024-005', marks: 78, grade: 'B+' },
  { id: 's6', name: 'Sneha Patel', rollNo: 'CS-2024-006', marks: 88, grade: 'A' },
  { id: 's7', name: 'Arjun Nair', rollNo: 'CS-2024-007', marks: 58, grade: 'C+' },
  { id: 's8', name: 'Aisha Khan', rollNo: 'CS-2024-008', marks: 45, grade: 'D' },
];

const gradeBoundaries = [
  { grade: 'A+', min: 90, color: 'text-emerald-600 dark:text-emerald-400' },
  { grade: 'A', min: 80, color: 'text-blue-600 dark:text-blue-400' },
  { grade: 'B+', min: 70, color: 'text-amber-600 dark:text-amber-400' },
  { grade: 'B', min: 60, color: 'text-orange-600 dark:text-orange-400' },
  { grade: 'C+', min: 50, color: 'text-purple-600 dark:text-purple-400' },
  { grade: 'C', min: 40, color: 'text-red-600 dark:text-red-400' },
  { grade: 'D', min: 0, color: 'text-red-600 dark:text-red-400' },
];

function calculateGrade(marks: number, maxMarks: number): string {
  const pct = (marks / maxMarks) * 100;
  const boundary = gradeBoundaries.find(b => pct >= b.min);
  return boundary?.grade || 'D';
}

const previousMarks = [
  { date: 'Jul 10, 2026', exam: 'Quiz 1', subject: 'CS-301', submitted: 48, approved: true },
  { date: 'Jul 5, 2026', exam: 'Midterm', subject: 'CS-302', submitted: 52, approved: true },
  { date: 'Jun 28, 2026', exam: 'Lab Practical', subject: 'CS-303', submitted: 48, approved: false },
];

function FacultyMarksPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState<MarkEntry[]>(studentMarks);
  const [maxMarks, setMaxMarks] = useState(100);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [search, setSearch] = useState('');

  const filteredMarks = marksData.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const startEditing = (student: MarkEntry) => {
    setEditingId(student.id);
    setEditValue(student.marks);
  };

  const saveMark = (id: string) => {
    setMarksData(prev => prev.map(s =>
      s.id === id ? { ...s, marks: editValue, grade: calculateGrade(editValue, maxMarks) } : s
    ));
    setEditingId(null);
  };

  const average = Math.round(marksData.reduce((a, s) => a + s.marks, 0) / marksData.length);
  const passCount = marksData.filter(s => parseFloat(s.grade.replace('+', '.5')) >= 4 || ['A+', 'A', 'B+', 'B', 'C+'].includes(s.grade)).length;
  const highest = Math.max(...marksData.map(s => s.marks));
  const lowest = Math.min(...marksData.map(s => s.marks));

  const handleExportCSV = () => {
    const headers = 'Name,Roll No,Marks,Grade\n';
    const rows = marksData.map(s => `${s.name},${s.rollNo},${s.marks},${s.grade}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_${selectedSubject || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Marks & Grades</h1>
          <p className="text-muted-foreground mt-1">Enter and manage student marks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </Button>
          <Button size="sm" className="gap-2">
            <Send size={14} /> Submit for Approval
          </Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Exam/Assessment</label>
              <Select value={selectedExam} onValueChange={(v) => {
                setSelectedExam(v);
                const exam = exams.find(e => e.id === v);
                if (exam) setMaxMarks(exam.maxMarks);
              }}>
                <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                <SelectContent>
                  {exams.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name} ({e.maxMarks} marks)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.id} - {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2"><BookOpen size={14} /> Load Students</Button>
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
                    <CardTitle className="text-lg">Enter Marks</CardTitle>
                    <CardDescription>Max marks: {maxMarks}</CardDescription>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search student..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-8 h-9 w-48"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead className="w-32 text-center">Marks (/{maxMarks})</TableHead>
                      <TableHead className="w-20 text-center">Grade</TableHead>
                      <TableHead className="w-20 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarks.map((student) => (
                      <TableRow key={student.id}>
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
                        <TableCell className="text-center">
                          {editingId === student.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={e => setEditValue(Number(e.target.value))}
                                className="h-8 w-20 text-center"
                                min={0}
                                max={maxMarks}
                              />
                              <button onClick={() => saveMark(student.id)} className="text-emerald-500 hover:text-emerald-600">
                                <CheckCircle2 size={16} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-600">
                                <XCircle size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(student)}
                              className="font-mono text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                            >
                              {student.marks}
                            </button>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn(
                            'font-mono',
                            student.grade.startsWith('A') ? 'border-emerald-200 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400' :
                            student.grade.startsWith('B') ? 'border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-400' :
                            student.grade.startsWith('C') ? 'border-amber-200 text-amber-600 dark:border-amber-900 dark:text-amber-400' :
                            'border-red-200 text-red-600 dark:border-red-900 dark:text-red-400'
                          )}>
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => startEditing(student)}
                          >
                            <Save size={12} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between py-3">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredMarks.length} of {marksData.length} students
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
                    <FileSpreadsheet size={14} /> Export
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Save size={14} /> Save All
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Previous Marks Records</CardTitle>
                <CardDescription>Recently submitted marks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previousMarks.map((record, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{record.exam} - {record.subject}</p>
                        <p className="text-xs text-muted-foreground">{record.date} • {record.submitted} students</p>
                      </div>
                      <Badge variant={record.approved ? 'success' : 'warning'}>
                        {record.approved ? 'Approved' : 'Pending'}
                      </Badge>
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
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{average}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{highest}</p>
                    <p className="text-xs text-muted-foreground">Highest</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowest}</p>
                    <p className="text-xs text-muted-foreground">Lowest</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{passCount}</p>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Grade Distribution</h4>
                  {gradeBoundaries.map((g) => {
                    const count = marksData.filter(s => s.grade === g.grade).length;
                    const pct = (count / marksData.length) * 100;
                    return (
                      <div key={g.grade} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium w-6">{g.grade}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            className={cn('h-full rounded-full', g.grade.startsWith('A') ? 'bg-emerald-500' : g.grade.startsWith('B') ? 'bg-blue-500' : g.grade.startsWith('C') ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Grade Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gradeBoundaries.map((g) => (
                    <div key={g.grade} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <span className={cn('font-semibold', g.color)}>{g.grade}</span>
                      <span className="text-muted-foreground">{g.min}% and above</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultyMarksPage;
