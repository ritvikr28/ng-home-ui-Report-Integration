import { EventCardStatus } from "@essnextgen/ui-kit";

export interface IEventContainerProps {
  SchoolEventexternalId: string;
  EventTitle: string;
  EventTime: any;
  RoomCode: string;
  EventStartDate: string;
  EventEndDate: string;
  EventTypeCode: string;
  EventDescription: string;
  GroupExternalId: string;
  EventPeriodNum: string;
  togglePanel: (SchoolEventexternalId: string) => void;
  GroupDescription: string | null;
  StaffName: string | null;
  CoverStaffName: string | null;
  index: number;
  EventCardColor: EventCardStatus;
  ClassPeriodExternalId: string;
  EventInstanceExternalId: string;
  SelectedItem: string;
  isOpen?: boolean;
  isOpenPanel?: boolean;
  isLoader?: boolean;
}
