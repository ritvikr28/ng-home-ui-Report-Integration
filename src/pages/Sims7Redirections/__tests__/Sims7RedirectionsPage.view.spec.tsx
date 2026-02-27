import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sims7RedirectionsPage } from '../Sims7RedirectionsPage.view';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn().mockResolvedValue({
    items: [
      {
        moduleId: 1,
        ngComponent: 'TestCat',
        ngModule: 'TestNextGen',
        sims7Module: 'TestSIMS7',
        updatedBy: 'TestUser',
        effectiveDate: '2026-02-18T00:00:00',
        redirectStatus: 'PLANNED',
        tooltipMessage: 'Test tooltip',
        cellStatus: '',
        actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
        reasonForChanges: ''
      }
    ],
    totalItems: 1
  })
}));

// Move require() mocks to top-level
const api = require('../Sims7RedirectionsPage.api');

describe('Sims7RedirectionsPage', () => {

  it('renders API data in table', async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText('TestCat')).toBeInTheDocument();
      expect(screen.getByText('TestNextGen')).toBeInTheDocument();
      expect(screen.getByText('TestSIMS7')).toBeInTheDocument();
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('18 Feb 2026')).toBeInTheDocument();
      expect(screen.getByText('Planned')).toBeInTheDocument();
    });
  });

  it('opens and closes filter dialog', async () => {
    render(<Sims7RedirectionsPage />);
    const filterBtn = await screen.findByText('Filter');
    fireEvent.click(filterBtn);
    expect(screen.getByText('Filter by')).toBeInTheDocument();
    const closeBtn = screen.getByText('Clear all');
    fireEvent.click(closeBtn);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    render(<Sims7RedirectionsPage />);
  });

  it('shows API failure message on API error', async () => {
    api.fetchSims7Redirections.mockRejectedValueOnce(new Error('API failed'));
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText(/apiFailureMessage/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when API returns empty array', async () => {
    api.fetchSims7Redirections.mockResolvedValueOnce([]);
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
    });
  });
});
