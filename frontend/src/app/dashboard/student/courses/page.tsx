'use client';

import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  User,
  Hash,
  BarChart3,
  ExternalLink,
  FileText,
  Video,
  Download,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty: string;
  facultyId: string;
  schedule: string;
  room: string;
  attendancePct: number;
  totalClasses: number;
  attendedClasses: number;
  materials: Array<{ id: string; title: string; type: string; url: string; uploadedAt: string }>;
  syllabus: string;
  description: string;
}

function CoursesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CoursesPage() {
  const { data: courses, isLoading } = useApiGet<Course[]>(
    ['student-courses'],
    '/student/courses'
  );

  if (isLoading) return <CoursesSkeleton />;

  const getAttendanceColor = (pct: number) => {
    if (pct >= 75) return 'text-emerald-500 [&>div]:bg-emerald-500';
    if (pct >= 60) return 'text-amber-500 [&>div]:bg-amber-500';
    return 'text-red-500 [&>div]:bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enrolled courses for current semester
        </p>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid" className="gap-2">
            <BookOpen size={14} />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <BarChart3 size={14} />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300 group h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="info">{course.code}</Badge>
                      <Badge variant="secondary">{course.credits} Credits</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Faculty:</span>
                      <span className="font-medium">{course.faculty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Hash size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{course.room}</span>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className={cn('font-semibold', getAttendanceColor(course.attendancePct))}>
                          {course.attendancePct}%
                        </span>
                      </div>
                      <Progress
                        value={course.attendancePct}
                        className={cn('h-2', getAttendanceColor(course.attendancePct))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.attendedClasses} / {course.totalClasses} classes
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => window.open(course.syllabus, '_blank')}
                    >
                      <FileText size={12} />
                      Syllabus
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => window.open(`/dashboard/student/courses/${course.id}/materials`, '_blank')}
                    >
                      <Video size={12} />
                      Materials
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            {(!courses || courses.length === 0) && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p>No courses enrolled for current semester</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="glass-card border-0">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {courses?.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={22} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{course.name}</p>
                        <Badge variant="outline" className="text-[10px]">{course.code}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {course.faculty} | {course.schedule} | Room {course.room}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn('text-sm font-semibold', getAttendanceColor(course.attendancePct))}>
                        {course.attendancePct}%
                      </p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <Progress
                        value={course.attendancePct}
                        className={cn('h-1.5', getAttendanceColor(course.attendancePct))}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <ChevronRight size={16} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default CoursesPage;
