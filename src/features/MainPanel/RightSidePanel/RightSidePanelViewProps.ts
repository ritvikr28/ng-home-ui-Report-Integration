import { IGroupMemberDetailsResponse } from "../../../shared/model/SchoolDomain/responsemodels";

export interface IRightSidePanelViewProps {
    SchoolEventexternalId:string
    EventTitle:string;
    EventTime:string;
    Location:string;
    GroupMembersData:IGroupMemberDetailsResponse[];
    togglePanel: (SchoolEventexternalId:string) => void;
    isOpen:boolean;
    GroupDescription:string |null;
    isLoader:boolean;
    errCodeMessage:boolean;
    pupilDetailErrorCodeMessage:string;
    StaffName:string |null;
  }

