import React from 'react';
import { Grid, GridItem } from "@essnextgen/ui-kit";
import WelcomeUser from "../../../MainPanel/WelcomeUser/WelcomeUser.logic";
import { ISIMSIDAdminMainPanelViewProps } from "./SIMSIDAdminMainPanelProps";
import "../../../MainPanel/style.scss";
import NotificationView from '../NotificationView/Notification.view';
import "./style.scss";
import SIMSupdatesView from '../../../../shared/components/SIMSUpdates/SIMSupdates.view';
import { FilledLeftPanelIcon } from '../../../../shared/components/CommonElement/FilledButton';

const SIMSIDAdminMainPanelView: React.FC<ISIMSIDAdminMainPanelViewProps> = ({ isOpen, enableNotification, setDisableNotification, setIsOpen }) =>
  <div className={isOpen ? " " : "welcome-user-simsid-fixed welcome-user-simsid-large"}>
    <Grid dataTestId="SIMSID-Admin-View">
      <GridItem className="simsid-main-panel-container-simsid-admin">
        <div className="simsid-sidebtn"> {!isOpen && (
          <GridItem className="c-clear-padding">
            <button
              type="button"
              className="new-sidepanel-toggle-btn"
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            >
              <FilledLeftPanelIcon />
            </button>
          </GridItem>
        )}

          <WelcomeUser
            isSchoolNameToBeDisplayed={false}
            isOpen={isOpen}
          />
        </div>
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