import React from 'react';
import { Grid, GridItem} from "@essnextgen/ui-kit";
import SIMSupdatesView from "../../../MainPanel/SIMSUpdates/SIMSupdates.view";
import WelcomeUser from "../../../MainPanel/WelcomeUser/WelcomeUser.logic";
import { ISIMSIDAdminMainPanelProps } from "./SIMSIDAdminMainPanelProps";
import "../../../MainPanel/style.scss";
import NotificationView from '../NotificationView/Notfication.view';
import "./style.scss";

const SIMSIDAdminMainPanelView : React.FC<ISIMSIDAdminMainPanelProps> = ({ isOpen, disableNotification, setDisableNotification}) =>
<div className={isOpen ? " " : "welcome-user-simsid-fixed-dertfsg11463f"}>
    <Grid dataTestId="SIMSID-Admin-View">
      <GridItem className="simsid-main-panel-container-dertfsg11463f">
        <div className='welcome-user'>
        <WelcomeUser
        isSchoolNameToBeDisplayed={false} 
        isOpen = {isOpen} 
        />
        </div>
        {disableNotification && 
        <div className= {isOpen ? 'notification-open-panel' :'notification-simsid'}>
        <NotificationView setDisableNotification={setDisableNotification}/>
        </div>
        }
        <div className='simsupdate-simsid-admin'><SIMSupdatesView isOpen = {isOpen}/> </div>      
      </GridItem>
    </Grid>
  </div>
export default SIMSIDAdminMainPanelView;