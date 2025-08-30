import React from "react";
import { INotificationProps } from "./NotificationProps";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { useSimsConnectedBanner } from "../../../../shared/hooks/useSimsConnectedBanner";

const NotificationView: React.FC<INotificationProps> = () => {
  const [isRenderSimsConnectedBanner] = useSimsConnectedBanner();
  return (
    isRenderSimsConnectedBanner ? (
      <div data-testid="notification-test-id">
        <SIMSConnectedLauncher />
      </div>
    ) : null
  );
};

export default NotificationView;
