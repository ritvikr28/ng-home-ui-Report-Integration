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
    group:IEventGroupData
    room:IEventRoomData
    subject:IEventSubjectData
    supervisors: IEventSupervisorsData[]
    isCovered:boolean |null;
    isCovering:boolean |null;
    originalStaffExternalID?: string | null;
    coveringStaffExternalID: string | null;
    yearGroupExternalId: string | null;
    staff: IEventSupervisorsData;
    roomCover: IEventRoomData | null;   
  }
  export interface IEventGroupData {
     externalId:string;
     shortName?:string;
  }
  export interface IEventRoomData {
        externalId:string;
        roomCode:string;
        roomName:string;
  }

  export interface IEventSubjectData {
        externalId:string;
        name:string;
  }

  export interface IEventSupervisorsData {
        externalId: string;
        forename: string;
        surname: string;
        preferredForename?: string | null; 
        preferredSurname?: string | null;
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

export interface ISchoolNameDataResponse {
    externalId: string;
    schoolName: string;
    isSchoolPrimary:boolean;
  }