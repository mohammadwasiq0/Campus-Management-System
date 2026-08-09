import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = 'PPP') {
  try {
    return format(new Date(date), formatStr);
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(date: string | Date) {
  try {
    return format(new Date(date), 'PPp');
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(date: string | Date) {
  try {
    const d = new Date(date);
    if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatTime(date: string | Date) {
  try {
    return format(new Date(date), 'h:mm a');
  } catch {
    return 'Invalid time';
  }
}

export function formatCurrency(amount: number, currency: string = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatPhone(phone: string) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function truncate(str: string, length: number = 100) {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateInitials(name: string) {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStatusColor(status: string) {
  const statusMap: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRandomColor(name: string): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-orange-500', 'bg-lime-500', 'bg-rose-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural || `${singular}s`;
}
