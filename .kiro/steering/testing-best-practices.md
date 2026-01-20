---
inclusion: fileMatch
fileMatchPattern: '__tests__/**/*.{ts,tsx}'
---

# Testing Best Practices for SneakerGram

This steering file provides guidelines for writing effective tests in the SneakerGram application.

## Testing Philosophy

We use a dual testing approach:
1. **Unit Tests**: Verify specific examples, edge cases, and component behavior
2. **Property-Based Tests**: Verify universal properties across all inputs

Both are essential for comprehensive coverage.

## Test Structure

### Organize Tests by Feature

```typescript
describe('ComponentName', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      // test
    });
    
    it('should render with custom props', () => {
      // test
    });
  });
  
  describe('interactions', () => {
    it('should handle click events', () => {
      // test
    });
    
    it('should handle keyboard events', () => {
      // test
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty data', () => {
      // test
    });
    
    it('should handle error states', () => {
      // test
    });
  });
});
```

## Unit Testing Guidelines

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('should update count when button is clicked', () => {
  // Arrange
  const handleClick = vi.fn();
  render(<Counter onClick={handleClick} />);
  
  // Act
  fireEvent.click(screen.getByRole('button'));
  
  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Test User Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
it('should set state to true', () => {
  const { result } = renderHook(() => useState(false));
  act(() => result.current[1](true));
  expect(result.current[0]).toBe(true);
});

// ✅ Good: Testing user-visible behavior
it('should show success message after form submission', async () => {
  render(<Form />);
  fireEvent.change(screen.getByLabelText('Email'), { 
    target: { value: 'test@example.com' } 
  });
  fireEvent.click(screen.getByText('Submit'));
  expect(await screen.findByText('Success!')).toBeInTheDocument();
});
```

### Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { /* ... */ });
it('test 1', () => { /* ... */ });

// ✅ Good
it('should display error message when email is invalid', () => { /* ... */ });
it('should disable submit button while loading', () => { /* ... */ });
```

### Test Accessibility

```typescript
it('should have proper accessibility attributes', () => {
  render(<Button>Click Me</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveAccessibleName('Click Me');
});

it('should announce errors to screen readers', () => {
  render(<Input error="Invalid email" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
});
```

## Property-Based Testing Guidelines

### When to Use Property Tests

Use property-based tests for:
- Universal properties that should hold for all inputs
- Round-trip properties (serialize/deserialize, encode/decode)
- Invariants (properties that remain constant)
- Metamorphic properties (relationships between operations)

### Property Test Structure

```typescript
/**
 * Feature: sneakergram-app, Property X: Description
 * Validates: Requirements X.Y
 */
test('Property X: Description', () => {
  fc.assert(
    fc.property(
      // Generators
      fc.record({
        id: fc.string(),
        value: fc.integer()
      }),
      // Test function
      (data) => {
        const result = processData(data);
        expect(result).toSatisfyProperty();
      }
    ),
    { numRuns: 100 } // Always run at least 100 iterations
  );
});
```

### Property Test Examples

#### Round-Trip Property
```typescript
/**
 * Feature: sneakergram-app, Property 6: Like button toggles state
 * Validates: Requirements 3.4
 */
test('Property 6: Like button toggles state (round trip)', () => {
  fc.assert(
    fc.property(
      fc.record({
        id: fc.string(),
        likes: fc.nat(),
        isLiked: fc.boolean()
      }),
      (post) => {
        // Like then unlike should return to original state
        const liked = toggleLike(post);
        const unliked = toggleLike(liked);
        expect(unliked.isLiked).toBe(post.isLiked);
        expect(unliked.likes).toBe(post.likes);
      }
    ),
    { numRuns: 100 }
  );
});
```

#### Invariant Property
```typescript
/**
 * Feature: sneakergram-app, Property 4: Posts contain all required fields
 * Validates: Requirements 3.2
 */
test('Property 4: Posts contain all required fields', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...mockPosts),
      (post) => {
        // Invariant: All posts must have required fields
        expect(post.id).toBeDefined();
        expect(post.userId).toBeDefined();
        expect(post.images).toBeDefined();
        expect(Array.isArray(post.images)).toBe(true);
        expect(post.images.length).toBeGreaterThan(0);
      }
    ),
    { numRuns: 100 }
  );
});
```

## Testing React Components

### Rendering Tests

```typescript
import { render, screen } from '@testing-library/react';

it('should render component with props', () => {
  render(<Button variant="primary">Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveClass('bg-primary');
});
```

### Interaction Tests

```typescript
import { fireEvent } from '@testing-library/react';

it('should handle user interactions', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Async Tests

```typescript
import { waitFor } from '@testing-library/react';

it('should load data asynchronously', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('should update state in custom hook', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Mocking

### Mock Functions

```typescript
import { vi } from 'vitest';

it('should call callback with correct arguments', () => {
  const callback = vi.fn();
  const component = render(<Component onAction={callback} />);
  
  fireEvent.click(screen.getByText('Action'));
  
  expect(callback).toHaveBeenCalledWith({ id: 1, type: 'action' });
});
```

### Mock Modules

```typescript
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}));

it('should use mocked API', async () => {
  const { fetchData } = await import('@/lib/api');
  const result = await fetchData();
  expect(result.data).toBe('mocked');
});
```

### Mock Timers

```typescript
it('should debounce function calls', () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const debounced = debounce(callback, 1000);
  
  debounced();
  debounced();
  debounced();
  
  expect(callback).not.toHaveBeenCalled();
  
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalledTimes(1);
  
  vi.useRealTimers();
});
```

## Testing Best Practices

### Do's ✅

1. **Test user-visible behavior**, not implementation details
2. **Use semantic queries** (getByRole, getByLabelText) over test IDs
3. **Test accessibility** (ARIA attributes, keyboard navigation)
4. **Keep tests simple** and focused on one thing
5. **Use descriptive test names** that explain what is being tested
6. **Clean up after tests** (unmount components, clear mocks)
7. **Test edge cases** (empty data, errors, loading states)
8. **Use property tests** for universal properties
9. **Run tests frequently** during development
10. **Maintain high test coverage** (aim for 80%+)

### Don'ts ❌

1. **Don't test implementation details** (internal state, private methods)
2. **Don't use test IDs** unless absolutely necessary
3. **Don't write brittle tests** that break with minor changes
4. **Don't mock everything** - test real behavior when possible
5. **Don't skip accessibility tests**
6. **Don't write tests that depend on each other**
7. **Don't test third-party libraries** (trust they work)
8. **Don't ignore failing tests** - fix them immediately
9. **Don't write tests just for coverage** - write meaningful tests
10. **Don't forget to test error states**

## Common Testing Patterns

### Testing Forms

```typescript
it('should validate and submit form', async () => {
  const handleSubmit = vi.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  
  // Submit
  fireEvent.click(screen.getByText('Submit'));
  
  // Verify
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### Testing Conditional Rendering

```typescript
it('should show error message when error occurs', () => {
  const { rerender } = render(<Component error={null} />);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  
  rerender(<Component error="Something went wrong" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
});
```

### Testing Lists

```typescript
it('should render list of items', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  
  render(<List items={items} />);
  
  items.forEach(item => {
    expect(screen.getByText(item.name)).toBeInTheDocument();
  });
});
```

### Testing Modals

```typescript
it('should open and close modal', () => {
  render(<ModalComponent />);
  
  // Modal should be closed initially
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  
  // Open modal
  fireEvent.click(screen.getByText('Open Modal'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  // Close modal
  fireEvent.click(screen.getByLabelText('Close modal'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

## Test Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Focus on meaningful coverage, not just hitting numbers.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.ts

# Run tests with coverage
npm test -- --coverage

# Run tests matching pattern
npm test -- --grep "Button"
```

## Debugging Tests

### Use screen.debug()

```typescript
it('should render component', () => {
  render(<Component />);
  screen.debug(); // Prints DOM to console
});
```

### Use screen.logTestingPlaygroundURL()

```typescript
it('should find element', () => {
  render(<Component />);
  screen.logTestingPlaygroundURL(); // Opens testing playground
});
```

### Use --ui flag

```bash
npm test -- --ui
```

Opens Vitest UI for interactive debugging.

---

**Remember**: Good tests give you confidence to refactor and add features. Write tests that document behavior and catch real bugs.
