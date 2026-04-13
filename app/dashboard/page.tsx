// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter }            from 'next/navigation';
import Link                     from 'next/link';
import { useAuth }              from '@/services/auth-context';
import { AppShell }             from '@/components/layout/AppShell';
import { Card }                 from '@/components/ui/Card';
import { Button }               from '@/components/ui/Button';
import { InstallBanner }        from '@/components/ui/InstallBanner';
import { DashboardSkeleton }    from '@/components/ui/Skeleton';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router  = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) { router.replace('/login'); return; }
      setReady(true);
    }
  }, [isLoading, isAuthenticated, router]);

  if (!ready) return (
    <AppShell>
      <DashboardSkeleton />
    </AppShell>
  );

  const firstName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Technician';

  return (
    <AppShell>
      <div className="h-full flex flex-col scroll-area">
        <div className="flex-1 px-5 py-5 space-y-5">

          {/* Greeting */}
          <div className="flex items-start justify-between pt-1 animate-slide-up">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">
                {formatDate()}
              </p>
              <h2 className="text-2xl font-bold text-slate-50 leading-tight">
                {getGreeting()},<br />
                <span className="text-brand-400">{firstName}</span> 👋
              </h2>
            </div>
            <button onClick={() => { logout(); router.replace('/login'); }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10
                         flex items-center justify-center text-slate-400
                         hover:text-danger-400 hover:bg-danger-500/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>

          {/* Status banner */}
          <Card className="p-4 bg-gradient-to-br from-brand-700/30 to-violet-800/20
                           border-brand-500/20 animate-slide-up"
            style={{ animationDelay: '0.05s' } as React.CSSProperties}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/40 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-300" fill="none"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-400 font-medium">Today's Status</p>
                <p className="text-sm font-semibold text-slate-200">Not checked in yet</p>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full badge-warning">
                Pending
              </span>
            </div>
          </Card>

          {/* Check-in CTA */}
          <Link href="/checkin" className="block animate-slide-up"
            style={{ animationDelay: '0.1s' }}>
            <button className="w-full h-20 rounded-3xl
              bg-gradient-to-r from-brand-600 to-violet-600
              flex items-center justify-between px-6
              shadow-glow hover:shadow-glow-lg active:scale-[0.98]
              transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.85)"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-base">Check In Now</p>
                  <p className="text-white/60 text-xs">Verify your location</p>
                </div>
              </div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/70
                group-hover:translate-x-1 transition-transform duration-200"
                fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up"
            style={{ animationDelay: '0.15s' }}>
            <Card className="p-4">
              <div className="w-8 h-8 rounded-lg bg-success-500/20 flex items-center
                              justify-center mb-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-success-400" fill="none"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-xs text-slate-500 mb-0.5">Current Time</p>
              <p className="text-lg font-bold text-slate-100">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </Card>

            <Card className="p-4">
              <div className="w-8 h-8 rounded-lg bg-warning-500/20 flex items-center
                              justify-center mb-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-warning-400" fill="none"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <p className="text-xs text-slate-500 mb-0.5">Role</p>
              <p className="text-sm font-bold text-slate-100 truncate">
                {user?.role ?? 'Technician'}
              </p>
            </Card>
          </div>

          {/* Quick tips */}
          <Card className="p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              How it works
            </p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Tap Check In Now', color: 'bg-brand-600' },
                { step: '2', text: 'Allow location access', color: 'bg-violet-600' },
                { step: '3', text: 'Wait for approval', color: 'bg-warning-500' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className={`w-6 h-6 ${item.color} rounded-full flex items-center
                                   justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {item.step}
                  </span>
                  <span className="text-sm text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Install banner */}
        <InstallBanner />
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </AppShell>
  );
}
