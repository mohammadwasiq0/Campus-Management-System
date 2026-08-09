'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BookOpen, Search, Filter, Plus, MoreVertical, Edit2, Trash2, Mail, Phone,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GraduationCap,
  Clock, Calendar, Award, Briefcase, BookMarked, Users, BarChart3, Loader2,
  CheckCircle2, XCircle, UserCheck, UserX, SlidersHorizontal, RefreshCw,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Faculty {
  id: string; fullName: string; email: string; phone: string; employeeId: string;
  department: string; designation: string; qualification: string; specialization: string;
  experience: number; coursesAssigned: number; load: number; maxLoad: number;
  status: 'active' | 'inactive' | 'on-leave'; joiningDate: string;
  avatar?: string;
}

const sampleFaculty: Faculty[] = [
  { id: '1', fullName: 'Dr. Sarah Khan', email: 'sarah.khan@campus.edu', phone: '+91 98765 43210', employeeId: 'FAC-001', department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D. Computer Science', specialization: 'Machine Learning', experience: 12, coursesAssigned: 3, load: 12, maxLoad: 16, status: 'active', joiningDate: '2018-06-01' },
  { id: '2', fullName: 'Prof. John Smith', email: 'john.smith@campus.edu', phone: '+91 98765 43211', employeeId: 'FAC-002', department: 'Mathematics', designation: 'Associate Professor', qualification: 'Ph.D. Mathematics', specialization: 'Algebra', experience: 8, coursesAssigned: 4, load: 14, maxLoad: 16, status: 'active', joiningDate: '2020-08-15' },
  { id: '3', fullName: 'Dr. Aisha Patel', email: 'aisha.patel@campus.edu', phone: '+91 98765 43212', employeeId: 'FAC-003', department: 'Physics', designation: 'Assistant Professor', qualification: 'Ph.D. Physics', specialization: 'Quantum Mechanics', experience: 5, coursesAssigned: 3, load: 10, maxLoad: 14, status: 'active', joiningDate: '2021-01-10' },
  { id: '4', fullName: 'Prof. David Kim', email: 'david.kim@campus.edu', phone: '+91 98765 43213', employeeId: 'FAC-004', department: 'Business Admin', designation: 'Professor', qualification: 'Ph.D. Management', specialization: 'Strategic Management', experience: 15, coursesAssigned: 3, load: 12, maxLoad: 16, status: 'active', joiningDate: '2015-03-20' },
  { id: '5', fullName: 'Dr. Lisa Chen', email: 'lisa.chen@campus.edu', phone: '+91 98765 43214', employeeId: 'FAC-005', department: 'Computer Science', designation: 'Assistant Professor', qualification: 'Ph.D. AI', specialization: 'Natural Language Processing', experience: 4, coursesAssigned: 2, load: 8, maxLoad: 14, status: 'on-leave', joiningDate: '2022-07-01' },
  { id: '6', fullName: 'Prof. Robert Brown', email: 'robert.brown@campus.edu', phone: '+91 98765 43215', employeeId: 'FAC-006', department: 'Engineering', designation: 'Associate Professor', qualification: 'Ph.D. Mechanical Eng', specialization: 'Thermodynamics', experience: 10, coursesAssigned: 4, load: 15, maxLoad: 16, status: 'active', joiningDate: '2017-09-01' },
];

const departments = ['All Departments', 'Computer Science', 'Mathematics', 'Physics', 'Business Admin', 'Engineering'];
const statuses = ['All', 'Active', 'Inactive', 'On Leave'];
const designations = ['All', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const perPage = 8;

  const filtered = sampleFaculty.filter(f => {
    const m1 = !searchQuery || f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || f.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const m2 = deptFilter === 'All Departments' || f.department === deptFilter;
    const m3 = statusFilter === 'All' || f.status === statusFilter.toLowerCase().replace(' ', '-');
    const m4 = designationFilter === 'All' || f.designation === designationFilter;
    return m1 && m2 && m3 && m4;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'on-leave': return 'warning';
      default: return 'outline';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Faculty Management</h1><p className="text-muted-foreground mt-1">Manage faculty records, assignments, and workload</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><GraduationCap size={14} /> Assign Courses</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Add Faculty</Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or employee ID..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            <Select value={designationFilter} onValueChange={v => { setDesignationFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Designation" /></SelectTrigger><SelectContent>{designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden md:table-cell">Designation</TableHead>
                <TableHead className="hidden lg:table-cell">Load</TableHead>
                <TableHead className="hidden lg:table-cell">Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((f, i) => (
                <motion.tr key={f.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedFaculty(f); setShowDetailsDialog(true); }}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{f.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{f.fullName}</p><p className="text-xs text-muted-foreground">{f.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{f.employeeId}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{f.department}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{f.designation}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={(f.load / f.maxLoad) * 100} className="h-1.5 w-16" />
                      <span className={cn('text-xs font-medium', f.load / f.maxLoad > 0.85 ? 'text-red-500' : f.load / f.maxLoad > 0.7 ? 'text-amber-500' : 'text-emerald-500')}>{f.load}/{f.maxLoad}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{f.experience} yrs</TableCell>
                  <TableCell><Badge variant={getStatusVariant(f.status)} className="text-xs capitalize">{f.status.replace('-', ' ')}</Badge></TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedFaculty(f); setShowEditDialog(true); }}><Edit2 size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<Button key={p} variant={currentPage === p ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(p)}>{p}</Button>))}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Add New Faculty</DialogTitle><DialogDescription>Enter faculty details to create a new record</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@campus.edu" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Business">Business Admin</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Designation</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Professor">Professor</SelectItem><SelectItem value="Associate Professor">Associate Professor</SelectItem><SelectItem value="Assistant Professor">Assistant Professor</SelectItem><SelectItem value="Lecturer">Lecturer</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Qualification</Label><Input placeholder="e.g., Ph.D. Computer Science" /></div>
            <div className="space-y-2"><Label>Specialization</Label><Input placeholder="e.g., Machine Learning" /></div>
            <div className="space-y-2"><Label>Experience (years)</Label><Input type="number" placeholder="0" /></div>
            <div className="space-y-2"><Label>Max Teaching Load</Label><Select defaultValue="16"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="12">12 hrs/week</SelectItem><SelectItem value="14">14 hrs/week</SelectItem><SelectItem value="16">16 hrs/week</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button>Create Faculty</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Faculty</DialogTitle><DialogDescription>Update faculty information</DialogDescription></DialogHeader>
          {selectedFaculty && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue={selectedFaculty.fullName} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={selectedFaculty.email} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue={selectedFaculty.phone} /></div>
              <div className="space-y-2"><Label>Designation</Label><Select defaultValue={selectedFaculty.designation}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Professor">Professor</SelectItem><SelectItem value="Associate Professor">Associate Professor</SelectItem><SelectItem value="Assistant Professor">Assistant Professor</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Max Load</Label><Select defaultValue={selectedFaculty.maxLoad.toString()}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="12">12 hrs/week</SelectItem><SelectItem value="14">14 hrs/week</SelectItem><SelectItem value="16">16 hrs/week</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Status</Label><Select defaultValue={selectedFaculty.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="on-leave">On Leave</SelectItem></SelectContent></Select></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button><Button>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>Faculty Details</DialogTitle></DialogHeader>
          {selectedFaculty && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="text-lg bg-primary/10 text-primary">{selectedFaculty.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><h3 className="text-lg font-semibold">{selectedFaculty.fullName}</h3><p className="text-sm text-muted-foreground">{selectedFaculty.employeeId}</p><Badge variant={getStatusVariant(selectedFaculty.status)} className="mt-1 capitalize">{selectedFaculty.status.replace('-', ' ')}</Badge></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email</span><p>{selectedFaculty.email}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p>{selectedFaculty.phone}</p></div>
                <div><span className="text-muted-foreground">Department</span><p>{selectedFaculty.department}</p></div>
                <div><span className="text-muted-foreground">Designation</span><p>{selectedFaculty.designation}</p></div>
                <div><span className="text-muted-foreground">Qualification</span><p>{selectedFaculty.qualification}</p></div>
                <div><span className="text-muted-foreground">Specialization</span><p>{selectedFaculty.specialization}</p></div>
                <div><span className="text-muted-foreground">Experience</span><p>{selectedFaculty.experience} years</p></div>
                <div><span className="text-muted-foreground">Courses</span><p>{selectedFaculty.coursesAssigned} assigned</p></div>
                <div><span className="text-muted-foreground">Teaching Load</span><p>{selectedFaculty.load}/{selectedFaculty.maxLoad} hrs/week</p></div>
                <div><span className="text-muted-foreground">Joined</span><p>{new Date(selectedFaculty.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Teaching Load</p>
                <div className="flex items-center gap-3">
                  <Progress value={(selectedFaculty.load / selectedFaculty.maxLoad) * 100} className="h-2.5 flex-1" />
                  <span className={cn('text-sm font-medium', selectedFaculty.load / selectedFaculty.maxLoad > 0.85 ? 'text-red-500' : selectedFaculty.load / selectedFaculty.maxLoad > 0.7 ? 'text-amber-500' : 'text-emerald-500')}>{Math.round((selectedFaculty.load / selectedFaculty.maxLoad) * 100)}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1"><BookMarked size={14} /> Manage Courses</Button>
                <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Send Email</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default FacultyPage;
