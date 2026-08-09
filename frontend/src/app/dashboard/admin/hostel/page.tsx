'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home, Search, Plus, Edit2, Trash2, Users, Bed, DoorOpen, Key,
  ChevronLeft, ChevronRight, Building2, MapPin, AlertTriangle, CheckCircle2,
  XCircle, Wallet, Filter, MoreHorizontal, RefreshCw, CreditCard,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

interface Hostel {
  id: string; name: string; type: string; totalRooms: number; occupied: number;
  capacity: number; totalStudents: number; warden: string; floors: number;
  status: 'active' | 'maintenance' | 'full';
}

const hostels: Hostel[] = [
  { id: '1', name: 'Boys Hostel A', type: 'Boys', totalRooms: 100, occupied: 92, capacity: 300, totalStudents: 276, warden: 'Mr. Sharma', floors: 5, status: 'active' },
  { id: '2', name: 'Girls Hostel B', type: 'Girls', totalRooms: 80, occupied: 78, capacity: 240, totalStudents: 234, warden: 'Mrs. Devi', floors: 4, status: 'active' },
  { id: '3', name: 'International Hostel', type: 'Co-ed', totalRooms: 50, occupied: 50, capacity: 150, totalStudents: 150, warden: 'Dr. Khan', floors: 3, status: 'full' },
  { id: '4', name: 'Boys Hostel C', type: 'Boys', totalRooms: 60, occupied: 45, capacity: 180, totalStudents: 135, warden: 'Mr. Patel', floors: 3, status: 'active' },
];

const rooms = [
  { id: '101', hostel: 'Boys Hostel A', floor: 1, type: '3-Seater', capacity: 3, occupied: 3, status: 'full' as const, occupants: ['Ahmed Ali', 'Rahul Sharma', 'Vikram Singh'] },
  { id: '102', hostel: 'Boys Hostel A', floor: 1, type: '3-Seater', capacity: 3, occupied: 2, status: 'partial' as const, occupants: ['John Doe', 'Mike Chen'] },
  { id: '103', hostel: 'Boys Hostel A', floor: 1, type: '2-Seater', capacity: 2, occupied: 0, status: 'available' as const, occupants: [] },
  { id: '201', hostel: 'Girls Hostel B', floor: 2, type: '2-Seater', capacity: 2, occupied: 2, status: 'full' as const, occupants: ['Priya Sharma', 'Anjali Patel'] },
  { id: '202', hostel: 'Girls Hostel B', floor: 2, type: '3-Seater', capacity: 3, occupied: 1, status: 'partial' as const, occupants: ['Sara Williams'] },
];

const transferRequests = [
  { id: '1', student: 'Ahmed Ali', from: 'Room 101 (A)', to: 'Room 201 (B)', reason: 'Academic reasons', status: 'pending' as const },
  { id: '2', student: 'Priya Sharma', from: 'Room 201 (B)', to: 'Room 102 (A)', reason: 'Personal', status: 'approved' as const },
];

function HostelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const totalCapacity = hostels.reduce((sum, h) => sum + h.capacity, 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + h.totalStudents, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Hostel Management</h1><p className="text-muted-foreground mt-1">Manage hostels, rooms, allocations, and fee collection</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Plus size={14} /> Allocate Room</Button>
          <Button variant="outline" size="sm" className="gap-2"><Key size={14} /> Transfer</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview"><Building2 size={14} className="mr-1" /> Overview</TabsTrigger>
          <TabsTrigger value="rooms"><DoorOpen size={14} className="mr-1" /> Rooms</TabsTrigger>
          <TabsTrigger value="allocations"><Users size={14} className="mr-1" /> Allocations</TabsTrigger>
          <TabsTrigger value="transfers"><RefreshCw size={14} className="mr-1" /> Transfers</TabsTrigger>
          <TabsTrigger value="fees"><Wallet size={14} className="mr-1" /> Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Capacity</p><p className="text-xl font-bold mt-1">{totalCapacity}</p></CardContent></Card>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Currently Occupied</p><p className="text-xl font-bold mt-1">{totalOccupied}</p></CardContent></Card>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Available Beds</p><p className="text-xl font-bold mt-1 text-emerald-500">{totalCapacity - totalOccupied}</p></CardContent></Card>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Occupancy Rate</p><p className="text-xl font-bold mt-1">{((totalOccupied / totalCapacity) * 100).toFixed(1)}%</p></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostels.map((hostel, i) => (
              <motion.div key={hostel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white"><Building2 size={20} /></div>
                        <div><h3 className="font-semibold">{hostel.name}</h3><Badge variant="outline" className="text-xs">{hostel.type}</Badge></div>
                      </div>
                      <Badge variant={hostel.status === 'active' ? 'success' : hostel.status === 'full' ? 'warning' : 'secondary'} className="text-xs capitalize">{hostel.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                      <div><p className="font-bold">{hostel.totalRooms}</p><p className="text-xs text-muted-foreground">Rooms</p></div>
                      <div><p className="font-bold">{hostel.totalStudents}</p><p className="text-xs text-muted-foreground">Students</p></div>
                      <div><p className="font-bold">{hostel.floors}</p><p className="text-xs text-muted-foreground">Floors</p></div>
                    </div>
                    <Progress value={(hostel.totalStudents / hostel.capacity) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{hostel.warden}</span>
                      <span>{Math.round((hostel.totalStudents / hostel.capacity) * 100)}% filled</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4 mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search room..." className="pl-9" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rooms.map((room, i) => (
              <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={cn('glass-card border-0 cursor-pointer hover:shadow-lg transition-all', room.status === 'available' && 'border-emerald-500/30', room.status === 'full' && 'border-red-500/30')}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><DoorOpen size={16} className="text-muted-foreground" /><p className="font-semibold">Room {room.id}</p></div>
                      <Badge variant={room.status === 'available' ? 'success' : room.status === 'partial' ? 'warning' : 'secondary'} className="text-[10px] capitalize">{room.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{room.hostel} | Floor {room.floor} | {room.type}</p>
                    <p className="text-xs mt-1">{room.occupied}/{room.capacity} occupants</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4 mt-4">
          {transferRequests.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t.student}</p>
                  <p className="text-xs text-muted-foreground">{t.from} → {t.to}</p>
                  <p className="text-xs text-muted-foreground">Reason: {t.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.status === 'pending' ? 'warning' : 'success'} className="text-xs capitalize">{t.status}</Badge>
                  {t.status === 'pending' && <><Button variant="outline" size="sm" className="h-8 text-xs"><CheckCircle2 size={14} className="mr-1" /> Approve</Button><Button variant="outline" size="sm" className="h-8 text-xs"><XCircle size={14} className="mr-1 text-destructive" /> Decline</Button></>}
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          <p className="text-muted-foreground text-sm">Detailed allocation list with student+room mapping.</p>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <p className="text-muted-foreground text-sm">Hostel fee collection status for all residents.</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default HostelPage;
