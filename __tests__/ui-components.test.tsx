/**
 * Unit tests for Base UI Components
 * Tests rendering, interactions, and accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VerificationLevel } from '@/types';

describe('Button Component', () => {
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
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-card');
  });

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-card/50');
  });

  it('applies size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3');
    
    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<Button>Accessible</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('handles user input', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input.value).toBe('test value');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Input label="Password" helperText="Must be 8+ characters" />);
    expect(screen.getByText('Must be 8+ characters')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<Input label="Username" error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-card');
  });

  it('applies glass variant styles', () => {
    const { container } = render(<Card variant="glass">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('backdrop-blur-md');
  });

  it('applies elevated variant styles', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-glow');
  });

  it('renders with sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('Avatar Component', () => {
  it('renders with image src', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
    const img = screen.getByAltText('User Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders fallback when no src provided', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders custom fallback', () => {
    render(<Avatar fallback="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('displays verification badge when verified', () => {
    const { container } = render(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        verified 
        verificationLevel={VerificationLevel.GOLD}
      />
    );
    const badge = container.querySelector('svg');
    expect(badge).toBeInTheDocument();
  });

  it('applies correct verification badge color for email level', () => {
    const { container } = render(
      <Avatar verified verificationLevel={VerificationLevel.EMAIL} />
    );
    const badge = container.querySelector('.text-blue-500');
    expect(badge).toBeInTheDocument();
  });

  it('applies correct verification badge color for ID level', () => {
    const { container } = render(
      <Avatar verified verificationLevel={VerificationLevel.ID} />
    );
    const badge = container.querySelector('.text-green-500');
    expect(badge).toBeInTheDocument();
  });

  it('applies correct verification badge color for gold level', () => {
    const { container } = render(
      <Avatar verified verificationLevel={VerificationLevel.GOLD} />
    );
    const badge = container.querySelector('.text-yellow-500');
    expect(badge).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container, rerender } = render(<Avatar size="sm" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();
    
    rerender(<Avatar size="md" />);
    expect(container.querySelector('.w-10')).toBeInTheDocument();
    
    rerender(<Avatar size="lg" />);
    expect(container.querySelector('.w-12')).toBeInTheDocument();
    
    rerender(<Avatar size="xl" />);
    expect(container.querySelector('.w-16')).toBeInTheDocument();
  });
});

describe('Badge Component', () => {
  it('renders with children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container, rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary/10');
    
    rerender(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-green-500/10');
    
    rerender(<Badge variant="warning">Warning</Badge>);
    expect(container.firstChild).toHaveClass('bg-yellow-500/10');
    
    rerender(<Badge variant="error">Error</Badge>);
    expect(container.firstChild).toHaveClass('bg-red-500/10');
  });

  it('applies size variants', () => {
    const { container, rerender } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstChild).toHaveClass('text-xs');
    
    rerender(<Badge size="md">Medium</Badge>);
    expect(container.firstChild).toHaveClass('text-sm');
    
    rerender(<Badge size="lg">Large</Badge>);
    expect(container.firstChild).toHaveClass('text-base');
  });
});

describe('Modal Component', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        Content
      </Modal>
    );
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        Content
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('applies size variants', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    expect(container.querySelector('.max-w-sm')).toBeInTheDocument();
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} size="md">
        Content
      </Modal>
    );
    expect(container.querySelector('.max-w-md')).toBeInTheDocument();
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
  });
});

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector('.w-4')).toBeInTheDocument();
    
    rerender(<LoadingSpinner size="md" />);
    expect(container.querySelector('.w-6')).toBeInTheDocument();
    
    rerender(<LoadingSpinner size="lg" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();
    
    rerender(<LoadingSpinner size="xl" />);
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });

  it('applies color variants', () => {
    const { container, rerender } = render(<LoadingSpinner variant="primary" />);
    expect(container.querySelector('.text-primary')).toBeInTheDocument();
    
    rerender(<LoadingSpinner variant="white" />);
    expect(container.querySelector('.text-white')).toBeInTheDocument();
    
    rerender(<LoadingSpinner variant="muted" />);
    expect(container.querySelector('.text-muted')).toBeInTheDocument();
  });
});
