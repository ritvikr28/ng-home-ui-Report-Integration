export interface IRightSidePanelProps {
    SchoolEventexternalId:string;
    EventTitle:string;
    RoomCode:string;
    EventStart:string;
    EventEnd:string;
    GroupExternalId:string;
    EventPeriodNo:string;
    togglePanel: (SchoolEventexternalId:string) => void;
    isOpen:boolean;
    GroupDescription:string |null;
    StaffName:string |null;

  }
