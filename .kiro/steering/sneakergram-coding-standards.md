---
inclusion: always
---

# SneakerGram Coding Standards

This document defines the coding standards and best practices for the SneakerGram project.

## TypeScript Standards

### Type Safety
- Always use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` or proper types instead
- Use strict TypeScript configuration
- Leverage type inference where appropriate

### Naming Conventions
- **Components**: PascalCase (e.g., `Button`, `PostCard`, `SneakerOfDay`)
- **Functions**: camelCase (e.g., `getUserById`, `getKaggleImages`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `KAGGLE_SNEAKER_CLASSES`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `Sneaker`, `Post`)
- **Enums**: PascalCase with UPPER_CASE values (e.g., `PostType.COLLECTION`)

### File Organization
```
components/
├── ui/           # Reusable UI components
├── feed/         # Feed-specific components
├── marketplace/  # Marketplace components
└── shared/       # Shared components

lib/
├── api/          # API adapters
├── utils/        # Utility functions
└── *.ts          # Core libraries

types/
└── index.ts      # All type definitions

stores/
└── *.ts          # Zustand stores
```

## React/Next.js Standards

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);
  
  // 5. Event handlers
  const handleClick = () => {
    setState(true);
    onAction?.();
  };
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

### Component Best Practices
- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components small and focused (< 200 lines)
- Use composition over prop drilling
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback` when passing to children

### Next.js App Router
- Use Server Components by default
- Add `'use client'` only when needed (hooks, events, browser APIs)
- Leverage file-based routing
- Use loading.tsx and error.tsx for better UX
- Implement proper metadata for SEO

## Styling Standards

### Tailwind CSS
- Use Tailwind utility classes for styling
- Follow mobile-first approach
- Use custom theme colors from tailwind.config.ts
- Group related utilities together
- Use `@apply` sparingly (only for repeated patterns)

### Class Organization
```typescript
// Good: Organized by category
<div className="
  flex items-center justify-between
  w-full max-w-md
  px-4 py-2
  bg-card border border-border
  rounded-lg shadow-glow
">
```

### Dark Theme
- All components must support dark theme
- Use theme colors: `bg-background`, `text-foreground`, `bg-card`
- Test components in dark mode
- Use `text-gray-400` for muted text, not `text-gray-600`

## State Management

### Zustand Stores
```typescript
import { create } from 'zustand';

interface MyStore {
  // State
  data: Data[];
  loading: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  updateData: (id: string, updates: Partial<Data>) => void;
}

export const useMyStore = create<MyStore>((set, get) => ({
  data: [],
  loading: false,
  
  loadData: async () => {
    set({ loading: true });
    const data = await fetchData();
    set({ data, loading: false });
  },
  
  updateData: (id, updates) => {
    set(state => ({
      data: state.data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },
}));
```

### State Best Practices
- Keep stores focused and single-purpose
- Use selectors to prevent unnecessary re-renders
- Avoid storing derived state
- Use local state for UI-only state
- Use Zustand for global application state

## Error Handling

### Try-Catch Blocks
```typescript
async function fetchData() {
  try {
    const response = await api.getData();
    return response;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Show user-friendly error
    toast.error('Failed to load data. Please try again.');
    return null;
  }
}
```

### Error Boundaries
- Wrap major sections in error boundaries
- Provide fallback UI for errors
- Log errors for debugging
- Show user-friendly error messages

## Testing Standards

### Unit Tests
- Test component rendering
- Test user interactions
- Test edge cases
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Property-Based Tests
- Use fast-check for property tests
- Run minimum 100 iterations
- Tag tests with property numbers
- Test universal properties, not specific examples

### Test Organization
```typescript
describe('ComponentName', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      // test
    });
  });
  
  describe('interactions', () => {
    it('should handle click events', () => {
      // test
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty data', () => {
      // test
    });
  });
});
```

## Performance Standards

### Optimization Techniques
- Use `React.memo` for expensive components
- Implement virtual scrolling for long lists
- Lazy load images with Next.js Image component
- Code split heavy components
- Debounce search and scroll handlers

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={sneaker.images[0]}
  alt={sneaker.model}
  width={400}
  height={400}
  className="rounded-lg"
  loading="lazy"
/>
```

## Accessibility Standards

### ARIA Labels
- Add aria-labels to interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals
- Return focus after modal closes

## Git Commit Standards

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(ui): add Button component with variants

- Implemented primary, secondary, and ghost variants
- Added loading state
- Included accessibility attributes

Closes #123
```

## Code Review Checklist

- [ ] Code follows TypeScript standards
- [ ] Components are properly typed
- [ ] Tests are included and passing
- [ ] Accessibility requirements met
- [ ] Performance considerations addressed
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] Dark theme supported
- [ ] Mobile responsive

## Documentation Standards

### Component Documentation
```typescript
/**
 * Button component with multiple variants and states
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // implementation
}
```

### Function Documentation
```typescript
/**
 * Get images for a sneaker by brand and model
 * 
 * @param brand - Sneaker brand (e.g., "Nike", "Adidas")
 * @param model - Sneaker model (e.g., "Air Jordan 1")
 * @param variant - Optional variant (e.g., "High", "Low")
 * @param count - Number of images to return
 * @returns Array of image paths
 */
export function getImagesByBrandModel(
  brand: string,
  model: string,
  variant?: string,
  count?: number
): string[] {
  // implementation
}
```

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize data before display
- Use parameterized queries (when backend is added)
- Implement rate limiting for API calls

### Authentication
- Store tokens securely
- Implement proper session management
- Use HTTPS in production
- Implement CSRF protection

## Dependencies

### Adding New Dependencies
- Evaluate necessity
- Check bundle size impact
- Verify maintenance status
- Review security vulnerabilities
- Document why it's needed

### Preferred Libraries
- **UI**: Tailwind CSS, Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form (when needed)
- **Testing**: Vitest, React Testing Library, fast-check
- **3D**: Three.js, React Three Fiber

---

**Remember**: Write code that is readable, maintainable, and testable. When in doubt, favor simplicity over cleverness.
