'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users, Search, Plus, Edit2, Trash2, Calendar, Clock, DollarSign,
  ChevronLeft, ChevronRight, Briefcase, UserPlus, FileText, BarChart3,
  CheckCircle2, XCircle, AlertTriangle, Loader2, Eye, Download, Upload,
  Mail, Phone, MapPin, Award, GraduationCap, Heart, UserCheck, UserX,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Employee {
  id: string; fullName: string; email: string; phone: string; employeeId: string;
  department: string; designation: string; type: string;
  salary: number; joiningDate: string; status: 'active' | 'inactive' | 'on-leave';
}

const employees: Employee[] = [
  { id: '1', fullName: 'Dr. Sarah Khan', email: 'sarah.khan@campus.edu', phone: '+91 98765 43210', employeeId: 'EMP-001', department: 'Computer Science', designation: 'Professor', type: 'Faculty', salary: 95000, joiningDate: '2018-06-01', status: 'active' },
  { id: '2', fullName: 'Mr. Rajesh Kumar', email: 'rajesh.k@campus.edu', phone: '+91 98765 43211', employeeId: 'EMP-002', department: 'Administration', designation: 'Office Manager', type: 'Staff', salary: 55000, joiningDate: '2020-01-15', status: 'active' },
  { id: '3', fullName: 'Prof. John Smith', email: 'john.smith@campus.edu', phone: '+91 98765 43212', employeeId: 'EMP-003', department: 'Mathematics', designation: 'Associate Professor', type: 'Faculty', salary: 85000, joiningDate: '2020-08-15', status: 'active' },
  { id: '4', fullName: 'Mrs. Sunita Devi', email: 'sunita.d@campus.edu', phone: '+91 98765 43213', employeeId: 'EMP-004', department: 'Accounts', designation: 'Accountant', type: 'Staff', salary: 45000, joiningDate: '2019-04-01', status: 'active' },
  { id: '5', fullName: 'Dr. Aisha Patel', email: 'aisha.p@campus.edu', phone: '+91 98765 43214', employeeId: 'EMP-005', department: 'Physics', designation: 'Assistant Professor', type: 'Faculty', salary: 72000, joiningDate: '2021-01-10', status: 'on-leave' },
];

const leaveRequests = [
  { id: '1', employee: 'Dr. Aisha Patel', type: 'Sick Leave', from: '2026-07-10', to: '2026-07-12', status: 'pending' as const },
  { id: '2', employee: 'Rajesh Kumar', type: 'Annual Leave', from: '2026-07-15', to: '2026-07-20', status: 'approved' as const },
  { id: '3', employee: 'Sunita Devi', type: 'Personal Leave', from: '2026-07-08', to: '2026-07-08', status: 'pending' as const },
];

const payrollData = [
  { id: '1', employee: 'Dr. Sarah Khan', month: 'June 2026', basic: 85000, allowances: 10000, deductions: 5000, net: 95000, status: 'paid' as const },
  { id: '2', employee: 'Rajesh Kumar', month: 'June 2026', basic: 45000, allowances: 10000, deductions: 3000, net: 55000, status: 'paid' as const },
  { id: '3', employee: 'Prof. John Smith', month: 'June 2026', basic: 75000, allowances: 10000, deductions: 5000, net: 85000, status: 'pending' as const },
];

