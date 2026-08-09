'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Settings, Shield, Bell, Mail, Globe, Database, Lock, Eye, EyeOff,
  Save, RefreshCw, Download, Upload, AlertTriangle, CheckCircle2, XCircle,
  Smartphone, Monitor, Moon, Sun, Palette, Users, Building2, Wallet,
  Clock, Key, Server, HardDrive, FileText, LogOut, ChevronRight,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const auditLogs = [
  { id: '1', user: 'Admin User', action: 'User login', target: 'System', timestamp: '2026-06-30 12:00:00', ip: '192.168.1.100', status: 'success' as const },
  { id: '2', user: 'Dr. Sarah Khan', action: 'Updated profile', target: 'Faculty Management', timestamp: '2026-06-30 11:45:00', ip: '192.168.1.101', status: 'success' as const },
  { id: '3', user: 'System', action: 'Database backup', target: 'Backup System', timestamp: '2026-06-30 03:00:00', ip: 'System', status: 'success' as const },
  { id: '4', user: 'Unknown', action: 'Failed login attempt', target: 'Authentication', timestamp: '2026-06-29 23:15:00', ip: '203.0.113.5', status: 'failed' as const },
  { id: '5', user: 'Admin User', action: 'Fee structure updated', target: 'Fee Management', timestamp: '2026-06-29 16:30:00', ip: '192.168.1.100', status: 'success' as const },
];

const backupHistory = [
  { id: '1', type: 'Full', size: '2.4 GB', date: '2026-06-30 03:00', status: 'success' as const },
  { id: '2', type: 'Full', size: '2.3 GB', date: '2026-06-29 03:00', status: 'success' as const },
  { id: '3', type: 'Incremental', size: '450 MB', date: '2026-06-28 03:00', status: 'success' as const },
  { id: '4', type: 'Full', size: '2.2 GB', date: '2026-06-27 03:00', status: 'failed' as const },
];

