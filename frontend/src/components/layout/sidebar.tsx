'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleSidebar, setSidebarOpen } from '@/store/slices/uiSlice';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileCheck,
  Wallet,
  Building2,
  Bus,
  Library,
  Stethoscope,
  Settings,
  Bot,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Trophy,
  Music,
  Dumbbell,
  ClipboardList,
  UserCheck,
  Briefcase,
  FlaskConical,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: { title: string; href: string; roles?: string[] }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { title: 'Students', href: '/dashboard/students', icon: <Users size={20} />, roles: ['admin', 'faculty', 'staff'] },
  { title: 'Faculty', href: '/dashboard/faculty', icon: <GraduationCap size={20} />, roles: ['admin', 'hr'] },
  { title: 'Courses', href: '/dashboard/courses', icon: <BookOpen size={20} />, roles: ['admin', 'faculty'] },
  { title: 'Attendance', href: '/dashboard/attendance', icon: <CalendarCheck size={20} />, roles: ['admin', 'faculty'] },
  {
    title: 'Exams',
    href: '/dashboard/exams',
    icon: <FileCheck size={20} />,
    roles: ['admin', 'faculty'],
    children: [
      { title: 'Schedule', href: '/dashboard/exams/schedule' },
      { title: 'Results', href: '/dashboard/exams/results' },
      { title: 'Hall Tickets', href: '/dashboard/exams/hall-tickets' },
    ],
  },
  { title: 'Fees', href: '/dashboard/fees', icon: <Wallet size={20} />, roles: ['admin', 'accounts'] },
  { title: 'Hostel', href: '/dashboard/hostel', icon: <Building2 size={20} />, roles: ['admin', 'warden'] },
  { title: 'Transport', href: '/dashboard/transport', icon: <Bus size={20} />, roles: ['admin', 'transport'] },
  { title: 'Library', href: '/dashboard/library', icon: <Library size={20} />, roles: ['admin', 'librarian', 'faculty', 'student'] },
  { title: 'HR', href: '/dashboard/hr', icon: <UserCheck size={20} />, roles: ['admin', 'hr'] },
  { title: 'Payroll', href: '/dashboard/payroll', icon: <Briefcase size={20} />, roles: ['admin', 'accounts'] },
  { title: 'Research', href: '/dashboard/research', icon: <FlaskConical size={20} />, roles: ['admin', 'faculty'] },
  { title: 'Events', href: '/dashboard/events', icon: <Music size={20} /> },
  { title: 'Clubs', href: '/dashboard/clubs', icon: <Trophy size={20} /> },
  { title: 'Sports', href: '/dashboard/sports', icon: <Dumbbell size={20} /> },
  { title: 'Medical', href: '/dashboard/medical', icon: <Stethoscope size={20} />, roles: ['admin', 'medical'] },
  { title: 'Complaints', href: '/dashboard/complaints', icon: <ClipboardList size={20} /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} />, roles: ['admin'] },
  { title: 'AI Chatbot', href: '/dashboard/ai-chatbot', icon: <Bot size={20} /> },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen, isMobile } = useSelector((state: RootState) => state.ui);
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setSidebarOpen(window.innerWidth >= 768));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((child) => pathname.startsWith(child.href));
        if (isActive) {
          setExpandedMenus((prev) => new Set(prev).add(item.title));
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = useCallback((title: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/dashboard') return pathname === '/dashboard';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const canShow = useCallback(
    (item: NavItem) => {
      if (!item.roles || !user) return true;
      return item.roles.some((role) => user.roles?.some((ur) => ur.role === role));
    },
    [user]
  );

  const filteredItems = navItems.filter(canShow);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 72,
          x: isMobile && !sidebarOpen ? -280 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-full flex flex-col glass-sidebar',
          isMobile ? 'shadow-2xl' : ''
        )}
      >
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-border/50',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CE</span>
              </div>
              <span className="font-semibold text-sm">Smart Campus</span>
            </motion.div>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={cn(
              'p-1.5 rounded-lg hover:bg-accent transition-colors',
              sidebarOpen ? '' : 'mx-auto'
            )}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-3 pt-4 pb-3 border-b border-border/50"
            >
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.roles?.map((r) => r.role).join(', ') || 'Loading...'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="space-y-0.5">
            {filteredItems.map((item) => {
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.has(item.title);

              const filteredChildren = item.children?.filter((child) => {
                if (!child.roles || !user) return true;
                return child.roles.some((role) => user.roles?.some((ur) => ur.role === role));
              });

              return (
                <div key={item.title}>
                  {sidebarOpen ? (
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleSubmenu(item.title);
                        } else {
                          router.push(item.href);
                          if (isMobile) dispatch(setSidebarOpen(false));
                        }
                      }}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                        active
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <span className={cn(
                        'shrink-0 transition-transform duration-200',
                        active && 'scale-110'
                      )}>
                        {item.icon}
                      </span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 text-left"
                      >
                        {item.title}
                      </motion.span>
                      {hasChildren && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} className="text-muted-foreground/60" />
                        </motion.div>
                      )}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          dispatch(setSidebarOpen(true));
                          setTimeout(() => toggleSubmenu(item.title), 300);
                        } else {
                          router.push(item.href);
                        }
                      }}
                      className={cn(
                        'w-full flex items-center justify-center p-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative mx-auto',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      title={item.title}
                    >
                      <span className={cn('transition-transform', active && 'scale-110')}>
                        {item.icon}
                      </span>
                      {active && (
                        <motion.div
                          layoutId="activeIndicatorMini"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        />
                      )}
                    </button>
                  )}

                  <AnimatePresence initial={false}>
                    {hasChildren && sidebarOpen && isExpanded && filteredChildren && filteredChildren.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="ml-9 pl-2 border-l border-border/50 space-y-0.5 mt-0.5">
                          {filteredChildren.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <button
                                key={child.title}
                                onClick={() => {
                                  router.push(child.href);
                                  if (isMobile) dispatch(setSidebarOpen(false));
                                }}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                                  childActive
                                    ? 'text-primary bg-primary/5'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                              >
                                {child.title}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {sidebarOpen && (
          <div className="px-3 py-3 border-t border-border/50">
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}

export default Sidebar;
