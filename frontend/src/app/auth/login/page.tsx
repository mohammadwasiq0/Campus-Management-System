'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Chrome,
  Github,
  ChevronLeft,
  Shield,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must be 6 digits'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatingShapes = [
  { size: 60, x: '10%', y: '20%', duration: 20, delay: 0 },
  { size: 40, x: '85%', y: '15%', duration: 25, delay: 2 },
  { size: 80, x: '20%', y: '70%', duration: 22, delay: 1 },
  { size: 50, x: '75%', y: '75%', duration: 18, delay: 3 },
  { size: 35, x: '50%', y: '10%', duration: 28, delay: 0.5 },
  { size: 70, x: '90%', y: '50%', duration: 24, delay: 1.5 },
];

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, requiresTwoFactor, dismissError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (requiresTwoFactor) {
      setShowTwoFactor(true);
    }
  }, [requiresTwoFactor]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dismissError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dismissError]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      dismissError();
      const result = await login({
        email: data.email,
        password: data.password,
      });
      if (result.meta.requestStatus === 'fulfilled' && !requiresTwoFactor) {
        setLoginSuccess(true);
        setTimeout(() => {
          const role = (result.payload as any)?.user?.roles?.[0]?.role;
          const redirectMap: Record<string, string> = {
            admin: '/dashboard',
            faculty: '/dashboard',
            student: '/dashboard',
            staff: '/dashboard',
            accounts: '/dashboard/fees',
            librarian: '/dashboard/library',
            warden: '/dashboard/hostel',
            transport: '/dashboard/transport',
            medical: '/dashboard/medical',
            hr: '/dashboard/hr',
          };
          router.push(redirectMap[role] || '/dashboard');
        }, 1500);
      }
    },
    [login, requiresTwoFactor, router, dismissError]
  );

  const handleTwoFactorSubmit = useCallback(async () => {
    const code = twoFactorCode.join('');
    if (code.length !== 6) return;
    dismissError();
    const result = await login({
      email: '',
      password: '',
      twoFactorCode: code,
    });
    if (result.meta.requestStatus === 'fulfilled') {
      setLoginSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  }, [twoFactorCode, login, router, dismissError]);

  const handleCodeChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newCode = [...twoFactorCode];
      newCode[index] = value.slice(-1);
      setTwoFactorCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [twoFactorCode]
  );

  const handleCodeKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [twoFactorCode]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setTwoFactorCode(newCode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }, []);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/google`;
  }, []);

  const handleMicrosoftLogin = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/microsoft`;
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/5 dark:to-blue-500/5 blur-xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -30, 20, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: shape.delay,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent dark:from-purple-900/20" />

      <AnimatePresence mode="wait">
        {loginSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={40} className="text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="mt-6"
            >
              <Loader2 size={24} className="mx-auto text-primary" />
            </motion.div>
          </motion.div>
        ) : showTwoFactor ? (
          <motion.div
            key="2fa"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Shield size={32} className="text-primary" />
                </motion.div>
                <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enter the 6-digit verification code sent to your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex justify-center gap-2">
                  {twoFactorCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={cn(
                        'w-12 h-14 text-center text-lg font-bold rounded-xl border-2 transition-all duration-200',
                        'bg-background/50 focus:bg-background',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20',
                        'outline-none',
                        digit ? 'border-primary' : 'border-border'
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleTwoFactorSubmit}
                  disabled={twoFactorCode.join('').length !== 6 || isLoading}
                  className="w-full h-11 text-base"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : null}
                  Verify Code
                </Button>

                <button
                  onClick={() => {
                    setShowTwoFactor(false);
                    setTwoFactorCode(['', '', '', '', '', '']);
                  }}
                  className="flex items-center gap-1 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to login
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <motion.div
                  variants={itemVariants}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25"
                >
                  <span className="text-white font-bold text-xl">CE</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your Smart Campus account
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
                    <Label htmlFor="email">Email</Label>
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
                      <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
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
                      <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                      Remember me for 30 days
                    </Label>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </Button>
                </motion.form>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="h-11"
                  >
                    <Chrome size={18} className="mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMicrosoftLogin}
                    className="h-11"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 23 23" fill="currentColor">
                      <path d="M0 0h11v11H0z" fill="#f25022" />
                      <path d="M12 0h11v11H12z" fill="#7fba00" />
                      <path d="M0 12h11v11H0z" fill="#00a4ef" />
                      <path d="M12 12h11v11H12z" fill="#ffb900" />
                    </svg>
                    Microsoft
                  </Button>
                </motion.div>
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;
