'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  Bell,
  Calendar,
  BookOpen,
  FileText,
  Plus,
  UserPlus,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Zap,
  Activity,
  School,
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  gradient: string;
}

interface Activity {
  id: string;
  user: { name: string; avatar?: string; initials: string };
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'payment' | 'attendance';
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'academic' | 'sports' | 'cultural' | 'meeting';
}

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  postedBy: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Students',
    value: '2,847',
    change: '+12.5%',
    changeType: 'increase',
    icon: <Users size={22} />,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Faculty Members',
    value: '186',
    change: '+4.2%',
    changeType: 'increase',
    icon: <GraduationCap size={22} />,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Monthly Revenue',
    value: '₹4.8L',
    change: '+8.1%',
    changeType: 'increase',
    icon: <Wallet size={22} />,
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Avg. Attendance',
    value: '94.3%',
    change: '-2.1%',
    changeType: 'decrease',
    icon: <CalendarCheck size={22} />,
    gradient: 'from-purple-500 to-purple-600',
  },
];

const recentActivities: Activity[] = [
  {
    id: '1',
    user: { name: 'Dr. Sarah Khan', initials: 'SK' },
    action: 'updated attendance for',
    target: 'Computer Science Department',
    time: '2 minutes ago',
    type: 'attendance',
  },
  {
    id: '2',
    user: { name: 'Admin Office', initials: 'AO' },
    action: 'processed fee payment for',
    target: 'Ahmed Al-Rashid (CS-2024-0012)',
    time: '15 minutes ago',
    type: 'payment',
  },
  {
    id: '3',
    user: { name: 'Prof. John Smith', initials: 'JS' },
    action: 'uploaded new course material for',
    target: 'Data Structures (CS-301)',
    time: '1 hour ago',
    type: 'update',
  },
  {
    id: '4',
    user: { name: 'Registrar Office', initials: 'RO' },
    action: 'registered',
    target: '15 new students for Spring 2026',
    time: '2 hours ago',
    type: 'create',
  },
  {
    id: '5',
    user: { name: 'Library Staff', initials: 'LS' },
    action: 'added',
    target: '50 new books to the library catalog',
    time: '3 hours ago',
    type: 'create',
  },
  {
    id: '6',
    user: { name: 'Sports Dept.', initials: 'SD' },
    action: 'scheduled',
    target: 'Inter-department Cricket Tournament',
    time: '5 hours ago',
    type: 'update',
  },
];

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Final Exam - Semester 6',
    date: 'Jul 15, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Main Auditorium',
    type: 'academic',
  },
  {
    id: '2',
    title: 'Faculty Meeting',
    date: 'Jul 18, 2026',
    time: '2:00 PM - 4:00 PM',
    location: 'Conference Room A',
    type: 'meeting',
  },
  {
    id: '3',
    title: 'Annual Sports Day',
    date: 'Jul 25, 2026',
    time: '8:00 AM - 5:00 PM',
    location: 'University Ground',
    type: 'sports',
  },
  {
    id: '4',
    title: 'Cultural Fest 2026',
    date: 'Aug 5, 2026',
    time: '10:00 AM onwards',
    location: 'Campus Amphitheater',
    type: 'cultural',
  },
];

const notices: Notice[] = [
  {
    id: '1',
    title: 'Exam Schedule Published',
    content: 'The final examination schedule for all departments has been published. Students can check their exam timetable on the portal.',
    date: 'Jul 12, 2026',
    priority: 'high',
    postedBy: 'Examination Department',
  },
  {
    id: '2',
    title: 'Fee Reminder',
    content: 'Last date for fee payment for the current semester is July 20, 2026. Late payment will incur a penalty of ₹500.',
    date: 'Jul 11, 2026',
    priority: 'high',
    postedBy: 'Accounts Department',
  },
  {
    id: '3',
    title: 'Library Timings Extended',
    content: 'The library will remain open until 10:00 PM during the examination period starting July 14.',
    date: 'Jul 10, 2026',
    priority: 'medium',
    postedBy: 'Library',
  },
  {
    id: '4',
    title: 'New Course Registration Open',
    content: 'Registration for elective courses for the next semester is now open. Please consult with your advisors.',
    date: 'Jul 9, 2026',
    priority: 'medium',
    postedBy: 'Academic Affairs',
  },
  {
    id: '5',
    title: 'Holiday Notice',
    content: 'The campus will remain closed on August 15 on account of Independence Day.',
    date: 'Jul 8, 2026',
    priority: 'low',
    postedBy: 'Administration',
  },
];

