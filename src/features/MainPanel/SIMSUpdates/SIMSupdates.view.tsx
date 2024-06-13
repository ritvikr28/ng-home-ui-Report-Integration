import React from 'react';
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { hasFeaturePermission } from '@essnextgen/ui-flagr';
import { authService, MatchPermissions, Permission } from '@essnextgen/auth-ui';
import { envConfig } from '../../../shared/utils';
import DiscoverMoreView from "./Components/DiscoverMore.view";
import styles from "./DiscoverStyle.module.scss";
import { isOrganisationInVariant } from '../../../shared/utils/flagr-utils';
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
    Securable: "NG.Learner.Personal",

    Operation: "View",
  },
  {
    Securable: "NG.Learner.Registration",

    Operation: "View",
  },
  {
    Securable: "NG.Learner.Identifier",

    Operation: "View",
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View",
  },
];


export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) =>{
    const hasAdminFlagrPermission: boolean =
      hasFeaturePermission(`${envConfig.APPLICATION}`, "AdminView") &&
      isOrganisationInVariant("AdminView");

    const isSystemManager =
      hasAdminFlagrPermission &&
      authService.isAuthorised(
        requiredAdminPermissions,
        MatchPermissions.all
      ) &&
      !authService.isAuthorised(
        requiredPupilProfilePermissions,
        MatchPermissions.all
      ); 

  return (
  <Grid>
    <GridItem className={`${styles["sims-container"]} ${isOpen ? styles["sims-open"] : ''} ${isSystemManager ? styles["sys-mgr"] : ''}`}>
      <DiscoverMoreView isOpen={isOpen}/>
    </GridItem>
  </Grid>
)};
/* eslint-enable */
export default SIMSupdatesView;
