// components/ui/InstallBanner.tsx
'use client';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Button } from './Button';
import { useState } from 'react';

export function InstallBanner() {
  const { isInstallable, triggerInstall } = useInstallPrompt();
  const [dismissed, setDismissed]         = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="mx-4 mb-3 p-4 rounded-2xl bg-brand-600/20 border border-brand-500/30
                    flex items-center gap-3 animate-slide-up">
      <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100">Install TechCheck</p>
        <p className="text-xs text-slate-400 truncate">Add to home screen for the best experience</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => setDismissed(true)}
          className="text-xs text-slate-500 px-2 py-1">Later</button>
        <Button variant="primary" size="sm" onClick={triggerInstall}>Install</Button>
      </div>
    </div>
  );
}
