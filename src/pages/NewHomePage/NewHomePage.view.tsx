import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { envConfig } from "../../shared/utils";
import "./style.scss";
import Welcomeview from "./Welcome.view";
import SidePanel from "../SidePanel/SidePanel.view";
import WidgetView from "../../features/widget/Widget.view";

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
        <Welcomeview />
        <WidgetView />
      </div>
    </div>
  ) : (
    <Redirect to="/noAccess" />
  );
};
