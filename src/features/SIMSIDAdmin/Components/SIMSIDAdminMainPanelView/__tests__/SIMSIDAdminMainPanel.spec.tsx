import { render, screen } from "@testing-library/react";
import SIMSIDAdminMainPanelView from "../SIMSIDAdminMainPanel.view";
import SIMSIDAdminMainPanel from "../SIMSIDAdminMainPanel.logic";
import * as stateHelper from "../../../../../shared/utils/state-helper";
import * as hooks from "../../../../../shared/hooks/useSIMSNextGenLinks";

jest.mock("../../../../../shared/hooks/useSIMSNextGenLinks", () => ({
  useSIMSNextGenLinks: jest.fn()
}));

describe("SIMSIDAdminMainPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();    
    (hooks.useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: true
    });
  });

  const setIsOpen = jest.fn();

  const setNotificationDisable = jest.fn();

  test("renders SIMSIDAdminMainPanel with isOpen true and Notification enabled", async () => {
    const usePersistantState = jest.spyOn(stateHelper, 'usePersistantState');
    usePersistantState.mockReturnValue([true, setNotificationDisable]);
    render(
      <SIMSIDAdminMainPanel
        isOpen
        setIsOpen={setIsOpen}
      />
    );
    
    expect(screen.queryByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(screen.queryByTestId("notification-test-id")).toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanel with isOpen true and Notification disabled", async () => {
    const usePersistantState = jest.spyOn(stateHelper, 'usePersistantState');
    usePersistantState.mockReturnValue([false, setNotificationDisable]);
    render(
      <SIMSIDAdminMainPanel
        isOpen
        setIsOpen={setIsOpen}
      />
    );
    expect(screen.queryByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanelView with Notification enabled with isOpen false", async () => {
    const { getByTestId, container } = render(
      <SIMSIDAdminMainPanelView
        isOpen={false}
        setIsOpen={setIsOpen}
        enableNotification
        setDisableNotification={() => { }}
      />
    );
    const NotificationTestId = getByTestId('notification-test-id');
    const NotificationClass = container.querySelector('.notification-simsid');
    const SidePanelOpenAppendedClass = container.querySelector('.welcome-user-simsid-fixed');
    expect(getByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(SidePanelOpenAppendedClass).toBeInTheDocument();
    expect(NotificationTestId).toBeInTheDocument();
    expect(NotificationClass).toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanelView with Notification disabled with isOpen false", async () => {
    (hooks.useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: false
    });

    const { getByTestId } = render(
      <SIMSIDAdminMainPanelView
        isOpen={false}
        setIsOpen={setIsOpen}
        enableNotification={false}
        setDisableNotification={() => { }}
      />
    );

    const NotificationTestId = screen.queryByTestId('notification-test-id');
    expect(getByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(NotificationTestId).not.toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanelView with Notification enabled with isOpen true", async () => {
    const { getByTestId, container } = render(
      <SIMSIDAdminMainPanelView
        isOpen
        setIsOpen={setIsOpen}
        enableNotification
        setDisableNotification={() => { }}
      />
    );
    const SidePanelOpenAppendedClass = container.querySelector('.welcome-user-simsid-fixed');
    const NotificationTestId = getByTestId('notification-test-id');
    const NotificationClass = container.querySelector('.notification-open-panel');
    expect(getByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(SidePanelOpenAppendedClass).not.toBeInTheDocument();
    expect(NotificationTestId).toBeInTheDocument();
    expect(NotificationClass).toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanelView with Notification disabled with isOpen true", async () => {
    (hooks.useSIMSNextGenLinks as jest.Mock).mockReturnValue({
      hasConnectedLauncher: false
    });

    const { getByTestId } = render(
      <SIMSIDAdminMainPanelView
        isOpen
        setIsOpen={setIsOpen}
        enableNotification={false}
        setDisableNotification={() => { }}
      />
    );

    const NotificationTestId = screen.queryByTestId('notification-test-id');
    expect(getByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(NotificationTestId).not.toBeInTheDocument();
  });
});
