'use client';

import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  Clock,
  User,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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
import { Skeleton } from '@/components/ui/skeleton';

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

interface TimetableData {
  entries: TimetableEntry[];
  currentDay: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const typeColors: Record<string, string> = {
  lecture: 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  lab: 'bg-emerald-100 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
  tutorial: 'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
};

const typeBadgeVariants: Record<string, 'info' | 'success' | 'warning'> = {
  lecture: 'info',
  lab: 'success',
  tutorial: 'warning',
};

function TimetableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-24" />
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TimetablePage() {
  const { data: timetable, isLoading } = useApiGet<TimetableData>(
    ['student-timetable'],
    '/student/timetable'
  );

  if (isLoading) return <TimetableSkeleton />;

  const getEntriesForDay = (day: string) => {
    return timetable?.entries?.filter((e) => e.day.toLowerCase() === day.toLowerCase())
      .sort((a, b) => a.time.localeCompare(b.time)) ?? [];
  };

  const isCurrentDay = (day: string) => {
    const today = timetable?.currentDay || new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return day.toLowerCase() === today.toLowerCase();
  };

  const timeSlots = timetable?.entries
    ? [...new Set(timetable.entries.map((e) => e.time))].sort()
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Weekly class schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-medium">This Week</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="hidden xl:grid xl:grid-cols-7 gap-3">
        {days.map((day) => {
          const entries = getEntriesForDay(day);
          const isToday = isCurrentDay(day);
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: days.indexOf(day) * 0.05 }}
            >
              <Card
                className={cn(
                  'glass-card border-0 h-full',
                  isToday && 'ring-2 ring-primary shadow-lg'
                )}
              >
                <CardHeader className={cn(
                  'pb-2 px-3 pt-3',
                  isToday && 'bg-primary/5'
                )}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {day.slice(0, 3)}
                    </CardTitle>
                    {isToday && (
                      <Badge variant="info" className="text-[8px] px-1.5 py-0">Today</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 space-y-2">
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          'p-2 rounded-lg border text-xs space-y-1',
                          typeColors[entry.type]
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{entry.subject}</span>
                          <Badge variant={typeBadgeVariants[entry.type]} className="text-[8px] px-1 py-0">
                            {entry.type[0].toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock size={10} />
                          <span>{entry.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User size={10} />
                          <span className="truncate">{entry.faculty.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={10} />
                          <span>{entry.room}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No classes</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="xl:hidden space-y-4">
        {days.map((day) => {
          const entries = getEntriesForDay(day);
          const isToday = isCurrentDay(day);
          if (entries.length === 0) return null;
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={cn(
                'glass-card border-0',
                isToday && 'ring-2 ring-primary'
              )}>
                <CardHeader className={cn('pb-2', isToday && 'bg-primary/5')}>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{day}</CardTitle>
                    {isToday && <Badge variant="info">Today</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-xl border',
                        typeColors[entry.type]
                      )}
                    >
                      <div className="text-center shrink-0">
                        <p className="text-lg font-bold">{entry.time.split(':')[0]}</p>
                        <p className="text-[10px] text-muted-foreground">{entry.time.split(':')[1]}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{entry.subject}</p>
                          <Badge variant={typeBadgeVariants[entry.type]} className="text-[10px]">
                            {entry.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.code}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User size={11} />
                            {entry.faculty}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {entry.room}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default TimetablePage;
