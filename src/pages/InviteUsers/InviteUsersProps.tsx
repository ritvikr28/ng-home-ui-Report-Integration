import {
  IBreadcrumbLink,
  OptionsEntity,
  ShowValAs,
  ValidationText,
  ValidationTextLevel
} from "@essnextgen/ui-kit";
import React from "react";
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
    isColumnSorting: true
  },
  {
    text: "Email",
    isShow: true,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 17,
    isSimpleText: true,
    isColumnSorting: false,
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
    isColumnSorting: true,
    columnWidth: "206px"
  }
];

export const breadcrumbActions: IBreadcrumbLink[] = [
  {
    active: true,
    linkName: "Home",
    path: "/"
  },
  {
    active: false,
    linkName: "Admin Console",
    path: homeurl,
    isExternalLink: true
  },
  {
    active: false,
    linkName: "Invite Users",
    path: "/"
  }
];

export const editSelectedOptions: OptionsEntity[] = [
  {
    disabled: false,
    text: "Send invite",
    value: "SendInvite",
    isShowDivider: false,
    isSelected: false
  }
];

export interface IInviteUserDetails {
  emailId: string;
  externalId: string;
  forename: string;
  invitationStatus: string;
  surname: string;
  userType: string;
  isShowActionBtn?: boolean;
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
}

// eslint-disable-next-line no-shadow
export enum InvitationStatusFilterOptions {
  All = "All",
  NotInvited = "Not-invited",
  InvitationExpired = "Invitation expired",
  InvitationConflict = "Invitation conflict",
  Invited = "Invited",
  Accepted = "Accepted"
}
export interface IFilterOptions {
  id: string;
  text: InvitationStatusFilterOptions;
  value: InvitationStatusFilterOptions;
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
    value: InvitationStatusFilterOptions.NotInvited
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
    text: InvitationStatusFilterOptions.Invited,
    value: InvitationStatusFilterOptions.Invited
  },
  {
    id: "6",
    text: InvitationStatusFilterOptions.Accepted,
    value: InvitationStatusFilterOptions.Accepted
  }
];
