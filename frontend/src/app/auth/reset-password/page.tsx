'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
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
import { Progress } from '@/components/ui/progress';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      setIsValidating(false);
      return;
    }
    const validateToken = async () => {
      try {
        await api.get(`/auth/verify-reset-token/${token}`);
        setIsTokenValid(true);
      } catch {
        setError('This reset link is invalid or has expired');
      } finally {
        setIsValidating(false);
      }
    };
    validateToken();
  }, [token]);

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        await api.post('/auth/reset-password', {
          token,
          password: data.password,
        });
        setIsReset(true);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Failed to reset password. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-muted-foreground">Validating your reset link...</p>
        </motion.div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle size={40} className="text-destructive" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'This reset link is invalid or has expired. Please request a new one.'}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/auth/forgot-password')} className="h-11">
              Request New Link
            </Button>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isReset) {
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
          <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Button onClick={() => router.push('/auth/login')} className="h-11 px-8">
            Sign In
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent dark:from-emerald-900/20" />

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
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your new password
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-10 pr-10 h-11"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10 h-11"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <p className="text-xs text-muted-foreground">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: '8+ characters', met: password.length >= 8 },
                      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                      { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                      { label: 'Number', met: /[0-9]/.test(password) },
                      { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            req.met ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            req.met ? 'text-emerald-500' : 'text-muted-foreground'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
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

export default ResetPasswordPage;
