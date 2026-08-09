'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Building2,
  MapPin,
  Users,
  Bed,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  CreditCard,
  Clock,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

interface Roommate {
  name: string;
  rollNumber: string;
  course: string;
  phone: string;
  roomNumber: string;
}

interface HostelData {
  hostelName: string;
  block: string;
  floor: number;
  roomNumber: string;
  roomType: string;
  sharing: number;
  checkInDate: string;
  feeStatus: { total: number; paid: number; due: number };
  roommates: Roommate[];
  warden: { name: string; phone: string; email: string };
  facilities: string[];
}

function HostelPage() {
  const [showLeave, setShowLeave] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ fromDate: '', toDate: '', reason: '' });
  const [complaintForm, setComplaintForm] = useState({ category: '', description: '' });

  const { data: hostel, isLoading } = useApiGet<HostelData>(
    ['student-hostel'],
    '/student/hostel'
  );

  const leaveMutation = useApiPost('/student/hostel/leave', {
    onSuccess: () => {
      toast.success('Leave application submitted');
      setShowLeave(false);
      setLeaveForm({ fromDate: '', toDate: '', reason: '' });
    },
  });

  const complaintMutation = useApiPost('/student/hostel/complaint', {
    onSuccess: () => {
      toast.success('Complaint registered');
      setShowComplaint(false);
      setComplaintForm({ category: '', description: '' });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <Skeleton className="h-4 w-40 mb-4" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Hostel</h1>
          <p className="text-sm text-muted-foreground mt-1">Hostel accommodation details</p>
        </div>
        <Card className="glass-card border-0">
          <CardContent className="py-12 text-center">
            <Building2 size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No hostel accommodation allocated</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Hostel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hostel.hostelName} - Room {hostel.roomNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowLeave(true)}>
            <Calendar size={14} />
            Leave Application
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowComplaint(true)}>
            <MessageSquare size={14} />
            Complaint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Room</p>
                <p className="text-lg font-bold">{hostel.roomNumber}</p>
                <p className="text-xs text-muted-foreground">{hostel.block} | Floor {hostel.floor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sharing</p>
                <p className="text-lg font-bold">{hostel.sharing}-Sharing</p>
                <p className="text-xs text-muted-foreground">{hostel.roomType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-In</p>
                <p className="text-lg font-bold">{hostel.checkInDate}</p>
                <p className="text-xs text-muted-foreground">{hostel.hostelName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="room" className="space-y-4">
        <TabsList>
          <TabsTrigger value="room" className="gap-2">
            <Bed size={14} />
            Room Details
          </TabsTrigger>
          <TabsTrigger value="fees" className="gap-2">
            <CreditCard size={14} />
            Fee Status
          </TabsTrigger>
          <TabsTrigger value="facilities" className="gap-2">
            <CheckCircle2 size={14} />
            Facilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="room">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={18} />
                  Roommates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hostel.roommates.map((rm, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {rm.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{rm.name}</p>
                      <p className="text-xs text-muted-foreground">{rm.course} | {rm.rollNumber}</p>
                    </div>
                  </div>
                ))}
                {hostel.roommates.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No roommates</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin size={18} />
                  Warden Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="font-medium">{hostel.warden.name}</p>
                  <p className="text-sm text-muted-foreground">{hostel.warden.phone}</p>
                  <p className="text-sm text-muted-foreground">{hostel.warden.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total', value: formatCurrency(hostel.feeStatus.total), color: '' },
                    { label: 'Paid', value: formatCurrency(hostel.feeStatus.paid), color: 'text-emerald-500' },
                    { label: 'Due', value: formatCurrency(hostel.feeStatus.due), color: hostel.feeStatus.due > 0 ? 'text-red-500' : 'text-emerald-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={cn('text-lg font-bold', item.color)}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <Progress
                  value={hostel.feeStatus.total > 0 ? (hostel.feeStatus.paid / hostel.feeStatus.total) * 100 : 0}
                  className="h-2"
                />
                {hostel.feeStatus.due > 0 && (
                  <Button className="w-full gap-2">
                    <CreditCard size={14} />
                    Pay Hostel Fee
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Available Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hostel.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showLeave} onOpenChange={setShowLeave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Application</DialogTitle>
            <DialogDescription>Apply for hostel leave</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeave(false)}>Cancel</Button>
            <Button
              onClick={() => leaveMutation.mutate(leaveForm)}
              disabled={leaveMutation.isPending}
              className="gap-2"
            >
              <Send size={14} />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showComplaint} onOpenChange={setShowComplaint}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Complaint</DialogTitle>
            <DialogDescription>Report issues with hostel facilities</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={complaintForm.category}
                onValueChange={(v) => setComplaintForm({ ...complaintForm, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                rows={3}
                placeholder="Describe the issue..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComplaint(false)}>Cancel</Button>
            <Button
              onClick={() => complaintMutation.mutate(complaintForm)}
              disabled={complaintMutation.isPending}
              className="gap-2"
            >
              <Send size={14} />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default HostelPage;