const quickActions = [
  { label: 'Add Student', icon: UserPlus, href: '/dashboard/students/add', color: 'bg-blue-500' },
  { label: 'Create Event', icon: Calendar, href: '/dashboard/events/create', color: 'bg-emerald-500' },
  { label: 'Post Notice', icon: FileText, href: '/dashboard/notices', color: 'bg-amber-500' },
  { label: 'AI Assistant', icon: Sparkles, href: '/dashboard/ai-chatbot', color: 'bg-purple-500' },
];

const WeeklyAttendanceChart = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const values = [92, 88, 95, 87, 91, 78];
  const maxValue = Math.max(...values);

  return (
    <div className="flex items-end justify-between gap-2 h-32 pt-4">
      {days.map((day, i) => (
        <div key={day} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(values[i] / maxValue) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            className={cn(
              'w-full rounded-md transition-colors',
              values[i] >= 90 ? 'bg-emerald-400' : values[i] >= 80 ? 'bg-amber-400' : 'bg-red-400'
            )}
            style={{ maxHeight: '100%' }}
          />
          <span className="text-[10px] text-muted-foreground">{day}</span>
          <span className="text-[10px] font-medium">{values[i]}%</span>
        </div>
      ))}
    </div>
  );
};

const FeeCollectionChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const collected = [12, 15, 11, 18, 14, 16];
  const pending = [3, 2, 4, 1, 3, 2];

  return (
    <div className="space-y-3 pt-2">
      {months.map((month, i) => {
        const total = collected[i] + pending[i];
        const collectedPercent = (collected[i] / total) * 100;
        return (
          <div key={month} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{month}</span>
              <span className="font-medium">₹{(collected[i] + pending[i]) * 25000 / 100000}L</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${collectedPercent}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Collected: ₹{collected[i] * 25000 / 100000}L</span>
              <span>Pending: ₹{pending[i] * 25000 / 100000}L</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen size={14} className="text-blue-500" />;
      case 'sports':
        return <Activity size={14} className="text-emerald-500" />;
      case 'cultural':
        return <Sparkles size={14} className="text-purple-500" />;
      case 'meeting':
        return <Users size={14} className="text-amber-500" />;
      default:
        return <Calendar size={14} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Plus size={12} className="text-emerald-500" />;
      case 'update':
        return <RefreshCw size={12} className="text-blue-500" />;
      case 'payment':
        return <Wallet size={12} className="text-amber-500" />;
      case 'attendance':
        return <CalendarCheck size={12} className="text-purple-500" />;
      default:
        return <Bell size={12} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl lg:text-3xl font-bold"
          >
            {greeting}, {user?.fullName?.split(' ')[0] || 'User'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden sm:flex items-center gap-2"
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
          <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/students/add')}>
            <UserPlus size={16} />
            Add Student
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp size={14} className="text-emerald-500" />
                      ) : (
                        <TrendingDown size={14} className="text-red-500" />
                      )}
                      <span
                        className={cn(
                          'text-xs font-medium',
                          stat.changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'
                        )}
                      >
                        {stat.change} this month
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0',
                      stat.gradient
                    )}
                  >
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    <CardTitle className="text-lg">Attendance Trend</CardTitle>
                    <CardDescription>Weekly attendance percentage</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    This Week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <WeeklyAttendanceChart />
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
                    <CardTitle className="text-lg">Fee Collection</CardTitle>
                    <CardDescription>Monthly fee collection status</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    2026
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <FeeCollectionChart />
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
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push('/dashboard/events')}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <ScrollArea className="h-[240px] pr-2">
                  <div className="space-y-3">
                    {upcomingEvents.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                          <span className="text-[10px] font-bold leading-none">{event.date.split(' ')[1]}</span>
                          <span className="text-[8px]">{event.date.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            {getEventIcon(event.type)}
                            <p className="text-sm font-medium truncate">{event.title}</p>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Clock size={11} />
                            <span>{event.time}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{event.location}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
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
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest updates</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <ScrollArea className="h-[320px] pr-2">
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.03 }}
                        className="flex gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {activity.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          {i < recentActivities.length - 1 && (
                            <div className="w-px flex-1 bg-border/50 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user.name}</span>{' '}
                            {activity.action}{' '}
                            <span className="font-medium text-primary">{activity.target}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              {getActivityIcon(activity.type)}
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => router.push('/dashboard/activity')}>
                  View All Activity
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="lg:col-span-3"
      >
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notice Board</CardTitle>
                <CardDescription>Official announcements</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => router.push('/dashboard/notices')}
              >
                View All
                <ChevronRight size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-2 py-0',
                        notice.priority === 'high' && 'border-red-200 text-red-600 dark:border-red-900',
                        notice.priority === 'medium' && 'border-amber-200 text-amber-600 dark:border-amber-900',
                        notice.priority === 'low' && 'border-blue-200 text-blue-600 dark:border-blue-900',
                      )}
                    >
                      {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {notice.content}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Posted by: {notice.postedBy}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default DashboardPage;
