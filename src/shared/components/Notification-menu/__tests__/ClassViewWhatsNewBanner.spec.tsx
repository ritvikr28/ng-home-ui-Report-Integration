import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { WhatsNewBanner } from '../ClassViewWhatsNewBanner';
import { getUserOrganisation } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getUserOrganisation: jest.fn(),
}));

const mockOrgId = 'org_123';

describe('WhatsNewBanner Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);
  });

  it('shows both banners if nothing is in localStorage', () => {
    render(<WhatsNewBanner />);

    expect(screen.getByTestId('whatsnew-banner')).toBeInTheDocument();
    expect(screen.getByText('simsNextGenLinksBanner.heading')).toBeInTheDocument();
  });

  it('hides only classview banner when handleExit is called', () => {
    render(<WhatsNewBanner />);

    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);

    const stored = JSON.parse(localStorage.getItem('classViewBannerClosed') || '[]');
    expect(stored).toContainEqual({ orgId: mockOrgId, isClosed: true });

    expect(screen.queryByTestId('whatsnew-banner')).not.toBeInTheDocument();
  });

  it('hides next gen banner when close button is clicked', () => {
    render(<WhatsNewBanner />);

    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[1]);
    expect(screen.queryByText('simsNextGenLinksBanner.heading')).not.toBeInTheDocument();
  });

  it('adds new orgId while preserving others on close', () => {
    const existing = [
      { orgId: 'org_999', isClosed: true },
      { orgId: 'org_456', isClosed: false }
    ];
    localStorage.setItem('classViewBannerClosed', JSON.stringify(existing));

    render(<WhatsNewBanner />);
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);

    const updated = JSON.parse(localStorage.getItem('classViewBannerClosed') || '[]');
    expect(updated).toContainEqual({ orgId: 'org_999', isClosed: true });
    expect(updated).toContainEqual({ orgId: 'org_456', isClosed: false });
    expect(updated).toContainEqual({ orgId: mockOrgId, isClosed: true });
  });

  it('logs error to console if localStorage.setItem fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    render(<WhatsNewBanner />);
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to update localStorage:', expect.any(Error));

    consoleSpy.mockRestore();
    (Storage.prototype.setItem as jest.Mock).mockRestore();
  });

  it('handles undefined orgId gracefully and still stores a blank string as orgId', () => {
    (getUserOrganisation as jest.Mock).mockReturnValue(undefined);

    render(<WhatsNewBanner />);
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);

    const stored = JSON.parse(localStorage.getItem('classViewBannerClosed') || '[]');
    expect(stored).toContainEqual({ orgId: '', isClosed: true });
  });
});