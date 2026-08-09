'use client';

import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Bus,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Route,
  Users,
  Phone,
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface RouteStop {
  name: string;
  time: string;
  order: number;
}

interface TransportData {
  hasPass: boolean;
  passStatus: 'active' | 'expired' | 'pending';
  passValidUntil: string;
  routeName: string;
  routeNumber: string;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  stops: RouteStop[];
  feeStatus: { total: number; paid: number; due: number };
  vehicleLocation: { lat: number; lng: number; lastUpdated: string };
}

function TransportPage() {
  const { data: transport, isLoading } = useApiGet<TransportData>(
    ['student-transport'],
    '/student/transport'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Transport</h1>
          <p className="text-sm text-muted-foreground mt-1">Bus route and pass information</p>
        </div>
        <Card className="glass-card border-0">
          <CardContent className="py-12 text-center">
            <Bus size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No transport service allocated</p>
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
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Transport</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {transport.routeName} - Bus {transport.busNumber}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Route', value: transport.routeNumber, icon: Route, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pass Status', value: transport.passStatus, icon: transport.passStatus === 'active' ? CheckCircle2 : AlertTriangle, color: transport.passStatus === 'active' ? 'text-emerald-500' : 'text-amber-500', bg: transport.passStatus === 'active' ? 'bg-emerald-500/10' : 'bg-amber-500/10' },
          { label: 'Bus Number', value: transport.busNumber, icon: Bus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Valid Until', value: transport.passValidUntil || 'N/A', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass-card border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={cn('text-lg font-bold capitalize', item.color)}>{item.value}</p>
                  </div>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
                    <item.icon size={20} className={item.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="route" className="space-y-4">
        <TabsList>
          <TabsTrigger value="route" className="gap-2">
            <Route size={14} />
            Route Details
          </TabsTrigger>
          <TabsTrigger value="pass" className="gap-2">
            <Bus size={14} />
            Pass & Payment
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <MapPin size={14} />
            Vehicle Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="route">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Route size={18} />
                  Route Stops
                </CardTitle>
                <CardDescription>{transport.routeName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {transport.stops
                    .sort((a, b) => a.order - b.order)
                    .map((stop, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-3 h-3 rounded-full border-2 shrink-0',
                            i === 0 ? 'bg-emerald-500 border-emerald-500' :
                            i === transport.stops.length - 1 ? 'bg-red-500 border-red-500' :
                            'bg-background border-muted-foreground'
                          )} />
                          {i < transport.stops.length - 1 && (
                            <div className="w-0.5 h-8 bg-muted-foreground/20" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="text-sm font-medium">{stop.name}</p>
                          <p className="text-xs text-muted-foreground">{stop.time}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={18} />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="font-semibold">{transport.driverName}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone size={14} />
                    {transport.driverPhone}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pass">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Pass Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={
                    transport.passStatus === 'active' ? 'success' :
                    transport.passStatus === 'expired' ? 'destructive' : 'warning'
                  }>
                    {transport.passStatus}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valid Until</span>
                  <span className="text-sm font-medium">{transport.passValidUntil || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Fee Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total', value: formatCurrency(transport.feeStatus.total) },
                    { label: 'Paid', value: formatCurrency(transport.feeStatus.paid), color: 'text-emerald-500' },
                    { label: 'Due', value: formatCurrency(transport.feeStatus.due), color: transport.feeStatus.due > 0 ? 'text-red-500' : 'text-emerald-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={cn('text-lg font-bold', item.color || '')}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <Progress
                  value={transport.feeStatus.total > 0 ? (transport.feeStatus.paid / transport.feeStatus.total) * 100 : 0}
                  className="h-2"
                />
                {transport.feeStatus.due > 0 && (
                  <Button className="w-full gap-2">
                    <CreditCard size={14} />
                    Pay Transport Fee
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Live Vehicle Tracking</CardTitle>
              <CardDescription>
                Last updated: {transport.vehicleLocation.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Map view would render here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {transport.vehicleLocation.lat}, Lng: {transport.vehicleLocation.lng}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default TransportPage;
