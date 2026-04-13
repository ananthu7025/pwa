// components/ui/Toast.tsx
'use client';
import { useEffect, useState } from 'react';
import { cx } from '@/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message:   string;
  type?:     ToastType;
  duration?: number;
  onClose:   () => void;
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

const styles: Record<ToastType, string> = {
  success: 'bg-success-500/20 border-success-500/40 text-success-400',
  error:   'bg-danger-500/20  border-danger-500/40  text-danger-400',
  warning: 'bg-warning-500/20 border-warning-500/40 text-warning-400',
  info:    'bg-brand-500/20   border-brand-500/40   text-brand-400',
};

export function Toast({ message, type = 'info', duration = 3500, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className={cx(
        'fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm',
        'flex items-center gap-3 px-4 py-3 rounded-2xl border',
        'backdrop-blur-md font-medium text-sm shadow-soft',
        'transition-all duration-300',
        styles[type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
      )}
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
    >
      <span className="text-lg leading-none">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="text-current opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

// ── Simple global toast context ──────────────────────────────────────────────
import { createContext, useContext, useCallback, ReactNode } from 'react';

interface ToastEntry { id: number; message: string; type: ToastType }
interface ToastCtx   { show: (message: string, type?: ToastType) => void }

const Ctx = createContext<ToastCtx>({ show: () => {} });

let _id = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++_id;
    setToasts(p => [...p, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
