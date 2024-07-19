import React from 'react';
import { Grid, GridItem } from "@essnextgen/ui-kit";
import SIMSupdatesView from "../../../MainPanel/SIMSUpdates/SIMSupdates.view";
import WelcomeUser from "../../../MainPanel/WelcomeUser/WelcomeUser.logic";
import { ISIMSIDAdminMainPanelViewProps } from "./SIMSIDAdminMainPanelProps";
import "../../../MainPanel/style.scss";
import NotificationView from '../NotificationView/Notification.view';
import "./style.scss";

const SIMSIDAdminMainPanelView: React.FC<ISIMSIDAdminMainPanelViewProps> = ({ isOpen, enableNotification, setDisableNotification }) =>
  <div className={isOpen ? " " : "welcome-user-simsid-fixed welcome-user-simsid-large"}>
    <Grid dataTestId="SIMSID-Admin-View">
      <GridItem className="simsid-main-panel-container-simsid-admin">
          <WelcomeUser
            isSchoolNameToBeDisplayed={false}
            isOpen={isOpen}
          />
     
        {enableNotification &&
          <div className={isOpen ? 'notification-open-panel' : 'notification-simsid'}>
            <NotificationView setDisableNotification={setDisableNotification} />
          </div>
        }
        <div className='simsupdate-simsid-admin'><SIMSupdatesView isOpen={isOpen} /> </div>
      </GridItem>
    </Grid>
  </div>
export default SIMSIDAdminMainPanelView;