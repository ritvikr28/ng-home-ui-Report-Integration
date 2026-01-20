import {
  ISelectedItem,
  ShowValAs,
  ValidationText,
  ValidationTextLevel
} from "@essnextgen/ui-kit";
import React from "react";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { envConfig } from "../../shared/utils";

export interface InviteUserProps {
  usersTableData: IInviteUserDetails[];
  setUsersTableData: React.Dispatch<React.SetStateAction<IInviteUserDetails[]>>;
  isLoader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  totalPage: number;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handlePageChange: (event: any, handlepageCount: number) => void;
  showInvitationConflictBanner: boolean;
  setshowInvitationConflictBanner: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  isSearchLoader: boolean;
  setSearchLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

export const homeurl = `${envConfig.HOME_UI_BASEURL}/adminconsole`;

export const pageSize = 40;

export interface ITableOptions {
  disabled: boolean;
  text: string;
  value: string;
}
export interface ITableBodyDataType {
  id: string;
  name: string;
  email: string;
  userType: string;
  invitationStatus: string;
  //inviteRequestDate: Date | null;
  inviteRequestDate: string;
  actions: {
    options: ITableOptions[];
  };
  isShowActionBtn?: boolean;
}
export interface TableHeader {
  text?: string;
  isShow?: boolean;
  showValAs?: ShowValAs;
  isTextTruncate?: boolean;
  txtTrunctLength?: number;
  columnWidth?: string;
  isHeaderTextTruncate?: boolean;
  headerTxtTrunctLength?: number;
  isColumnSorting?: boolean;
  anyComponent?: any;
  isSimpleText?: boolean;
  isColumnSortByDefault?: boolean;
  isColumnSortAscFirst?: boolean;
}
export const getTableHeadersData: TableHeader[] = [
  {
    text: "Id",
    isShow: false,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    columnWidth: "10px"
  },
  {
    text: "Name",
    isShow: true,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    columnWidth: "285px",
    headerTxtTrunctLength: 50,
    isSimpleText: true,
    isColumnSorting: true,
    isColumnSortByDefault: true
  },
  {
    text: "Email",
    isShow: true,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 17,
    isSimpleText: true,
    isColumnSorting: true,
    columnWidth: "325px"
  },
  {
    text: "User type",
    isShow: true,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 50,
    isColumnSorting: false,
    columnWidth: "165px"
  },
  {
    text: "Invitation status",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    anyComponent: (props: any) => {
      if (props === "Invitation conflict") {
        return (
          <ValidationText
            className="invite-user-status"
            text="Invitation conflict"
            textLevel={ValidationTextLevel.Warning}
          />
        );
      }
      return props;
    },

    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 50,
    isColumnSorting: false,
    columnWidth: "206px"
  }
];

export interface IInviteUserDetails {
  emailId: string;
  externalId: string;
  forename: string;
  invitationStatus: string;
  //inviteRequestDate: Date | null | undefined;
  inviteRequestDate: string;
  surname: string;
  userType: string;
  isShowActionBtn?: boolean;
  isShowCheckBox?: boolean;
  isCheckboxSelected?: boolean;
}

export interface IInviteUserData {
  data: IInviteUserDetails[];
  total?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface IPaginationOptions {
  pageNumber: number;
  pageSize: number;
  setTotalPage?: React.Dispatch<React.SetStateAction<number>>;
  setShowErrorBanner?: React.Dispatch<React.SetStateAction<boolean>>;
  setshowInvitationConflictBanner?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  columnName?: string;
  sortDirection?: boolean;
  searchAndStatusFilter?: {
    searchText: string;
    selectedStatus: ISelectedItem;
  };
  setNoDataTextToDisplay?: React.Dispatch<React.SetStateAction<string>>;
}

// eslint-disable-next-line no-shadow
export enum InvitationStatusFilterOptions {
  All = "All",
  NotInvited = "Not-invited",
  InvitationExpired = "Invitation expired",
  InvitationConflict = "Invitation conflict",
  InviteRequested = "Invite requested",
  Invited = "Invited",
  Accepted = "Accepted"
}
export interface IFilterOptions {
  id: string;
  text: InvitationStatusFilterOptions;
  value: string;
}

export const filterOptions: IFilterOptions[] = [
  {
    id: "1",
    text: InvitationStatusFilterOptions.All,
    value: InvitationStatusFilterOptions.All
  },
  {
    id: "2",
    text: InvitationStatusFilterOptions.NotInvited,
    value: "Not invited"
  },
  {
    id: "3",
    text: InvitationStatusFilterOptions.InvitationExpired,
    value: InvitationStatusFilterOptions.InvitationExpired
  },
  {
    id: "4",
    text: InvitationStatusFilterOptions.InvitationConflict,
    value: InvitationStatusFilterOptions.InvitationConflict
  },
  {
    id: "5",
    text: InvitationStatusFilterOptions.InviteRequested,
    value: InvitationStatusFilterOptions.InviteRequested
  },
  {
    id: "6",
    text: InvitationStatusFilterOptions.Invited,
    value: InvitationStatusFilterOptions.Invited
  },
  {
    id: "7",
    text: InvitationStatusFilterOptions.Accepted,
    value: InvitationStatusFilterOptions.Accepted
  }
];

export interface IPostSendInvitation {
  requestBody: IRequestBodyType;
  setShowInviteErrBanner: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IRequestBodyType {
  externalId: string[];
}

export const BulkInviteErrBanner = ({
  selectedRowItems
}: {
  selectedRowItems: IInviteUserDetails[];
}) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const emails = selectedRowItems.map((item) => item.emailId).join("; ");
  return (
    <>
      <p>
        {`${t("invitePerson.unableToInvitePersonList")}`}
      </p>
      <p>&nbsp; • &nbsp; {emails}</p>
      <p>
        {`${t("invitePerson.unableToInvitePersonListDescription")}`}
      </p>
    </>
  );
};
