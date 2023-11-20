import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { useState } from "react";
import { envConfig } from "../../shared/utils";
import MainPanelView from "../../features/MainPanel/MainPanel.view";
import SidePanelView from "../../features/SidePanel/SidePanel.view";


const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View",
  }
];

export const NewHomepageView = () => {
  const isPermission =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
      setIsOpen(!isOpen);
    };
  
    const closePanel = () => {
      setIsOpen(false);
    };
  

  return isPermission ? (
    <Grid className="app">
    <GridItem lg={isOpen ? 2 : 1} sm = {isOpen ? 3 : 2}>
      <SidePanelView isOpen={isOpen} togglePanel={togglePanel} closePanel={closePanel} />
    </GridItem>
    <GridItem className="body-panel" lg={isOpen ? 10: 11 } sm = {isOpen ? 3 : 2}>
      <MainPanelView />
    </GridItem>
  </Grid>
  ) : (
    <Redirect to="/noAccess" />
  );
  }

  