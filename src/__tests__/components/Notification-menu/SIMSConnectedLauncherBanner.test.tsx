import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslation } from '@essnextgen/ui-intl-kit';
import { SIMSConnectedLauncher } from '../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner';
import { getUserOrganisation } from '../../../shared/utils';

jest.mock('@essnextgen/ui-kit', () => ({
  Notification: ({ id, className, dataTestId, title, message, onClickClose }: any) => (
    <div
      id={id}
      className={className}
      data-testid={dataTestId}
      role="alert"
    >
      <h3>{title}</h3>
      <div>{message}</div>
      <button type="button" onClick={onClickClose}>Close</button>
    </div>
  ),
  NotificationStatus: {
    HIGHLIGHT: 'HIGHLIGHT'
  }
}));

jest.mock('@essnextgen/ui-intl-kit', () => ({
  useTranslation: jest.fn()
}));

jest.mock('../../../shared/utils', () => ({
  getUserOrganisation: jest.fn()
}));

describe('SIMSConnectedLauncher', () => {
  type TranslationKeys = 'simsNextGenLinksBanner.heading' | 'simsNextGenLinksBanner.subHeading';

  const translations: Record<TranslationKeys, string> = {
    'simsNextGenLinksBanner.heading': 'Mock Heading',
    'simsNextGenLinksBanner.subHeading': 'Mock Subheading'
  };

  const t = jest.fn((key: string) => translations[key as TranslationKeys] || key);

  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    jest.clearAllMocks();

    mockStorage = {};

    const localStorageMock = {
      getItem: jest.fn((key: string) => mockStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      clear: jest.fn(() => {
        mockStorage = {};
      })
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    (useTranslation as jest.Mock).mockReturnValue({ t });
    (getUserOrganisation as jest.Mock).mockReturnValue('test-org-id');
  });

  it('should render with correct props and translations', () => {
    render(<SIMSConnectedLauncher />);

    const banner = screen.getByTestId('connected-launcher-banner');
    expect(banner).toBeInTheDocument();

    expect(screen.getByText('Mock Heading')).toBeInTheDocument();
    expect(screen.getByText('Mock Subheading')).toBeInTheDocument();

    expect(t).toHaveBeenCalledWith('simsNextGenLinksBanner.heading');
    expect(t).toHaveBeenCalledWith('simsNextGenLinksBanner.subHeading');
  });

  it('should have correct notification status and classes', () => {
    render(<SIMSConnectedLauncher />);

    const banner = screen.getByTestId('connected-launcher-banner');
    expect(banner).toHaveClass('notification-banner-class-view');

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('role', 'alert');
  });

  it('should update localStorage when banner is closed', () => {
    const mockOrgId = 'test-org-id';
    (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);

    render(<SIMSConnectedLauncher />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    const storedData = JSON.parse(mockStorage.classViewBannerClosed || '[]');
    expect(storedData).toHaveLength(1);
    expect(storedData[0]).toEqual({
      orgId: mockOrgId,
      isClosed: true
    });
  });

  it('should handle existing localStorage data when closing banner', () => {
    const mockOrgId = 'test-org-id';
    const existingData = [
      { orgId: 'existing-org', isClosed: true }
    ];
    mockStorage.classViewBannerClosed = JSON.stringify(existingData);
    (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);

    render(<SIMSConnectedLauncher />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    const storedData = JSON.parse(mockStorage.classViewBannerClosed || '[]');
    expect(storedData).toHaveLength(2);
    expect(storedData).toContainEqual({ orgId: 'existing-org', isClosed: true });
    expect(storedData).toContainEqual({ orgId: mockOrgId, isClosed: true });
  });

  it('should handle undefined organisation ID', () => {
    (getUserOrganisation as jest.Mock).mockReturnValue(undefined);

    render(<SIMSConnectedLauncher />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    const storedData = JSON.parse(mockStorage.classViewBannerClosed || '[]');
    expect(storedData[0]).toEqual({
      orgId: '',
      isClosed: true
    });
  });
}); 