import React from 'react';
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { authService, MatchPermissions, Permission } from '@essnextgen/auth-ui';
import DiscoverMoreView from "./Components/DiscoverMore.view";
import styles from "./DiscoverStyle.module.scss";
/* eslint-disable */
interface SIMSupdatesViewProps {
  isOpen?: boolean;  
}

const requiredAdminPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.Admin",

    Operation: "View",
  },
];

const requiredPupilProfilePermissions: Permission[] = [
  {
    Securable: "Learner.Personal",

    Operation: "View",
  },
  {
    Securable: "Learner.Registration",

    Operation: "View",
  },
  {
    Securable: "Learner.Identifier",

    Operation: "View",
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View",
  },
];


export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) => {
  const isSystemManager =
    authService.isAuthorised(requiredAdminPermissions, MatchPermissions.all) &&
    !authService.isAuthorised(
      requiredPupilProfilePermissions,
      MatchPermissions.all
    );

  return (
    <Grid>
      <GridItem
        className={`${styles["sims-container"]} ${
          isOpen ? styles["sims-open"] : ""
        } ${isSystemManager ? styles["sys-mgr"] : ""}`}
      >
        <DiscoverMoreView isOpen={isOpen} />
      </GridItem>
    </Grid>
  );
};
/* eslint-enable */
export default SIMSupdatesView;
