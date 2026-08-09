'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText, Search, Filter, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  CheckCircle2, XCircle, Clock, Eye, Mail, Phone, Calendar, UserCheck, UserX,
  Download, Upload, FileSpreadsheet, Loader2, AlertTriangle, MessageSquare,
  Check, X, ChevronDown, ChevronUp, SlidersHorizontal,
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface Application {
  id: string; fullName: string; email: string; phone: string;
  program: string; department: string; appliedDate: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'accepted' | 'rejected' | 'enrolled';
  documents: { name: string; uploaded: boolean; verified: boolean }[];
  interviewDate?: string; interviewScore?: number;
  marks: number; rank: number;
}

const sampleApplications: Application[] = [
  { id: '1', fullName: 'Aisha Mohammed', email: 'aisha.m@email.com', phone: '+91 98765 43210', program: 'B.Tech CSE', department: 'Computer Science', appliedDate: '2026-06-15', status: 'pending', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: false }, { name: 'Transfer Certificate', uploaded: false, verified: false }], marks: 92, rank: 15 },
  { id: '2', fullName: 'Rahul Sharma', email: 'rahul.s@email.com', phone: '+91 98765 43211', program: 'BBA', department: 'Business Admin', appliedDate: '2026-06-16', status: 'reviewing', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: true }], marks: 85, rank: 42 },
  { id: '3', fullName: 'Priya Patel', email: 'priya.p@email.com', phone: '+91 98765 43212', program: 'B.Tech CSE', department: 'Computer Science', appliedDate: '2026-06-14', status: 'shortlisted', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: true }, { name: 'Transfer Certificate', uploaded: true, verified: false }], marks: 95, rank: 8, interviewDate: '2026-07-10T10:00:00', interviewScore: 88 },
  { id: '4', fullName: 'John Doe', email: 'john.d@email.com', phone: '+91 98765 43213', program: 'B.Sc Math', department: 'Mathematics', appliedDate: '2026-06-12', status: 'accepted', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: true }], marks: 88, rank: 30, interviewDate: '2026-07-05T14:00:00', interviewScore: 90 },
  { id: '5', fullName: 'Sara Ali', email: 'sara.a@email.com', phone: '+91 98765 43214', program: 'B.Tech ME', department: 'Engineering', appliedDate: '2026-06-10', status: 'rejected', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: false }], marks: 65, rank: 120 },
  { id: '6', fullName: 'Arjun Singh', email: 'arjun.s@email.com', phone: '+91 98765 43215', program: 'BBA', department: 'Business Admin', appliedDate: '2026-06-08', status: 'enrolled', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: true }, { name: 'Transfer Certificate', uploaded: true, verified: true }], marks: 90, rank: 25, interviewDate: '2026-07-01T11:00:00', interviewScore: 92 },
  { id: '7', fullName: 'Fatima Noor', email: 'fatima.n@email.com', phone: '+91 98765 43216', program: 'B.Sc Physics', department: 'Physics', appliedDate: '2026-06-18', status: 'pending', documents: [{ name: '10th Marksheet', uploaded: true, verified: false }, { name: '12th Marksheet', uploaded: false, verified: false }], marks: 78, rank: 65 },
  { id: '8', fullName: 'David Kim', email: 'david.k@email.com', phone: '+91 98765 43217', program: 'B.Tech CSE', department: 'Computer Science', appliedDate: '2026-06-20', status: 'reviewing', documents: [{ name: '10th Marksheet', uploaded: true, verified: true }, { name: '12th Marksheet', uploaded: true, verified: true }, { name: 'ID Proof', uploaded: true, verified: true }], marks: 91, rank: 18 },
];

