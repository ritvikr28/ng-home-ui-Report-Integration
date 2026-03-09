import React from "react";
import { ISelectedItem, Suggestion } from "@essnextgen/ui-kit";
import { service } from "../../shared/utils/api-service";
import {
  IInviteUserData,
  IInviteUserDetails,
  InvitationStatusFilterOptions,
  InviteUsersSortingOptions,
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
  }: IPaginationOptions = props;

  const searchTerm: string | undefined = searchAndStatusFilter?.searchText;
  const selectedStatus: ISelectedItem | undefined = searchAndStatusFilter?.selectedStatus;

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

export const postSendInvitation: (props: IPostSendInvitation) => Promise<any> = async (props: IPostSendInvitation) => {
  try {
    const url = `InviteUser/SendInvitation`;
    const postReqBody: IRequestBodyType = props.requestBody;
    const response: any = await service.post(url, postReqBody);
    return response?.data;
  } catch (error) {
    console.error("Error sending invitation:", error);
    props.setShowInviteErrBanner(true);
    throw error;
  }
};

function formatDate(dateString: Date): string | undefined {
  if (dateString === undefined) {
    return undefined;
  }
  if (dateString === null) {
    return "";
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const fetchInviteUserDetails: (props: IPaginationOptions) => Promise<any[]> = async (props: IPaginationOptions) => {
  const {
    pageSize,
    setTotalPage,
    setShowErrorBanner,
    setshowInvitationConflictBanner,
    setshowInvitationRequestBanner,
    setNoDataTextToDisplay
  }: IPaginationOptions = props;
  try {
    const InviteUsersData: any = await getUsersData(props);

    if (setshowInvitationConflictBanner) {
      setshowInvitationConflictBanner(
        InviteUsersData[0]?.payload.some(
          (x: any) => x?.invitationStatus === "Invite conflict"
        )
      );
    }

    if (setshowInvitationRequestBanner) {
      setshowInvitationRequestBanner(
        InviteUsersData[0]?.payload.some(
          (x: any) => x?.invitationStatus === "Invite requested"
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
        inviteRequestDate: formatDate(item?.inviteRequestDate),
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

export const inviteUsersSorting: (options: InviteUsersSortingOptions) => Promise<void> = async (
  options: InviteUsersSortingOptions
): Promise<void> => {
  const {
    // columnName,
    // newDirection,
    stateSetters: {
      setSortDirection,
      setSortBy,
      setUsersTableData,
      setLoader,
      setShowErrorBanner,
      setshowInvitationConflictBanner,
      setshowInvitationRequestBanner
    },
    pagination: { pageNumber, pageSize }
    // searchAndStatusFilter,
  }: any = options;

  let apiColumnName: string = options.columnName;
  switch (apiColumnName) {
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
      apiColumnName = options.columnName;
      break;
  }
  setSortBy(apiColumnName);
  setSortDirection(options.newDirection);
  setLoader(true);
  fetchInviteUserDetails({
    pageNumber,
    pageSize,
    columnName: apiColumnName,
    sortDirection: options.newDirection,
    setShowErrorBanner,
    setshowInvitationConflictBanner,
    setshowInvitationRequestBanner,
    searchAndStatusFilter: options.searchAndStatusFilter
  }).then((res) => {
    setLoader(false);
    setUsersTableData(res);
  });
};

export const handleSendInvite: ({ requestBody, setLoader, setShowInviteErrBanner, setDataUpdated }: {
  requestBody: IRequestBodyType;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteErrBanner: React.Dispatch<React.SetStateAction<boolean>>;
  setDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => Promise<void> = async ({
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
    const { id, selectedCheckBoxIds, setSelectedCheckBoxIds }: { id: string, selectedCheckBoxIds: string[], setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>> } = props;
    const updatedCheckBoxIds: string[] = [...selectedCheckBoxIds];
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
    const { usersTableData, selectedCheckBoxIds, setUsersTableData }: { usersTableData: IInviteUserDetails[]; selectedCheckBoxIds: string[]; setUsersTableData: React.Dispatch<React.SetStateAction<IInviteUserDetails[]>> } = props;
    if (usersTableData.length > 0) {
      const updatedData: any[] = usersTableData.map((user: any) => ({
        ...user,
        isCheckboxSelected: selectedCheckBoxIds.includes(user.id)
      }));
      setUsersTableData(updatedData);
    }
  };

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (this: any, ...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const debouncedAutosuggest: (this: any, event: React.ChangeEvent<HTMLInputElement>, setSearchLoader: React.Dispatch<React.SetStateAction<boolean>>, setSearchSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>, setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>, searchAndStatusFilter: {
  searchText: string;
  selectedStatus: ISelectedItem;
}) => void = debounce(
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
    const { value }: { value: string } = event.target;
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
      const suggestionList: {
        name: string;
        values: {
          text: string;
          props: {
            externalId: string;
            name: string;
          };
          value: JSX.Element;
        }[];
      }[] = [
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
