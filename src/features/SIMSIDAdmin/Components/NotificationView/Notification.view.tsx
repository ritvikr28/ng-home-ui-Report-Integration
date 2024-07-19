import React from 'react';
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { INotificationProps } from "./NotificationProps";
import "./style.scss";

const NotificationView: React.FC<INotificationProps> = ({ setDisableNotification }) =>
    <Notification
        className='notification-id-sims'
        dataTestId="notification-test-id"
        escapeExits
        id="element-id"
        message={
            <div className='secondary-text-simsid'>
                <br />
                <div className='secondary-text-simsid-admin-sec-heading'>What to do next:</div>


                <div className='secondary-text-span-simsid-admin'>Invite staff members
                    <div className='secondary-text-simsid-admin'>
                        - You can invite staff members to access SIMS Next Gen by selecting the Invite staff option in the left side panel or from the main menu.
                    </div>
                </div>

                <br />


                <div className=' secondary-text-second-para'>Or, contact your SIMS 7 System Manager
                    <div className='secondary-text-simsid-admin'>
                        - To access additional SIMS Next Gen functionality, you will need to be assigned to the appropriate security groups in SIMS 7. Your SIMS 7 System Manager can assist with this.</div>
                </div>
            </div>
        }
        onClickClose={() => setDisableNotification(false)}
        status={NotificationStatus.HIGHLIGHT}
        title="You have limited access to SIMS Next Gen"
    />

export default NotificationView;