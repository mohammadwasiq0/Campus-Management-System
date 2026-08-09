'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Info,
  Award,
  FileText,
  CreditCard,
  BookOpen,
  Bus,
  Building2,
  Library,
  MessageSquare,
  MoreHorizontal,
  Filter,
  ChevronRight,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'exam' | 'fee' | 'event' | 'result' | 'general' | 'application' | 'library' | 'hostel' | 'transport';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  exam: { icon: BookOpen, color: 'text-red-500', bg: 'bg-red-500/10' },
  fee: { icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  event: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  result: { icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  general: { icon: Info, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  application: { icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  library: { icon: Library, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  hostel: { icon: Building2, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  transport: { icon: Bus, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  const { data: notifications, isLoading, refetch } = useApiGet<Notification[]>(
    ['student-notifications'],
    '/student/notifications'
  );

  const markAllReadMutation = useApiPost('/student/notifications/mark-all-read', {
    onSuccess: () => {
      toast.success('All notifications marked as read');
      refetch();
    },
  });

  const filteredNotifications = notifications?.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-5 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'No unread notifications'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markAllReadMutation.mutate({})}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck size={14} />
              Mark All as Read
            </Button>
          )}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <Filter size={14} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="fee">Fee</SelectItem>
              <SelectItem value="result">Result</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="application">Application</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          {filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification, i) => {
                const config = typeConfig[notification.type] || typeConfig.general;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      'flex items-start gap-4 p-4 transition-colors hover:bg-muted/30',
                      !notification.isRead && 'bg-primary/5'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.bg)}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn(
                          'text-sm truncate',
                          !notification.isRead ? 'font-semibold' : 'font-medium'
                        )}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.link && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 mt-1 text-xs gap-1"
                          onClick={() => window.open(notification.link, '_self')}
                        >
                          View Details <ChevronRight size={10} />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Bell size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {filter === 'all'
                  ? 'No notifications yet'
                  : `No ${filter === 'unread' ? 'unread' : filter} notifications`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default NotificationsPage;
