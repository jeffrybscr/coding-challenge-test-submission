import { render, screen } from '@testing-library/react';
import Button from '@/components/Button/Button';

describe('Button component', () => {
  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should have primary variant class by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('should have secondary variant class when variant is secondary', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
  });
});
