// components/layout/AppShell.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/services/auth-context';
import { cx } from '@/utils';
import { ReactNode } from 'react';

interface NavItem { href: string; label: string; icon: (active: boolean) => JSX.Element }

const navItems: NavItem[] = [
  {
    href:  '/dashboard',
    label: 'Home',
    icon:  (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={a ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={a ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href:  '/checkin',
    label: 'Check-In',
    icon:  (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={a ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={a ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill={a ? 'white' : 'currentColor'} stroke="none"/>
      </svg>
    ),
  },
  {
    href:  '/profile',
    label: 'Profile',
    icon:  (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={a ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={a ? 0 : 2}>
        <circle cx="12" cy="8" r="4" strokeLinecap="round"/>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

interface AppShellProps { children: ReactNode; title?: string; showBack?: boolean }

export function AppShell({ children, title, showBack = false }: AppShellProps) {
  const pathname  = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-surface-100 select-none">
      {/* Status bar spacer */}
      <div className="flex-shrink-0 bg-surface-100"
        style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between
                         px-5 py-3 bg-surface-100 border-b border-white/5">
        {showBack ? (
          <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center
            rounded-xl text-slate-500 hover:text-slate-700 hover:bg-black/5 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-wide">TechCheck</span>
          </div>
        )}

        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-slate-800 text-base">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-1">
          {user && (
            <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-200">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden scroll-area page-enter">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 bg-surface-100 border-t border-white/5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-stretch">
          {navItems.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={cx(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-3',
                  'transition-colors duration-150',
                  active ? 'text-brand-600' : 'text-slate-500 hover:text-slate-600',
                )}>
                {item.icon(active)}
                <span className={cx(
                  'text-[10px] font-medium',
                  active ? 'text-brand-600' : 'text-slate-600',
                )}>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 w-1 h-1 rounded-full bg-brand-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
