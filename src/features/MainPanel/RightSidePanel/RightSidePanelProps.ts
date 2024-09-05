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
  CoverStaffName: string | null;  
  EventTypeCode:string;
  ClassPeriodExternalId:string | null;
  EventInstanceExternalId:string;
  EventDescription: string;
  ExternalId: string;
}
