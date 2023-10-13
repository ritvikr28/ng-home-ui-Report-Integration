import "./style.scss";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Redirect } from "react-router-dom";
import { envConfig } from "../../shared/utils";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",
    Operation: "View",
  }
];

export const NewHomepageView = () => (
  authService.isAuthorised(requiredPermissions, MatchPermissions.all) && envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True" 
  ? (
    <div className="newhomepage">
      <span className="newhomepagetext">New homepage in the making! </span>
    </div>
  )
  : <Redirect to="/noAccess" />
);

