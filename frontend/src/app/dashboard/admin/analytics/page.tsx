'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BarChart3, TrendingUp, TrendingDown, Download, FileText, PieChart,
  ChevronLeft, ChevronRight, Calendar, Filter, RefreshCw, Brain,
  Users, GraduationCap, Wallet, BookOpen, Award, Target, Zap,
  DownloadCloud, FileSpreadsheet, Printer, MoreHorizontal, Activity,
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
import { Progress } from '@/components/ui/progress';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const departmentComparison = [
  { dept: 'Computer Science', students: 450, faculty: 28, placement: 82, avgScore: 8.2, revenue: '₹3.2Cr' },
  { dept: 'Business Admin', students: 380, faculty: 25, placement: 76, avgScore: 7.8, revenue: '₹2.8Cr' },
  { dept: 'Mathematics', students: 320, faculty: 22, placement: 58, avgScore: 7.5, revenue: '₹2.1Cr' },
  { dept: 'Engineering', students: 290, faculty: 20, placement: 69, avgScore: 7.2, revenue: '₹2.5Cr' },
  { dept: 'Physics', students: 180, faculty: 15, placement: 45, avgScore: 7.0, revenue: '₹1.2Cr' },
  { dept: 'Arts & Humanities', students: 210, faculty: 18, placement: 38, avgScore: 6.8, revenue: '₹1.0Cr' },
];

const AIInsight = ({ icon: Icon, title, description, type }: { icon: any; title: string; description: string; type: 'positive' | 'negative' | 'neutral' }) => (
  <div className="flex gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50">
    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
      type === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' : type === 'negative' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30')}>
      <Icon size={16} className={cn(type === 'positive' ? 'text-emerald-600' : type === 'negative' ? 'text-red-600' : 'text-blue-600')} />
    </div>
    <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div>
  </div>
);

const SimpleBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs"><span>{label}</span><span className="font-medium">{value}%</span></div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 0.8 }} className={cn('h-full rounded-full', color)} />
    </div>
  </div>
);

const TrendChart = () => {
  const data = [65, 72, 68, 85, 78, 90, 82, 88, 92, 86, 94, 89];
  const max = Math.max(...data);
  return (
    <div className="flex items-end justify-between gap-1 h-40">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.03 }}
            className="w-full rounded-sm bg-gradient-to-t from-primary to-blue-400" style={{ maxHeight: '100%' }} />
          <span className="text-[8px] text-muted-foreground">{months[i].slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
};

const PieChartSimple = () => {
  const segments = [
    { label: 'Tuition', value: 65, color: 'bg-blue-500' },
    { label: 'Hostel', value: 15, color: 'bg-emerald-500' },
    { label: 'Transport', value: 8, color: 'bg-amber-500' },
    { label: 'Other', value: 12, color: 'bg-purple-500' },
  ];
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 rounded-full bg-muted overflow-hidden">
        {segments.map((s, i) => {
          const pct = s.value;
          const rotation = segments.slice(0, i).reduce((sum, seg) => sum + seg.value * 3.6, 0);
          return (
            <div key={s.label} className={cn('absolute inset-0', s.color)}
              style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((pct * 3.6 * Math.PI) / 180)}% ${50 - 50 * Math.sin((pct * 3.6 * Math.PI) / 180)}%)`, transform: `rotate(${rotation}deg)`, opacity: 0.8 }} />
          );
        })}
        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center"><span className="text-lg font-bold">100%</span></div>
      </div>
      <div className="space-y-1.5">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-xs"><span className={cn('w-2.5 h-2.5 rounded-sm', s.color)} /><span>{s.label} ({s.value}%)</span></div>
        ))}
      </div>
    </div>
  );
};

function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Analytics & Reports</h1><p className="text-muted-foreground mt-1">Data-driven insights, custom reports, and trend analysis</p></div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">This Quarter</SelectItem><SelectItem value="year">This Year</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2"><DownloadCloud size={14} /> Export</Button>
          <Button variant="outline" size="sm" className="gap-2"><RefreshCw size={14} /> Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹12.8Cr', change: '+8.2%', positive: true, icon: Wallet },
          { label: 'Student Growth', value: '+15.3%', change: 'YoY', positive: true, icon: TrendingUp },
          { label: 'Avg Performance', value: '7.8 CGPA', change: '+0.3', positive: true, icon: Award },
          { label: 'Placement Rate', value: '78.4%', change: '+5.2%', positive: true, icon: Target },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <stat.icon size={16} className="text-muted-foreground" />
                </div>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
                <p className={cn('text-xs mt-0.5', stat.positive ? 'text-emerald-500' : 'text-red-500')}>{stat.change} {stat.label === 'Student Growth' ? '' : 'vs last year'}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Enrollment Trend</CardTitle><CardDescription>Monthly enrollment for {selectedPeriod}</CardDescription></div>
                  <Badge variant="outline">{selectedPeriod}</Badge>
                </div>
              </CardHeader>
              <CardContent><TrendChart /></CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Department Comparison</CardTitle><CardDescription>Performance metrics across departments</CardDescription></div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><FileSpreadsheet size={14} /> Export</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentComparison.map((d, i) => (
                    <div key={d.dept} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{d.dept}</span>
                        <span className="text-muted-foreground">{d.students} students | Placement: {d.placement}% | Avg: {d.avgScore} CGPA</span>
                      </div>
                      <Progress value={d.placement} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Revenue Breakdown</CardTitle><CardDescription>By fee type</CardDescription></div>
                </div>
              </CardHeader>
              <CardContent><PieChartSimple /></CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">AI-Powered Insights</CardTitle><CardDescription>Intelligent recommendations</CardDescription></div>
                  <Brain size={16} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <AIInsight icon={TrendingUp} title="Placement trend is positive" description="82% placement rate this year, up 5.2% from last year. Computer Science leading." type="positive" />
                <AIInsight icon={TrendingDown} title="Mathematics enrollment declining" description="15% decrease in enrollment compared to last year. Consider outreach programs." type="negative" />
                <AIInsight icon={Activity} title="Revenue optimization opportunity" description="Hostel fee collection at 72%. Automated reminders could improve by 15%." type="neutral" />
                <AIInsight icon={Users} title="Faculty-student ratio healthy" description="Overall ratio 1:18, within UGC recommended range of 1:20." type="positive" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Report Builder</CardTitle>
                <CardDescription>Generate custom reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select><SelectTrigger><SelectValue placeholder="Report type" /></SelectTrigger><SelectContent><SelectItem value="academic">Academic Report</SelectItem><SelectItem value="financial">Financial Report</SelectItem><SelectItem value="placement">Placement Report</SelectItem><SelectItem value="attendance">Attendance Report</SelectItem></SelectContent></Select>
                <div className="grid grid-cols-2 gap-2">
                  <Select><SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="cs">CS</SelectItem><SelectItem value="math">Math</SelectItem></SelectContent></Select>
                  <Select><SelectTrigger><SelectValue placeholder="Period" /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent></Select>
                </div>
                <div className="flex gap-2"><Button className="flex-1" size="sm"><FileText size={14} className="mr-1" /> Generate PDF</Button><Button variant="outline" size="sm" className="flex-1"><FileSpreadsheet size={14} className="mr-1" /> Export Excel</Button></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsPage;