function HrPage() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">HR Management</h1><p className="text-muted-foreground mt-1">Manage employees, attendance, payroll, leaves, and recruitment</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><UserPlus size={14} /> Recruitment</Button>
          <Button variant="outline" size="sm" className="gap-2"><FileText size={14} /> Documents</Button>
          <Button size="sm" className="gap-2"><Plus size={16} /> Add Employee</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="employees"><Users size={14} className="mr-1" /> Employees</TabsTrigger>
          <TabsTrigger value="attendance"><Calendar size={14} className="mr-1" /> Attendance</TabsTrigger>
          <TabsTrigger value="payroll"><DollarSign size={14} className="mr-1" /> Payroll</TabsTrigger>
          <TabsTrigger value="leaves"><Clock size={14} className="mr-1" /> Leaves</TabsTrigger>
          <TabsTrigger value="recruitment"><UserPlus size={14} className="mr-1" /> Recruitment</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search employees..." className="pl-9" /></div>
          <Card className="glass-card border-0"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{emp.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                        <div><p className="text-sm font-medium">{emp.fullName}</p><p className="text-xs text-muted-foreground">{emp.designation}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{emp.employeeId}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{emp.department}</TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-xs">{emp.type}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">₹{emp.salary.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={emp.status === 'active' ? 'success' : emp.status === 'on-leave' ? 'warning' : 'secondary'} className="text-xs capitalize">{emp.status}</Badge></TableCell>
                    <TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button><Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="glass-card border-0"><CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search employee..." className="pl-9" /></div>
              <Input type="date" className="w-[180px]" />
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Export</Button>
            </div>
            <Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Leave</TableHead><TableHead>Attendance %</TableHead></TableRow></TableHeader>
            <TableBody>
              {employees.map((emp, i) => {
                const pct = 85 + Math.floor(Math.random() * 15);
                return (
                  <TableRow key={emp.id}>
                    <TableCell><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{emp.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><span className="text-sm">{emp.fullName}</span></div></TableCell>
                    <TableCell className="text-sm">{emp.department}</TableCell>
                    <TableCell className="text-sm text-emerald-500">{Math.round(pct * 0.9)}</TableCell>
                    <TableCell className="text-sm text-red-500">{Math.round((100 - pct) * 0.7)}</TableCell>
                    <TableCell className="text-sm text-amber-500">{Math.round((100 - pct) * 0.3)}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><Progress value={pct} className="h-1.5 w-16" /><span className={cn('text-xs font-medium', pct >= 90 ? 'text-emerald-500' : pct >= 75 ? 'text-amber-500' : 'text-red-500')}>{pct}%</span></div></TableCell>
                  </TableRow>
                );
              })}
            </TableBody></Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4 mt-4">
          <div className="flex gap-2"><Button size="sm" className="gap-1"><DollarSign size={14} /> Run Payroll</Button><Button variant="outline" size="sm" className="gap-1"><Download size={14} /> Export</Button></div>
          <Card className="glass-card border-0"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Month</TableHead><TableHead className="hidden md:table-cell">Basic</TableHead><TableHead className="hidden md:table-cell">Allowances</TableHead><TableHead className="hidden lg:table-cell">Deductions</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px] text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {payrollData.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm font-medium">{p.employee}</TableCell>
                    <TableCell className="text-sm">{p.month}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">₹{p.basic.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-emerald-500">+₹{p.allowances.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-red-500">-₹{p.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{p.net.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={p.status === 'paid' ? 'success' : 'warning'} className="text-xs capitalize">{p.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4 mt-4">
          {leaveRequests.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 flex items-center justify-between">
              <div><p className="text-sm font-medium">{l.employee}</p><p className="text-xs text-muted-foreground">{l.type} | {new Date(l.from).toLocaleDateString()} - {new Date(l.to).toLocaleDateString()}</p></div>
              <div className="flex items-center gap-2">
                <Badge variant={l.status === 'pending' ? 'warning' : 'success'} className="text-xs capitalize">{l.status}</Badge>
                {l.status === 'pending' && <><Button variant="outline" size="sm" className="h-8 text-xs"><CheckCircle2 size={14} className="mr-1 text-emerald-500" /> Approve</Button><Button variant="outline" size="sm" className="h-8 text-xs"><XCircle size={14} className="mr-1 text-destructive" /> Decline</Button></>}
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="recruitment" className="mt-4">
          <p className="text-muted-foreground text-sm">Manage job postings, applications, interviews, and hiring pipeline.</p>
          <Card className="glass-card border-0 mt-4"><CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Open Positions: 4', 'Total Applicants: 47', 'Interviewed: 12'].map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50 text-center">
                  <p className="text-lg font-bold">{s.split(': ')[1]}</p>
                  <p className="text-xs text-muted-foreground">{s.split(': ')[0]}</p>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default HrPage;
