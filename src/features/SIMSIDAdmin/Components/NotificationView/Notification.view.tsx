import React from "react";
import { INotificationProps } from "./NotificationProps";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { SIMSNextGenLink } from "../../../../shared/hooks/useSIMSNextGenLinks";
import { getCachedData } from "../../../../shared/hooks/cacheHelperFile";

const NotificationView: React.FC<INotificationProps> = () => {
  // const [isRenderSimsConnectedBanner]: [boolean, boolean] = useSimsConnectedBanner();
  const response: any = getCachedData("SIMS_CONNECTED_PERMISSIONS")
  // await service.get('v1/SIMSConnected/simsnextgenlinks');
  const apiMenus = response || [];
  const launcherInApi: SIMSNextGenLink | undefined = apiMenus.find((menu: SIMSNextGenLink) => menu.code === "SIMSConnectedLauncher");

  if (!launcherInApi) {
    return null;
  }

  const hasValidLink = Boolean(launcherInApi.link && launcherInApi.link.trim());

  return (
    hasValidLink ? (
      <div data-testid="notification-test-id">
        <SIMSConnectedLauncher />
      </div>
    ) : null
  );
};

export default NotificationView;
