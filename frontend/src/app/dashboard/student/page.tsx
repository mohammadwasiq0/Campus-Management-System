'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CalendarCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Bell,
  Calendar,
  FileText,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Library,
  Bus,
  Building2,
  MessageCircle,
  Percent,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  ScrollText,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  attendance: { percentage: number; total: number; present: number };
  upcomingExams: Array<{
    id: string; subject: string; date: string; time: string; type: string;
  }>;
  upcomingAssignments: Array<{
    id: string; title: string; subject: string; dueDate: string; status: string;
  }>;
  feeStatus: { total: number; paid: number; due: number; dueDate: string };
  recentNotices: Array<{
    id: string; title: string; content: string; date: string; priority: string;
  }>;
  stats: {
    coursesEnrolled: number;
    attendancePct: number;
    assignmentsPending: number;
    libraryBooks: number;
  };
}

const quickLinks = [
  { label: 'Courses', icon: BookOpen, href: '/dashboard/student/courses', color: 'bg-blue-500' },
  { label: 'Attendance', icon: CalendarCheck, href: '/dashboard/student/attendance', color: 'bg-emerald-500' },
  { label: 'Timetable', icon: Clock, href: '/dashboard/student/timetable', color: 'bg-purple-500' },
  { label: 'Exams', icon: ScrollText, href: '/dashboard/student/exams', color: 'bg-amber-500' },
  { label: 'Results', icon: TrendingUp, href: '/dashboard/student/results', color: 'bg-rose-500' },
  { label: 'Fees', icon: Wallet, href: '/dashboard/student/fees', color: 'bg-cyan-500' },
  { label: 'Library', icon: Library, href: '/dashboard/student/library', color: 'bg-indigo-500' },
  { label: 'AI Assistant', icon: Sparkles, href: '/dashboard/student/chatbot', color: 'bg-violet-500' },
];

const statCards = [
  { label: 'Courses Enrolled', icon: BookOpen, key: 'coursesEnrolled', suffix: '', gradient: 'from-blue-500 to-blue-600' },
  { label: 'Attendance', icon: Percent, key: 'attendancePct', suffix: '%', gradient: 'from-emerald-500 to-emerald-600' },
  { label: 'Pending Assignments', icon: FileText, key: 'assignmentsPending', suffix: '', gradient: 'from-amber-500 to-amber-600' },
  { label: 'Library Books', icon: Library, key: 'libraryBooks', suffix: '', gradient: 'from-purple-500 to-purple-600' },
];

function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: dashboardData, isLoading } = useApiGet<DashboardData>(
    ['student-dashboard'],
    '/student/dashboard'
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  if (isLoading) return <StudentDashboardSkeleton />;

  const d = dashboardData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl lg:text-3xl font-bold"
          >
            {greeting}, {user?.fullName?.split(' ')[0] || 'Student'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/student/chatbot')}
            className="gap-2"
          >
            <Sparkles size={16} />
            AI Assistant
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => router.push('/dashboard/student/applications')}
          >
            <FileText size={16} />
            New Application
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const value = d?.stats?.[stat.key as keyof typeof d.stats] ?? 0;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold tracking-tight">
                        {value}{stat.suffix}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0',
                        stat.gradient
                      )}
                    >
                      <stat.icon size={22} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                    <CardDescription>Navigate to key features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickLinks.map((link, i) => (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.03 }}
                      onClick={() => router.push(link.href)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', link.color)}>
                        <link.icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-center">{link.label}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Attendance Summary</CardTitle>
                    <CardDescription>Overall attendance percentage</CardDescription>
                  </div>
                  <Badge variant={d?.attendance?.percentage >= 75 ? 'success' : 'destructive'}>
                    {d?.attendance?.percentage ?? 0}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Present: {d?.attendance?.present ?? 0} / {d?.attendance?.total ?? 0} days
                    </span>
                    <span className="font-semibold">
                      {d?.attendance?.percentage ?? 0}%
                    </span>
                  </div>
                  <Progress
                    value={d?.attendance?.percentage ?? 0}
                    className={cn(
                      'h-3',
                      (d?.attendance?.percentage ?? 0) >= 75
                        ? '[&>div]:bg-emerald-500'
                        : (d?.attendance?.percentage ?? 0) >= 60
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-red-500'
                    )}
                  />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Present ({d?.attendance?.present ?? 0})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Absent ({(d?.attendance?.total ?? 0) - (d?.attendance?.present ?? 0)})
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1"
                  onClick={() => router.push('/dashboard/student/attendance')}
                >
                  View Detailed Attendance <ChevronRight size={14} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Upcoming Exams & Assignments</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => router.push('/dashboard/student/exams')}
                  >
                    View All <ChevronRight size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-2">
                  <div className="space-y-3">
                    {d?.upcomingExams?.map((exam, i) => (
                      <motion.div
                        key={exam.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <ScrollText size={18} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{exam.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.date} | {exam.time} | {exam.type}
                          </p>
                        </div>
                        <Badge variant="warning">Exam</Badge>
                      </motion.div>
                    ))}
                    {d?.upcomingAssignments?.map((asgn, i) => (
                      <motion.div
                        key={asgn.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                          <FileText size={18} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{asgn.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {asgn.subject} | Due: {asgn.dueDate}
                          </p>
                        </div>
                        <Badge variant={asgn.status === 'pending' ? 'warning' : 'success'}>
                          {asgn.status}
                        </Badge>
                      </motion.div>
                    ))}
                    {(!d?.upcomingExams?.length && !d?.upcomingAssignments?.length) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No upcoming exams or assignments
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Fee Status</CardTitle>
                    <CardDescription>Current semester</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push('/dashboard/student/fees')}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Fee</span>
                  <span className="text-sm font-semibold">₹{(d?.feeStatus?.total ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <span className="text-sm font-semibold text-emerald-500">₹{(d?.feeStatus?.paid ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Due</span>
                  <span className={cn(
                    'text-sm font-bold',
                    (d?.feeStatus?.due ?? 0) > 0 ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    ₹{(d?.feeStatus?.due ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {d?.feeStatus?.due && d.feeStatus.due > 0 && (
                  <>
                    <Progress
                      value={((d.feeStatus.paid / d.feeStatus.total) * 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Due date: {d.feeStatus.dueDate}
                    </p>
                    <Button
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => router.push('/dashboard/student/fees')}
                    >
                      <CreditCard size={14} />
                      Pay Now
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Notices</CardTitle>
                    <CardDescription>Official announcements</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push('/dashboard/student/notifications')}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <ScrollArea className="h-[280px] pr-2">
                  <div className="space-y-3">
                    {d?.recentNotices?.map((notice, i) => (
                      <motion.div
                        key={notice.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', getPriorityColor(notice.priority))} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notice.title}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">{notice.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 ml-3.5">
                          {notice.content}
                        </p>
                      </motion.div>
                    ))}
                    {(!d?.recentNotices?.length) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No new notices
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default StudentDashboardPage;
