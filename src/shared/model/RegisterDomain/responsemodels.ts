export interface IRegistersDetails {
  externalId: string;
  eventStart: string;
  eventEnd: string;
  eventDescription: string;
  eventInstanceExternalId: string;
  eventTypeCode: string;
  classPeriodExternalId: string;
  group: {
    externalId: string;
    shortName: string;
  };
  room: {
    externalId: string;
    roomCode: string;
    roomName: string;
  } | null;
  subject: {
    externalId: string;
    name: string;
  };
  isCompleted: boolean;
}
