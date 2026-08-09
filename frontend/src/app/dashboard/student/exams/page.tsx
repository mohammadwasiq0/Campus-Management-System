'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  ScrollText,
  Calendar,
  Clock,
  MapPin,
  Download,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BookOpen,
  Award,
  FileText,
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
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: string;
  syllabus: string;
}

interface PreviousResult {
  semester: number;
  gpa: number;
  totalMarks: number;
  obtainedMarks: number;
  subjects: Array<{
    name: string;
    code: string;
    marks: number;
    maxMarks: number;
    grade: string;
    status: 'pass' | 'fail';
  }>;
}

interface ExamsData {
  upcoming: Exam[];
  previousResults: PreviousResult[];
  currentGPA: number;
}

function ExamsPage() {
  const [expandedSem, setExpandedSem] = useState<number | null>(null);

  const { data: examsData, isLoading } = useApiGet<ExamsData>(
    ['student-exams'],
    '/student/exams'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Exams</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Exam schedule and results
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} />
          Download Grade Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current GPA</p>
                  <p className="text-3xl font-bold text-primary">{examsData?.currentGPA?.toFixed(2) || '-'}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Exams</p>
                  <p className="text-3xl font-bold">{examsData?.upcoming?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Calendar size={24} className="text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Semesters Completed</p>
                  <p className="text-3xl font-bold">{examsData?.previousResults?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <BookOpen size={24} className="text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar size={14} />
            Upcoming Exams
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <TrendingUp size={14} />
            Previous Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Exam Schedule</CardTitle>
                <CardDescription>Your scheduled examinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {examsData?.upcoming?.length ? (
                  examsData.upcoming.map((exam, i) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex flex-col items-center justify-center shrink-0">
                        <ScrollText size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{exam.subject}</p>
                          <Badge variant="outline" className="text-[10px]">{exam.code}</Badge>
                          <Badge variant="warning" className="text-[10px]">{exam.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {exam.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {exam.time} ({exam.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {exam.location}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 shrink-0">
                        <FileText size={12} />
                        Syllabus
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No upcoming exams</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-4">
            {examsData?.previousResults?.length ? (
              examsData.previousResults.map((sem, i) => (
                <motion.div
                  key={sem.semester}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-card border-0">
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => setExpandedSem(expandedSem === sem.semester ? null : sem.semester)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Semester {sem.semester}</CardTitle>
                          <CardDescription>
                            GPA: {sem.gpa.toFixed(2)} | Total: {sem.obtainedMarks}/{sem.totalMarks}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={sem.gpa >= 3.5 ? 'success' : sem.gpa >= 2.5 ? 'warning' : 'destructive'}>
                            GPA: {sem.gpa.toFixed(2)}
                          </Badge>
                          {expandedSem === sem.semester ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {expandedSem === sem.semester && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Subject</TableHead>
                                  <TableHead>Code</TableHead>
                                  <TableHead className="text-center">Marks</TableHead>
                                  <TableHead className="text-center">Max</TableHead>
                                  <TableHead className="text-center">Grade</TableHead>
                                  <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sem.subjects.map((subj) => (
                                  <TableRow key={subj.code}>
                                    <TableCell className="font-medium">{subj.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{subj.code}</TableCell>
                                    <TableCell className="text-center font-medium">{subj.marks}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{subj.maxMarks}</TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={
                                        subj.grade === 'A' || subj.grade === 'A+'
                                          ? 'success'
                                          : subj.grade === 'B' || subj.grade === 'B+'
                                            ? 'info'
                                            : subj.grade === 'C' || subj.grade === 'C+'
                                              ? 'warning'
                                              : 'destructive'
                                      }>
                                        {subj.grade}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Badge variant={subj.status === 'pass' ? 'success' : 'destructive'}>
                                        {subj.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="glass-card border-0">
                <CardContent className="py-12">
                  <p className="text-sm text-muted-foreground text-center">No previous results available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default ExamsPage;
