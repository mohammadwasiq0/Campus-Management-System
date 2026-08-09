'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { sidebarOpen, isMobile } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen && !isMobile ? 'ml-[280px]' : isMobile ? 'ml-0' : 'ml-[72px]'
        )}
      >
        <Header />
        <main className="p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
