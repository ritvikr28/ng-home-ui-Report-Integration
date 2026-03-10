import React, { useState, useEffect } from "react";
import { InviteUserView } from "./InviteUsers.view";
import { IInviteUserDetails } from "./InviteUsersProps";
import gtmAnalytics from "../../shared/utils/analytics";

export const InviteUsersLogic: () => JSX.Element = () => {
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
  const [isSearchLoader, setSearchLoader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [usersTableData, setUsersTableData]: [IInviteUserDetails[], React.Dispatch<React.SetStateAction<IInviteUserDetails[]>>] = useState<IInviteUserDetails[]>(
    []
  );
  const [showInvitationConflictBanner, setshowInvitationConflictBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [totalConflicts, setTotalConflicts] : [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(0);
  const [showInvitationRequestBanner, setshowInvitationRequestBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [totalRequests, setTotalRequests]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(0);

  useEffect(() => {
    gtmAnalytics.pushPageViewEvent();   
  }, []);

  const handlePageChange: (event: any, handlepageCount: number) => void = (
    event: any,
    handlepageCount: number
  ) => {
    setLoader(true);
    setshowInvitationConflictBanner(false);
    setshowInvitationRequestBanner(false);
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
      totalConflicts={totalConflicts}
      setTotalConflicts={setTotalConflicts}
      showInvitationRequestBanner={showInvitationRequestBanner}
      setshowInvitationRequestBanner={setshowInvitationRequestBanner}
      totalRequests={totalRequests}
      setTotalRequests={setTotalRequests}
      isSearchLoader={isSearchLoader}
      setSearchLoader={setSearchLoader}
    />
  );
};

export default InviteUsersLogic;
