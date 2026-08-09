'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet, useApiPut, useApiPost } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Hash,
  Camera,
  Upload,
  Save,
  Download,
  FileText,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate, generateInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePicture: string;
  course: string;
  batch: string;
  semester: number;
  rollNumber: string;
  enrollmentNumber: string;
  academicYear: string;
  documents: Array<{ id: string; name: string; type: string; url: string; uploadedAt: string }>;
  bloodGroup: string;
  nationality: string;
  motherName: string;
  fatherName: string;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="w-28 h-28 rounded-full" />
            <div className="flex-1 space-y-3 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-56 mx-auto md:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="glass-card border-0">
            <CardContent className="p-6 space-y-4">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-5 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});

  const { data: profile, isLoading, refetch } = useApiGet<StudentProfile>(
    ['student-profile'],
    '/student/profile'
  );

  const updateMutation = useApiPut('/student/profile', {
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      refetch();
    },
  });

  const uploadMutation = useApiPost('/student/profile/photo', {
    onSuccess: () => {
      toast.success('Photo uploaded successfully');
      setShowPhotoDialog(false);
      refetch();
    },
  });

  const handleEdit = () => {
    setFormData({
      fullName: profile?.fullName,
      phone: profile?.phone,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      zipCode: profile?.zipCode,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('photo', file);
      uploadMutation.mutate(fd);
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return null;

  const infoFields = [
    { label: 'Date of Birth', value: formatDate(profile.dateOfBirth, 'PPP'), icon: Calendar },
    { label: 'Gender', value: profile.gender, icon: User },
    { label: 'Blood Group', value: profile.bloodGroup, icon: AlertCircle },
    { label: 'Nationality', value: profile.nationality, icon: MapPin },
    { label: 'Father\'s Name', value: profile.fatherName, icon: User },
    { label: 'Mother\'s Name', value: profile.motherName, icon: User },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal and academic information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
              <Edit3 size={14} />
              Edit Profile
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPhotoDialog(true)}>
            <Camera size={14} />
            Update Photo
          </Button>
        </div>
      </div>

      <Card className="glass-card border-0 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-background shadow-xl">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {generateInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowPhotoDialog(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{profile.fullName}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="info">{profile.course}</Badge>
                <Badge variant="secondary">Sem {profile.semester}</Badge>
                <Badge variant="secondary">Batch {profile.batch}</Badge>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="text-lg font-bold">{profile.rollNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={18} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={formData.state || ''}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={formData.zipCode || ''}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="gap-2" onClick={handleSave} disabled={updateMutation.isPending}>
                    <Save size={14} />
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              infoFields.map((field) => (
                <div key={field.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <field.icon size={14} />
                    <span>{field.label}</span>
                  </div>
                  <span className="text-sm font-medium">{field.value || '-'}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap size={18} />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Course', value: profile.course, icon: BookOpen },
                { label: 'Batch', value: profile.batch, icon: Calendar },
                { label: 'Semester', value: `Semester ${profile.semester}`, icon: GraduationCap },
                { label: 'Roll Number', value: profile.rollNumber, icon: Hash },
                { label: 'Enrollment No.', value: profile.enrollmentNumber, icon: Hash },
                { label: 'Academic Year', value: profile.academicYear, icon: Calendar },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <field.icon size={14} />
                    <span>{field.label}</span>
                  </div>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={18} />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.documents && profile.documents.length > 0 ? (
                <ScrollArea className="h-[200px] pr-2">
                  <div className="space-y-2">
                    {profile.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText size={16} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} | {formatDate(doc.uploadedAt, 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
                          <a href={doc.url} download>
                            <Download size={14} />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>Upload a new profile picture (JPG, PNG, WEBP)</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {generateInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="photo-upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background cursor-pointer hover:bg-accent transition-colors"
            >
              <Upload size={16} />
              Choose Photo
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default ProfilePage;
