'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bus, Search, Plus, Edit2, Trash2, MapPin, Users, Clock, Route,
  ChevronLeft, ChevronRight, Fuel, Wrench, User, Phone, Calendar,
  AlertTriangle, CheckCircle2, XCircle, MoreHorizontal, Car,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
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

interface Route {
  id: string; name: string; startPoint: string; endPoint: string;
  distance: string; duration: string; stops: number; students: number;
  vehicles: string; status: 'active' | 'inactive';
}

interface Vehicle {
  id: string; registrationNo: string; type: string; capacity: number;
  driver: string; driverPhone: string; route: string;
  lastService: string; status: 'active' | 'maintenance' | 'out-of-service';
}

const routes: Route[] = [
  { id: '1', name: 'Route A - North Campus', startPoint: 'Main Gate', endPoint: 'North Block', distance: '12 km', duration: '35 min', stops: 8, students: 65, vehicles: 'Bus 01, Bus 02', status: 'active' },
  { id: '2', name: 'Route B - South City', startPoint: 'City Center', endPoint: 'South Campus', distance: '18 km', duration: '45 min', stops: 12, students: 85, vehicles: 'Bus 03', status: 'active' },
  { id: '3', name: 'Route C - East Zone', startPoint: 'Railway Station', endPoint: 'East Gate', distance: '8 km', duration: '25 min', stops: 5, students: 45, vehicles: 'Bus 04', status: 'active' },
  { id: '4', name: 'Route D - West Suburbs', startPoint: 'West Mall', endPoint: 'West Hostel', distance: '15 km', duration: '40 min', stops: 10, students: 55, vehicles: 'Bus 05', status: 'inactive' },
];

const vehicles: Vehicle[] = [
  { id: '1', registrationNo: 'UP-32-AB-1234', type: 'Standard Bus', capacity: 50, driver: 'Rajesh Kumar', driverPhone: '+91 98765 43210', route: 'Route A - North Campus', lastService: '2026-06-15', status: 'active' },
  { id: '2', registrationNo: 'UP-32-CD-5678', type: 'Standard Bus', capacity: 50, driver: 'Suresh Singh', driverPhone: '+91 98765 43211', route: 'Route A - North Campus', lastService: '2026-06-10', status: 'active' },
  { id: '3', registrationNo: 'UP-32-EF-9012', type: 'Mini Bus', capacity: 30, driver: 'Amit Verma', driverPhone: '+91 98765 43212', route: 'Route B - South City', lastService: '2026-05-28', status: 'active' },
  { id: '4', registrationNo: 'UP-32-GH-3456', type: 'Standard Bus', capacity: 50, driver: 'Vijay Patel', driverPhone: '+91 98765 43213', route: 'Route C - East Zone', lastService: '2026-06-20', status: 'active' },
  { id: '5', registrationNo: 'UP-32-IJ-7890', type: 'Mini Bus', capacity: 30, driver: 'Ravi Kumar', driverPhone: '+91 98765 43214', route: 'Route D - West Suburbs', lastService: '2026-05-01', status: 'maintenance' },
];

const drivers = [
  { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', license: 'DL-123456', experience: '8 yrs', vehicle: 'Bus 01', status: 'active' as const },
  { id: '2', name: 'Suresh Singh', phone: '+91 98765 43211', license: 'DL-234567', experience: '12 yrs', vehicle: 'Bus 02', status: 'active' as const },
  { id: '3', name: 'Amit Verma', phone: '+91 98765 43212', license: 'DL-345678', experience: '5 yrs', vehicle: 'Bus 03', status: 'active' as const },
  { id: '4', name: 'Vijay Patel', phone: '+91 98765 43213', license: 'DL-456789', experience: '6 yrs', vehicle: 'Bus 04', status: 'active' as const },
  { id: '5', name: 'Ravi Kumar', phone: '+91 98765 43214', license: 'DL-567890', experience: '10 yrs', vehicle: 'Bus 05', status: 'on-leave' as const },
];

function TransportPage() {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Transport Management</h1><p className="text-muted-foreground mt-1">Manage bus routes, vehicles, passes, and drivers</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">Pass Management</Button>
          <Button size="sm" className="gap-2"><Plus size={16} /> Add Route</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="routes"><Route size={14} className="mr-1" /> Routes</TabsTrigger>
          <TabsTrigger value="vehicles"><Bus size={14} className="mr-1" /> Vehicles</TabsTrigger>
          <TabsTrigger value="drivers"><User size={14} className="mr-1" /> Drivers</TabsTrigger>
          <TabsTrigger value="passes"><Users size={14} className="mr-1" /> Passes</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search routes..." className="pl-9" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route, i) => (
              <motion.div key={route.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white"><Route size={20} /></div>
                        <div><h3 className="font-semibold">{route.name}</h3><Badge variant={route.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">{route.status}</Badge></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span>{route.startPoint} → {route.endPoint}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span>{route.distance} ({route.duration})</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Stops</span><span>{route.stops}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span>{route.students}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Vehicles</span><span>{route.vehicles}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search vehicles..." className="pl-9" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={cn('glass-card border-0', v.status === 'maintenance' && 'border-amber-500/30')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2"><Bus size={16} className="text-muted-foreground" /><p className="font-semibold">{v.registrationNo}</p></div>
                      <Badge variant={v.status === 'active' ? 'success' : v.status === 'maintenance' ? 'warning' : 'destructive'} className="text-[10px] capitalize">{v.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.type} | Capacity: {v.capacity}</p>
                    <p className="text-xs text-muted-foreground">Driver: {v.driver}</p>
                    <p className="text-xs text-muted-foreground">Route: {v.route}</p>
                    <p className="text-xs text-muted-foreground">Last Service: {new Date(v.lastService).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary text-xs">{d.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{d.name}</p><Badge variant={d.status === 'active' ? 'success' : 'warning'} className="text-[10px] capitalize">{d.status}</Badge></div>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>📞 {d.phone}</p>
                      <p>🎫 License: {d.license}</p>
                      <p>📅 Experience: {d.experience}</p>
                      <p>🚌 Vehicle: {d.vehicle}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="passes" className="mt-4">
          <p className="text-muted-foreground text-sm">Transport pass management - issue, renew, and track bus passes for students and staff.</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default TransportPage;
