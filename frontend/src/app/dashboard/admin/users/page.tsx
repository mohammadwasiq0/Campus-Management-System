'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users, Search, Filter, Plus, MoreVertical, Edit2, Trash2, UserCheck, UserX,
  Download, Upload, Mail, Phone, Shield, ShieldOff, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, ArrowUpDown, Check, X, AlertCircle, Loader2,
  Eye, EyeOff, Key, Ban, CheckCircle2, SlidersHorizontal, RefreshCw,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '@/hooks/useApi';

interface User {
  id: string; fullName: string; email: string; phone: string;
  role: string; status: 'active' | 'inactive' | 'suspended';
  department: string; lastLogin: string; createdAt: string;
  avatar?: string;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'secondary';
    case 'suspended': return 'destructive';
    default: return 'outline';
  }
};

const sampleUsers: User[] = [
  { id: '1', fullName: 'Dr. Sarah Khan', email: 'sarah.khan@campus.edu', phone: '+91 98765 43210', role: 'Faculty', status: 'active', department: 'Computer Science', lastLogin: '2026-06-29T10:30:00', createdAt: '2024-01-15T00:00:00' },
  { id: '2', fullName: 'Ahmed Ali', email: 'ahmed.ali@campus.edu', phone: '+91 98765 43211', role: 'Student', status: 'active', department: 'Computer Science', lastLogin: '2026-06-30T08:15:00', createdAt: '2025-09-01T00:00:00' },
  { id: '3', fullName: 'Fatima Noor', email: 'fatima.noor@campus.edu', phone: '+91 98765 43212', role: 'Student', status: 'active', department: 'Business Admin', lastLogin: '2026-06-28T14:20:00', createdAt: '2025-09-01T00:00:00' },
  { id: '4', fullName: 'Prof. John Smith', email: 'john.smith@campus.edu', phone: '+91 98765 43213', role: 'Faculty', status: 'active', department: 'Mathematics', lastLogin: '2026-06-30T09:00:00', createdAt: '2023-08-20T00:00:00' },
  { id: '5', fullName: 'Maria Garcia', email: 'maria.garcia@campus.edu', phone: '+91 98765 43214', role: 'Staff', status: 'inactive', department: 'Administration', lastLogin: '2026-05-15T11:00:00', createdAt: '2024-03-10T00:00:00' },
  { id: '6', fullName: 'Admin User', email: 'admin@campus.edu', phone: '+91 98765 43215', role: 'Admin', status: 'active', department: 'IT', lastLogin: '2026-06-30T12:00:00', createdAt: '2023-01-01T00:00:00' },
  { id: '7', fullName: 'Robert Chen', email: 'robert.chen@campus.edu', phone: '+91 98765 43216', role: 'Student', status: 'suspended', department: 'Engineering', lastLogin: '2026-06-20T16:30:00', createdAt: '2025-09-01T00:00:00' },
  { id: '8', fullName: 'Dr. Aisha Patel', email: 'aisha.patel@campus.edu', phone: '+91 98765 43217', role: 'Faculty', status: 'active', department: 'Physics', lastLogin: '2026-06-29T15:45:00', createdAt: '2024-07-01T00:00:00' },
];

const roles = ['All', 'Admin', 'Faculty', 'Student', 'Staff'];
const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const perPage = 8;

  const filteredUsers = sampleUsers.filter(u => {
    const matchSearch = searchQuery === '' || u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) setSelectedUsers([]);
    else setSelectedUsers(paginatedUsers.map(u => u.id));
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const openDetailsDialog = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield size={14} />;
      case 'Faculty': return <Users size={14} />;
      case 'Student': return <Users size={14} />;
      default: return <Users size={14} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all system users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}><Plus size={16} /> Add User</Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name or email..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9 h-10" />
            </div>
            <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /></Button>
          </div>
        </CardContent>
      </Card>

      {selectedUsers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-0 bg-primary/5 border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedUsers.length} user(s) selected</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Email</Button>
                  <Button variant="outline" size="sm" className="gap-1"><UserCheck size={14} /> Activate</Button>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive"><Ban size={14} /> Deactivate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input type="checkbox" checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} onChange={toggleSelectAll} className="rounded border-gray-300 dark:border-gray-600" />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => openDetailsDialog(user)}>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} className="rounded border-gray-300 dark:border-gray-600" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1 text-xs">{getRoleIcon(user.role)}{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{user.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={statusVariant(user.status)} className="text-xs capitalize">{user.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(user)}><Edit2 size={14} /></Button>
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
        <p className="text-sm text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredUsers.length)} of {filteredUsers.length} users</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={currentPage === p ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Create New User</DialogTitle><DialogDescription>Add a new user to the system</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@campus.edu" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
            <div className="space-y-2"><Label>Role</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Faculty">Faculty</SelectItem><SelectItem value="Student">Student</SelectItem><SelectItem value="Staff">Staff</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Department</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent><SelectItem value="CS">Computer Science</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Business">Business Admin</SelectItem><SelectItem value="Engineering">Engineering</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select defaultValue="active"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2"><Label>Temporary Password</Label><Input type="password" placeholder="Leave empty to auto-generate" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit User</DialogTitle><DialogDescription>Update user information</DialogDescription></DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue={selectedUser.fullName} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={selectedUser.email} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue={selectedUser.phone} /></div>
              <div className="space-y-2"><Label>Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Faculty">Faculty</SelectItem><SelectItem value="Student">Student</SelectItem><SelectItem value="Staff">Staff</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Department</Label>
                <Select defaultValue={selectedUser.department}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Computer Science">Computer Science</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Business Admin">Business Admin</SelectItem><SelectItem value="Engineering">Engineering</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="text-lg bg-primary/10 text-primary">{selectedUser.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.fullName}</h3>
                  <Badge variant={statusVariant(selectedUser.status)} className="mt-1 capitalize">{selectedUser.status}</Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email</span><p>{selectedUser.email}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p>{selectedUser.phone}</p></div>
                <div><span className="text-muted-foreground">Role</span><p>{selectedUser.role}</p></div>
                <div><span className="text-muted-foreground">Department</span><p>{selectedUser.department}</p></div>
                <div><span className="text-muted-foreground">Last Login</span><p>{new Date(selectedUser.lastLogin).toLocaleString()}</p></div>
                <div><span className="text-muted-foreground">Created</span><p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Key size={14} /> Reset Password</Button>
                <Button variant="outline" size="sm" className="gap-1"><Mail size={14} /> Send Email</Button>
                <Button variant="destructive" size="sm" className="gap-1"><Ban size={14} /> Suspend</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default UsersPage;
