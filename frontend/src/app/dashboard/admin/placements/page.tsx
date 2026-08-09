'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Briefcase, Search, Plus, Edit2, Trash2, Building2, Users, TrendingUp,
  ChevronLeft, ChevronRight, Calendar, MapPin, DollarSign, Award,
  CheckCircle2, XCircle, Clock, Download, Upload, Eye, MoreHorizontal,
  BarChart3, GraduationCap, FileText, Target, Star,
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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Recruiter {
  id: string; name: string; industry: string; website: string;
  jobsPosted: number; studentsPlaced: number; avgPackage: string;
  status: 'active' | 'inactive';
}

interface JobPosting {
  id: string; title: string; company: string; location: string;
  package: string; positions: number; applicants: number;
  deadline: string; status: 'open' | 'closed' | 'filled';
}

const recruiters: Recruiter[] = [
  { id: '1', name: 'Google', industry: 'Technology', website: 'google.com', jobsPosted: 5, studentsPlaced: 8, avgPackage: '₹25L', status: 'active' },
  { id: '2', name: 'Microsoft', industry: 'Technology', website: 'microsoft.com', jobsPosted: 4, studentsPlaced: 6, avgPackage: '₹22L', status: 'active' },
  { id: '3', name: 'Amazon', industry: 'E-commerce', website: 'amazon.com', jobsPosted: 6, studentsPlaced: 10, avgPackage: '₹20L', status: 'active' },
  { id: '4', name: 'Deloitte', industry: 'Consulting', website: 'deloitte.com', jobsPosted: 3, studentsPlaced: 5, avgPackage: '₹15L', status: 'active' },
  { id: '5', name: 'TCS', industry: 'IT Services', website: 'tcs.com', jobsPosted: 8, studentsPlaced: 15, avgPackage: '₹8L', status: 'active' },
];

const jobPostings: JobPosting[] = [
  { id: '1', title: 'Software Engineer', company: 'Google', location: 'Bangalore', package: '₹25L', positions: 5, applicants: 45, deadline: '2026-08-15', status: 'open' },
  { id: '2', title: 'Data Analyst', company: 'Microsoft', location: 'Hyderabad', package: '₹18L', positions: 3, applicants: 32, deadline: '2026-08-20', status: 'open' },
  { id: '3', title: 'Business Analyst', company: 'Deloitte', location: 'Mumbai', package: '₹12L', positions: 4, applicants: 28, deadline: '2026-07-30', status: 'open' },
  { id: '4', title: 'Frontend Developer', company: 'Amazon', location: 'Bangalore', package: '₹20L', positions: 3, applicants: 38, deadline: '2026-08-10', status: 'open' },
  { id: '5', title: 'Software Trainee', company: 'TCS', location: 'Pune', package: '₹7L', positions: 20, applicants: 120, deadline: '2026-07-25', status: 'open' },
  { id: '6', title: 'ML Engineer', company: 'Google', location: 'Bangalore', package: '₹30L', positions: 2, applicants: 25, deadline: '2026-08-01', status: 'open' },
];

const drives = [
  { id: '1', company: 'Google', date: '2026-08-20', type: 'On-Campus', positions: 5, status: 'scheduled' as const },
  { id: '2', company: 'Microsoft', date: '2026-08-25', type: 'On-Campus', positions: 3, status: 'scheduled' as const },
  { id: '3', company: 'Amazon', date: '2026-09-01', type: 'Virtual', positions: 3, status: 'scheduled' as const },
];

function PlacementsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPlaced = recruiters.reduce((s, r) => s + r.studentsPlaced, 0);
  const totalApplicants = jobPostings.reduce((s, j) => s + j.applicants, 0);
  const avgPackage = '₹18.5L';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Placement Management</h1><p className="text-muted-foreground mt-1">Manage recruiters, job postings, drives, and placement statistics</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Calendar size={14} /> Schedule Drive</Button>
          <Button size="sm" className="gap-2"><Plus size={16} /> Add Recruiter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Students Placed', value: totalPlaced, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Active Recruiters', value: recruiters.filter(r => r.status === 'active').length, color: 'from-blue-500 to-blue-600' },
          { label: 'Open Jobs', value: jobPostings.filter(j => j.status === 'open').length, color: 'from-amber-500 to-amber-600' },
          { label: 'Avg Package', value: avgPackage, color: 'from-purple-500 to-purple-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-xl font-bold mt-1">{stat.value}</p></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview"><BarChart3 size={14} className="mr-1" /> Overview</TabsTrigger>
          <TabsTrigger value="recruiters"><Building2 size={14} className="mr-1" /> Recruiters</TabsTrigger>
          <TabsTrigger value="jobs"><Briefcase size={14} className="mr-1" /> Job Postings</TabsTrigger>
          <TabsTrigger value="drives"><Calendar size={14} className="mr-1" /> Drives</TabsTrigger>
          <TabsTrigger value="applications"><Users size={14} className="mr-1" /> Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="glass-card border-0"><CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Placement Statistics (2026 Batch)</h3>
            <div className="space-y-3">
              {[
                { dept: 'Computer Science', total: 120, placed: 98, avgPkg: '₹22L' },
                { dept: 'Business Admin', total: 90, placed: 72, avgPkg: '₹14L' },
                { dept: 'Engineering', total: 80, placed: 55, avgPkg: '₹16L' },
                { dept: 'Mathematics', total: 60, placed: 35, avgPkg: '₹10L' },
              ].map((d, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm"><span>{d.dept}</span><span>{d.placed}/{d.total} placed | {d.avgPkg}</span></div>
                  <Progress value={(d.placed / d.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent></Card>

          <Card className="glass-card border-0"><CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3">Top Recruiters</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {recruiters.slice(0, 5).map((r, i) => (
                <div key={r.id} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50 text-center">
                  <Building2 size={24} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs font-medium">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.studentsPlaced} placed</p>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="recruiters" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search recruiters..." className="pl-9" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recruiters.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white"><Building2 size={18} /></div>
                      <div><p className="font-medium">{r.name}</p><Badge variant="outline" className="text-[10px]">{r.industry}</Badge></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
                      <div><p className="font-bold">{r.jobsPosted}</p><p className="text-muted-foreground">Jobs</p></div>
                      <div><p className="font-bold">{r.studentsPlaced}</p><p className="text-muted-foreground">Placed</p></div>
                      <div><p className="font-bold">{r.avgPackage}</p><p className="text-muted-foreground">Avg</p></div>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.website}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search job postings..." className="pl-9" /></div>
          <Card className="glass-card border-0"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Job Title</TableHead><TableHead>Company</TableHead><TableHead className="hidden md:table-cell">Location</TableHead><TableHead>Package</TableHead><TableHead className="hidden md:table-cell">Applicants</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px] text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {jobPostings.map((job, i) => (
                  <TableRow key={job.id}>
                    <TableCell className="text-sm font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{job.location}</TableCell>
                    <TableCell className="font-medium text-emerald-500">{job.package}</TableCell>
                    <TableCell className="hidden md:table-cell">{job.applicants}/{job.positions}</TableCell>
                    <TableCell><Badge variant={job.status === 'open' ? 'success' : 'secondary'} className="text-xs capitalize">{job.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="drives" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drives.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><Calendar size={16} className="text-primary" /><p className="font-semibold">{d.company}</p></div>
                      <Badge variant={d.status === 'scheduled' ? 'info' : 'success'} className="text-[10px] capitalize">{d.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Date: {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-xs text-muted-foreground">Type: {d.type}</p>
                    <p className="text-xs text-muted-foreground">Positions: {d.positions}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <p className="text-muted-foreground text-sm">Student applications tracking - view and manage all placement applications.</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default PlacementsPage;