function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">System Settings</h1><p className="text-muted-foreground mt-1">Configure system preferences, security, and integrations</p></div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general"><Settings size={14} className="mr-1" /> General</TabsTrigger>
          <TabsTrigger value="academic"><Building2 size={14} className="mr-1" /> Academic</TabsTrigger>
          <TabsTrigger value="fees"><Wallet size={14} className="mr-1" /> Fee Config</TabsTrigger>
          <TabsTrigger value="notifications"><Bell size={14} className="mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="email"><Mail size={14} className="mr-1" /> Email/SMS</TabsTrigger>
          <TabsTrigger value="security"><Shield size={14} className="mr-1" /> Security</TabsTrigger>
          <TabsTrigger value="backup"><Database size={14} className="mr-1" /> Backup</TabsTrigger>
          <TabsTrigger value="audit"><FileText size={14} className="mr-1" /> Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Basic system configuration</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Institution Name</Label><Input defaultValue="Smart Campus University" /></div>
                <div className="space-y-2"><Label>Institution Code</Label><Input defaultValue="SCU-001" /></div>
                <div className="space-y-2"><Label>Address</Label><Input defaultValue="123 Education Lane, Knowledge City" /></div>
                <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue="info@campus.edu" /></div>
                <div className="space-y-2"><Label>Contact Phone</Label><Input defaultValue="+91 1800-123-4567" /></div>
                <div className="space-y-2"><Label>Website</Label><Input defaultValue="https://www.campus.edu" /></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">Dark Mode Default</p><p className="text-xs text-muted-foreground">Set default theme for new users</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">Maintenance Mode</p><p className="text-xs text-muted-foreground">Temporarily disable user access</p></div>
                <Switch />
              </div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Academic Settings</CardTitle><CardDescription>Configure academic year, grading, and semesters</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Current Academic Year</Label><Select defaultValue="2025-26"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2025-26">2025-2026</SelectItem><SelectItem value="2026-27">2026-2027</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Current Semester</Label><Select defaultValue="even"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="odd">Odd Semester</SelectItem><SelectItem value="even">Even Semester</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Passing Percentage</Label><Input defaultValue="40" type="number" /></div>
                <div className="space-y-2"><Label>Attendance Threshold (%)</Label><Input defaultValue="75" type="number" /></div>
                <div className="space-y-2"><Label>Max Credits/Semester</Label><Input defaultValue="24" type="number" /></div>
                <div className="space-y-2"><Label>Grading System</Label><Select defaultValue="cgpa"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cgpa">CGPA (10-point)</SelectItem><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select></div>
              </div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Fee Configuration</CardTitle><CardDescription>Configure fee rules, due dates, and penalties</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Late Fee (₹/day)</Label><Input defaultValue="50" type="number" /></div>
                <div className="space-y-2"><Label>Grace Period (days)</Label><Input defaultValue="7" type="number" /></div>
                <div className="space-y-2"><Label>Installments Allowed</Label><Select defaultValue="2"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 (Full Payment)</SelectItem><SelectItem value="2">2 Installments</SelectItem><SelectItem value="3">3 Installments</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Payment Methods</Label><Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Methods</SelectItem><SelectItem value="online">Online Only</SelectItem></SelectContent></Select></div>
              </div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Configure notification channels and preferences</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Email Notifications', desc: 'Send notifications via email' },
                { label: 'SMS Notifications', desc: 'Send notifications via SMS' },
                { label: 'Push Notifications', desc: 'In-app push notifications' },
                { label: 'Fee Reminders', desc: 'Automated fee payment reminders' },
                { label: 'Attendance Alerts', desc: 'Alert when attendance drops below threshold' },
                { label: 'Exam Notifications', desc: 'Exam schedule and result notifications' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Email & SMS Configuration</CardTitle><CardDescription>Configure SMTP, SMS gateway, and templates</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>SMTP Host</Label><Input defaultValue="smtp.campus.edu" /></div>
                <div className="space-y-2"><Label>SMTP Port</Label><Input defaultValue="587" /></div>
                <div className="space-y-2"><Label>SMTP Username</Label><Input defaultValue="noreply@campus.edu" /></div>
                <div className="space-y-2"><Label>SMTP Password</Label>
                  <div className="relative"><Input type={showPassword ? 'text' : 'password'} defaultValue="********" /><Button variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</Button></div>
                </div>
                <div className="space-y-2"><Label>SMS API Key</Label><Input type="password" defaultValue="sk-**********" /></div>
                <div className="space-y-2"><Label>SMS Sender ID</Label><Input defaultValue="CAMPUS" /></div>
              </div>
              <div className="flex gap-2"><Button variant="outline" size="sm">Test Email</Button><Button variant="outline" size="sm">Test SMS</Button></div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Password policy, 2FA, and access control</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Password Min Length</Label><Input defaultValue="8" type="number" /></div>
                <div className="space-y-2"><Label>Password Expiry (days)</Label><Input defaultValue="90" type="number" /></div>
                <div className="space-y-2"><Label>Max Login Attempts</Label><Input defaultValue="5" type="number" /></div>
                <div className="space-y-2"><Label>Session Timeout (mins)</Label><Input defaultValue="30" type="number" /></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">IP Whitelisting</p><p className="text-xs text-muted-foreground">Restrict admin access to specific IPs</p></div>
                <Switch />
              </div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Backup Management</CardTitle><CardDescription>Schedule backups and restore data</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Backup Frequency</Label><Select defaultValue="daily"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Retention (days)</Label><Input defaultValue="30" type="number" /></div>
                <div className="space-y-2"><Label>Backup Location</Label><Input defaultValue="/backups/database/" /></div>
                <div className="space-y-2"><Label>Last Backup</Label><Input defaultValue="2026-06-30 03:00 AM" disabled /></div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Backup History</p>
                {backupHistory.map((b, i) => (
                  <div key={b.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant={b.status === 'success' ? 'success' : 'destructive'} className="text-[10px] capitalize">{b.status}</Badge>
                      <span>{b.type} Backup</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{b.size}</span><span>{b.date}</span></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2"><Button className="gap-2"><Database size={16} /> Run Backup Now</Button><Button variant="outline" className="gap-2"><Download size={16} /> Download Backup</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Audit Logs</CardTitle><CardDescription>Track all system activities</CardDescription></div>
                <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export Logs</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditLogs.map((log, i) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500')} />
                    <div><p className="text-sm font-medium">{log.action}</p><p className="text-xs text-muted-foreground">{log.user} | {log.target}</p></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <p>{log.timestamp}</p>
                    <p>{log.ip}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default SettingsPage;
