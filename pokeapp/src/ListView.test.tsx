import { render, screen } from '@testing-library/react';
import ListView from './ListView';

describe('Challenge', () => {
  it('should have component that reads "Assignment"', () => {
    render(<ListView />);
    const assignment = screen.getByText('All');

    expect(assignment).toBeInTheDocument();
  });
});
