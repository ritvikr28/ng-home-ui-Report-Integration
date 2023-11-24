import { EventCardStatus } from "@essnextgen/ui-kit";

export interface IEventContainerProps {
    SchoolEventexternalId:string;
    EventTitle:string;
    EventTime:string;
    RoomCode:string;
    EventStartDate:string;
    EventEndDate:string;
    EventTypeCode:string;
    GroupExternalId:string;    
    EventPeriodNum:string;
    togglePanel: (SchoolEventexternalId:string) => void;
    isOpen:boolean;
    GroupDescription:string |null;
    StaffName:string |null;
    index:number;
    EventCardColor: EventCardStatus;
    ClassPeriodExternalId:string;
    EventInstanceExternalId:string;
  }
