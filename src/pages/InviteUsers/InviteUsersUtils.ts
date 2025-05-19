import React from "react";
import { service } from "../../shared/utils/api-service";
import {
  IInviteUserData,
  IInviteUserDetails,
  InvitationStatusFilterOptions,
  IPaginationOptions
} from "./InviteUsersProps";

export const getUsersData: (
  props: IPaginationOptions
) => Promise<IInviteUserData> = async (props: IPaginationOptions) => {
  const { pageNumber, pageSize, columnName, sortDirection } = props;
  let url = `/InviteUser/Users?PageNumber=${pageNumber}&PageSize=${pageSize}`;
  if (columnName) {
    url += `&SortBy=${columnName}`;
  }
  if (sortDirection !== undefined) {
    url += `&Asc=${sortDirection}`;
  }
  const response: any = await service.get(url);
  return response?.data;
};

export const fetchInviteUserDetails = async (props: IPaginationOptions) => {
  const {
    pageSize,
    setTotalPage,
    setShowErrorBanner,
    setshowInvitationConflictBanner
  } = props;
  try {
    const InviteUsersData: any = await getUsersData(props);
    if (setshowInvitationConflictBanner) {
      setshowInvitationConflictBanner(
        InviteUsersData[0]?.payload.some(
          (x: any) => x?.invitationStatus === "Invitation conflict"
        )
      );
    }

    const totalPages = Math.ceil(InviteUsersData[0].total / pageSize);
    if (setTotalPage) {
      setTotalPage(totalPages);
    }

    const tableDataObj: any[] = InviteUsersData[0]?.payload
      ?.filter(
        (item: any) =>
          !(
            item?.forename === "" &&
            item?.surname === "" &&
            item?.emailId === "Work main email address is missing"
          )
      )
      .map((item: any) => ({
        id: item?.externalId,
        name: `${item?.forename} ${item?.surname}`,
        emailId:
          item?.emailId === "Work main email address is missing"
            ? "Primary email unavailable"
            : item?.emailId,
        userType: item?.userType,
        invitationStatus: item?.invitationStatus,
        actions: {
          options: [
            {
              disabled: false,
              isSelected: false,
              text: "Send Invite",
              value: "SendInvite"
            }
          ]
        },
        isShowActionBtn:
          !(
            item?.invitationStatus === InvitationStatusFilterOptions.Accepted ||
            item?.invitationStatus ===
              InvitationStatusFilterOptions.InvitationConflict
          ) && item?.emailId !== "Work main email address is missing"
      }));

    return tableDataObj;
  } catch (error) {
    if (setShowErrorBanner) {
      setShowErrorBanner(true);
    }
    return [];
  }
};

export const inviteUsersSorting = async (
  columnName: string,
  sortDirection: boolean,
  setSortDirection: React.Dispatch<React.SetStateAction<boolean>>,
  setSortBy: React.Dispatch<React.SetStateAction<string>>,
  pageNumber: number,
  pageSize: number,
  setUsersTableData: React.Dispatch<React.SetStateAction<IInviteUserDetails[]>>,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  setShowErrorBanner?: React.Dispatch<React.SetStateAction<boolean>>,
  setshowInvitationConflictBanner?: React.Dispatch<
    React.SetStateAction<boolean>
  >
): Promise<void> => {
  let apiColumnName = columnName;
  switch (columnName) {
    case "Name":
      apiColumnName = "Forename";
      break;
    case "Email":
      apiColumnName = "EmailId";
      break;
    default:
      apiColumnName = columnName;
      break;
  }
  setSortBy(apiColumnName);
  setSortDirection(sortDirection);
  setLoader(true);
  fetchInviteUserDetails({
    pageNumber,
    pageSize,
    columnName: apiColumnName,
    sortDirection,
    setShowErrorBanner,
    setshowInvitationConflictBanner
  }).then((res) => {
    setLoader(false);
    setUsersTableData(res);
  });
};
