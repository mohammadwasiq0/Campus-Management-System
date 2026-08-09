'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Calendar,
  ChevronDown,
  Filter,
  PieChart,
  LineChart,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface SubjectPerformance {
  subject: string;
  code: string;
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
  students: number;
  gradeDistribution: Record<string, number>;
}

interface ClassPerformance {
  batch: string;
  section: string;
  semester: string;
  avgAttendance: number;
  avgCgpa: number;
  totalStudents: number;
  subjects: number;
}

const classPerformance: ClassPerformance = {
  batch: '2024-2028', section: 'A', semester: 'Sem 4',
  avgAttendance: 87, avgCgpa: 7.8, totalStudents: 48, subjects: 4,
};

const subjectPerformances: SubjectPerformance[] = [
  {
    subject: 'Data Structures', code: 'CS-301', average: 76, highest: 95, lowest: 42, passRate: 88, students: 48,
    gradeDistribution: { 'A+': 8, 'A': 12, 'B+': 14, 'B': 8, 'C+': 4, 'C': 2, 'D': 0 },
  },
  {
    subject: 'Database Systems', code: 'CS-302', average: 72, highest: 91, lowest: 38, passRate: 85, students: 52,
    gradeDistribution: { 'A+': 6, 'A': 10, 'B+': 16, 'B': 10, 'C+': 6, 'C': 3, 'D': 1 },
  },
  {
    subject: 'Algorithm Lab', code: 'CS-303', average: 81, highest: 98, lowest: 55, passRate: 94, students: 48,
    gradeDistribution: { 'A+': 12, 'A': 14, 'B+': 12, 'B': 6, 'C+': 3, 'C': 1, 'D': 0 },
  },
  {
    subject: 'Software Engineering', code: 'CS-401', average: 74, highest: 92, lowest: 40, passRate: 86, students: 45,
    gradeDistribution: { 'A+': 7, 'A': 11, 'B+': 13, 'B': 8, 'C+': 4, 'C': 2, 'D': 0 },
  },
];

const monthlyTrendData = [
  { month: 'Jan', attendance: 85, performance: 72 },
  { month: 'Feb', attendance: 88, performance: 74 },
  { month: 'Mar', attendance: 82, performance: 70 },
  { month: 'Apr', attendance: 90, performance: 78 },
  { month: 'May', attendance: 87, performance: 76 },
  { month: 'Jun', attendance: 91, performance: 80 },
];

const reportsList = [
  { id: 'r1', name: 'Class Performance Report', type: 'PDF', date: 'Jul 15, 2026', size: '2.3 MB' },
  { id: 'r2', name: 'Subject-wise Analysis - Sem 4', type: 'Excel', date: 'Jul 14, 2026', size: '1.1 MB' },
  { id: 'r3', name: 'Attendance Summary - June 2026', type: 'PDF', date: 'Jul 1, 2026', size: '856 KB' },
  { id: 'r4', name: 'Grade Distribution Report', type: 'PDF', date: 'Jun 28, 2026', size: '1.5 MB' },
];

function BarChart({ data, maxValue, color }: { data: number[]; maxValue: number; color: string }) {
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(val / maxValue) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            className={`w-full rounded-md ${color}`}
            style={{ maxHeight: '100%', minHeight: 4 }}
          />
          <span className="text-[10px] text-muted-foreground">{['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'][i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChartVisual({ data }: { data: { month: string; attendance: number; performance: number }[] }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.attendance, d.performance)));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.attendance / maxVal) * 100,
  }));

  return (
    <div className="relative h-36">
      <div className="absolute inset-0 flex items-end">
        {data.map((d, i) => {
          const h = (d.attendance / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-3/4 rounded-t-md bg-emerald-400/70"
              />
              <span className="text-[8px] text-muted-foreground">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FacultyReportsPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjectData = selectedSubject === 'all'
    ? subjectPerformances
    : subjectPerformances.filter(s => s.code === selectedSubject);

  const overallAverage = Math.round(
    subjectPerformances.reduce((a, s) => a + s.average, 0) / subjectPerformances.length
  );
  const overallPassRate = Math.round(
    subjectPerformances.reduce((a, s) => a + s.passRate, 0) / subjectPerformances.length
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Class performance reports and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-9 w-44">
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filter subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjectPerformances.map(s => (
                <SelectItem key={s.code} value={s.code}>{s.code} - {s.subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} /> Download All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{classPerformance.totalStudents}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{overallAverage}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{overallPassRate}%</p>
            <p className="text-xs text-muted-foreground">Pass Rate</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">{classPerformance.avgCgpa}</p>
            <p className="text-xs text-muted-foreground">Avg CGPA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Subject-wise Performance</CardTitle>
                    <CardDescription>Average scores across subjects</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectData.map((sub, i) => (
                    <motion.div
                      key={sub.code}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-sm font-medium">{sub.subject}</p>
                          <p className="text-xs text-muted-foreground">{sub.code} • {sub.students} students</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{sub.average}%</p>
                          <p className="text-[10px] text-muted-foreground">{sub.passRate}% pass</p>
                        </div>
                      </div>
                      <Progress value={sub.average} className="h-2.5" />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>Low: {sub.lowest}</span>
                        <span>High: {sub.highest}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Grade Distribution</CardTitle>
                    <CardDescription>Grade breakdown across subjects</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">All Subjects</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[33, 47, 55, 32, 17, 8, 1]}
                  maxValue={55}
                  color="bg-gradient-to-t from-primary to-blue-400"
                />
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>A+: {33}</span>
                  <span>A: {47}</span>
                  <span>B+: {55}</span>
                  <span>B: {32}</span>
                  <span>C+: {17}</span>
                  <span>C: {8}</span>
                  <span>D: {1}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Monthly Trends</CardTitle>
                <CardDescription>Attendance & performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartVisual data={monthlyTrendData} />
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-400/70" /> Attendance</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400/70" /> Performance</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Class Overview</CardTitle>
                <CardDescription>{classPerformance.batch} • Sec {classPerformance.section}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{classPerformance.avgCgpa}</p>
                  <p className="text-xs text-muted-foreground">Average CGPA</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="text-sm font-semibold">{classPerformance.totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subjects</span>
                    <span className="text-sm font-semibold">{classPerformance.subjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Attendance</span>
                    <span className={cn('text-sm font-semibold', classPerformance.avgAttendance >= 75 ? 'text-emerald-500' : 'text-red-500')}>
                      {classPerformance.avgAttendance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Semester</span>
                    <span className="text-sm font-semibold">{classPerformance.semester}</span>
                  </div>
                </div>
                <Progress value={classPerformance.avgAttendance} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Download Reports</CardTitle>
                <CardDescription>Generated reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportsList.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground">{r.date} • {r.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download size={12} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultyReportsPage;
