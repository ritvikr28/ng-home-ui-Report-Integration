import React from "react";
import { ISelectedItem, Suggestion } from "@essnextgen/ui-kit";
import { service } from "../../shared/utils/api-service";
import {
  IInviteUserData,
  IInviteUserDetails,
  InvitationStatusFilterOptions,
  IPaginationOptions,
  IPostSendInvitation,
  IRequestBodyType
} from "./InviteUsersProps";
import { getValues, NoDataMessage } from "./InviteUsers.view";

export const getUsersData: (
  props: IPaginationOptions
) => Promise<IInviteUserData> = async (props: IPaginationOptions) => {
  const {
    pageNumber,
    pageSize,
    columnName,
    sortDirection,
    searchAndStatusFilter,
    setNoDataTextToDisplay
  } = props;

  const searchTerm = searchAndStatusFilter?.searchText;
  const selectedStatus = searchAndStatusFilter?.selectedStatus;

  let url = `/InviteUser/Users?PageNumber=${pageNumber}&PageSize=${pageSize}`;
  if (columnName) {
    url += `&SortBy=${columnName}`;
  }
  if (sortDirection !== undefined) {
    url += `&Asc=${sortDirection}`;
  }
  if (searchTerm !== "") {
    url += `&SearchTerm=${searchTerm}`;
  }
  if (selectedStatus?.value !== "All") {
    url += `&InvitationStatus=${selectedStatus?.value}`;
  }

  const response: any = await service.get(url);
  if (response?.data[0]?.payload?.length === 0) {
    if (setNoDataTextToDisplay) {
      setNoDataTextToDisplay(
        searchTerm
          ? NoDataMessage.noDataOnSearch(searchTerm)
          : NoDataMessage.noDataToDisplay
      );
    }
  }
  return response?.data;
};

export const postSendInvitation = async (props: IPostSendInvitation) => {
  try {
    const url = `InviteUser/SendInvitation`;
    const postReqBody = props.requestBody;
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
    setshowInvitationConflictBanner,
    setNoDataTextToDisplay
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
            ? "Main work email unavailable"
            : item?.emailId,
        userType: item?.userType,
        invitationStatus: item?.invitationStatus,
        inviteRequestDate: item?.inviteRequestDate,
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
    if (setNoDataTextToDisplay) {
      setNoDataTextToDisplay(NoDataMessage.noDataToDisplay);
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
  >,
  searchAndStatusFilter?: {
    searchText: string;
    selectedStatus: ISelectedItem;
  }
): Promise<void> => {
  let apiColumnName = columnName;
  switch (columnName) {
    case "Name":
    case "Enw":
      apiColumnName = "Forename";
      break;
    case "Email":
    case "E-bost":
      apiColumnName = "EmailId";
      break;
    case "Invitation request date":
      apiColumnName = "InviteRequestDate";
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
    setshowInvitationConflictBanner,
    searchAndStatusFilter
  }).then((res) => {
    setLoader(false);
    setUsersTableData(res);
  });
};

export const handleSendInvite = async ({
  requestBody,
  setLoader,
  setShowInviteErrBanner,
  setDataUpdated
}: {
  requestBody: IRequestBodyType;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteErrBanner: React.Dispatch<React.SetStateAction<boolean>>;
  setDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setLoader(true);
  try {
    await postSendInvitation({
      requestBody,
      setShowInviteErrBanner
    }).then(() => {
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

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const debouncedAutosuggest = debounce(
  async (
    event: React.ChangeEvent<HTMLInputElement>,
    setSearchLoader: React.Dispatch<React.SetStateAction<boolean>>,
    setSearchSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
    setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
    searchAndStatusFilter: {
      searchText: string;
      selectedStatus: ISelectedItem;
    }
  ) => {
    const { value } = event.target;
    if (!value || value.trim().length === 0) {
      setSearchLoader(false);
      return;
    }
    try {
      setSearchLoader(true);
      setShowSearchError(false);
      let url = `/InviteUser/Autosuggest?searchTerm=${value}`;
      if (searchAndStatusFilter?.selectedStatus?.value !== "All") {
        url += `&InvitationStatus=${searchAndStatusFilter?.selectedStatus?.value}`;
      }
      const response: any = await service.get(url);
      const suggestionList = [
        {
          name: "",
          values: getValues(response?.data)
        }
      ];
      setSearchSuggestions(suggestionList);
      setSearchLoader(false);
    } catch (error) {
      setShowSearchError(true);
      setSearchLoader(false);
    }
  },
  1000
);

export const handleSearch: Function = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setSearchLoader: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,

  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
  searchAndStatusFilter: {
    searchText: string;
    selectedStatus: ISelectedItem;
  }
) => {
  setSearchTerm(event.target.value || "");
  if (event.target.value === "") {
    setSearchLoader(false);
    return undefined;
  }
  if (event?.target?.value?.length >= 2) {
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    return undefined;
  }
  return undefined;
};
