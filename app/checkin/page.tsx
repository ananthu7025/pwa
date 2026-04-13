// app/checkin/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter }            from 'next/navigation';
import dynamic                  from 'next/dynamic';
import { useAuth }              from '@/services/auth-context';
import { checkinApi, OfficeLocation } from '@/services/api';
import { useGeolocation }       from '@/hooks/useGeolocation';
import { usePolling }           from '@/hooks/usePolling';
import { AppShell }             from '@/components/layout/AppShell';
import { Button }               from '@/components/ui/Button';
import { Card }                 from '@/components/ui/Card';
import { vibrate, formatDistance, haversineDistance } from '@/utils';

type Step = 'map' | 'locating' | 'verifying' | 'pending' | 'approved' | 'rejected';

export default function CheckinPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [step,           setStep]          = useState<Step>('map');
  const [officeLocation, setOfficeLocation] = useState<OfficeLocation | null>(null);
  const [officeError,    setOfficeError]   = useState<string | null>(null);
  const [requestId,      setRequestId]     = useState<string | null>(null);
  const [requestDisplay, setRequestDisplay] = useState<string | null>(null);
  const [distance,       setDistance]      = useState<number | null>(null);
  const [verifyError,    setVerifyError]   = useState<string | null>(null);
  const [pollError,      setPollError]     = useState<string | null>(null);

  const { status: geoStatus, coords, error: geoError, getLocation } = useGeolocation();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isLoading, isAuthenticated, router]);

  // ── Fetch office location on mount ─────────────────────────────────────────
  useEffect(() => {
    checkinApi.getOfficeLocation()
      .then(loc => setOfficeLocation(loc))
      .catch(() => setOfficeError('Could not load office location. Please try again.'));
  }, []);

  // ── Poll for approval when pending ─────────────────────────────────────────
  const pollFn = useCallback(async () => {
    if (!requestId) return { stop: true };
    try {
      const res = await checkinApi.getRequestStatus(requestId);
      if (res.status === 'approved') {
        setStep('approved');
        vibrate([80, 40, 120, 40, 200]);
        return { stop: true };
      }
      if (res.status === 'rejected') {
        setStep('rejected');
        vibrate([200, 100, 200]);
        return { stop: true };
      }
      return { stop: false };
    } catch {
      setPollError('Connection issue. Still polling…');
      return { stop: false };
    }
  }, [requestId]);

  usePolling(pollFn, { enabled: step === 'pending', interval: 5_000 });

  // ── Handle check-in button ──────────────────────────────────────────────────
  const handleCheckin = async () => {
    setVerifyError(null);
    setStep('locating');
    vibrate(50);

    let userCoords;
    try {
      userCoords = await getLocation();
    } catch {
      setStep('map');
      return;
    }

    // Compute distance for UI
    if (officeLocation) {
      const dist = haversineDistance(
        userCoords.latitude, userCoords.longitude,
        officeLocation.latitude, officeLocation.longitude,
      );
      setDistance(dist);
    }

    setStep('verifying');
    try {
      const res = await checkinApi.verifyLocation({
        latitude:  userCoords.latitude,
        longitude: userCoords.longitude,
      });

      if (res.auto_approved) {
        setStep('approved');
        vibrate([80, 40, 120, 40, 200]);
        return;
      }
      
      // pending
      if (res.id) setRequestId(res.id);
      if (res.requestId) setRequestDisplay(res.requestId);
      setStep('pending');
      vibrate(100);
    } catch (err: unknown) {
      setVerifyError((err as { message?: string })?.message ?? 'Verification failed. Please try again.');
      setStep('map');
    }
  };

  // ── Retry ───────────────────────────────────────────────────────────────────
  const retry = () => {
    setStep('map');
    setVerifyError(null);
    setPollError(null);
    setRequestId(null);
    setRequestDisplay(null);
    setDistance(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AppShell title="Check In" showBack>
      <div className="h-full flex flex-col">

        {/* ── Ready / Verifying ── */}
        {(step === 'map' || step === 'locating' || step === 'verifying') && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden page-enter">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-900/10 to-surface-950/40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-6 mt-[-10vh]">
              
              {/* Location Icon */}
              <div className="w-24 h-24 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mb-2 shadow-glow">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>

              {/* Office info */}
              {officeLocation && (
                <Card className="w-full px-4 py-3 bg-surface-800/80 animate-slide-up border-brand-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600/40 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-300" fill="currentColor">
                        <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">Office Location</p>
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {officeLocation.name ?? 'Main Office'}
                      </p>
                    </div>
                    {distance !== null && (
                      <span className="text-xs font-medium text-brand-400 bg-brand-500/20 px-2 py-1 rounded-lg flex-shrink-0">
                        {formatDistance(distance)}
                      </span>
                    )}
                  </div>
                </Card>
              )}

              {officeError && (
                <Card className="w-full px-4 py-3 border-danger-500/30">
                  <p className="text-sm text-center text-danger-400">{officeError}</p>
                </Card>
              )}

              {/* Geo error */}
              {(geoStatus === 'error' || geoStatus === 'denied') && (
                <Card className="w-full px-4 py-3 border-danger-500/30 animate-slide-up text-center">
                  <p className="text-sm text-danger-400 mb-3">{geoError}</p>
                  <Button variant="secondary" size="sm" onClick={handleCheckin} className="w-full">Retry</Button>
                </Card>
              )}

              {/* Verify error */}
              {verifyError && (
                <Card className="w-full px-4 py-3 border-danger-500/30 animate-slide-up text-center">
                  <p className="text-sm text-danger-400">{verifyError}</p>
                </Card>
              )}
            </div>

            {/* Bottom stick button */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <Button
                fullWidth
                size="xl"
                loading={step === 'locating' || step === 'verifying'}
                onClick={handleCheckin}
                disabled={step === 'locating' || step === 'verifying'}
                className="shadow-glow-lg"
              >
                {step === 'locating'  ? 'Getting your location…'
                 : step === 'verifying' ? 'Verifying location…'
                 : 'Check In Here'}
              </Button>
            </div>
          </div>
        )}

        {/* ── Pending screen ─────────────────────────────────────────────────── */}
        {step === 'pending' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 page-enter">
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-warning-500/10 border-2
                              border-warning-500/30 flex items-center justify-center
                              animate-pulse-slow">
                <div className="w-20 h-20 rounded-full bg-warning-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-warning-400" fill="none"
                    stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/>
                  </svg>
                </div>
              </div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent
                              border-t-warning-400 animate-spin-slow" />
            </div>

            <h2 className="text-2xl font-bold text-slate-50 mb-2">Awaiting Approval</h2>
            <p className="text-slate-400 text-center text-sm leading-relaxed max-w-xs mb-8">
              Your check-in request has been sent. Waiting for manager approval…
            </p>

            {/* Polling indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <span className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-warning-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
              Checking every 5 seconds
            </div>

            {pollError && (
              <p className="text-xs text-slate-500 mb-4">{pollError}</p>
            )}

            <Card className="w-full max-w-xs p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Request ID</span>
                  <span className="text-slate-300 font-mono text-xs truncate max-w-[120px]">
                    {requestDisplay ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Submitted</span>
                  <span className="text-slate-300">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {distance !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Distance</span>
                    <span className="text-slate-300">{formatDistance(distance)}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ── Approved screen ───────────────────────────────────────────────── */}
        {step === 'approved' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 page-enter">
            {/* Success ring */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-success-500/15 border-2
                              border-success-500/40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-success-500/25 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-success-400" fill="none"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>
              {/* Sparkles */}
              {[
                { top: '-8px', right: '8px',  size: 'w-3 h-3', delay: '0s' },
                { top: '8px',  right: '-12px', size: 'w-2 h-2', delay: '0.1s' },
                { bottom: '0', left: '-8px',  size: 'w-2.5 h-2.5', delay: '0.2s' },
              ].map((s, i) => (
                <div key={i} className={`absolute ${s.size} rounded-full bg-success-400
                  animate-ping opacity-75`}
                  style={{ top: s.top, right: s.right, bottom: s.bottom, left: s.left,
                           animationDelay: s.delay }} />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-slate-50 mb-2">Checked In! 🎉</h2>
            <p className="text-slate-400 text-center text-sm mb-8">
              Your attendance has been confirmed successfully.
            </p>

            <Card className="w-full max-w-xs p-4 mb-6 bg-success-500/10 border-success-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-500/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-success-400" fill="none"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-success-500">Approved at</p>
                  <p className="text-sm font-semibold text-slate-100">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </Card>

            <Button fullWidth size="xl" onClick={() => router.replace('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        )}

        {/* ── Rejected screen ───────────────────────────────────────────────── */}
        {step === 'rejected' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 page-enter">
            <div className="w-28 h-28 rounded-full bg-danger-500/15 border-2
                            border-danger-500/30 flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-danger-500/25 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-danger-400" fill="none"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-50 mb-2">Request Rejected</h2>
            <p className="text-slate-400 text-center text-sm mb-8 max-w-xs">
              Your check-in was not approved. You may be outside the allowed zone or there
              was an issue with verification.
            </p>

            <div className="w-full max-w-xs space-y-3">
              <Button fullWidth size="xl" onClick={retry}>
                Try Again
              </Button>
              <Button fullWidth size="lg" variant="ghost"
                onClick={() => router.replace('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
