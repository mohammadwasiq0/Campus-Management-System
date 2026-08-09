'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  FileText,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  Upload,
  BarChart3,
  Layers,
  Calendar,
  BookMarked,
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
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  batch: string;
  section: string;
  semester: string;
  students: number;
  schedule: string;
  progress: number;
  materials: number;
}

interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  uploadedAt: string;
  size: string;
}

const myCourses: Course[] = [
  { id: '1', code: 'CS-301', name: 'Data Structures', credits: 4, batch: '2024-2028', section: 'A', semester: 'Sem 4', students: 48, schedule: 'Mon/Wed 9-10:30 AM', progress: 65, materials: 12 },
  { id: '2', code: 'CS-302', name: 'Database Systems', credits: 3, batch: '2024-2028', section: 'B', semester: 'Sem 4', students: 52, schedule: 'Tue/Thu 11-12:30 PM', progress: 70, materials: 8 },
  { id: '3', code: 'CS-303', name: 'Algorithm Lab', credits: 2, batch: '2024-2028', section: 'A', semester: 'Sem 4', students: 48, schedule: 'Wed/Fri 2-4 PM', progress: 55, materials: 6 },
  { id: '4', code: 'CS-401', name: 'Software Engineering', credits: 3, batch: '2023-2027', section: 'A', semester: 'Sem 6', students: 45, schedule: 'Mon/Wed 11-12:30 PM', progress: 40, materials: 5 },
];

const courseMaterials: Record<string, CourseMaterial[]> = {
  '1': [
    { id: 'm1', title: 'Arrays & Linked Lists Notes', type: 'pdf', uploadedAt: 'Jul 10, 2026', size: '2.4 MB' },
    { id: 'm2', title: 'Stack & Queue Lecture Video', type: 'video', uploadedAt: 'Jul 8, 2026', size: '45 MB' },
    { id: 'm3', title: 'Tree Traversal Reference', type: 'link', uploadedAt: 'Jul 5, 2026', size: '-' },
  ],
};

const studentList: Record<string, { id: string; name: string; rollNo: string; attendance: number; }[]> = {
  '1': [
    { id: 's1', name: 'Ahmed Ali', rollNo: 'CS-2024-001', attendance: 92 },
    { id: 's2', name: 'Fatima Noor', rollNo: 'CS-2024-002', attendance: 88 },
    { id: 's3', name: 'Rahul Sharma', rollNo: 'CS-2024-003', attendance: 95 },
    { id: 's4', name: 'Priya Singh', rollNo: 'CS-2024-004', attendance: 78 },
    { id: 's5', name: 'Omar Hassan', rollNo: 'CS-2024-005', attendance: 85 },
  ],
};

function FacultyCoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('1');
  const [view, setView] = useState<'overview' | 'materials' | 'students'>('overview');

  const { data: courses, isLoading } = useApiGet<Course[]>(['faculty-courses'], '/faculty/courses');

  const data = courses || myCourses;
  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Card key={i} className="glass-card border-0"><CardContent className="p-5"><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-6 w-24 mb-2" /><Skeleton className="h-4 w-full" /></CardContent></Card>)}</div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your assigned courses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-9 w-48"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={14} /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={cn(
                'glass-card border-0 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5',
                selectedCourse === course.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-xs text-muted-foreground">{course.code} • {course.credits} Credits</p>
                    </div>
                  </div>
                  <Badge variant="outline">{course.semester}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users size={12} /> {course.students} Students
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers size={12} /> {course.batch} | Sec {course.section}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} /> {course.schedule}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText size={12} /> {course.materials} Materials
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedCourse && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">
                    {data.find(c => c.id === selectedCourse)?.name}
                  </CardTitle>
                  <Badge variant="secondary">{data.find(c => c.id === selectedCourse)?.code}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push('/dashboard/faculty/attendance')}>
                    <UserCheck size={14} /> Attendance
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push('/dashboard/faculty/marks')}>
                    <Upload size={14} /> Upload Marks
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview" className="gap-2"><BookOpen size={14} /> Overview</TabsTrigger>
                  <TabsTrigger value="materials" className="gap-2"><FileText size={14} /> Materials</TabsTrigger>
                  <TabsTrigger value="students" className="gap-2"><Users size={14} /> Students</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                      <BookMarked size={20} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.find(c => c.id === selectedCourse)?.credits}</p>
                      <p className="text-xs text-muted-foreground">Credits</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                      <Users size={20} className="mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.find(c => c.id === selectedCourse)?.students}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                      <FileText size={20} className="mx-auto mb-1 text-amber-600 dark:text-amber-400" />
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.find(c => c.id === selectedCourse)?.materials}</p>
                      <p className="text-xs text-muted-foreground">Materials</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                      <BarChart3 size={20} className="mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.find(c => c.id === selectedCourse)?.progress}%</p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="space-y-3">
                  {(courseMaterials[selectedCourse] || []).map((mat) => (
                    <div key={mat.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center',
                          mat.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                          mat.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          'bg-gray-100 dark:bg-gray-800'
                        )}>
                          <FileText size={16} className={cn(
                            mat.type === 'pdf' ? 'text-red-600 dark:text-red-400' :
                            mat.type === 'video' ? 'text-blue-600 dark:text-blue-400' :
                            'text-gray-600 dark:text-gray-400'
                          )} />
                        </div>
                        <div><p className="text-sm font-medium">{mat.title}</p><p className="text-xs text-muted-foreground">{mat.uploadedAt} • {mat.size}</p></div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download size={14} /></Button>
                    </div>
                  ))}
                  {!(courseMaterials[selectedCourse] || []).length && (
                    <p className="text-sm text-muted-foreground text-center py-4">No materials uploaded yet</p>
                  )}
                  <Button variant="outline" size="sm" className="gap-2"><Upload size={14} /> Upload Material</Button>
                </TabsContent>

                <TabsContent value="students">
                  <div className="space-y-2">
                    {(studentList[selectedCourse] || []).map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {s.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.rollNo}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Attendance</p>
                            <p className={cn('text-sm font-semibold', s.attendance >= 75 ? 'text-emerald-500' : 'text-red-500')}>{s.attendance}%</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/faculty/students`)}>
                            <Eye size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FacultyCoursesPage;
