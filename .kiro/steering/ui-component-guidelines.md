---
inclusion: fileMatch
fileMatchPattern: 'components/**/*.tsx'
---

# UI Component Development Guidelines

This steering file provides specific guidelines for developing UI components in the SneakerGram application.

## Component Architecture

### Base UI Components (`components/ui/`)

These are the foundational, reusable components used throughout the application:

- **Button**: Primary interaction element with variants
- **Input**: Form input fields with validation
- **Card**: Container with glassmorphism effects
- **Avatar**: User profile images with badges
- **Badge**: Status and verification indicators
- **Modal**: Overlay dialogs with animations
- **LoadingSpinner**: Loading state indicator

### Design System Tokens

```typescript
// Theme Colors (from tailwind.config.ts)
const colors = {
  primary: '#FF6B35',      // Orange accent
  background: '#0F0F1A',   // Dark background
  card: '#1A1A2E',         // Card background
  border: '#2A2A3E',       // Border color
  foreground: '#FFFFFF',   // Text color
  muted: '#9CA3AF',        // Muted text
};

// Spacing Scale
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
};

// Border Radius
const radius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  full: '9999px',  // Fully rounded
};
```

## Component Patterns

### Button Component Pattern

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium rounded-lg',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variant styles
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'bg-card border border-border hover:bg-card/80': variant === 'secondary',
            'hover:bg-card/50': variant === 'ghost',
          },
          
          // Size styles
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Input Component Pattern

```typescript
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2',
            'bg-card border border-border rounded-lg',
            'text-foreground placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### Card Component Pattern

```typescript
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          {
            'bg-card border border-border': variant === 'default',
            'bg-card/50 backdrop-blur-md border border-border/50': variant === 'glass',
            'bg-card border border-border shadow-glow': variant === 'elevated',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
```

### Modal Component Pattern

```typescript
'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                'bg-card border border-border rounded-lg shadow-2xl',
                'w-full max-h-[90vh] overflow-y-auto',
                {
                  'max-w-sm': size === 'sm',
                  'max-w-md': size === 'md',
                  'max-w-2xl': size === 'lg',
                }
              )}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              )}
              
              {/* Content */}
              <div className="p-4">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Glassmorphism Effects

### CSS Implementation

```css
/* In globals.css */
.glass {
  background: rgba(26, 26, 46, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.1);
}

.shadow-glow-strong {
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.2);
}
```

### Tailwind Classes

```typescript
// Glassmorphism card
<div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg">

// Elevated card with glow
<div className="bg-card border border-border rounded-lg shadow-glow">

// Strong glow effect
<div className="bg-card border border-primary/20 rounded-lg shadow-glow-strong">
```

## Animation Guidelines

### Framer Motion Variants

```typescript
// Fade in animation
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide up animation
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Scale animation
const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### Button Press Animation

```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  className="..."
>
  Click Me
</motion.button>
```

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Implement proper tab order
- Add visible focus indicators
- Support Enter and Space for activation

### ARIA Attributes
```typescript
// Button with loading state
<button
  aria-label="Submit form"
  aria-busy={loading}
  disabled={loading}
>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Modal Title</h2>
</div>

// Input with error
<input
  aria-label="Email address"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide descriptive labels
- Announce dynamic content changes
- Hide decorative elements with `aria-hidden="true"`

## Responsive Design

### Breakpoints
```typescript
// Mobile first approach
<div className="
  w-full          // Mobile
  md:w-1/2        // Tablet (768px+)
  lg:w-1/3        // Desktop (1024px+)
">
```

### Mobile Considerations
- Touch targets minimum 44x44px
- Adequate spacing between interactive elements
- Readable font sizes (minimum 16px for body text)
- Test on actual devices

## Component Testing

### Unit Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-card');
  });
});
```

## Performance Optimization

### Memoization
```typescript
import { memo } from 'react';

// Memoize expensive components
export const ExpensiveCard = memo(function ExpensiveCard({ data }: Props) {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});

// Custom comparison function
export const SmartCard = memo(
  function SmartCard({ id, data }: Props) {
    return <div>{/* ... */}</div>;
  },
  (prevProps, nextProps) => {
    // Only re-render if id changes
    return prevProps.id === nextProps.id;
  }
);
```

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const HeavyModal = lazy(() => import('./HeavyModal'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyModal />
    </Suspense>
  );
}
```

## Common Pitfalls to Avoid

### ❌ Don't
```typescript
// Inline object creation (causes re-renders)
<Component style={{ color: 'red' }} />

// Anonymous functions in render
<button onClick={() => handleClick(id)}>Click</button>

// Spreading all props blindly
<div {...props} className="my-class" /> // className might be overridden
```

### ✅ Do
```typescript
// Define objects outside render
const style = { color: 'red' };
<Component style={style} />

// Use useCallback for handlers
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Spread props first, then override
<div {...props} className={cn(props.className, 'my-class')} />
```

## Utility Functions

### Class Name Utility (cn)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:
```typescript
<div className={cn(
  'base-class',
  condition && 'conditional-class',
  className // Allow override
)} />
```

---

**Remember**: Build components that are reusable, accessible, and performant. Always consider the user experience and developer experience when creating UI components.
