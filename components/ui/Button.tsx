// components/ui/Button.tsx
'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  icon?:     ReactNode;
  fullWidth?: boolean;
  children:  ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-glow hover:shadow-glow-lg',
  secondary: 'bg-white hover:bg-surface-700 active:bg-surface-100 text-slate-700 border border-black/10',
  danger:    'bg-danger-600  hover:bg-danger-500  active:bg-danger-700  text-white',
  ghost:     'bg-transparent hover:bg-black/5 active:bg-black/10 text-slate-600',
};

const sizeStyles: Record<Size, string> = {
  sm:  'h-9  px-4  text-sm  gap-1.5',
  md:  'h-11 px-5  text-sm  gap-2',
  lg:  'h-14 px-6  text-base gap-2.5',
  xl:  'h-16 px-8  text-lg  gap-3',
};

export function Button({
  variant   = 'primary',
  size      = 'lg',
  loading   = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center font-semibold rounded-2xl',
        'transition-all duration-150 active:scale-[0.97] select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
