import React from "react";
import SIMSIDAdminMainPanelView from "./SIMSIDAdminMainPanel.view";
import { usePersistantState } from "../../../../shared/utils/state-helper";
import { ISIMSIDAdminMainPanelProps } from "./SIMSIDAdminMainPanelProps";

const SIMSIDAdminMainPanel: React.FC<ISIMSIDAdminMainPanelProps> = ({ isOpen, setIsOpen }) => {

  const [notificationDisable, setNotificationDisable] = usePersistantState("IS_NOTIFICATION_ENABLED", true);

  return <SIMSIDAdminMainPanelView
    setDisableNotification={setNotificationDisable}
    disableNotification={notificationDisable}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
  />;
};

export default SIMSIDAdminMainPanel;
