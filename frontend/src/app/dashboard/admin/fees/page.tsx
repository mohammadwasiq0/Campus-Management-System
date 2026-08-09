'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Wallet, Search, Plus, Edit2, Trash2, Download, Upload, Printer,
  ChevronLeft, ChevronRight, CreditCard, DollarSign, Receipt, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, AlertTriangle, Loader2, Eye, FileSpreadsheet, BarChart3,
  Calendar, Clock, Users, Mail, MoreHorizontal, SlidersHorizontal,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
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

interface FeeRecord {
  id: string; studentName: string; rollNo: string; department: string;
  feeType: string; amount: number; paid: number; due: number;
  dueDate: string; status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  paymentDate?: string; transactionId?: string;
}

const sampleFees: FeeRecord[] = [
  { id: '1', studentName: 'Ahmed Ali', rollNo: 'CS-2024-001', department: 'Computer Science', feeType: 'Tuition Fee', amount: 85000, paid: 85000, due: 0, dueDate: '2026-07-20', status: 'paid', paymentDate: '2026-07-10', transactionId: 'TXN001' },
  { id: '2', studentName: 'Fatima Noor', rollNo: 'BA-2024-002', department: 'Business Admin', feeType: 'Tuition Fee', amount: 75000, paid: 50000, due: 25000, dueDate: '2026-07-20', status: 'partial', paymentDate: '2026-07-05', transactionId: 'TXN002' },
  { id: '3', studentName: 'Robert Chen', rollNo: 'EN-2024-003', department: 'Engineering', feeType: 'Hostel Fee', amount: 45000, paid: 0, due: 45000, dueDate: '2026-07-15', status: 'overdue' },
  { id: '4', studentName: 'Priya Sharma', rollNo: 'CS-2024-004', department: 'Computer Science', feeType: 'Tuition Fee', amount: 85000, paid: 85000, due: 0, dueDate: '2026-07-20', status: 'paid', paymentDate: '2026-07-08', transactionId: 'TXN003' },
  { id: '5', studentName: 'Mohammed Khan', rollNo: 'MA-2024-005', department: 'Mathematics', feeType: 'Library Fee', amount: 5000, paid: 0, due: 5000, dueDate: '2026-07-25', status: 'unpaid' },
  { id: '6', studentName: 'Sara Williams', rollNo: 'CS-2023-006', department: 'Computer Science', feeType: 'Exam Fee', amount: 12000, paid: 12000, due: 0, dueDate: '2026-07-10', status: 'paid', paymentDate: '2026-07-01', transactionId: 'TXN004' },
  { id: '7', studentName: 'Arjun Reddy', rollNo: 'EN-2024-007', department: 'Engineering', feeType: 'Tuition Fee', amount: 80000, paid: 30000, due: 50000, dueDate: '2026-07-20', status: 'partial', paymentDate: '2026-06-25', transactionId: 'TXN005' },
  { id: '8', studentName: 'Lisa Park', rollNo: 'BA-2023-008', department: 'Business Admin', feeType: 'Transport Fee', amount: 15000, paid: 0, due: 15000, dueDate: '2026-07-15', status: 'overdue' },
];

const feeTypes = ['All Types', 'Tuition Fee', 'Hostel Fee', 'Library Fee', 'Exam Fee', 'Transport Fee', 'Miscellaneous'];
const statusFilters = ['All', 'Paid', 'Partial', 'Unpaid', 'Overdue'];

function FeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFeeStructureDialog, setShowFeeStructureDialog] = useState(false);
  const [showScholarshipDialog, setShowScholarshipDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = sampleFees.filter(f => {
    const m1 = !searchQuery || f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || f.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const m2 = typeFilter === 'All Types' || f.feeType === typeFilter;
    const m3 = statusFilter === 'All' || f.status === statusFilter.toLowerCase();
    return m1 && m2 && m3;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalCollected = sampleFees.reduce((sum, f) => sum + f.paid, 0);
  const totalDue = sampleFees.reduce((sum, f) => sum + f.due, 0);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'unpaid': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Fee Management</h1><p className="text-muted-foreground mt-1">Manage fee structure, payments, dues, and scholarships</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowScholarshipDialog(true)}><Wallet size={14} /> Scholarships</Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFeeStructureDialog(true)}><Receipt size={14} /> Fee Structure</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `₹${(totalCollected / 100000).toFixed(2)}L`, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Total Due', value: `₹${(totalDue / 100000).toFixed(2)}L`, color: 'from-red-500 to-red-600' },
          { label: 'Collection Rate', value: `${((totalCollected / (totalCollected + totalDue)) * 100).toFixed(1)}%`, color: 'from-blue-500 to-blue-600' },
          { label: 'Overdue Accounts', value: sampleFees.filter(f => f.status === 'overdue').length.toString(), color: 'from-amber-500 to-amber-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or roll number..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent>{feeTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent>{statusFilters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      {sampleFees.filter(f => f.status === 'overdue').length > 0 && (
        <Card className="glass-card border-0 bg-red-500/5 border-red-500/20">
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{sampleFees.filter(f => f.status === 'overdue').length} fee records are overdue. <Button variant="link" className="text-xs h-auto p-0 text-red-600 dark:text-red-400">View Due List</Button></p>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="hidden lg:table-cell">Due</TableHead>
                <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((fee, i) => (
                <motion.tr key={fee.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{fee.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{fee.studentName}</p><p className="text-xs text-muted-foreground">{fee.rollNo}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{fee.feeType}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium">₹{fee.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-emerald-500 font-medium">₹{fee.paid.toLocaleString()}</TableCell>
                  <TableCell className={cn('hidden lg:table-cell font-medium', fee.due > 0 ? 'text-red-500' : 'text-emerald-500')}>₹{fee.due.toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{new Date(fee.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell><Badge variant={statusVariant(fee.status)} className="text-xs capitalize">{fee.status}</Badge></TableCell>
                  <TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button><Button variant="ghost" size="icon" className="h-8 w-8"><CreditCard size={14} /></Button></div></TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showFeeStructureDialog} onOpenChange={setShowFeeStructureDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Fee Structure</DialogTitle><DialogDescription>Configure fee structure for courses and departments</DialogDescription></DialogHeader>
          <Tabs defaultValue="tuition">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="tuition">Tuition</TabsTrigger>
              <TabsTrigger value="hostel">Hostel</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="tuition" className="space-y-3 pt-4">
              {[
                { course: 'B.Tech CSE', amount: '₹85,000/sem' },
                { course: 'B.Tech ME', amount: '₹80,000/sem' },
                { course: 'BBA', amount: '₹75,000/sem' },
                { course: 'B.Sc Math', amount: '₹60,000/sem' },
                { course: 'MBA', amount: '₹1,20,000/sem' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                  <span className="text-sm font-medium">{item.course}</span>
                  <div className="flex items-center gap-2"><span className="text-sm">{item.amount}</span><Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 size={12} /></Button></div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-1"><Plus size={14} /> Add Fee Structure</Button>
            </TabsContent>
            <TabsContent value="hostel">Hostel fee configuration...</TabsContent>
            <TabsContent value="transport">Transport fee configuration...</TabsContent>
            <TabsContent value="other">Other fee configuration...</TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showScholarshipDialog} onOpenChange={setShowScholarshipDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Scholarship Management</DialogTitle><DialogDescription>Manage scholarships and financial aid</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { name: 'Merit Scholarship', criteria: 'CGPA > 9.0', amount: '50% tuition waiver', students: 12 },
              { name: 'Need Based Aid', criteria: 'Family income < ₹5L', amount: 'Up to 75% waiver', students: 28 },
              { name: 'Sports Scholarship', criteria: 'National level athlete', amount: '100% tuition waiver', students: 5 },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
                <div className="flex items-start justify-between">
                  <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.criteria}</p></div>
                  <Badge variant="info">{s.students} awarded</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.amount}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full gap-1"><Plus size={14} /> Add Scholarship</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default FeesPage;
