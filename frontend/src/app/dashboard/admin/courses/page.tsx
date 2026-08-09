'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BookOpen, Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Layers,
  Users, Clock, Calendar, BookMarked, GraduationCap, FileText, MoreHorizontal,
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, FolderOpen,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface Subject {
  id: string; name: string; code: string; credits: number; hours: number;
  type: 'core' | 'elective' | 'lab'; faculty: string;
}

interface Batch {
  id: string; name: string; year: string; sections: number; students: number;
}

interface Course {
  id: string; name: string; code: string; department: string; duration: string;
  totalSemesters: number; totalCredits: number; subjects: Subject[];
  batches: Batch[]; status: 'active' | 'inactive'; description: string;
}

const sampleCourses: Course[] = [
  {
    id: '1', name: 'B.Tech Computer Science', code: 'BTCS', department: 'Computer Science',
    duration: '4 Years', totalSemesters: 8, totalCredits: 160, status: 'active',
    description: 'Bachelor of Technology in Computer Science and Engineering',
    subjects: [
      { id: 's1', name: 'Data Structures', code: 'CS301', credits: 4, hours: 4, type: 'core', faculty: 'Dr. Sarah Khan' },
      { id: 's2', name: 'Algorithms', code: 'CS302', credits: 4, hours: 4, type: 'core', faculty: 'Dr. Sarah Khan' },
      { id: 's3', name: 'Database Systems', code: 'CS303', credits: 3, hours: 3, type: 'core', faculty: 'Dr. Lisa Chen' },
      { id: 's4', name: 'Machine Learning', code: 'CS401', credits: 3, hours: 3, type: 'elective', faculty: 'Dr. Sarah Khan' },
      { id: 's5', name: 'Web Development', code: 'CS304', credits: 3, hours: 3, type: 'elective', faculty: 'TBD' },
      { id: 's6', name: 'Programming Lab', code: 'CS381', credits: 2, hours: 4, type: 'lab', faculty: 'Dr. Lisa Chen' },
    ],
    batches: [
      { id: 'b1', name: '2024-2028', year: '2024', sections: 4, students: 120 },
      { id: 'b2', name: '2023-2027', year: '2023', sections: 3, students: 90 },
      { id: 'b3', name: '2022-2026', year: '2022', sections: 3, students: 85 },
    ],
  },
  {
    id: '2', name: 'Bachelor of Business Administration', code: 'BBA', department: 'Business Admin',
    duration: '3 Years', totalSemesters: 6, totalCredits: 120, status: 'active',
    description: 'Bachelor of Business Administration',
    subjects: [
      { id: 's7', name: 'Principles of Management', code: 'BA201', credits: 4, hours: 4, type: 'core', faculty: 'Prof. David Kim' },
      { id: 's8', name: 'Marketing Management', code: 'BA202', credits: 3, hours: 3, type: 'core', faculty: 'Prof. David Kim' },
      { id: 's9', name: 'Financial Accounting', code: 'BA203', credits: 4, hours: 4, type: 'core', faculty: 'TBD' },
    ],
    batches: [
      { id: 'b4', name: '2024-2027', year: '2024', sections: 3, students: 90 },
      { id: 'b5', name: '2023-2026', year: '2023', sections: 2, students: 60 },
    ],
  },
  {
    id: '3', name: 'B.Sc Mathematics', code: 'BSM', department: 'Mathematics',
    duration: '3 Years', totalSemesters: 6, totalCredits: 120, status: 'active',
    description: 'Bachelor of Science in Mathematics',
    subjects: [
      { id: 's10', name: 'Calculus I', code: 'MATH101', credits: 4, hours: 4, type: 'core', faculty: 'Prof. John Smith' },
      { id: 's11', name: 'Linear Algebra', code: 'MATH102', credits: 3, hours: 3, type: 'core', faculty: 'Prof. John Smith' },
    ],
    batches: [
      { id: 'b6', name: '2024-2027', year: '2024', sections: 2, students: 60 },
    ],
  },
];

function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSubjectsDialog, setShowSubjectsDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const filtered = sampleCourses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleExpand = (id: string) => setExpandedCourse(prev => prev === id ? null : id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Course Management</h1><p className="text-muted-foreground mt-1">Manage courses, subjects, batches, and curriculum structure</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><FolderOpen size={14} /> Manage Subjects</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Add Course</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-4">
        {filtered.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0">
              <CardContent className="p-5">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleExpand(course.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white"><BookOpen size={22} /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                        <Badge variant="outline" className="text-xs">{course.code}</Badge>
                        <Badge variant={course.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">{course.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{course.department} | {course.duration} | {course.totalCredits} Credits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); setSelectedCourse(course); setShowEditDialog(true); }}><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); setSelectedCourse(course); setShowSubjectsDialog(true); }}><Layers size={14} /></Button>
                    {expandedCourse === course.id ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Layers size={14} /> Subjects ({course.subjects.length})</h4>
                        <div className="space-y-2">
                          {course.subjects.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                              <div>
                                <p className="text-sm font-medium">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">{sub.code} | {sub.credits} credits | {sub.hours} hrs/week</p>
                              </div>
                              <Badge variant={sub.type === 'core' ? 'default' : sub.type === 'elective' ? 'warning' : 'info'} className="text-xs capitalize">{sub.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users size={14} /> Batches & Sections</h4>
                        <div className="space-y-2">
                          {course.batches.map(batch => (
                            <div key={batch.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                              <div>
                                <p className="text-sm font-medium">{batch.name}</p>
                                <p className="text-xs text-muted-foreground">Year: {batch.year}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{batch.sections} sections</p>
                                <p className="text-xs text-muted-foreground">{batch.students} students</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>Add New Course</DialogTitle><DialogDescription>Create a new academic course</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2"><Label>Course Name</Label><Input placeholder="e.g., B.Tech Computer Science" /></div>
            <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g., BTCS" /></div>
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Business">Business Admin</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Duration</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="3">3 Years</SelectItem><SelectItem value="4">4 Years</SelectItem><SelectItem value="2">2 Years</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Total Semesters</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="6">6</SelectItem><SelectItem value="8">8</SelectItem><SelectItem value="4">4</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Total Credits</Label><Input type="number" placeholder="120" /></div>
            <div className="space-y-2 col-span-2"><Label>Description</Label><Textarea placeholder="Course description..." /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button>Create Course</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubjectsDialog} onOpenChange={setShowSubjectsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Subject Management</DialogTitle><DialogDescription>{selectedCourse?.name} - Manage subjects and curriculum</DialogDescription></DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{selectedCourse.subjects.length} subjects</p>
                <Button size="sm" className="gap-1"><Plus size={14} /> Add Subject</Button>
              </div>
              <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-2">
                  {selectedCourse.subjects.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{sub.name}</p>
                          <Badge variant="outline" className="text-xs">{sub.code}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub.credits} Credits | {sub.hours} hrs/week | {sub.faculty}</p>
                      </div>
                      <Badge variant={sub.type === 'core' ? 'default' : sub.type === 'elective' ? 'warning' : 'info'} className="text-xs capitalize mr-2">{sub.type}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 size={12} /></Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default CoursesPage;
