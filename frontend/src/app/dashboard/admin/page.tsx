'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  Users, GraduationCap, Wallet, CalendarCheck, TrendingUp, TrendingDown,
  ArrowUpRight, MoreHorizontal, Clock, Bell, Calendar, BookOpen, FileText,
  Plus, UserPlus, Sparkles, RefreshCw, ChevronRight, Zap, Activity, School,
  UserCog, Building2, Library, Bus, Home, BarChart3, Settings, Brain,
  Briefcase, Stethoscope, Target, AlertTriangle, CheckCircle2, XCircle,
  CreditCard, ScrollText, Percent, Shield, Globe, Database, Server, GitBranch,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStats {
  totalUsers: number; totalStudents: number; totalFaculty: number;
  totalStaff: number; totalCourses: number; revenue: number;
  monthlyCollection: number; pendingFees: number;
  activeApplications: number; placementRate: number;
}

const statCards = [
  { label: 'Total Users', key: 'totalUsers', icon: Users, gradient: 'from-blue-500 to-blue-600', suffix: '' },
  { label: 'Students', key: 'totalStudents', icon: GraduationCap, gradient: 'from-emerald-500 to-emerald-600', suffix: '' },
  { label: 'Faculty', key: 'totalFaculty', icon: BookOpen, gradient: 'from-purple-500 to-purple-600', suffix: '' },
  { label: 'Staff', key: 'totalStaff', icon: UserCog, gradient: 'from-amber-500 to-amber-600', suffix: '' },
  { label: 'Courses', key: 'totalCourses', icon: ScrollText, gradient: 'from-rose-500 to-rose-600', suffix: '' },
  { label: 'Revenue', key: 'revenue', icon: Wallet, gradient: 'from-cyan-500 to-cyan-600', suffix: '', isCurrency: true },
];

const quickActions = [
  { label: 'Users', icon: Users, href: '/dashboard/admin/users', color: 'bg-blue-500' },
  { label: 'Students', icon: GraduationCap, href: '/dashboard/admin/students', color: 'bg-emerald-500' },
  { label: 'Faculty', icon: BookOpen, href: '/dashboard/admin/faculty', color: 'bg-purple-500' },
  { label: 'Courses', icon: ScrollText, href: '/dashboard/admin/courses', color: 'bg-rose-500' },
  { label: 'Admissions', icon: FileText, href: '/dashboard/admin/admissions', color: 'bg-amber-500' },
  { label: 'Fees', icon: Wallet, href: '/dashboard/admin/fees', color: 'bg-cyan-500' },
  { label: 'Analytics', icon: BarChart3, href: '/dashboard/admin/analytics', color: 'bg-indigo-500' },
  { label: 'Settings', icon: Settings, href: '/dashboard/admin/settings', color: 'bg-gray-500' },
];

const systemHealth = [
  { name: 'Database', status: 'healthy', icon: Database, detail: '2.3ms avg query' },
  { name: 'API Server', status: 'healthy', icon: Server, detail: '99.8% uptime' },
  { name: 'Storage', status: 'warning', icon: Database, detail: '72% used' },
  { name: 'Cache', status: 'healthy', icon: Zap, detail: '98% hit rate' },
  { name: 'AI Services', status: 'healthy', icon: Brain, detail: 'Active' },
  { name: 'Email Service', status: 'healthy', icon: Globe, detail: 'Operational' },
];

const notifications = [
  { id: '1', title: 'Fee Payment Due', message: '45 students have pending fees', time: '2m ago', type: 'warning' },
  { id: '2', title: 'New Applications', message: '12 new applications received today', time: '15m ago', type: 'info' },
  { id: '3', title: 'Server Backup', message: 'Daily backup completed successfully', time: '1h ago', type: 'success' },
  { id: '4', title: 'Low Attendance', message: '3 students below 75% threshold', time: '2h ago', type: 'error' },
];

const recentRegistrations = [
  { id: '1', name: 'Ahmed Ali', role: 'Student', dept: 'Computer Science', date: 'Today' },
  { id: '2', name: 'Dr. Sarah Khan', role: 'Faculty', dept: 'Mathematics', date: 'Yesterday' },
  { id: '3', name: 'Fatima Noor', role: 'Student', dept: 'Business Admin', date: '2 days ago' },
  { id: '4', name: 'John Smith', role: 'Staff', dept: 'Administration', date: '3 days ago' },
  { id: '5', name: 'Maria Garcia', role: 'Student', dept: 'Engineering', date: '4 days ago' },
];

