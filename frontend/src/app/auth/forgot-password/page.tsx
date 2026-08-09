'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import {
  Mail,
  Loader2,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmailSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} className="text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary hover:underline"
            >
              try again
            </button>
          </p>
          <Button onClick={() => router.push('/auth/login')} variant="outline" className="h-11">
            <ChevronLeft size={18} className="mr-2" />
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent dark:from-blue-900/20" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              variants={itemVariants}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <Lock size={32} className="text-primary" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    className="pl-10 h-11"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <Link
              href="/auth/login"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
