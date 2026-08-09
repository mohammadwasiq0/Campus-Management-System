'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

function PageContainer({
  title,
  description,
  children,
  actions,
  breadcrumbs,
  className,
}: PageContainerProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground md:hidden">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:text-foreground transition-colors"
          >
            <Home size={14} />
          </button>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href || index} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-muted-foreground/50" />
              {crumb.href && index < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl lg:text-3xl font-bold tracking-tight"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex items-center gap-2 shrink-0"
          >
            {actions}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default PageContainer;