const departmentData = [
  { name: 'CS', students: 450, faculty: 28, color: 'bg-blue-500' },
  { name: 'Math', students: 320, faculty: 22, color: 'bg-emerald-500' },
  { name: 'Business', students: 380, faculty: 25, color: 'bg-amber-500' },
  { name: 'Engineering', students: 290, faculty: 20, color: 'bg-purple-500' },
  { name: 'Arts', students: 210, faculty: 18, color: 'bg-rose-500' },
];

const feeMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-4 w-20 mb-3" /><Skeleton className="h-8 w-16" /></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(2)].map((_, i) => <Card key={i} className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>)}
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => <Card key={i} className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-48 w-full" /></CardContent></Card>)}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: stats, isLoading } = useApiGet<AdminStats>(['admin-dashboard'], '/admin/dashboard');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <AdminDashboardSkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl lg:text-3xl font-bold">
            {greeting}, {user?.fullName?.split(' ')[0] || 'Admin'}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-1">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/admin/ai')} className="gap-2">
            <Brain size={16} /> AI Insights
          </Button>
          <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/admin/students')}>
            <UserPlus size={16} /> Add Student
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const val = stats?.[stat.key as keyof AdminStats] ?? 0;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold tracking-tight">{stat.isCurrency ? `₹${(val / 100000).toFixed(1)}L` : val}{stat.suffix}</p>
                    </div>
                    <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0', stat.gradient)}>
                      <stat.icon size={16} />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Quick Actions</CardTitle><CardDescription>All management functions</CardDescription></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.button key={action.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.03 }}
                      onClick={() => router.push(action.href)} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', action.color)}><action.icon size={18} /></div>
                      <span className="text-xs font-medium text-center">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Monthly Fee Collection</CardTitle><CardDescription>Current year overview</CardDescription></div>
                  <Badge variant="outline" className="text-xs">2026</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feeMonths.map((month, i) => {
                    const collected = 12 + Math.floor(Math.random() * 8);
                    const pending = 1 + Math.floor(Math.random() * 4);
                    const total = collected + pending;
                    const pct = (collected / total) * 100;
                    return (
                      <div key={month} className="space-y-1">
                        <div className="flex justify-between text-xs"><span className="text-muted-foreground">{month}</span><span className="font-medium">₹{((collected + pending) * 25000 / 100000).toFixed(1)}L</span></div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500" />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground"><span>Collected: ₹{(collected * 25000 / 100000).toFixed(1)}L</span><span>Pending: ₹{(pending * 25000 / 100000).toFixed(1)}L</span></div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Department Distribution</CardTitle><CardDescription>Students per department</CardDescription></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, i) => {
                    const max = Math.max(...departmentData.map(d => d.students));
                    return (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-sm"><span>{dept.name}</span><span className="font-medium">{dept.students} students</span></div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(dept.students / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className={cn('h-full rounded-full', dept.color)} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">{dept.faculty} faculty members</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">System Health</CardTitle><CardDescription>All systems operational</CardDescription></div>
                  <Badge variant="success" className="text-xs">All OK</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.map((sys, i) => (
                    <motion.div key={sys.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', sys.status === 'healthy' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30')}>
                        <sys.icon size={14} className={sys.status === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{sys.name}</p>
                        <p className="text-xs text-muted-foreground">{sys.detail}</p>
                      </div>
                      <div className={cn('w-2 h-2 rounded-full', sys.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Notifications</CardTitle><CardDescription>Recent alerts</CardDescription></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px] pr-2">
                  <div className="space-y-3">
                    {notifications.map((n, i) => (
                      <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          n.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : n.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' : n.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30')}>
                          {n.type === 'warning' ? <AlertTriangle size={14} className="text-amber-600" /> : n.type === 'info' ? <Bell size={14} className="text-blue-600" /> : n.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Recent Registrations</CardTitle><CardDescription>Latest signups</CardDescription></div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => router.push('/dashboard/admin/users')}>View All <ChevronRight size={14} /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRegistrations.map((reg, i) => (
                    <motion.div key={reg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{reg.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{reg.name}</p>
                        <p className="text-xs text-muted-foreground">{reg.role} - {reg.dept}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{reg.date}</span>
                    </motion.div>
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

export default AdminDashboardPage;
