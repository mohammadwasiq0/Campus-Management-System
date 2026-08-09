'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import {
  Library,
  Search,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  ArrowRight,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  coverUrl?: string;
}

interface IssuedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine: number;
}

interface LibraryData {
  issuedBooks: IssuedBook[];
  borrowingHistory: IssuedBook[];
  totalFines: number;
}

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReserve, setShowReserve] = useState<Book | null>(null);

  const { data: library, isLoading } = useApiGet<LibraryData>(
    ['student-library'],
    '/student/library'
  );

  const { data: searchResults } = useApiGet<Book[]>(
    ['library-search', searchQuery],
    '/student/library/search',
    { q: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const reserveMutation = useApiPost('/student/library/reserve', {
    onSuccess: () => {
      toast.success('Book reserved successfully');
      setShowReserve(null);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-0">
          <CardContent className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!library) return null;

  const finesPaid = library.totalFines <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search books, manage borrowings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Books Issued', value: library.issuedBooks.filter(b => b.status === 'issued').length, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Overdue', value: library.issuedBooks.filter(b => b.status === 'overdue').length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Total Fines', value: formatCurrency(library.totalFines), icon: AlertTriangle, color: finesPaid ? 'text-emerald-500' : 'text-red-500', bg: finesPaid ? 'bg-emerald-500/10' : 'bg-red-500/10' },
          { label: 'History', value: library.borrowingHistory.length, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                    <p className={cn('text-xl font-bold', item.color)}>{item.value}</p>
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

      <Tabs defaultValue="issued" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search" className="gap-2">
            <Search size={14} />
            Search Books
          </TabsTrigger>
          <TabsTrigger value="issued" className="gap-2">
            <BookOpen size={14} />
            Currently Issued
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock size={14} />
            Borrowing History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Search Books</CardTitle>
              <CardDescription>Search the library catalog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery.length >= 2 && searchResults && (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                        >
                          <div className="w-10 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Library size={20} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                            <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant={book.availableCopies > 0 ? 'success' : 'destructive'}>
                              {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Unavailable'}
                            </Badge>
                            {book.availableCopies > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 h-7 text-xs"
                                onClick={() => setShowReserve(book)}
                              >
                                Reserve
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No books found</p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issued">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Currently Issued Books</CardTitle>
              <CardDescription>Books currently in your possession</CardDescription>
            </CardHeader>
            <CardContent>
              {library.issuedBooks.filter(b => b.status === 'issued' || b.status === 'overdue').length > 0 ? (
                <div className="space-y-3">
                  {library.issuedBooks
                    .filter(b => b.status === 'issued' || b.status === 'overdue')
                    .map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                      >
                        <div className="w-10 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Issued: {formatDate(book.issueDate, 'MMM d')}</span>
                            <span className={cn(
                              'flex items-center gap-1',
                              book.status === 'overdue' ? 'text-red-500' : 'text-amber-500'
                            )}>
                              <Calendar size={11} />
                              Due: {formatDate(book.dueDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant={book.status === 'overdue' ? 'destructive' : 'warning'}>
                            {book.status}
                          </Badge>
                          {book.fine > 0 && (
                            <p className="text-xs text-red-500 mt-1">Fine: {formatCurrency(book.fine)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No books currently issued</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Borrowing History</CardTitle>
              <CardDescription>Past book borrowings</CardDescription>
            </CardHeader>
            <CardContent>
              {library.borrowingHistory.length > 0 ? (
                <div className="space-y-2">
                  {library.borrowingHistory.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>Issued: {formatDate(book.issueDate, 'MMM d')}</p>
                        <p>Returned: {book.returnDate ? formatDate(book.returnDate, 'MMM d') : '-'}</p>
                      </div>
                      <Badge variant={book.status === 'returned' ? 'success' : 'destructive'}>
                        {book.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No borrowing history</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!showReserve} onOpenChange={(o) => !o && setShowReserve(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Book</DialogTitle>
            <DialogDescription>
              Reserve "{showReserve?.title}" from the library
            </DialogDescription>
          </DialogHeader>
          {showReserve && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <Library size={24} className="text-primary" />
                <div>
                  <p className="font-semibold">{showReserve.title}</p>
                  <p className="text-sm text-muted-foreground">{showReserve.author}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You will be notified when the book is available for pickup.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReserve(null)}>Cancel</Button>
            <Button onClick={() => reserveMutation.mutate({ bookId: showReserve?.id })}>
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default LibraryPage;
