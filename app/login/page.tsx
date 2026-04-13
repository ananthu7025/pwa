// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/auth-context';
import { Button }  from '@/components/ui/Button';
import { Input }   from '@/components/ui/Input';
import { vibrate } from '@/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim())            e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password)                 e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { vibrate(100); return; }
    setLoading(true);
    setErrors({});
    try {
      await login(email.trim(), password);
      vibrate([50, 30, 80]);
      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Login failed. Please try again.';
      setErrors({ form: msg });
      vibrate([100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)',
               paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full
                        bg-brand-700/30 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full
                        bg-violet-700/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full
                        bg-brand-900/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 py-8">
        {/* Logo */}
        <div className="pt-10 mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center
                          shadow-glow mb-5">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="currentColor">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.85"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-base">Sign in to your TechCheck account</p>
        </div>

        {/* Form */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {errors.form && (
            <div className="px-4 py-3 rounded-2xl bg-danger-500/15 border border-danger-500/30
                            text-danger-400 text-sm flex items-center gap-2">
              <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {errors.form}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
            icon={
              <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            }
          />

          <Input
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            icon={
              <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            }
            suffix={
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1">
                {showPw ? (
                  <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                  </svg>
                )}
              </button>
            }
          />

          <div className="pt-2">
            <Button
              fullWidth
              size="xl"
              loading={loading}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 text-center animate-fade-in"
          style={{ animationDelay: '0.2s' }}>
          <p className="text-xs text-slate-600">
            TechCheck Field App · Secure Login
          </p>
        </div>
      </div>
    </div>
  );
}
