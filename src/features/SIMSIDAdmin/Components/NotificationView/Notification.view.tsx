import React from "react";
import { INotificationProps } from "./NotificationProps";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { useSIMSNextGenLinks } from "../../../../shared/hooks/useSIMSNextGenLinks";

const NotificationView: React.FC<INotificationProps> = () => {
  const { hasConnectedLauncher } = useSIMSNextGenLinks();

  if (!hasConnectedLauncher) {
    return null;
  }

  return (
    <div data-testid="notification-test-id">
      <SIMSConnectedLauncher />
    </div>
  );
};

export default NotificationView;
