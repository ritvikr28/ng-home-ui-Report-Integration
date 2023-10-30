import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { envConfig } from "../../shared/utils";
import "./style.scss";
import WelcomeUser from "../../features/WelcomeUser/WelcomeUser.logic";
import SidePanel from "../../features/SidePanel/SidePanel.logic";
import TeacherPanelView from "../../features/TeacherPanel/TeacherPanel.view";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View"
  }
];

export const NewHomepageView = () => {
  const isPermission =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";

  return isPermission ? (
    <div className="app">
      <div>
        <SidePanel />
      </div>
      <div className="body-panel">
        <div className="notificationmsg">
          <Notification
            dataTestId="test-id"
            escapeExits
            id="element-id"
            title="A new homepage is under development!"
            status={NotificationStatus.HIGHLIGHT}
          />
        </div>
        <WelcomeUser />
        <TeacherPanelView />
      </div>
    </div>
  ) : (
    <Redirect to="/noAccess" />
  );
};
