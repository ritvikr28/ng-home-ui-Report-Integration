import { Redirect } from "react-router-dom";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { envConfig } from "../../shared/utils";
import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";


const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View",
  }
];

const QuickLink = () => {

  const isPermission =
  authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
  envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";
  
  return isPermission ? (
    <div className="teacher-panel-container">
       <BreadcrumbWrapper  />
        
    </div>
  
    ): (
      <Redirect to="/noAccess" />
    );
}

export default QuickLink;
