// components/ui/Input.tsx
'use client';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cx } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  icon?:    ReactNode;
  suffix?:  ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 text-slate-400 pointer-events-none">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cx(
              'w-full h-14 rounded-2xl bg-surface-800 border border-white/10',
              'text-slate-100 placeholder:text-slate-500',
              'transition-all duration-150',
              'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
              icon   ? 'pl-11 pr-4' : 'px-4',
              suffix ? 'pr-12'       : '',
              error  ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : '',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 text-slate-400">{suffix}</span>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger-400 flex items-center gap-1 ml-1">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