const statusFilters = ['All', 'Pending', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected', 'Enrolled'];
const programs = ['All Programs', 'B.Tech CSE', 'B.Tech ME', 'BBA', 'B.Sc Math', 'B.Sc Physics'];

function AdmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const perPage = 8;

  const filtered = sampleApplications.filter(a => {
    const m1 = !searchQuery || a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const m2 = statusFilter === 'All' || a.status === statusFilter.toLowerCase();
    const m3 = programFilter === 'All Programs' || a.program === programFilter;
    return m1 && m2 && m3;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'pending': return 'warning';
      case 'reviewing': return 'info';
      case 'shortlisted': return 'info';
      case 'accepted': return 'success';
      case 'rejected': return 'destructive';
      case 'enrolled': return 'success';
      default: return 'outline';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'pending': return <Clock size={14} />;
      case 'reviewing': return <Search size={14} />;
      case 'shortlisted': return <CheckCircle2 size={14} />;
      case 'accepted': return <CheckCircle2 size={14} />;
      case 'rejected': return <XCircle size={14} />;
      case 'enrolled': return <UserCheck size={14} />;
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Admission Management</h1><p className="text-muted-foreground mt-1">Process applications, manage interviews, and enrollment</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Upload size={14} /> Import</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export</Button>
          <Button size="sm" className="gap-2"><Plus size={16} /> New Application</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: sampleApplications.length, color: 'from-blue-500 to-blue-600' },
          { label: 'Pending Review', value: sampleApplications.filter(a => a.status === 'pending').length, color: 'from-amber-500 to-amber-600' },
          { label: 'Shortlisted', value: sampleApplications.filter(a => a.status === 'shortlisted').length, color: 'from-purple-500 to-purple-600' },
          { label: 'Enrolled', value: sampleApplications.filter(a => a.status === 'enrolled').length, color: 'from-emerald-500 to-emerald-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className={cn('w-2 h-2 rounded-full', stat.label.includes('Pending') ? 'bg-amber-500' : stat.label.includes('Shortlisted') ? 'bg-purple-500' : stat.label.includes('Enrolled') ? 'bg-emerald-500' : 'bg-blue-500')} />
                </div>
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
              <Input placeholder="Search by name or email..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statusFilters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={programFilter} onValueChange={v => { setProgramFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Program" /></SelectTrigger><SelectContent>{programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="hidden md:table-cell">Applied</TableHead>
                <TableHead className="hidden lg:table-cell">Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((app, i) => (
                <motion.tr key={app.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedApp(app); setShowDetailsDialog(true); }}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{app.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{app.fullName}</p><p className="text-xs text-muted-foreground">{app.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><p className="text-sm">{app.program}</p><p className="text-xs text-muted-foreground">{app.department}</p></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={cn('font-medium', app.marks >= 90 ? 'text-emerald-500' : app.marks >= 75 ? 'text-amber-500' : 'text-red-500')}>{app.marks}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(app.status)} className="text-xs capitalize gap-1">{getStatusIcon(app.status)}{app.status}</Badge>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedApp(app); setShowScheduleDialog(true); }}><Calendar size={14} /></Button>
                      {app.status === 'shortlisted' && <><Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500"><Check size={14} /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><X size={14} /></Button></>}
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary/10 text-primary text-base">{selectedApp.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><h3 className="text-lg font-semibold">{selectedApp.fullName}</h3><p className="text-sm text-muted-foreground">{selectedApp.email}</p><Badge variant={statusVariant(selectedApp.status)} className="mt-1 capitalize">{selectedApp.status}</Badge></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Phone</span><p>{selectedApp.phone}</p></div>
                <div><span className="text-muted-foreground">Program</span><p>{selectedApp.program}</p></div>
                <div><span className="text-muted-foreground">Department</span><p>{selectedApp.department}</p></div>
                <div><span className="text-muted-foreground">Applied</span><p>{new Date(selectedApp.appliedDate).toLocaleDateString()}</p></div>
                <div><span className="text-muted-foreground">Marks</span><p className="font-medium">{selectedApp.marks}%</p></div>
                <div><span className="text-muted-foreground">Rank</span><p className="font-medium">#{selectedApp.rank}</p></div>
                {selectedApp.interviewScore && <div><span className="text-muted-foreground">Interview Score</span><p className="font-medium">{selectedApp.interviewScore}/100</p></div>}
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Documents ({selectedApp.documents.filter(d => d.uploaded).length}/{selectedApp.documents.length})</p>
                <div className="space-y-1.5">
                  {selectedApp.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <span className="text-sm">{doc.name}</span>
                      <div className="flex items-center gap-2">
                        {doc.uploaded ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                        {doc.verified ? <Badge variant="success" className="text-[10px] px-1.5 py-0">Verified</Badge> : doc.uploaded ? <Badge variant="warning" className="text-[10px] px-1.5 py-0">Pending</Badge> : <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Missing</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Send Email</Button>
                <Button variant="outline" size="sm" className="gap-1"><Calendar size={14} /> Schedule Interview</Button>
                {selectedApp.status === 'shortlisted' && <><Button size="sm" className="gap-1 bg-emerald-500 hover:bg-emerald-600"><Check size={14} /> Accept</Button><Button variant="destructive" size="sm" className="gap-1"><X size={14} /> Reject</Button></>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Schedule Interview</DialogTitle><DialogDescription>Set interview date and time for the applicant</DialogDescription></DialogHeader>
          {selectedApp && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <Avatar className="h-10 w-10"><AvatarFallback className="text-xs">{selectedApp.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><p className="text-sm font-medium">{selectedApp.fullName}</p><p className="text-xs text-muted-foreground">{selectedApp.program}</p></div>
              </div>
              <div className="space-y-2"><Label>Interview Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Interview Time</Label><Input type="time" /></div>
              <div className="space-y-2"><Label>Interview Mode</Label><Select><SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger><SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="in-person">In Person</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Panel</Label><Select><SelectTrigger><SelectValue placeholder="Select panel" /></SelectTrigger><SelectContent><SelectItem value="panel-1">Panel 1 - Dr. Khan, Prof. Smith</SelectItem><SelectItem value="panel-2">Panel 2 - Dr. Patel, Prof. Kim</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional notes..." /></div>
              <DialogFooter><Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button><Button>Schedule Interview</Button></DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default AdmissionsPage;
