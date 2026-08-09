'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useApiGet } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Award,
  FileText,
  ExternalLink,
  Edit3,
  Save,
  X,
  Building2,
  Hash,
  Briefcase,
  Microscope,
  Users,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface FacultyProfile {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  qualifications: string[];
  specialization: string[];
  researchProjects: number;
  publications: number;
  researchStudents: number;
  grants: number;
  officeHours: string;
  officeLocation: string;
  bio: string;
  avatar?: string;
}

const profileData: FacultyProfile = {
  id: '1',
  employeeCode: 'FAC-2024-0042',
  fullName: 'Dr. Sarah Khan',
  email: 'sarah.khan@campus.edu',
  phone: '+91 98765 43210',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  dateOfJoining: '15 Aug 2019',
  qualifications: ['Ph.D. in Computer Science (IIT Delhi)', 'M.Tech in Software Engineering (NIT Trichy)', 'B.Tech in CSE (DTU)'],
  specialization: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science'],
  researchProjects: 4,
  publications: 28,
  researchStudents: 6,
  grants: 3,
  officeHours: 'Monday - Friday: 10:00 AM - 4:00 PM',
  officeLocation: 'CS Department, Block-A, Room 204',
  bio: 'Dr. Sarah Khan is an Associate Professor in the Department of Computer Science & Engineering with over 10 years of teaching and research experience. Her research interests include Machine Learning, NLP, and Computer Vision. She has published 28 research papers in reputed international journals and conferences.',
};

function FacultyProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ officeHours: profileData.officeHours, officeLocation: profileData.officeLocation, bio: profileData.bio });

  const { data: profile, isLoading } = useApiGet<FacultyProfile>(
    ['faculty-profile'],
    '/faculty/profile'
  );

  const d = profile || profileData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4"><Skeleton className="h-20 w-20 rounded-full" /><div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><Card className="glass-card border-0"><CardContent className="p-6"><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-40 w-full" /></CardContent></Card></div>
          <Card className="glass-card border-0"><CardContent className="p-6"><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and professional information</p>
        </div>
        <Button
          variant={isEditing ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Profile</>}
        </Button>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={d.avatar} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-blue-600 text-white">
                {d.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold">{d.fullName}</h2>
              <p className="text-muted-foreground">{d.designation}</p>
              <p className="text-sm text-muted-foreground">{d.department}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="info">{d.employeeCode}</Badge>
                <Badge variant="secondary">Joined {d.dateOfJoining}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <Mail size={16} className="text-muted-foreground" />
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{d.email}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <Phone size={16} className="text-muted-foreground" />
                  <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{d.phone}</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-primary" />
                <CardTitle className="text-lg">Qualifications & Specialization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Education</h4>
                <div className="space-y-3">
                  {d.qualifications.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <GraduationCap size={14} className="text-primary" />
                      </div>
                      <p className="text-sm">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Areas of Specialization</h4>
                <div className="flex flex-wrap gap-2">
                  {d.specialization.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <CardTitle className="text-lg">Office & Contact Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Office Hours</label>
                    <Input value={formData.officeHours} onChange={e => setFormData({ ...formData, officeHours: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Office Location</label>
                    <Input value={formData.officeLocation} onChange={e => setFormData({ ...formData, officeLocation: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bio</label>
                    <Textarea rows={4} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <Clock size={16} className="text-primary" />
                    <div><p className="text-xs text-muted-foreground">Office Hours</p><p className="text-sm font-medium">{d.officeHours}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <MapPin size={16} className="text-primary" />
                    <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium">{d.officeLocation}</p></div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <p className="text-xs text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm">{d.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                <CardTitle className="text-lg">Employee Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Hash size={14} /> Employee Code</span>
                <span className="text-sm font-semibold">{d.employeeCode}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Briefcase size={14} /> Designation</span>
                <span className="text-sm font-semibold">{d.designation}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Building2 size={14} /> Department</span>
                <span className="text-sm font-semibold">{d.department}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={14} /> Joined</span>
                <span className="text-sm font-semibold">{d.dateOfJoining}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Microscope size={18} className="text-primary" />
                <CardTitle className="text-lg">Research Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{d.researchProjects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{d.publications}</p>
                  <p className="text-xs text-muted-foreground">Publications</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{d.researchStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{d.grants}</p>
                  <p className="text-xs text-muted-foreground">Grants</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.location.href = '/dashboard/faculty/research'}>
                <ExternalLink size={14} /> View Research Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultyProfilePage;
