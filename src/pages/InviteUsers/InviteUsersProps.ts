import React from "react";
import { ShowValAs, TagColor } from "@essnextgen/ui-kit";

export interface InviteUsersProps extends IusermanagementProps,
IAddUserProps{
    
  }

  export const getTableHeadersData: any[] = [
    {
      text: "Id",
      isShow: false,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      columnWidth: "56px"
    },
    {
      text: "Name",
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: true,
      isHeaderTextTruncate: true,
      columnWidth: "194.75px",
      headerTxtTrunctLength: 50,
      isSimpleText:true,
      isColumnSorting: false
  
    },
    {
      text: "Email address",
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: true,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 17,
      isSimpleText:true,
      isColumnSorting: false,
      columnWidth: "194.75px"
    },
    {
      text: "Permission roles",
      isShow: true,
      showValAs: ShowValAs.TextWithTag,
      isTextTruncate: true,
      alignSpecific:true,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 50,
      isColumnSorting: false,
      columnWidth: "194.75px"
    },
    {
      text: "Associated schools",
      isShow: true,
      showValAs: ShowValAs.TextWithTag,
      isTextTruncate: true,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 50,
      alignSpecific:true,
      isColumnSorting: false,
      columnWidth: "194.75px"
    },
    {
      text: "Status",
      isShow: true,
      columnWidth: "98px",
      showValAs: ShowValAs.Tag,
      statusColors: { Active: TagColor.Success, Inactive: TagColor.Neutral },
      isTextTruncate: false,
      isColumnSorting: false
    },
    {
      text: "Invitation",
      isShow: true,
      showValAs: ShowValAs.Text,
      txtTrunctLength: 12,
      isColumnSorting: false,
      isTextTruncate: false,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 50,
      columnWidth: "105px"
    }
  ];
  export interface IusermanagementProps {
    heading?: string;
    subHeading?: string;

    enableSearch?:boolean
  }

  export interface IAddUserProps {
    sidePanelTle?: string;
    hdleOpenSidePanel?: (e: React.SyntheticEvent) => void;
    hdleCloseSidePanel?: (e: React.SyntheticEvent) => void;
    
  }

  export const getDefaultControlledListProps: () => any = () => ({
    id: "usermanagment-list",
    dataTestId: "usermanagment-list-test-id",
    resultNotFoundMessage: "No data to display",
    tableFirstColumnWidth: "56px",
    tableLastColumnWidth: "72px",
    isBreadCrumbEnable: true,
    addEventBtnTitle: "Add new user",
    secondaryButtonTitle: "Cancel"
  });