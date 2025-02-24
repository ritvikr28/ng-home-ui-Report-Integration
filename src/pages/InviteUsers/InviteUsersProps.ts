import { IBreadcrumbLink, OptionsEntity, ShowValAs } from "@essnextgen/ui-kit";
import { envConfig } from "../../shared/utils";

export interface InviteUserProps 
{
  dataTestId?: string;
}

export const homeurl = `${envConfig.HOME_UI_BASEURL}/AdminConsole`;

export  const tableDataObj: any[] = [
    {
      id: "01",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    },
    {
      id: "01",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    },
    {
      id: "01",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    },
    {
      id: "01",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    },{
      id: "02",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    },{
      id: "03",
      name: "Text",
      email: "xyz.com",
      userType: "Staff",
      invitationStatus: "Not-Invited",
      actions: {
        options: [
          {
            disabled: false,
            isSelected: false,
            text: "Send Invite",
            value: "SendInvite"
          }
        ]
      }
    }
  
 ]

  export const getTableHeadersData: any[] = [
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
      isSimpleText:true,
      isColumnSorting: false
  
    },
    {
      text: "Email",
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 17,
      isSimpleText:true,
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
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 50,
      isColumnSorting: false,
      columnWidth: "206px"
    }
   
  ];
 
  export const getDefaultControlledListProps: () => any = () => ({
    id: "invite-list",
    dataTestId: "invite-list-test-id",
    resultNotFoundMessage: "No data to display",
    tableFirstColumnWidth: "56px",
    tableLastColumnWidth: "72px",
    isBreadCrumbEnable: false
    
  });

  export const breadcrumbActions :IBreadcrumbLink[] = [
    {
      active: true,
      linkName: "Home",
      path: "/"
    },
    {
      active: false,
      linkName: "Admin Console",
      path: homeurl,
    },
    {
      active: false,
      linkName: "Invite Users",
      path: "/",
    }
  ];
  
  export const  editSelectedOptions : OptionsEntity[] = [
    {
      disabled: false,
      text: 'Send invite',
      value: 'SendInvite',
      isShowDivider: false,
      isSelected:false
    }
  ]