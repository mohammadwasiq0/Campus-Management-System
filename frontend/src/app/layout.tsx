import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Smart Campus ERP - AI Powered University Management System',
    template: '%s | Smart Campus ERP',
  },
  description:
    'AI Powered University ERP & Automation Platform. Developed by Mohammad Wasiq. Manage academics, administration, finance, and campus services from a single intelligent platform.',
  keywords: [
    'Campus Management',
    'University ERP',
    'AI Education',
    'Smart Campus',
    'Student Information System',
    'Faculty Management',
    'Academic Management',
  ],
  authors: [{ name: 'Mohammad Wasiq' }],
  creator: 'Mohammad Wasiq',
  publisher: 'Smart Campus ERP',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Smart Campus ERP',
    title: 'Smart AI Campus Management System',
    description: 'AI Powered University ERP & Automation Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Campus ERP',
    description: 'AI Powered University ERP & Automation Platform',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
