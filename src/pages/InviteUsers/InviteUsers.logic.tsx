import React, { useState } from "react";
import InviteUserView from "./InviteUsers.view";
import { IInviteUserDetails } from "./InviteUsersProps";


export const InviteUsersLogic = () => {
  const [currentPage, setCurrentPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(1);
  const [totalPage, setTotalPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(0);
  const [isLoader, setLoader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [usersTableData, setUsersTableData] = useState<IInviteUserDetails[]>(
    []
  );
  const [showInvitationConflictBanner, setshowInvitationConflictBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  
  const handlePageChange: (event: any, handlepageCount: number) => void = (
    event: any,
    handlepageCount: number
  ) => {
    setLoader(true);
    setshowInvitationConflictBanner(false);
    setCurrentPage(handlepageCount);
  };

  return (
    <InviteUserView
      usersTableData={usersTableData}
      setUsersTableData={setUsersTableData}
      isLoader={isLoader}
      setLoader={setLoader}
      totalPage={totalPage}
      setTotalPage={setTotalPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      handlePageChange={handlePageChange}
      showInvitationConflictBanner={showInvitationConflictBanner}
      setshowInvitationConflictBanner={setshowInvitationConflictBanner}
    />
  );
};

export default InviteUsersLogic;
