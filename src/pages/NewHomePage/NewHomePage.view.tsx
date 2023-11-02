import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import SidePanel from "../../features/SidePanel/SidePanel.logic";
import TeacherPanelView from "../../features/TeacherPanel/TeacherPanel.view";
import { envConfig } from "../../shared/utils";
import WelcomeUser from "../../features/WelcomeUser/WelcomeUser.logic";

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
    <Grid className="app">
      <GridItem lg ={12}md = {8} sm = {4} >
        <SidePanel />
      </GridItem>
      <GridItem lg ={12}md = {8} sm = {4} className="body-panel">
        <WelcomeUser />
        <TeacherPanelView />
      </GridItem>
    </Grid>
  ) : (
    <Redirect to="/noAccess" />
  );
};
