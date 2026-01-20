import { HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { VerificationLevel } from '@/types';
import { CheckCircle2 } from 'lucide-react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  verificationLevel?: VerificationLevel;
  fallback?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt = 'Avatar', 
    size = 'md', 
    verified, 
    verificationLevel,
    fallback,
    className, 
    ...props 
  }, ref) => {
    const [imageError, setImageError] = useState(false);
    
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const badgeSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const badgeColorClasses = {
      [VerificationLevel.EMAIL]: 'text-blue-500',
      [VerificationLevel.ID]: 'text-green-500',
      [VerificationLevel.GOLD]: 'text-yellow-500',
    };

    const showFallback = !src || imageError;

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        {...props}
      >
        <div
          className={cn(
            'rounded-full overflow-hidden bg-card border-2 border-border',
            sizeClasses[size]
          )}
        >
          {src && !imageError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
          {showFallback && (
            <div
              className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-semibold"
            >
              {fallback || alt.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {verified && verificationLevel && (
          <div
            className={cn(
              'absolute -bottom-0.5 -right-0.5',
              'bg-background rounded-full p-0.5',
              'ring-2 ring-background'
            )}
          >
            <CheckCircle2
              className={cn(
                badgeSizeClasses[size],
                badgeColorClasses[verificationLevel]
              )}
              fill="currentColor"
            />
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
