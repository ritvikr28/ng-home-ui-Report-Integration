import React from "react";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import DiscoverMoreView from "./Components/DiscoverMore.view";
/* eslint-disable */
interface SIMSupdatesViewProps {
  isOpen?: boolean;
}

const requiredAdminPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.Admin",

    Operation: "View"
  }
];

const requiredPupilProfilePermissions: Permission[] = [
  {
    Securable: "NG.Learner.Personal",
    Operation: "View"
  },
  {
    Securable: "NG.Learner.Registration",
    Operation: "View"
  },
  {
    Securable: "NG.Learner.Identifier",
    Operation: "View"
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View"
  }
];

export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) => {
  const isSystemManager =
    authService.isAuthorised(requiredAdminPermissions, MatchPermissions.all) &&
    !authService.isAuthorised(
      requiredPupilProfilePermissions,
      MatchPermissions.all
    );

  return <DiscoverMoreView isOpen={isOpen} />;
};
/* eslint-enable */
export default SIMSupdatesView;
