import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import NotificationView from "../Notification.view";
import * as useSimsConnectedBannerModule from "../../../../../shared/hooks/useSimsConnectedBanner";
import { INotificationProps } from "../NotificationProps";

jest.mock("../../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner", () => () => <div>SIMSConnectedLauncherBanner</div>);

describe("NotificationView", () => {
  const defaultProps: INotificationProps = {
    setDisableNotification: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders SIMSConnectedLauncherBanner when useSimsConnectedBanner returns true", async () => {
    jest.spyOn(useSimsConnectedBannerModule, "useSimsConnectedBanner").mockReturnValue([true, true]);
    render(<NotificationView {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("notification-test-id")).toBeInTheDocument();
      expect(screen.getByText("SIMSConnectedLauncherBanner")).toBeInTheDocument();
    });
  });

  it("does not render SIMSConnectedLauncherBanner when useSimsConnectedBanner returns false", async () => {
    jest.spyOn(useSimsConnectedBannerModule, "useSimsConnectedBanner").mockReturnValue([false, false]);
    render(<NotificationView {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByTestId("notification-test-id")).toBeNull();
      expect(screen.queryByText("SIMSConnectedLauncherBanner")).toBeNull();
    });
  });

  it("does not render SIMSConnectedLauncherBanner when useSimsConnectedBanner returns false (error case)", async () => {
    jest.spyOn(useSimsConnectedBannerModule, "useSimsConnectedBanner").mockReturnValue([false, false]);
    render(<NotificationView {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByTestId("notification-test-id")).toBeNull();
      expect(screen.queryByText("SIMSConnectedLauncherBanner")).toBeNull();
    });
  });
});
