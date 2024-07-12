import React from 'react';
import {Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { INotificationProps } from "./NotificationProps";

const NotificationView: React.FC<INotificationProps> = ({ setDisableNotification }) =>
     <Notification
             dataTestId="test-id"
             escapeExits
             id="element-id"
             message={<div>
              <br />
              <div>What to do next:</div><br />
              <div><b>Invite staff members</b> - You can invite staff members to access SIMS Next Gen by selecting the Invite staff option in the left side panel or from the main menu.</div><br />
              <b>Or, contact your SIMS 7 System Manager</b> - To access additional SIMS Next Gen functionality, you will need to be assigned to the appropriate security groups in SIMS 7. Your SIMS 7 System Manager can assist with this.
             </div>}
             onClickClose={() => setDisableNotification(false)}
             status={NotificationStatus.HIGHLIGHT}
             title="You have limited access to SIMS Next Gen"
         />

export default NotificationView;