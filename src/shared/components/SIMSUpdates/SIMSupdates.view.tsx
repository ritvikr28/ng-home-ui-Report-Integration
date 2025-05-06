import React from 'react';
import DiscoverMoreView from "./Components/DiscoverMore.view";
/* eslint-disable */
interface SIMSupdatesViewProps {
  isOpen?: boolean;
}

export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) => {
  // Not in use 
  // const isSystemManager =
  //   authService.isAuthorised(requiredAdminPermissions, MatchPermissions.all) &&
  //   !authService.isAuthorised(
  //     requiredPupilProfilePermissions,
  //     MatchPermissions.all
  //   );

  return (
    <DiscoverMoreView isOpen={isOpen} />
  );
};
/* eslint-enable */
export default SIMSupdatesView;
