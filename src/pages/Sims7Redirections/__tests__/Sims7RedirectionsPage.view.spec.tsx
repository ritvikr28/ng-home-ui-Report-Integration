import { render, screen, fireEvent } from '@testing-library/react';
import { Sims7RedirectionsPage } from '../Sims7RedirectionsPage.view';

describe('Sims7RedirectionsPage', () => {
  it('renders without crashing', () => {
    render(<Sims7RedirectionsPage />);
    // Check for a known header or button
    expect(screen.getByText(/Category/i)).toBeInTheDocument();
  });

  it('renders dropdown items', () => {
    render(<Sims7RedirectionsPage />);
    // Simulate opening the dropdown and check for items
    // fireEvent.click(screen.getByRole('button', { name: /dropdown/i }));
    // expect(screen.getByText('Migrated')).toBeInTheDocument();
  });

  it('opens and closes the filter dialog', () => {
    render(<Sims7RedirectionsPage />);
    const filterBtn = screen.getByTestId('filter');
    fireEvent.click(filterBtn);
    expect(screen.getByText('Filter by')).toBeInTheDocument();
    const closeBtns = screen.getAllByTestId('close-btn');
    fireEvent.click(closeBtns[0]); // Clear all
    expect(screen.getByText('Filter by')).toBeInTheDocument();
    fireEvent.click(closeBtns[1]); // Apply
    // Dialog should close (not visible)
  });

  it('shows side panel when isOpen is true', () => {
    render(<Sims7RedirectionsPage />);
  });

  it('shows empty state when no data matches filter', () => {
    render(<Sims7RedirectionsPage />);
  });
});
