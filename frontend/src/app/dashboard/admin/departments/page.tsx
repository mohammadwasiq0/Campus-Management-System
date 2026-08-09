'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Building2, Search, Plus, Edit2, Trash2, Users, BookOpen, GraduationCap,
  ChevronRight, Mail, Phone, MapPin, BarChart3, TrendingUp, TrendingDown,
  MoreHorizontal, ChevronLeft, ChevronRight as ChevronRightIcon,
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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface Department {
  id: string; name: string; code: string; hod: string; hodEmail: string;
  facultyCount: number; studentCount: number; coursesCount: number;
  budget: number; usedBudget: number; established: string; status: 'active' | 'inactive';
  description: string;
}

const sampleDepartments: Department[] = [
  { id: '1', name: 'Computer Science', code: 'CS', hod: 'Dr. Sarah Khan', hodEmail: 'sarah.khan@campus.edu', facultyCount: 28, studentCount: 450, coursesCount: 24, budget: 2500000, usedBudget: 1850000, established: '2005', status: 'active', description: 'Department of Computer Science and Engineering' },
  { id: '2', name: 'Mathematics', code: 'MATH', hod: 'Prof. John Smith', hodEmail: 'john.smith@campus.edu', facultyCount: 22, studentCount: 320, coursesCount: 18, budget: 1800000, usedBudget: 1200000, established: '2003', status: 'active', description: 'Department of Mathematics and Statistics' },
  { id: '3', name: 'Business Administration', code: 'BA', hod: 'Prof. David Kim', hodEmail: 'david.kim@campus.edu', facultyCount: 25, studentCount: 380, coursesCount: 20, budget: 2200000, usedBudget: 1600000, established: '2008', status: 'active', description: 'Department of Business and Management Studies' },
  { id: '4', name: 'Engineering', code: 'EN', hod: 'Prof. Robert Brown', hodEmail: 'robert.brown@campus.edu', facultyCount: 20, studentCount: 290, coursesCount: 16, budget: 3000000, usedBudget: 2100000, established: '2010', status: 'active', description: 'Department of Mechanical and Electrical Engineering' },
  { id: '5', name: 'Physics', code: 'PHY', hod: 'Dr. Aisha Patel', hodEmail: 'aisha.patel@campus.edu', facultyCount: 15, studentCount: 180, coursesCount: 12, budget: 1500000, usedBudget: 900000, established: '2004', status: 'active', description: 'Department of Physics and Applied Sciences' },
  { id: '6', name: 'Arts & Humanities', code: 'AH', hod: 'TBD', hodEmail: '', facultyCount: 18, studentCount: 210, coursesCount: 14, budget: 1200000, usedBudget: 600000, established: '2006', status: 'inactive', description: 'Department of Arts, Languages and Humanities' },
];

function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const filtered = sampleDepartments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Department Management</h1><p className="text-muted-foreground mt-1">Manage academic departments, HOD assignments, and budgets</p></div>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Add Department</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search departments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 max-w-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((dept, i) => (
          <motion.div key={dept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0 group hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => { setSelectedDept(dept); setShowEditDialog(true); }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', dept.status === 'active' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-400 to-gray-500')}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">{dept.code}</Badge>
                    </div>
                  </div>
                  <Badge variant={dept.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">{dept.status}</Badge>
                </div>
                <Separator className="mb-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">{dept.studentCount}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{dept.facultyCount}</p>
                    <p className="text-xs text-muted-foreground">Faculty</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{dept.coursesCount}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">HOD</span>
                    <span className="font-medium">{dept.hod}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Budget Usage</span>
                      <span className="font-medium">₹{((dept.usedBudget / 100000)).toFixed(1)}L / ₹{((dept.budget / 100000)).toFixed(1)}L</span>
                    </div>
                    <Progress value={(dept.usedBudget / dept.budget) * 100} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add New Department</DialogTitle><DialogDescription>Create a new academic department</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Department Name</Label><Input placeholder="e.g., Computer Science" /></div>
            <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g., CS" /></div>
            <div className="space-y-2"><Label>HOD</Label><Select><SelectTrigger><SelectValue placeholder="Select HOD" /></SelectTrigger><SelectContent><SelectItem value="dr-khan">Dr. Sarah Khan</SelectItem><SelectItem value="prof-smith">Prof. John Smith</SelectItem><SelectItem value="prof-kim">Prof. David Kim</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Established Year</Label><Input type="number" placeholder="2020" /></div>
            <div className="space-y-2 col-span-2"><Label>Description</Label><Textarea placeholder="Department description..." /></div>
            <div className="space-y-2"><Label>Annual Budget (₹)</Label><Input type="number" placeholder="1000000" /></div>
            <div className="space-y-2"><Label>Status</Label><Select defaultValue="active"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button>Create Department</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Department Details</DialogTitle><DialogDescription>View and edit department information</DialogDescription></DialogHeader>
          {selectedDept && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white"><Building2 size={28} /></div>
                <div><h3 className="text-lg font-semibold">{selectedDept.name}</h3><Badge variant="outline">{selectedDept.code}</Badge></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">HOD</span><p className="font-medium">{selectedDept.hod}</p></div>
                <div><span className="text-muted-foreground">Email</span><p>{selectedDept.hodEmail || 'N/A'}</p></div>
                <div><span className="text-muted-foreground">Students</span><p className="font-medium">{selectedDept.studentCount}</p></div>
                <div><span className="text-muted-foreground">Faculty</span><p className="font-medium">{selectedDept.facultyCount}</p></div>
                <div><span className="text-muted-foreground">Courses</span><p className="font-medium">{selectedDept.coursesCount}</p></div>
                <div><span className="text-muted-foreground">Established</span><p>{selectedDept.established}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">Description</span><p>{selectedDept.description}</p></div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Budget</span><span>₹{((selectedDept.usedBudget / 100000)).toFixed(1)}L / ₹{((selectedDept.budget / 100000)).toFixed(1)}L</span></div>
                <Progress value={(selectedDept.usedBudget / selectedDept.budget) * 100} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Users size={14} /> View Faculty</Button>
                <Button variant="outline" size="sm" className="gap-1"><GraduationCap size={14} /> View Students</Button>
                <Button variant="outline" size="sm" className="gap-1"><Edit2 size={14} /> Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default DepartmentsPage;
