'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  Download,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart3,
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SubjectResult {
  name: string;
  code: string;
  credits: number;
  marks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  status: 'pass' | 'fail';
}

interface SemesterResult {
  semester: number;
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalMarks: number;
  obtainedMarks: number;
  subjects: SubjectResult[];
}

interface ResultsData {
  semesters: SemesterResult[];
  cgpa: number;
  totalCredits: number;
  totalEarnedCredits: number;
}

function ResultsPage() {
  const [expandedSem, setExpandedSem] = useState<number | null>(null);

  const { data: results, isLoading } = useApiGet<ResultsData>(
    ['student-results'],
    '/student/results'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-6 w-40" />
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results) return null;

  const getGradeBadge = (grade: string) => {
    const gradeMap: Record<string, 'success' | 'info' | 'warning' | 'destructive'> = {
      'A+': 'success', 'A': 'success', 'B+': 'info', 'B': 'info',
      'C+': 'warning', 'C': 'warning', 'D': 'destructive', 'F': 'destructive',
    };
    return gradeMap[grade] || 'default';
  };

  const gpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-emerald-500';
    if (gpa >= 2.5) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Semester-wise academic performance
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} />
          Download Transcript
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Overall CGPA</p>
                <p className="text-3xl font-bold text-primary">{results.cgpa.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Semesters</p>
                <p className="text-3xl font-bold">{results.semesters.length}</p>
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
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Credits</p>
                <p className="text-3xl font-bold">{results.totalCredits}</p>
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
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Earned Credits</p>
                <p className="text-3xl font-bold text-emerald-500">{results.totalEarnedCredits}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        {results.semesters.map((sem, i) => (
          <motion.div
            key={sem.semester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Card className="glass-card border-0 overflow-hidden">
              <div
                className="cursor-pointer"
                onClick={() => setExpandedSem(expandedSem === sem.semester ? null : sem.semester)}
              >
                <CardHeader className="hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award size={20} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Semester {sem.semester}</CardTitle>
                        <CardDescription>
                          {sem.earnedCredits}/{sem.totalCredits} credits | {sem.obtainedMarks}/{sem.totalMarks} marks
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn('text-2xl font-bold', gpaColor(sem.gpa))}>
                        {sem.gpa.toFixed(2)}
                      </div>
                      {expandedSem === sem.semester ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </CardHeader>
              </div>
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
                            <TableHead className="text-center">Credits</TableHead>
                            <TableHead className="text-center">Marks</TableHead>
                            <TableHead className="text-center">Max</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead className="text-center">GP</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sem.subjects.map((subj) => (
                            <TableRow key={subj.code}>
                              <TableCell className="font-medium">{subj.name}</TableCell>
                              <TableCell className="text-muted-foreground">{subj.code}</TableCell>
                              <TableCell className="text-center">{subj.credits}</TableCell>
                              <TableCell className="text-center font-medium">{subj.marks}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{subj.maxMarks}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={getGradeBadge(subj.grade)}>{subj.grade}</Badge>
                              </TableCell>
                              <TableCell className="text-center">{subj.gradePoint.toFixed(1)}</TableCell>
                              <TableCell className="text-right">
                                {subj.status === 'pass' ? (
                                  <CheckCircle2 size={16} className="text-emerald-500 inline" />
                                ) : (
                                  <XCircle size={16} className="text-red-500 inline" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Semester GPA: <span className={cn('font-bold', gpaColor(sem.gpa))}>{sem.gpa.toFixed(2)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <FileText size={12} />
                        Semester Report
                      </Button>
                    </CardFooter>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ResultsPage;
