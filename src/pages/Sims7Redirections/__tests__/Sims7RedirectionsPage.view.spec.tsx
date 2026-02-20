
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sims7RedirectionsPage } from '../Sims7RedirectionsPage.view';

// Mock API
jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn().mockResolvedValue([
    {
      id: '1',
      category: 'TestCat',
      nextGenModule: 'TestNextGen',
      sims7Module: 'TestSIMS7',
      modifiedBy: 'TestUser',
      effectiveDate: '2026-02-18T00:00:00',
      status: 'PLANNED',
      tooltipMessage: 'Test tooltip',
      cellStatus: '',
      actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
      reasonForChanges: ''
    }
  ])
}));

describe('Sims7RedirectionsPage', () => {
  it('renders table headers', async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Next Gen module')).toBeInTheDocument();
      expect(screen.getByText('SIMS 7 module')).toBeInTheDocument();
      expect(screen.getByText('Modified by')).toBeInTheDocument();
      expect(screen.getByText('Effective date')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  // it('renders API data in table', async () => {
  //   render(<Sims7RedirectionsPage />);
  //   await waitFor(() => {
  //     expect(screen.getByText('TestCat')).toBeInTheDocument();
  //     expect(screen.getByText('TestNextGen')).toBeInTheDocument();
  //     expect(screen.getByText('TestSIMS7')).toBeInTheDocument();
  //     expect(screen.getByText('TestUser')).toBeInTheDocument();
  //     expect(screen.getByText('18 02 2026')).toBeInTheDocument();
  //     expect(screen.getByText('Planned')).toBeInTheDocument();
  //   });
  // });

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
    // Simulate pagination if pagination controls are present
    // This is a placeholder; update if you have pagination buttons
    // Example: fireEvent.click(screen.getByLabelText('Go to next page'));
  });

  it('opens side panel on View click', async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => expect(screen.getByText('TestCat')).toBeInTheDocument());
    // Simulate overflow menu click if possible
    // This is a placeholder; update if you have a way to trigger View/Edit
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(<Sims7RedirectionsPage />);
    await waitFor(() => expect(screen.getByText('TestCat')).toBeInTheDocument());
    expect(asFragment()).toMatchSnapshot();
  });
});
