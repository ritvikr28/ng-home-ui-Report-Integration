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
  const isPermission =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";

  const handleClickAction = () => {
    // implementation
  };

  const handleCloseAction = () => {
    // implementation
  };

  return isPermission ? (
    <div className="newhomewid">
     <div className="notificationmsg">
        <Notification
          dataTestId="test-id"
          escapeExits
          id="element-id"
          onClickAction={handleClickAction}
          onClickClose={handleCloseAction}
          title="A new homepage is under development!"
          status={NotificationStatus.HIGHLIGHT} />
      </div><div className="page-heading welcone">
        <span>
          {userFullname.length > 30 ? (
            <>
              <span className="welcomemsg2">
                Hi <strong>{userFullname}</strong>,
              </span>
              <br />
              <span className="welcomemsg">welcome back!</span>
            </>
          ) : (
            <span className="welcomemsg">
              Hi <strong>{userFullname}</strong>, welcome back!
            </span>
          )}
          </span>
        </div>
    </div>
  ) : (
    <Redirect to="/noAccess" />
  );
};
