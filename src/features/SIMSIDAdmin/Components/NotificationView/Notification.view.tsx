import React from 'react';
import { Grid, GridItem, Notification, NotificationStatus } from "@essnextgen/ui-kit";
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

        <Grid>
        <GridItem className='secondary-text-span-simsid-admin'>
            <span>Invite staff members - </span>
            <div className='secondary-text-simsid-admin'>
                You can invite staff members to access SIMS Next Gen by selecting the Invite Staff option in the left side panel or from the main menu.
            </div>
        </GridItem>

        <GridItem className='secondary-text-second-para'>
            <span>Contact your SIMS 7 System Manager - </span>
            <div className='secondary-text-simsid-admin'>
                 For access to more SIMS Next Gen features, ask your SIMS 7 System Manager to assign you the necessary security groups. 
            </div>
        </GridItem>
    </Grid>
</div>
        }
        onClickClose={() => setDisableNotification(false)}
        status={NotificationStatus.HIGHLIGHT}
        title="You have limited access to SIMS Next Gen"
    />

export default NotificationView;