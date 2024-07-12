import React from "react";
import SIMSIDAdminMainPanelView from "./SIMSIDAdminMainPanel.view";
import { usePersistantState } from "../../../../shared/utils/state-helper";

const SIMSIDAdminMainPanel: React.FC = () => {
  
    const [notificationDisable, setNotificationDisable] = usePersistantState("IS_NOTIFICATION_ENABLED", true);

  return <SIMSIDAdminMainPanelView setDisableNotification={setNotificationDisable} disableNotification={notificationDisable}/>;
};

export default SIMSIDAdminMainPanel;
