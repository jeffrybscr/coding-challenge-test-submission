import { render, screen } from '@testing-library/react';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

describe('ErrorMessage component', () => {
  it('should render error message when message is provided', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should not render when message is empty string', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should have error class for styling', () => {
    render(<ErrorMessage message="Error occurred" />);
    const errorMessage = screen.getByText('Error occurred');
    expect(errorMessage).toHaveClass('error');
  });

});
