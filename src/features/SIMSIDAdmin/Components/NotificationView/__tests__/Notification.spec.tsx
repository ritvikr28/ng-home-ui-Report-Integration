import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import NotificationView from "../Notification.view";
import * as useSIMSNextGenLinksModule from "../../../../../shared/hooks/useSIMSNextGenLinks";
import { INotificationProps } from "../NotificationProps";

jest.mock("../../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner", () => () => <div>SIMSConnectedLauncherBanner</div>);

describe("NotificationView", () => {
  const defaultProps: INotificationProps = {
    setDisableNotification: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip("renders SIMSConnectedLauncherBanner when fetchLinks returns true", async () => {
    jest.spyOn(useSIMSNextGenLinksModule, "fetchLinks").mockResolvedValueOnce(true);
    render(<NotificationView {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("notification-test-id")).toBeInTheDocument();
      expect(screen.getByText("SIMSConnectedLauncherBanner")).toBeInTheDocument();
    });
  });

  it("does not render SIMSConnectedLauncherBanner when fetchLinks returns false", async () => {
    jest.spyOn(useSIMSNextGenLinksModule, "fetchLinks").mockResolvedValueOnce(false);
    render(<NotificationView {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByTestId("notification-test-id")).toBeNull();
      expect(screen.queryByText("SIMSConnectedLauncherBanner")).toBeNull();
    });
  });

  it("does not render SIMSConnectedLauncherBanner when fetchLinks throws error", async () => {
    jest.spyOn(useSIMSNextGenLinksModule, "fetchLinks").mockRejectedValueOnce(new Error("fail"));
    render(<NotificationView {...defaultProps} />);
    // Wait for useEffect to run
    await waitFor(() => {
      expect(screen.queryByTestId("notification-test-id")).toBeNull();
      expect(screen.queryByText("SIMSConnectedLauncherBanner")).toBeNull();
    });
  });
});
