'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  FileCheck,
  GraduationCap,
  BookOpen,
  Award,
  Bus,
  Building2,
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
import { Separator } from '@/components/ui/separator';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  type: string;
  subject: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedAt: string;
  resolvedAt?: string;
  remarks?: string;
  certificateUrl?: string;
}

const applicationTypes = [
  { value: 'bonafide', label: 'Bonafide Certificate', icon: FileCheck },
  { value: 'transfer', label: 'Transfer Certificate', icon: BookOpen },
  { value: 'scholarship', label: 'Scholarship', icon: Award },
  { value: 'leave', label: 'Leave Application', icon: Clock },
  { value: 'bus_pass', label: 'Bus Pass', icon: Bus },
  { value: 'hostel', label: 'Hostel', icon: Building2 },
  { value: 'other', label: 'Other', icon: FileText },
];

function ApplicationsPage() {
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({ type: '', subject: '', description: '' });

  const { data: applications, isLoading, refetch } = useApiGet<Application[]>(
    ['student-applications'],
    '/student/applications'
  );

  const submitMutation = useApiPost('/student/applications', {
    onSuccess: () => {
      toast.success('Application submitted successfully');
      setShowNew(false);
      setFormData({ type: '', subject: '', description: '' });
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-5">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statusIcon: Record<string, any> = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    draft: AlertTriangle,
  };

  const statusVariants: Record<string, 'warning' | 'success' | 'destructive' | 'default'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    draft: 'default',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit and track your applications
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowNew(true)}>
          <Plus size={14} />
          New Application
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications?.map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i} />
          ))}
          {(!applications || applications.length === 0) && (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {applications?.filter(a => a.status === 'pending').map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i} />
          ))}
          {(!applications?.filter(a => a.status === 'pending').length) && <EmptyState />}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {applications?.filter(a => a.status === 'approved').map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i} />
          ))}
          {(!applications?.filter(a => a.status === 'approved').length) && <EmptyState />}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {applications?.filter(a => a.status === 'rejected').map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i} />
          ))}
          {(!applications?.filter(a => a.status === 'rejected').length) && <EmptyState />}
        </TabsContent>
      </Tabs>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
            <DialogDescription>
              Select the type of application you want to submit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Application Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {applicationTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <t.icon size={14} />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief subject line"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Detailed description of your application..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button
              onClick={() => submitMutation.mutate(formData)}
              disabled={!formData.type || !formData.subject || submitMutation.isPending}
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

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const typeInfo = applicationTypes.find(t => t.value === app.type);
  const StatusIcon = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    draft: AlertTriangle,
  }[app.status];
  const statusVariants: Record<string, 'warning' | 'success' | 'destructive' | 'default'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    draft: 'default',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass-card border-0 hover:shadow-lg transition-all">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              {typeInfo ? <typeInfo.icon size={20} className="text-primary" /> : <FileText size={20} className="text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold truncate">{app.subject}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{app.type?.replace('_', ' ')}</p>
                </div>
                <Badge variant={statusVariants[app.status]}>
                  <StatusIcon size={12} className="mr-1" />
                  {app.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>Submitted: {formatDate(app.submittedAt, 'MMM d, yyyy')}</span>
                {app.resolvedAt && (
                  <span>Resolved: {formatDate(app.resolvedAt, 'MMM d, yyyy')}</span>
                )}
              </div>
              {app.remarks && (
                <div className="mt-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <span className="font-medium">Remarks:</span> {app.remarks}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {app.certificateUrl && (
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                  <a href={app.certificateUrl} download>
                    <Download size={10} />
                    Certificate
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <Card className="glass-card border-0">
      <CardContent className="py-12 text-center">
        <FileText size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-muted-foreground">No applications found</p>
      </CardContent>
    </Card>
  );
}

export default ApplicationsPage;
