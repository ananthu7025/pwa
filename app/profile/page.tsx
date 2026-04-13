// app/profile/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth }   from '@/services/auth-context';
import { AppShell }  from '@/components/layout/AppShell';
import { Card }      from '@/components/ui/Card';
import { Button }    from '@/components/ui/Button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { isInstallable, triggerInstall, isInstalled } = useInstallPrompt();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!isAuthenticated) return null;

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppShell title="Profile">
      <div className="h-full scroll-area px-5 py-6 space-y-5">

        {/* Avatar card */}
        <Card className="p-6 flex flex-col items-center text-center animate-slide-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-500
                          flex items-center justify-center mb-4 shadow-glow">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {user?.name || 'Technician'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
          {user?.role && (
            <span className="mt-2 text-xs px-3 py-1 rounded-full bg-brand-500/20 text-brand-600 font-medium">
              {user.role}
            </span>
          )}
        </Card>

        {/* App info */}
        <Card className="divide-y divide-white/5 animate-slide-up"
          style={{ animationDelay: '0.05s' } as React.CSSProperties}>
          {[
            { label: 'App Version', value: '1.0.0' },
            { label: 'API Server',  value: 'trip-ledge.vercel.app' },
            { label: 'Installed',   value: isInstalled ? 'Yes ✓' : 'No' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-medium text-slate-700">{item.value}</span>
            </div>
          ))}
        </Card>

        {/* Install */}
        {isInstallable && !isInstalled && (
          <Button fullWidth variant="secondary" size="lg" onClick={triggerInstall}
            icon={
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            }
            className="animate-slide-up">
            Install App
          </Button>
        )}

        {/* Logout */}
        <Button fullWidth variant="danger" size="lg" onClick={handleLogout}
          icon={
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
          }
          className="animate-slide-up" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
          Sign Out
        </Button>
      </div>
    </AppShell>
  );
}
