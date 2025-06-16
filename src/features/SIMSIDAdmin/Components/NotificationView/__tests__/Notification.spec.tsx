import { render, screen } from '@testing-library/react';
import NotificationView from '../Notification.view';
import { useSIMSNextGenLinks } from '../../../../../shared/hooks/useSIMSNextGenLinks';
import SIMSConnectedLauncher from '../../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner';

jest.mock('../../../../../shared/hooks/useSIMSNextGenLinks');
jest.mock('../../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner', () => 
  jest.fn(() => <div data-testid="mock-launcher">Mock Launcher</div>)
);

describe('NotificationView', () => {
  const mockSetDisableNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render SIMSConnectedLauncher when hasConnectedLauncher is true', () => {
    (useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: true,
      isLoading: false,
      error: false
    });

    render(<NotificationView setDisableNotification={mockSetDisableNotification} />);

    expect(screen.getByTestId('notification-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('mock-launcher')).toBeInTheDocument();
    expect(SIMSConnectedLauncher).toHaveBeenCalled();
  });

  it('should not render anything when hasConnectedLauncher is false', () => {
    (useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: false,
      isLoading: false,
      error: false
    });

    render(<NotificationView setDisableNotification={mockSetDisableNotification} />);

    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-launcher')).not.toBeInTheDocument();
    expect(SIMSConnectedLauncher).not.toHaveBeenCalled();
  });

  it('should not render anything when hook is loading', () => {
    (useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: false,
      isLoading: true,
      error: false
    });

    render(<NotificationView setDisableNotification={mockSetDisableNotification} />);

    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-launcher')).not.toBeInTheDocument();
    expect(SIMSConnectedLauncher).not.toHaveBeenCalled();
  });

  it('should not render anything when hook has error', () => {
    (useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: false,
      isLoading: false,
      error: true
    });

    render(<NotificationView setDisableNotification={mockSetDisableNotification} />);

    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-launcher')).not.toBeInTheDocument();
    expect(SIMSConnectedLauncher).not.toHaveBeenCalled();
  });
}); 