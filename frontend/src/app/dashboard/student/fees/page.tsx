'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
  Wallet,
  CreditCard,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Banknote,
  Award,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Receipt,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface FeeBreakdown {
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  transactionId: string;
  receiptUrl: string;
  status: string;
}

interface Scholarship {
  name: string;
  amount: number;
  provider: string;
  duration: string;
  status: string;
}

interface FeesData {
  summary: {
    total: number;
    paid: number;
    due: number;
    dueDate: string;
  };
  semesterFees: FeeBreakdown[];
  paymentHistory: PaymentHistory[];
  scholarships: Scholarship[];
}

function FeesPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);

  const { data: fees, isLoading } = useApiGet<FeesData>(
    ['student-fees'],
    '/student/fees'
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
          <CardContent className="p-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fees) return null;

  const paidPct = fees.summary.total > 0 ? (fees.summary.paid / fees.summary.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Fees</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fee details and payment history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setShowPayment(true)}
            disabled={fees.summary.due <= 0}
          >
            <CreditCard size={14} />
            Pay Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fee', value: formatCurrency(fees.summary.total), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Paid', value: formatCurrency(fees.summary.paid), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Due', value: formatCurrency(fees.summary.due), icon: AlertTriangle, color: fees.summary.due > 0 ? 'text-red-500' : 'text-emerald-500', bg: fees.summary.due > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10' },
          { label: 'Due Date', value: fees.summary.dueDate || 'N/A', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
                    <p className={cn('text-lg font-bold', item.color)}>{item.value}</p>
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

      <Card className="glass-card border-0">
        <CardContent className="p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment Progress</span>
              <span className="font-semibold">{paidPct.toFixed(1)}%</span>
            </div>
            <Progress value={paidPct} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Paid: {formatCurrency(fees.summary.paid)}</span>
              <span>Due: {formatCurrency(fees.summary.due)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown" className="gap-2">
            <Receipt size={14} />
            Fee Breakdown
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock size={14} />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="scholarship" className="gap-2">
            <Award size={14} />
            Scholarships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Semester Fee Breakdown</CardTitle>
              <CardDescription>Current semester fee details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.semesterFees.map((fee, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{fee.feeType}</TableCell>
                      <TableCell className="text-right">{formatCurrency(fee.amount)}</TableCell>
                      <TableCell>{fee.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={
                          fee.status === 'paid' ? 'success' :
                          fee.status === 'overdue' ? 'destructive' : 'warning'
                        }>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {fee.status !== 'paid' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <CreditCard size={10} />
                            Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
              <CardDescription>Your recent payments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {fees.paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{payment.transactionId}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={payment.status === 'success' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowReceipt(payment.receiptUrl)}
                          >
                            <Download size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No payment history
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scholarship">
          <div className="space-y-4">
            {fees.scholarships.length > 0 ? (
              fees.scholarships.map((scholarship, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card border-0">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Award size={24} className="text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{scholarship.name}</h3>
                          <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Amount: <strong>{formatCurrency(scholarship.amount)}</strong></span>
                            <span>Duration: {scholarship.duration}</span>
                          </div>
                        </div>
                        <Badge variant="success">{scholarship.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="glass-card border-0">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  No scholarships awarded
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Due amount: {formatCurrency(fees.summary.due)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount to Pay</span>
                <span className="text-2xl font-bold">{formatCurrency(fees.summary.due)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Credit Card', 'Debit Card', 'Net Banking', 'UPI'].map((method) => (
                <button
                  key={method}
                  className="p-3 rounded-xl border border-input bg-background hover:border-primary hover:bg-accent transition-all text-sm font-medium"
                >
                  {method}
                </button>
              ))}
            </div>
            <Button className="w-full gap-2" size="lg">
              <ExternalLink size={16} />
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default FeesPage;
