import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'muted';
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className,
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    muted: 'text-muted',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('inline-block', className)}
      {...props}
    >
      <svg
        className={cn(
          'animate-spin',
          sizeClasses[size],
          colorClasses[variant]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Full-screen loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        {message && (
          <p className="text-foreground text-lg font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

// Inline loading state for content areas
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-card/50 rounded-lg',
        className
      )}
      aria-hidden="true"
    />
  );
}
