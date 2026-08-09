'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  Users,
  BookOpen,
  ClipboardList,
  Clock,
  Bell,
  Calendar,
  ChevronRight,
  Sparkles,
  UserCheck,
  Upload,
  FilePlus,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface FacultyStats {
  totalStudents: number;
  coursesTeaching: number;
  pendingAttendance: number;
  pendingGrading: number;
  totalAssignments: number;
  avgAttendance: number;
}

interface TodayClass {
  id: string;
  course: string;
  code: string;
  batch: string;
  room: string;
  time: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

interface PendingTask {
  id: string;
  title: string;
  course: string;
  deadline: string;
  type: 'attendance' | 'grading' | 'assignment';
  priority: 'high' | 'medium' | 'low';
}

interface RecentActivity {
  id: string;
  action: string;
  detail: string;
  time: string;
  type: string;
}

const quickActions = [
  { label: 'Mark Attendance', icon: UserCheck, href: '/dashboard/faculty/attendance', color: 'bg-emerald-500' },
  { label: 'Upload Marks', icon: Upload, href: '/dashboard/faculty/marks', color: 'bg-blue-500' },
  { label: 'Create Assignment', icon: FilePlus, href: '/dashboard/faculty/assignments', color: 'bg-amber-500' },
  { label: 'View Courses', icon: BookOpen, href: '/dashboard/faculty/courses', color: 'bg-purple-500' },
  { label: 'Timetable', icon: Clock, href: '/dashboard/faculty/timetable', color: 'bg-rose-500' },
  { label: 'Reports', icon: BarChart3, href: '/dashboard/faculty/reports', color: 'bg-cyan-500' },
];

const todaySchedule: TodayClass[] = [
  { id: '1', course: 'Data Structures', code: 'CS-301', batch: 'CS-A', room: 'Lab-3', time: '9:00 AM - 10:30 AM', type: 'lecture' },
  { id: '2', course: 'Database Systems', code: 'CS-302', batch: 'CS-B', room: 'Hall-2', time: '11:00 AM - 12:30 PM', type: 'lecture' },
  { id: '3', course: 'Algorithm Lab', code: 'CS-303', batch: 'CS-A', room: 'Lab-1', time: '2:00 PM - 4:00 PM', type: 'lab' },
];

const pendingTasks: PendingTask[] = [
  { id: '1', title: 'Mark attendance for CS-301', course: 'Data Structures', deadline: 'Today', type: 'attendance', priority: 'high' },
  { id: '2', title: 'Grade midterm papers', course: 'Database Systems', deadline: 'Jul 18', type: 'grading', priority: 'high' },
  { id: '3', title: 'Review assignment submissions', course: 'Algorithm Lab', deadline: 'Jul 20', type: 'assignment', priority: 'medium' },
];

const recentActivities: RecentActivity[] = [
  { id: '1', action: 'Marked attendance for', detail: 'CS-301 (45 present / 48 total)', time: '1 hour ago', type: 'attendance' },
  { id: '2', action: 'Uploaded marks for', detail: 'CS-302 Midterm Exam', time: '3 hours ago', type: 'marks' },
  { id: '3', action: 'Created new assignment', detail: 'Binary Search Tree Implementation', time: 'Yesterday', type: 'assignment' },
  { id: '4', action: 'Graded submissions for', detail: 'Algorithm Lab - Week 6', time: 'Yesterday', type: 'grading' },
];

const statsConfig = [
  { label: 'Total Students', icon: Users, key: 'totalStudents', suffix: '', gradient: 'from-blue-500 to-blue-600' },
  { label: 'Courses Teaching', icon: BookOpen, key: 'coursesTeaching', suffix: '', gradient: 'from-emerald-500 to-emerald-600' },
  { label: 'Pending Attendance', icon: ClipboardList, key: 'pendingAttendance', suffix: '', gradient: 'from-amber-500 to-amber-600' },
  { label: 'Assignments to Grade', icon: FileText, key: 'pendingGrading', suffix: '', gradient: 'from-purple-500 to-purple-600' },
];

function FacultyDashboardSkeleton() {
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
          <Card className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-24 w-full" /></CardContent></Card>
          <Card className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-32 w-full" /></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    </div>
  );
}

function FacultyDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: dashboardData, isLoading } = useApiGet<FacultyStats>(
    ['faculty-dashboard'],
    '/faculty/dashboard'
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <FacultyDashboardSkeleton />;

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
            {greeting}, {user?.fullName?.split(' ')[0] || 'Faculty'}
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
            onClick={() => router.push('/dashboard/ai-chatbot')}
            className="gap-2"
          >
            <Sparkles size={16} />
            AI Assistant
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => router.push('/dashboard/faculty/attendance')}
          >
            <UserCheck size={16} />
            Mark Attendance
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => {
          const value = dashboardData?.[stat.key as keyof FacultyStats] ?? (index === 0 ? 156 : index === 1 ? 4 : index === 2 ? 2 : 3);
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
                      <p className="text-2xl font-bold tracking-tight">{value}{stat.suffix}</p>
                    </div>
                    <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0', stat.gradient)}>
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
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Frequently used tasks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      onClick={() => router.push(action.href)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', action.color)}>
                        <action.icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-center">{action.label}</span>
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
                    <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
                    <CardDescription>Your classes for today</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => router.push('/dashboard/faculty/timetable')}
                  >
                    Full Timetable <ChevronRight size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((cls, i) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
                        cls.type === 'lab' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        cls.type === 'tutorial' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      )}>
                        {cls.type === 'lab' ? <GraduationCap size={20} className="text-purple-600 dark:text-purple-400" /> :
                         <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{cls.course}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.code} | {cls.batch} | Room: {cls.room}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium">{cls.time}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{cls.type}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
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
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest actions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <ScrollArea className="h-[200px] pr-2">
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {activity.action.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>{' '}
                            <span className="text-primary">{activity.detail}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
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
                    <CardTitle className="text-lg">Pending Tasks</CardTitle>
                    <CardDescription>Requires your attention</CardDescription>
                  </div>
                  <Badge variant="destructive" className="text-xs">{pendingTasks.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <ScrollArea className="h-[300px] pr-2">
                  <div className="space-y-3">
                    {pendingTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                            task.type === 'attendance' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                            task.type === 'grading' ? 'bg-amber-100 dark:bg-amber-900/30' :
                            'bg-blue-100 dark:bg-blue-900/30'
                          )}>
                            {task.type === 'attendance' ? <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" /> :
                             task.type === 'grading' ? <FileText size={14} className="text-amber-600 dark:text-amber-400" /> :
                             <FilePlus size={14} className="text-blue-600 dark:text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.course} • Due: {task.deadline}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                  View All Tasks <ChevronRight size={14} />
                </Button>
              </CardFooter>
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
                    <CardTitle className="text-lg">Attendance Overview</CardTitle>
                    <CardDescription>Average across courses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-primary">{dashboardData?.avgAttendance ?? 87}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall attendance</p>
                </div>
                <Progress value={dashboardData?.avgAttendance ?? 87} className="h-2.5" />
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Above 75%</span>
                  <span className="flex items-center gap-1"><AlertCircle size={12} className="text-amber-500" /> Below 75%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultyDashboardPage;
