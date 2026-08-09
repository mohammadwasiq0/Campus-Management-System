'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    role: z.string().min(1, 'Please select a role'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty Member' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Administrator' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 5);
  }, [password]);

  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-emerald-600',
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength - 1] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className={`text-xs ${strength <= 2 ? 'text-destructive' : 'text-emerald-500'}`}>
          {labels[strength - 1] || 'Weak'}
        </p>
      )}
    </div>
  );
}

function RegistrationPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, dismissError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      dismissError();
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: data.role,
      });
      if (result.meta.requestStatus === 'fulfilled') {
        setRegistrationSuccess(true);
      }
    },
    [registerUser, dismissError]
  );

  if (registrationSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
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
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a verification email to your registered address. Please check your inbox and verify your email to activate your account.
          </p>
          <Button onClick={() => router.push('/auth/login')} className="h-11 px-8">
            Go to Login
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent dark:from-purple-900/20" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
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
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Join the Smart Campus community
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="pl-10 h-11"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

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
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 h-11"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={(value) => setValue('role', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-destructive">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
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
                  <PasswordStrengthIndicator password={password || ''} />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
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
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="acceptTerms"
                  onCheckedChange={(checked) =>
                    setValue('acceptTerms', checked as boolean)
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-5 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </motion.form>

            <motion.div variants={itemVariants} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 text-xs text-muted-foreground">
              <ShieldCheck size={16} className="shrink-0 text-primary" />
              <span>
                Your information is encrypted and secure. We'll never share your data with third parties.
              </span>
            </motion.div>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default RegistrationPage;
