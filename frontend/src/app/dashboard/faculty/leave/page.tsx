'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  FileText,
  Users,
  Ban,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
}

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

const leaveBalance: LeaveBalance[] = [
  { type: 'Annual Leave', total: 30, used: 12, remaining: 18 },
  { type: 'Sick Leave', total: 12, used: 3, remaining: 9 },
  { type: 'Personal Leave', total: 6, used: 2, remaining: 4 },
  { type: 'Conference Leave', total: 10, used: 5, remaining: 5 },
];

const leaveHistory: LeaveRequest[] = [
  { id: 'l1', type: 'Annual Leave', fromDate: 'Jul 22, 2026', toDate: 'Jul 26, 2026', days: 5, reason: 'Family vacation', status: 'pending', appliedOn: 'Jul 15, 2026' },
  { id: 'l2', type: 'Sick Leave', fromDate: 'Jun 10, 2026', toDate: 'Jun 11, 2026', days: 2, reason: 'Medical appointment', status: 'approved', appliedOn: 'Jun 9, 2026', approvedBy: 'Dean Office' },
  { id: 'l3', type: 'Conference Leave', fromDate: 'May 5, 2026', toDate: 'May 8, 2026', days: 4, reason: 'ICML Conference 2026', status: 'approved', appliedOn: 'Apr 20, 2026', approvedBy: 'HOD' },
  { id: 'l4', type: 'Personal Leave', fromDate: 'Apr 15, 2026', toDate: 'Apr 15, 2026', days: 1, reason: 'Personal work', status: 'rejected', appliedOn: 'Apr 14, 2026', approvedBy: 'HOD' },
];

const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Conference Leave', 'Maternity/Paternity Leave'];

function FacultyLeavePage() {
  const [activeTab, setActiveTab] = useState('apply');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: '', fromDate: '', toDate: '', reason: '' });

  const totalRemaining = leaveBalance.reduce((a, b) => a + b.remaining, 0);
  const pendingRequests = leaveHistory.filter(l => l.status === 'pending').length;

  const handleApplyLeave = () => {
    setShowApplyDialog(false);
    setNewLeave({ type: '', fromDate: '', toDate: '', reason: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Apply for leave and track your requests</p>
        </div>
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus size={16} /> Apply for Leave</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>Submit a new leave request</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Leave Type</label>
                <Select value={newLeave.type} onValueChange={v => setNewLeave({ ...newLeave, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">From Date</label>
                  <Input type="date" value={newLeave.fromDate} onChange={e => setNewLeave({ ...newLeave, fromDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">To Date</label>
                  <Input type="date" value={newLeave.toDate} onChange={e => setNewLeave({ ...newLeave, toDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Reason</label>
                <Textarea value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Provide reason for leave..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
              <Button onClick={handleApplyLeave} className="gap-2"><Send size={14} /> Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalRemaining}</p>
            <p className="text-xs text-muted-foreground">Total Remaining</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{leaveBalance.filter(l => l.remaining > 0).length}</p>
            <p className="text-xs text-muted-foreground">Leave Types Available</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{pendingRequests}</p>
            <p className="text-xs text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{leaveHistory.length}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="apply" className="gap-2"><Plus size={14} /> Apply</TabsTrigger>
          <TabsTrigger value="balance" className="gap-2"><Calendar size={14} /> Leave Balance</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><Clock size={14} /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="apply" className="space-y-4 mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Quick Apply</CardTitle>
              <CardDescription>Select leave type and dates to apply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {leaveTypes.map((type, i) => {
                  const bal = leaveBalance.find(b => b.type === type);
                  return (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setShowApplyDialog(true)}
                      className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all text-left"
                    >
                      <p className="text-sm font-semibold">{type}</p>
                      {bal && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {bal.remaining} of {bal.total} days remaining
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4 mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Leave Balance</CardTitle>
              <CardDescription>Your annual leave entitlement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveBalance.map((lb, i) => {
                const usedPct = (lb.used / lb.total) * 100;
                return (
                  <motion.div
                    key={lb.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{lb.type}</span>
                      <span className="text-xs text-muted-foreground">{lb.remaining} remaining</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={usedPct} className="h-2.5 flex-1" />
                      <span className="text-xs font-medium w-16 text-right">{lb.used}/{lb.total} days</span>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Leave History</CardTitle>
              <CardDescription>Your past and pending leave requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveHistory.map((leave, i) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        leave.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        leave.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-amber-100 dark:bg-amber-900/30'
                      )}>
                        {leave.status === 'approved' ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> :
                         leave.status === 'rejected' ? <XCircle size={18} className="text-red-600 dark:text-red-400" /> :
                         <Clock size={18} className="text-amber-600 dark:text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{leave.type}</h3>
                          <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'destructive' : 'warning'} className="text-[10px]">
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {leave.fromDate} - {leave.toDate} ({leave.days} day{leave.days > 1 ? 's' : ''})
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{leave.reason}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Applied: {leave.appliedOn}
                          {leave.approvedBy && ` • Approved by: ${leave.approvedBy}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default FacultyLeavePage;
