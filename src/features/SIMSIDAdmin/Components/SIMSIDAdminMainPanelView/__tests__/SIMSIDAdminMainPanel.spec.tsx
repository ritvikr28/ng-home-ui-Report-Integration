import { render, screen, fireEvent } from '@testing-library/react';
import * as stateHelper from '../../../../../shared/utils/state-helper';
import SIMSIDAdminMainPanelView from '../SIMSIDAdminMainPanel.view';
import SIMSIDAdminMainPanel from '../SIMSIDAdminMainPanel.logic';

// Mocks for child components and hooks
jest.mock('../../NotificationView/Notification.view', () => ({
  __esModule: true,
  default: ({ setDisableNotification }: any) => (
    <div data-testid="notification-test-id" onClick={() => setDisableNotification(false)}>NotificationView</div>
  ),
}));

jest.mock('../../../../../shared/components/SIMSUpdates/SIMSupdates.view', () => ({
  __esModule: true,
  default: ({ isOpen }: any) => <div data-testid="simsupdates-view">SIMSupdatesView {String(isOpen)}</div>,
}));

jest.mock('../../../../MainPanel/WelcomeUser/WelcomeUser.logic', () => ({
  __esModule: true,
  default: ({ isOpen }: any) => <div data-testid="welcome-user">WelcomeUser {String(isOpen)}</div>,
}));

jest.mock('../../../../../shared/components/CommonElement/FilledButton', () => ({
  FilledLeftPanelIcon: () => <svg data-testid="filled-left-panel-icon" />,
}));

// --- SIMSIDAdminMainPanelView tests ---
describe('SIMSIDAdminMainPanelView', () => {
  const setIsOpen = jest.fn();
  const setDisableNotification = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with isOpen true and notification enabled', () => {
    render(
      <SIMSIDAdminMainPanelView
        isOpen
        enableNotification
        setDisableNotification={setDisableNotification}
        setIsOpen={setIsOpen}
      />
    );
    expect(screen.getByTestId('SIMSID-Admin-View')).toBeInTheDocument();
    expect(screen.getByTestId('notification-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('simsupdates-view')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-user')).toBeInTheDocument();
    // Should not render the sidepanel toggle button
    expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
  });

  it('renders with isOpen false and notification enabled', () => {
    render(
      <SIMSIDAdminMainPanelView
        isOpen={false}
        enableNotification
        setDisableNotification={setDisableNotification}
        setIsOpen={setIsOpen}
      />
    );
    expect(screen.getByTestId('SIMSID-Admin-View')).toBeInTheDocument();
    expect(screen.getByTestId('notification-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('simsupdates-view')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-user')).toBeInTheDocument();
    // Should render the sidepanel toggle button
    expect(screen.getByTestId('filled-left-panel-icon')).toBeInTheDocument();
  });

  it('renders with notification disabled', () => {
    render(
      <SIMSIDAdminMainPanelView
        isOpen
        enableNotification={false}
        setDisableNotification={setDisableNotification}
        setIsOpen={setIsOpen}
      />
    );
    expect(screen.getByTestId('SIMSID-Admin-View')).toBeInTheDocument();
    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('simsupdates-view')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-user')).toBeInTheDocument();
  });

  it('calls setIsOpen when sidepanel toggle button is clicked', () => {
    render(
      <SIMSIDAdminMainPanelView
        isOpen={false}
        enableNotification
        setDisableNotification={setDisableNotification}
        setIsOpen={setIsOpen}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it('calls setDisableNotification when notification is clicked', () => {
    render(
      <SIMSIDAdminMainPanelView
        isOpen
        enableNotification
        setDisableNotification={setDisableNotification}
        setIsOpen={setIsOpen}
      />
    );
    fireEvent.click(screen.getByTestId('notification-test-id'));
    expect(setDisableNotification).toHaveBeenCalledWith(false);
  });
});

// --- SIMSIDAdminMainPanel (logic) tests ---
describe('SIMSIDAdminMainPanel', () => {
  const setIsOpen = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SIMSIDAdminMainPanelView with notification enabled', () => {
    jest.spyOn(stateHelper, 'usePersistantState').mockReturnValue([true, jest.fn()]);
    render(<SIMSIDAdminMainPanel isOpen setIsOpen={setIsOpen} />);
    expect(screen.getByTestId('SIMSID-Admin-View')).toBeInTheDocument();
    expect(screen.getByTestId('notification-test-id')).toBeInTheDocument();
  });

  it('renders SIMSIDAdminMainPanelView with notification disabled', () => {
    jest.spyOn(stateHelper, 'usePersistantState').mockReturnValue([false, jest.fn()]);
    render(<SIMSIDAdminMainPanel isOpen={false} setIsOpen={setIsOpen} />);
    expect(screen.getByTestId('SIMSID-Admin-View')).toBeInTheDocument();
    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
  });
});
