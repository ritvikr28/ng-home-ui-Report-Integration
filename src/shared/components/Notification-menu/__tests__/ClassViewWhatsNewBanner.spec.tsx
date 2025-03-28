import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { WhatsNewBanner } from '../ClassViewWhatsNewBanner';
import { getUserOrganisation } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getUserOrganisation: jest.fn(),
}));

describe('WhatsNewBanner Component', () => {
  const mockOrgId = 'org_123';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);
  });

  it('should render the banner when isBannerVisible is true', () => {
    render(<WhatsNewBanner />);
    expect(screen.getByTestId('whatsnew-banner')).toBeInTheDocument();
  });

  it('should hide the banner when the close button is clicked and update localStorage', () => {
    render(<WhatsNewBanner />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    // Check if localStorage was updated correctly
    const storedBanners = JSON.parse(localStorage.getItem('classViewBannerClosed') || '[]');
    expect(storedBanners).toEqual([{ orgId: mockOrgId, isClosed: true }]);
    expect(screen.queryByTestId('whatsnew-banner')).not.toBeInTheDocument();
  });

  it('should not render the banner if localStorage contains a closed entry for the current orgId', () => {
    const closedBannerData = [{ orgId: mockOrgId, isClosed: true }];
    localStorage.setItem('classViewBannerClosed', JSON.stringify(closedBannerData));

    render(<WhatsNewBanner />);
    expect(screen.queryByTestId('whatsnew-banner')).not.toBeInTheDocument();
  });

  it('should render the banner for a different orgId even if another orgId is closed', () => {
    const closedBannerData = [{ orgId: 'org_999', isClosed: true }];
    localStorage.setItem('classViewBannerClosed', JSON.stringify(closedBannerData));

    render(<WhatsNewBanner />);
    expect(screen.getByTestId('whatsnew-banner')).toBeInTheDocument();
  });

  it('should show the banner if localStorage is empty', () => {
    render(<WhatsNewBanner />);
    expect(screen.getByTestId('whatsnew-banner')).toBeInTheDocument();
  });

  it('should log an error if updating localStorage fails', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
  
    render(<WhatsNewBanner />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
  
    expect(console.error).toHaveBeenCalledWith('Failed to update localStorage:', expect.any(Error));
  
    (console.error as jest.Mock).mockRestore();
    (Storage.prototype.setItem as jest.Mock).mockRestore();
  });

  it('should not remove other orgIds when updating localStorage', () => {
    const existingData = [
      { orgId: 'org_999', isClosed: true },
      { orgId: 'org_456', isClosed: false }
    ];
    localStorage.setItem('classViewBannerClosed', JSON.stringify(existingData));

    render(<WhatsNewBanner />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    const updatedBanners = JSON.parse(localStorage.getItem('classViewBannerClosed') || '[]');
    
    // Ensure the new entry for mockOrgId is added while keeping existing ones
    expect(updatedBanners).toContainEqual({ orgId: mockOrgId, isClosed: true });
    expect(updatedBanners).toContainEqual({ orgId: 'org_999', isClosed: true });
    expect(updatedBanners).toContainEqual({ orgId: 'org_456', isClosed: false });
  });
});