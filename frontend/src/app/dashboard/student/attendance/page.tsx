'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  CalendarCheck,
  BarChart3,
  Download,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface SubjectAttendance {
  subject: string;
  code: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  percentage: number;
  present: number;
  total: number;
}

interface AttendanceData {
  overall: { percentage: number; present: number; absent: number; total: number };
  subjects: SubjectAttendance[];
  monthly: MonthlyData[];
  trend: 'up' | 'down' | 'stable';
}

function CircularProgress({ value, size = 160, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 75 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-xs text-muted-foreground">Overall</span>
      </div>
    </div>
  );
}

function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  const maxVal = Math.max(...data.map((d) => d.percentage), 100);

  return (
    <div className="flex items-end justify-between gap-2 h-40 pt-4">
      {data.map((item, i) => (
        <div key={item.month} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.percentage / maxVal) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            className={cn(
              'w-full rounded-md transition-colors',
              item.percentage >= 75 ? 'bg-emerald-400' : item.percentage >= 60 ? 'bg-amber-400' : 'bg-red-400'
            )}
            style={{ maxHeight: '100%' }}
          />
          <span className="text-[10px] text-muted-foreground">{item.month}</span>
          <span className="text-[10px] font-medium">{item.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

function AttendancePage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'semester'>('semester');

  const { data: attendance, isLoading } = useApiGet<AttendanceData>(
    ['student-attendance', dateRange],
    '/student/attendance',
    { range: dateRange }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card border-0 lg:col-span-1">
            <CardContent className="p-6 flex items-center justify-center">
              <Skeleton className="w-40 h-40 rounded-full" />
            </CardContent>
          </Card>
          <Card className="glass-card border-0 lg:col-span-2">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!attendance) return null;

  const getTrendIcon = () => {
    switch (attendance.trend) {
      case 'up': return <TrendingUp size={16} className="text-emerald-500" />;
      case 'down': return <TrendingDown size={16} className="text-red-500" />;
      default: return <Minus size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (pct: number) => {
    if (pct >= 75) return <Badge variant="success">Good</Badge>;
    if (pct >= 60) return <Badge variant="warning">Average</Badge>;
    return <Badge variant="destructive">Low</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your attendance across all subjects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-input bg-background p-1">
            {(['week', 'month', 'semester'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize',
                  dateRange === range
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <CircularProgress value={attendance.overall.percentage} />
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  {getTrendIcon()}
                  <span className="text-sm text-muted-foreground capitalize">{attendance.trend} trend</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on last 30 days
                </p>
              </div>
              <Separator />
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-500">{attendance.overall.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-500">{attendance.overall.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{attendance.overall.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-0 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 size={18} />
                    Monthly Attendance
                  </CardTitle>
                  <CardDescription>Attendance trend across months</CardDescription>
                </div>
                <Badge variant="outline">{dateRange}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart data={attendance.monthly} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarCheck size={18} />
                  Subject-wise Attendance
                </CardTitle>
                <CardDescription>Detailed attendance per subject</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.subjects.map((subj, i) => (
                  <motion.tr
                    key={subj.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{subj.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{subj.code}</TableCell>
                    <TableCell className="text-center">{subj.total}</TableCell>
                    <TableCell className="text-center text-emerald-500 font-medium">{subj.present}</TableCell>
                    <TableCell className="text-center text-red-500 font-medium">{subj.absent}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress
                          value={subj.percentage}
                          className={cn(
                            'w-20 h-1.5',
                            subj.percentage >= 75 ? '[&>div]:bg-emerald-500' : subj.percentage >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                          )}
                        />
                        <span className={cn(
                          'text-sm font-semibold w-12 text-right',
                          subj.percentage >= 75 ? 'text-emerald-500' : subj.percentage >= 60 ? 'text-amber-500' : 'text-red-500'
                        )}>
                          {subj.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{getStatusBadge(subj.percentage)}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="ghost" size="sm" className="gap-2 ml-auto">
              <Download size={14} />
              Download Full Report
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AttendancePage;
