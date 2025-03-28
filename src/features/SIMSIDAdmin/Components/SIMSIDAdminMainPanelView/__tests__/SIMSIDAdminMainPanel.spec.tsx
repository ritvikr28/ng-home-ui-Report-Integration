import { render, screen } from "@testing-library/react";
import SIMSIDAdminMainPanelView from "../SIMSIDAdminMainPanel.view";
import SIMSIDAdminMainPanel from "../SIMSIDAdminMainPanel.logic";
import * as stateHelper from "../../../../../shared/utils/state-helper";

describe("SIMSIDAdminMainPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setNotificationDisable = jest.fn(); 

  test("renders SIMSIDAdminMainPanel with isOpen true and Notification enabled", async () => {
    const usePersistantState = jest.spyOn(stateHelper, 'usePersistantState');
    usePersistantState.mockReturnValue([true, setNotificationDisable]);
    render(
      <SIMSIDAdminMainPanel
        isOpen
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
      />
    );
    expect(screen.queryByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(screen.queryByTestId('notification-test-id')).not.toBeInTheDocument();
  });

  test("renders SIMSIDAdminMainPanelView with Notification enabled with isOpen false", async () => {
    const { getByTestId, container } = render(
      <SIMSIDAdminMainPanelView
        isOpen = {false}
        enableNotification
        setDisableNotification={() => {}}
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
    const { getByTestId } = render(
      <SIMSIDAdminMainPanelView
        isOpen = {false}
        enableNotification={false}
        setDisableNotification={() => {}}
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
        enableNotification
        setDisableNotification={() => {}}
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
    const { getByTestId } = render(
      <SIMSIDAdminMainPanelView
        isOpen
        enableNotification={false}
        setDisableNotification={() => {}}
      />
    );

    const NotificationTestId = screen.queryByTestId('notification-test-id');
    expect(getByTestId("SIMSID-Admin-View")).toBeInTheDocument();
    expect(NotificationTestId).not.toBeInTheDocument();
  });
});
