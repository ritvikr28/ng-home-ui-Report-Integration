export interface IStaffTimeTableEventsResponse {
    externalId: string;
    eventStart: string;
    eventEnd: string;
    eventDescription: string;
    eventInstanceExternalId:string;
    levelCode?: string | null;
    eventTypeCode: string;
    subjectColor: string | null;
    yearGroupColor: string | null;
    userPreference: string;
    yearGroupId: string;
    classPeriodExternalId:string;
    group: {
        externalId:string;
        shortName:string;
    }
    room:{
        externalId:string;
        roomCode:string;
        roomName:string;
    }
    subject:{
        externalId:string;
        name:string;
    }
    supervisors: {
      externalId: string;
      forename: string;
      surname: string;
      preferredForename?: string | null; 
      preferredSurname?: string | null;
    }[]
    isCovered:boolean |null;
    isCovering:boolean |null;
    originalStaffExternalID?: string | null;
    coveringStaffExternalID: string | null;  
  }
  
  export interface IGroupMemberDetailsResponse {
    membershipId: string;
    pupilExternalId: string;
    startDate: string;
    endDate: string;
    yearGroup: {
        externalId:string;
        name:string;
    }
    regGroup: {
        externalId: string,
        name: string
    }
    personalInfo:{
        preferredForename:string;
        preferredSurname:string;
        preferredName:string;
        legalForename:string;
        legalSurname:string;
        legalName:string;
    }
    personImage:{
        organisationId:string;
        personExternalId:string;
        photoDate:string|null;
        createdDate:string|null;
        createdBy:string|null;
        updatedDate:string|null;
        updatedBy:string|null;
        imagePath:string|null;
        isThumbnailPresent:boolean;
    }|null;
  } 