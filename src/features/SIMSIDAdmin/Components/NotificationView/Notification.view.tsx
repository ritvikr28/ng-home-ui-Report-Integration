import React from "react";
import { INotificationProps } from "./NotificationProps";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { useSIMSNextGenLinks } from "../../../../shared/hooks/useSIMSNextGenLinks";

const NotificationView: React.FC<INotificationProps> = () => {
  const { hasConnectedLauncher } = useSIMSNextGenLinks();

  return (hasConnectedLauncher && (
    <div data-testid="notification-test-id">
      <SIMSConnectedLauncher />
    </div>
  )) as React.ReactElement | null;
};

export default NotificationView;
