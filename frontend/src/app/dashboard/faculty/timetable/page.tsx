'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Clock,
  BookOpen,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
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

interface TimetableSlot {
  id: string;
  course: string;
  code: string;
  room: string;
  time: string;
  type: 'lecture' | 'lab' | 'tutorial';
  batch: string;
}

interface DaySchedule {
  day: string;
  date: string;
  slots: TimetableSlot[];
}

const weekSchedule: DaySchedule[] = [
  {
    day: 'Monday', date: 'Jul 15',
    slots: [
      { id: 'm1', course: 'Data Structures', code: 'CS-301', room: 'Lab-3', time: '9:00 - 10:30', type: 'lecture', batch: 'CS-A' },
      { id: 'm2', course: 'Software Engineering', code: 'CS-401', room: 'Hall-2', time: '11:00 - 12:30', type: 'lecture', batch: 'CS-A (Sem 6)' },
    ],
  },
  {
    day: 'Tuesday', date: 'Jul 16',
    slots: [
      { id: 't1', course: 'Database Systems', code: 'CS-302', room: 'Hall-1', time: '11:00 - 12:30', type: 'lecture', batch: 'CS-B' },
      { id: 't2', course: 'Algorithm Lab', code: 'CS-303', room: 'Lab-1', time: '2:00 - 4:00', type: 'lab', batch: 'CS-A' },
    ],
  },
  {
    day: 'Wednesday', date: 'Jul 17',
    slots: [
      { id: 'w1', course: 'Data Structures', code: 'CS-301', room: 'Lab-3', time: '9:00 - 10:30', type: 'lecture', batch: 'CS-A' },
      { id: 'w2', course: 'Algorithm Lab', code: 'CS-303', room: 'Lab-1', time: '2:00 - 4:00', type: 'lab', batch: 'CS-A' },
    ],
  },
  {
    day: 'Thursday', date: 'Jul 18',
    slots: [
      { id: 'th1', course: 'Database Systems', code: 'CS-302', room: 'Hall-1', time: '11:00 - 12:30', type: 'lecture', batch: 'CS-B' },
      { id: 'th2', course: 'Faculty Meeting', code: '', room: 'Conference Room A', time: '2:00 - 4:00', type: 'meeting' as any, batch: '' },
    ],
  },
  {
    day: 'Friday', date: 'Jul 19',
    slots: [
      { id: 'f1', course: 'Software Engineering', code: 'CS-401', room: 'Hall-2', time: '11:00 - 12:30', type: 'lecture', batch: 'CS-A (Sem 6)' },
      { id: 'f2', course: 'Data Structures', code: 'CS-301', room: 'Lab-3', time: '2:00 - 3:30', type: 'tutorial', batch: 'CS-A' },
    ],
  },
  {
    day: 'Saturday', date: 'Jul 20',
    slots: [
      { id: 'sa1', course: 'Database Systems Lab', code: 'CS-302L', room: 'Lab-2', time: '9:00 - 11:00', type: 'lab', batch: 'CS-B' },
    ],
  },
  {
    day: 'Sunday', date: 'Jul 21',
    slots: [],
  },
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function FacultyTimetablePage() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredSchedule = weekSchedule.map(day => ({
    ...day,
    slots: typeFilter === 'all' ? day.slots : day.slots.filter(s => s.type === typeFilter),
  }));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'lab': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'tutorial': return 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lecture': return <Badge variant="info" className="text-[10px]">Lecture</Badge>;
      case 'lab': return <Badge variant="secondary" className="text-[10px]">Lab</Badge>;
      case 'tutorial': return <Badge variant="warning" className="text-[10px]">Tutorial</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">Meeting</Badge>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Timetable</h1>
          <p className="text-muted-foreground mt-1">Your weekly class schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-36">
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lecture">Lectures</SelectItem>
              <SelectItem value="lab">Labs</SelectItem>
              <SelectItem value="tutorial">Tutorials</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setCurrentWeek(w => w - 1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Calendar size={14} /> This Week
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setCurrentWeek(w => w + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {filteredSchedule.map((day, dayIdx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.05 }}
            className={cn(
              'rounded-xl border border-border/50 overflow-hidden',
              day.slots.length === 0 && 'opacity-50'
            )}
          >
            <div className={cn(
              'px-3 py-2.5 text-center border-b border-border/50',
              day.day === 'Sunday' ? 'bg-red-50 dark:bg-red-900/10' :
              dayIdx === new Date().getDay() - 1 ? 'bg-primary/5' : 'bg-muted/30'
            )}>
              <p className="text-xs font-semibold">{day.day.slice(0, 3)}</p>
              <p className="text-[10px] text-muted-foreground">{day.date}</p>
            </div>
            <div className="p-2 space-y-2 min-h-[180px]">
              {day.slots.length > 0 ? day.slots.map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    'p-2.5 rounded-lg border-l-4 text-xs space-y-1 cursor-pointer hover:shadow-md transition-all',
                    getTypeColor(slot.type)
                  )}
                  onClick={() => slot.code && router.push(`/dashboard/faculty/courses`)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{slot.course}</p>
                    {getTypeBadge(slot.type)}
                  </div>
                  {slot.code && <p className="text-muted-foreground">{slot.code}</p>}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={10} />
                    <span>{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={10} />
                    <span>{slot.room}</span>
                  </div>
                  {slot.batch && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCap size={10} />
                      <span>{slot.batch}</span>
                    </div>
                  )}
                </div>
              )) : (
                <div className="flex items-center justify-center h-[150px] text-xs text-muted-foreground">
                  No classes
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription>Your weekly teaching load</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {weekSchedule.reduce((a, d) => a + d.slots.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Classes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {weekSchedule.reduce((a, d) => a + d.slots.filter(s => s.type === 'lecture').length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Lectures</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {weekSchedule.reduce((a, d) => a + d.slots.filter(s => s.type === 'lab').length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Labs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {weekSchedule.reduce((a, d) => a + d.slots.filter(s => s.type === 'tutorial').length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Tutorials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default FacultyTimetablePage;
