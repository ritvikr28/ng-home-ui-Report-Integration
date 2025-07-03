import React, { useEffect, useState } from "react";
import { INotificationProps } from "./NotificationProps";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { fetchLinks } from "../../../../shared/hooks/useSIMSNextGenLinks";

const NotificationView: React.FC<INotificationProps> = () => {

  const [isRenderSimsConnectedBanner, setRenderSimsConnectedBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const fetchSimsConnectedLink: () => Promise<void> = async () => {

    try {
      const responseapidata = await fetchLinks();
      if (responseapidata != null) {
        setRenderSimsConnectedBanner(responseapidata)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSimsConnectedLink();
  })

  return (isRenderSimsConnectedBanner && (
    <div data-testid="notification-test-id">
      <SIMSConnectedLauncher />
    </div>
  )) as React.ReactElement | null;
};

export default NotificationView;
