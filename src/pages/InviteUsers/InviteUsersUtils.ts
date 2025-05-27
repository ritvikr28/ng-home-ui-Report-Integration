import React from "react";
import { service } from "../../shared/utils/api-service";
import {
  IInviteUserData,
  IInviteUserDetails,
  InvitationStatusFilterOptions,
  IPaginationOptions,
  IPostSendInvitation,
  ISendInviteReqBody
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

export const postSendInvitation = async (props: IPostSendInvitation) => {
  try {
    const url = `InviteUser/SendInvitation`;
    const postReqBody = {
      inviteUsers: props.requestBody
    };
    const response: any = await service.post(url, postReqBody);
    return response?.data;
  } catch (error) {
    console.error("Error sending invitation:", error);
    props.setShowInviteErrBanner(true);
    throw error;
  }
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
        isShowCheckBox:
          !(
            item?.invitationStatus === InvitationStatusFilterOptions.Accepted ||
            item?.invitationStatus ===
              InvitationStatusFilterOptions.InvitationConflict
          ) && item?.emailId !== "Work main email address is missing",
        isShowActionBtn:
          !(
            item?.invitationStatus === InvitationStatusFilterOptions.Accepted ||
            item?.invitationStatus ===
              InvitationStatusFilterOptions.InvitationConflict
          ) && item?.emailId !== "Work main email address is missing",
        forename: item?.forename,
        surname: item?.surname
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

export const handleSendInvite = async ({
  selectedRowItem,
  setLoader,
  setShowInviteErrBanner,
  setDataUpdated
}: {
  selectedRowItem: any;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteErrBanner: React.Dispatch<React.SetStateAction<boolean>>;
  setDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const requestBody: ISendInviteReqBody = {
    emailId: selectedRowItem?.emailId,
    externalId: selectedRowItem?.id,
    forename: selectedRowItem?.forename,
    surname: selectedRowItem?.surname
  };
  setLoader(true);
  try {
    await postSendInvitation({
      requestBody: [requestBody],
      setShowInviteErrBanner
    }).then((res) => {
      setDataUpdated(true);
    });
  } catch (error) {
    setLoader(false);
  }
};

export const handleCheckBoxSelection: (props: {
  id: string;
  selectedCheckBoxIds: string[];
  setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => void = (props: {
  id: string;
  selectedCheckBoxIds: string[];
  setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { id, selectedCheckBoxIds, setSelectedCheckBoxIds } = props;
  const updatedCheckBoxIds = [...selectedCheckBoxIds];
  if (updatedCheckBoxIds.includes(id)) {
    updatedCheckBoxIds.splice(updatedCheckBoxIds.indexOf(id), 1);
  } else {
    updatedCheckBoxIds.push(id);
  }
  setSelectedCheckBoxIds(updatedCheckBoxIds);
};

export const handleSelectedUserData: (props: {
  selectedCheckBoxIds: string[];
  usersTableData: IInviteUserDetails[];
  setUsersTableData: React.Dispatch<React.SetStateAction<IInviteUserDetails[]>>;
}) => void = (props: {
  selectedCheckBoxIds: string[];
  usersTableData: IInviteUserDetails[];
  setUsersTableData: React.Dispatch<React.SetStateAction<IInviteUserDetails[]>>;
}) => {
  const { usersTableData, selectedCheckBoxIds, setUsersTableData } = props;
  if (usersTableData.length > 0) {
    const updatedData = usersTableData.map((user: any) => ({
      ...user,
      isCheckboxSelected: selectedCheckBoxIds.includes(user.id)
    }));
    setUsersTableData(updatedData);
  }
};
