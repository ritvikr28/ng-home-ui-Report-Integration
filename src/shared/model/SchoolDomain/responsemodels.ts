export interface IStaffTimeTableEventsResponse {
    externalId: string;
    startdate: string;
    enddate: string;
    eventDescription: string;
    levelCode: string;
    eventtype: string;
    subjectColor: string;
    yearGroupColor: string;
    userPreference: string;
    yearGroupId: string;
    group: {
        externalId:string;
        description:string;
    }
    room:{
        externalId:string;
        code:string;
        description:string;
    }
    subject:{
        externalId:string;
        name:string;
    }
    supervisors: {
      externalId: string;
      forename: string;
      surname: string;
      preferredForename: string;
      preferredSurname: string;
    }[]
    isCovered:boolean |null
    isCovering:boolean |null
    originalStaffExternalID:string
  } 