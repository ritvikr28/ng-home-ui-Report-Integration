import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { envConfig } from "../../shared/utils";
import "./style.scss";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View"
  }
];

export const NewHomepageView = () => {
  const userFullname: string | null = authService.getUsername();
  const fullNameArray: string[] = userFullname.split(' ');

  const isPermission =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";

  return isPermission ? (
    <div className="newhomewid">
     <div className="notificationmsg">
        <Notification
          dataTestId="test-id"
          escapeExits
          id="element-id"
          title="A new homepage is under development!"
          status={NotificationStatus.HIGHLIGHT} />
      </div><div className="page-heading welcone">
        <span>
          {fullNameArray[0].length > 60 ? (
            <>
              <span className="welcomemsg welcomemsg2">
                Hi <strong>{fullNameArray[0]}</strong>,
              </span>
              <br />
              <span className="welcomemsg">welcome back!</span>
            </>
          ) : (
            <span className="welcomemsg welcomemsg2">
              Hi <strong>{fullNameArray[0]}</strong>, welcome back!
            </span>
          )}
          </span>
        </div>
    </div>
    
  ) : (
    <Redirect to="/noAccess" />
  );

};
