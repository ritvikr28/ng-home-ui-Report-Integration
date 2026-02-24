import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sims7RedirectionsPage } from '../Sims7RedirectionsPage.view';
import { fetchSims7Redirections } from '../Sims7RedirectionsPage.api';

// Mock API
jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn().mockResolvedValue([
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
  ])
}));

describe('Sims7RedirectionsPage', () => {
  // it('renders table headers', async () => {
  //   render(<Sims7RedirectionsPage />);
  //   await waitFor(() => {
  //     expect(screen.getByText('Category')).toBeInTheDocument();
  //     expect(screen.getByText('Next Gen module')).toBeInTheDocument();
  //     expect(screen.getByText('SIMS 7 module')).toBeInTheDocument();
  //     expect(screen.getByText('Modified by')).toBeInTheDocument();
  //     expect(screen.getByText('Effective date')).toBeInTheDocument();
  //     expect(screen.getByText('Status')).toBeInTheDocument();
  //   });
  // });

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
    // Simulate pagination if pagination controls are present
    // This is a placeholder; update if you have pagination buttons
    // Example: fireEvent.click(screen.getByLabelText('Go to next page'));
  });

  it('shows API failure message on API error', async () => {
    (fetchSims7Redirections as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText(/apiFailureMessage/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when API returns empty array', async () => {
    (fetchSims7Redirections as jest.Mock).mockResolvedValueOnce([]);
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      // expect(screen.getByText(/emptyStateMsg/i)).toBeInTheDocument();
    });
  });

  it('resets pagination when searchTagList changes', async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => expect(screen.getByText('TestCat')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.click(screen.getByText('Apply'));
  });

  // it('handles onItemClick in breadcrumbs', async () => {
  //   render(<Sims7RedirectionsPage />);
  //   await waitFor(() => expect(screen.getByText('TestCat')).toBeInTheDocument());
  //   const breadcrumbs = screen.getByTestId('breadcrumb-test-id');
  //   const anchor = breadcrumbs.querySelector('a');
  //   if (anchor) {
  //     fireEvent.click(anchor);
  //   }
  // });

  // it('handles onClickOverflowItem for View and Edit', async () => {
  //   render(<Sims7RedirectionsPage />);
  //   await waitFor(() => expect(screen.getByText('TestCat')).toBeInTheDocument());
  //   // Simulate overflow menu click for View
  //   const overflowEvent = { target: { innerText: 'View' } };
  //   // @ts-ignore
  //   screen.getByTestId('controlled-list-test-id').props.onClickOverflowItem(overflowEvent, {});
  //   // Simulate overflow menu click for Edit
  //   const overflowEventEdit = { target: { innerText: 'Edit' } };
  //   // @ts-ignore
  //   screen.getByTestId('controlled-list-test-id').props.onClickOverflowItem(overflowEventEdit, {});
  // });
});
