'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { RootState, AppDispatch } from '@/store';
import { toggleSidebar, setBreadcrumbs } from '@/store/slices/uiSlice';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  X,
  Command,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  faculty: 'Faculty',
  courses: 'Courses',
  attendance: 'Attendance',
  exams: 'Exams',
  fees: 'Fees',
  hostel: 'Hostel',
  transport: 'Transport',
  library: 'Library',
  hr: 'HR',
  payroll: 'Payroll',
  research: 'Research',
  events: 'Events',
  clubs: 'Clubs',
  sports: 'Sports',
  medical: 'Medical',
  complaints: 'Complaints',
  settings: 'Settings',
  'ai-chatbot': 'AI Chatbot',
};

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Student Registration',
    description: '25 new students registered for the academic year 2025-26',
    time: '5 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Fee Payment Reminder',
    description: 'Fee deadline for 3rd year students is approaching',
    time: '1 hour ago',
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Exam Schedule Updated',
    description: 'Final exam timetable has been published',
    time: '3 hours ago',
    read: false,
    type: 'success',
  },
  {
    id: '4',
    title: 'Server Maintenance',
    description: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM',
    time: '1 day ago',
    read: true,
    type: 'error',
  },
  {
    id: '5',
    title: 'Attendance Report Ready',
    description: 'Monthly attendance report for all departments',
    time: '2 days ago',
    read: true,
    type: 'info',
  },
];

const quickActions = [
  { label: 'Add Student', icon: User, shortcut: '⌘N' },
  { label: 'Create Event', icon: Sparkles, shortcut: '⌘E' },
  { label: 'Generate Report', icon: Shield, shortcut: '⌘R' },
  { label: 'Help Center', icon: HelpCircle, shortcut: '⌘H' },
];

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { sidebarOpen, isMobile } = useSelector((state: RootState) => state.ui);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [{ label: 'Home', href: '/dashboard' }];
    let currentPath = '';
    segments.forEach((seg) => {
      if (seg === 'dashboard') return;
      currentPath += `/dashboard/${seg}`;
      const label = breadcrumbMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
      crumbs.push({ label, href: currentPath });
    });
    dispatch(setBreadcrumbs(crumbs));
  }, [pathname, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const breadcrumbs = useSelector((state: RootState) => state.ui.breadcrumbs);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const searchResults = searchQuery
    ? Object.entries(breadcrumbMap)
        .filter(([key, label]) =>
          label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
    : Object.entries(breadcrumbMap).slice(0, 8);

  const handleNotificationClick = useCallback((id: string) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotificationOpen(false);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 border-b border-border/50 flex items-center justify-between px-4 lg:px-6',
        'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl'
      )}
    >
      <div className="flex items-center gap-3">
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu size={20} />
          </motion.button>
        )}

        <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href || index} className="flex items-center gap-1.5">
              {index === 0 && <Home size={14} className="shrink-0" />}
              {index > 0 && <ChevronRight size={14} className="shrink-0 text-muted-foreground/50" />}
              {crumb.href && index < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-foreground font-medium px-1">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSearch(true)}
          className={cn(
            'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50',
            'text-sm text-muted-foreground hover:bg-accent transition-colors w-64 lg:w-72',
            'bg-white/50 dark:bg-gray-800/50'
          )}
        >
          <Search size={16} className="shrink-0" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
            <Command size={10} />K
          </kbd>
        </button>

        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 mt-1">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    'flex items-start gap-3 p-3 cursor-pointer',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 shrink-0',
                    notification.type === 'info' && 'bg-blue-500',
                    notification.type === 'warning' && 'bg-amber-500',
                    notification.type === 'success' && 'bg-emerald-500',
                    notification.type === 'error' && 'bg-red-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm',
                      !notification.read && 'font-medium'
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
                {user?.fullName || 'User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
            <motion.div
              ref={searchRef}
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, settings, or modules..."
                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                  ESC
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      router.push(`/dashboard/${key}`);
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Search size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">/dashboard/{key}</p>
                    </div>
                    <kbd className="hidden sm:inline-flex text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      ↵
                    </kbd>
                  </button>
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <div className="px-3 py-8 text-center">
                    <Search size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <kbd className="px-1 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <kbd className="px-1 py-0.5 rounded bg-muted font-mono">↵</kbd>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <kbd className="px-1 py-0.5 rounded bg-muted font-mono">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
