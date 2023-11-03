import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import SidePanel from "../../features/SidePanel/SidePanel.logic";
import { envConfig } from "../../shared/utils";
import MainPanelView from "../../features/MainPanel/MainPanel.view";

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

  return isPermission ? (
    <Grid className="app" >
      <GridItem lg ={2}>
        <SidePanel />
      </GridItem>
      <GridItem  className="body-panel" lg ={10}>
        <MainPanelView />
      </GridItem>
    </Grid>
  ) : (
    <Redirect to="/noAccess" />
  );
  }