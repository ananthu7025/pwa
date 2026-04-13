// components/ui/Card.tsx
import { ReactNode, CSSProperties } from 'react';
import { cx } from '@/utils';

interface CardProps {
  children:  ReactNode;
  className?: string;
  glass?:     boolean;
  onClick?:   () => void;
  style?:     CSSProperties;
}

export function Card({ children, className, glass = false, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cx(
        'rounded-3xl border',
        glass
          ? 'bg-white/5 border-white/10 backdrop-blur-sm'
          : 'bg-surface-800 border-white/8',
        'shadow-card',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-150',
        className,
      )}
    >
      {children}
    </div>
  );
}
