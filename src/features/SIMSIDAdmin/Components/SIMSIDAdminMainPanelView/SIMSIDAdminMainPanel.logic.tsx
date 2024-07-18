import React from "react";
import SIMSIDAdminMainPanelView from "./SIMSIDAdminMainPanel.view";
import { usePersistantState } from "../../../../shared/utils/state-helper";
import { ISIMSIDAdminMainPanelProps } from "./SIMSIDAdminMainPanelProps";

const SIMSIDAdminMainPanel: React.FC<ISIMSIDAdminMainPanelProps> = ({ isOpen, setIsOpen }) => {

  const [notificationEnable, setNotificationDisable] = usePersistantState("IS_NOTIFICATION_ENABLED", true);

  return <SIMSIDAdminMainPanelView
    setDisableNotification={setNotificationDisable}
    enableNotification={notificationEnable}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
  />;
};

export default SIMSIDAdminMainPanel;
