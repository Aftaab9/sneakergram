import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'font-medium rounded-full',
          'transition-colors',
          
          // Variant styles
          variant === 'default' && 'bg-card border border-border text-foreground',
          variant === 'primary' && 'bg-primary/10 text-primary border border-primary/20',
          variant === 'success' && 'bg-green-500/10 text-green-500 border border-green-500/20',
          variant === 'warning' && 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
          variant === 'error' && 'bg-red-500/10 text-red-500 border border-red-500/20',
          variant === 'info' && 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
          
          // Size styles
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'md' && 'px-2.5 py-1 text-sm',
          size === 'lg' && 'px-3 py-1.5 text-base',
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
