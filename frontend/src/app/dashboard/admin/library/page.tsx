'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Library, Search, Plus, Edit2, Trash2, BookOpen, BookMarked, Users, Clock,
  ChevronLeft, ChevronRight, Download, Upload, AlertTriangle, CheckCircle2,
  XCircle, DollarSign, FileText, MoreHorizontal, ArrowUpDown, Calendar,
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface Book {
  id: string; title: string; author: string; isbn: string; category: string;
  totalCopies: number; availableCopies: number; rackNo: string; publisher: string;
  year: number; status: 'available' | 'low' | 'unavailable';
}

interface BorrowRecord {
  id: string; bookTitle: string; borrower: string; borrowDate: string;
  dueDate: string; returnDate?: string; status: 'issued' | 'returned' | 'overdue';
  fine?: number;
}

const books: Book[] = [
  { id: '1', title: 'Introduction to Algorithms', author: 'Thomas Cormen', isbn: '978-0-262-03384-8', category: 'Computer Science', totalCopies: 10, availableCopies: 3, rackNo: 'CS-101', publisher: 'MIT Press', year: 2022, status: 'low' },
  { id: '2', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1-285-13759-6', category: 'Mathematics', totalCopies: 8, availableCopies: 5, rackNo: 'MATH-201', publisher: 'Cengage', year: 2021, status: 'available' },
  { id: '3', title: 'Principles of Economics', author: 'N. Gregory Mankiw', isbn: '978-0-357-72371-8', category: 'Business', totalCopies: 6, availableCopies: 0, rackNo: 'BUS-301', publisher: 'Cengage', year: 2023, status: 'unavailable' },
  { id: '4', title: 'The Art of Computer Programming', author: 'Donald Knuth', isbn: '978-0-201-89683-1', category: 'Computer Science', totalCopies: 4, availableCopies: 1, rackNo: 'CS-102', publisher: 'Addison-Wesley', year: 2019, status: 'low' },
  { id: '5', title: 'Physics for Scientists', author: 'Serway & Jewett', isbn: '978-1-337-55329-2', category: 'Physics', totalCopies: 7, availableCopies: 4, rackNo: 'PHY-101', publisher: 'Brooks Cole', year: 2020, status: 'available' },
];

const borrowRecords: BorrowRecord[] = [
  { id: '1', bookTitle: 'Introduction to Algorithms', borrower: 'Ahmed Ali', borrowDate: '2026-06-15', dueDate: '2026-06-29', status: 'overdue', fine: 50 },
  { id: '2', bookTitle: 'Calculus: Early Transcendentals', borrower: 'Priya Sharma', borrowDate: '2026-06-20', dueDate: '2026-07-04', status: 'issued' },
  { id: '3', bookTitle: 'The Art of Computer Programming', borrower: 'Fatima Noor', borrowDate: '2026-06-10', dueDate: '2026-06-24', returnDate: '2026-06-22', status: 'returned' },
  { id: '4', bookTitle: 'Physics for Scientists', borrower: 'Sara Williams', borrowDate: '2026-06-25', dueDate: '2026-07-09', status: 'issued' },
  { id: '5', bookTitle: 'Principles of Economics', borrower: 'Robert Chen', borrowDate: '2026-05-15', dueDate: '2026-05-29', status: 'overdue', fine: 150 },
];

function LibraryPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
  const availableBooks = books.reduce((s, b) => s + b.availableCopies, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Library Management</h1><p className="text-muted-foreground mt-1">Manage book inventory, issue/return, fines, and digital resources</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><FileText size={14} /> Purchase Request</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Report</Button>
          <Button size="sm" className="gap-2"><Plus size={16} /> Add Book</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: totalBooks, color: 'from-blue-500 to-blue-600' },
          { label: 'Available', value: availableBooks, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Issued', value: totalBooks - availableBooks, color: 'from-amber-500 to-amber-600' },
          { label: 'Overdue', value: borrowRecords.filter(r => r.status === 'overdue').length, color: 'from-red-500 to-red-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-xl font-bold mt-1">{stat.value}</p></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory"><BookOpen size={14} className="mr-1" /> Inventory</TabsTrigger>
          <TabsTrigger value="issue-return"><BookMarked size={14} className="mr-1" /> Issue/Return</TabsTrigger>
          <TabsTrigger value="fines"><DollarSign size={14} className="mr-1" /> Fines</TabsTrigger>
          <TabsTrigger value="digital"><Download size={14} className="mr-1" /> Digital Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4 mt-4">
          <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by title, author, ISBN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" /></div>
          <Card className="glass-card border-0"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title/Author</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">ISBN</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="hidden lg:table-cell">Rack</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.filter(b => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())).map((book, i) => (
                  <TableRow key={book.id}>
                    <TableCell><div><p className="text-sm font-medium">{book.title}</p><p className="text-xs text-muted-foreground">{book.author}</p></div></TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{book.category}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs font-mono">{book.isbn}</TableCell>
                    <TableCell><span className={cn('font-medium', book.availableCopies === 0 ? 'text-red-500' : book.availableCopies <= 3 ? 'text-amber-500' : 'text-emerald-500')}>{book.availableCopies}/{book.totalCopies}</span></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{book.rackNo}</TableCell>
                    <TableCell><Badge variant={book.status === 'available' ? 'success' : book.status === 'low' ? 'warning' : 'destructive'} className="text-xs capitalize">{book.status}</Badge></TableCell>
                    <TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="issue-return" className="space-y-4 mt-4">
          <div className="flex gap-2 mb-4"><Button size="sm" className="gap-1"><Plus size={14} /> Issue Book</Button><Button variant="outline" size="sm" className="gap-1">Return Book</Button></div>
          <Card className="glass-card border-0"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Fine</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowRecords.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{r.bookTitle}</TableCell>
                    <TableCell>{r.borrower}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{new Date(r.borrowDate).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{new Date(r.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">{r.fine ? `₹${r.fine}` : '—'}</TableCell>
                    <TableCell><Badge variant={r.status === 'issued' ? 'info' : r.status === 'returned' ? 'success' : 'destructive'} className="text-xs capitalize">{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="fines" className="mt-4">
          <p className="text-muted-foreground text-sm">Fine management - track and collect overdue fines from library users.</p>
          <Card className="glass-card border-0 mt-4"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Borrower</TableHead><TableHead>Book</TableHead><TableHead>Fine Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {borrowRecords.filter(r => r.fine).map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.borrower}</TableCell><TableCell>{r.bookTitle}</TableCell>
                    <TableCell className="font-medium text-red-500">₹{r.fine}</TableCell>
                    <TableCell><Badge variant="warning">Unpaid</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="outline" size="sm">Collect</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="digital" className="mt-4">
          <p className="text-muted-foreground text-sm">Digital resources - e-books, journals, databases, and online subscriptions.</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default LibraryPage;
