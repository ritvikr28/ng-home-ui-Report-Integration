import React from 'react';
import { Grid, GridItem} from "@essnextgen/ui-kit";
import SIMSupdatesView from "../../../MainPanel/SIMSUpdates/SIMSupdates.view";
import WelcomeUser from "../../../MainPanel/WelcomeUser/WelcomeUser.logic";
import { ISIMSIDAdminMainPanelProps } from "./SIMSIDAdminMainPanelProps";
import "../../../MainPanel/style.scss";
import NotificationView from '../NotificationView/Notfication.view';

const SIMSIDAdminMainPanelView : React.FC<ISIMSIDAdminMainPanelProps> = ({ isOpen, disableNotification, setDisableNotification }) =>
<div className={isOpen ? " " : "welcome-user-fixed-dertfsg11463f"}>
    <Grid dataTestId="SIMSID-Admin-View">
      <GridItem className="teacher-panel-container-dertfsg11463f" sm={4} md={8} lg={12}>
        <WelcomeUser isSchoolNameToBeDisplayed={false} isOpen = {isOpen} />
        {disableNotification && <NotificationView setDisableNotification={setDisableNotification}/>}
        <SIMSupdatesView isOpen = {isOpen}/>       
      </GridItem>
    </Grid>
  </div>
export default SIMSIDAdminMainPanelView;