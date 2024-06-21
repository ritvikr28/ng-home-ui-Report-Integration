import { EventCardStatus } from "@essnextgen/ui-kit";
import { IStaffTimeTableEventsResponse } from "../model/SchoolDomain/responsemodels";

export const getBackgroundColor = (
    data: IStaffTimeTableEventsResponse
  ) => {   
    let backgroundColor; 
    const { userPreference, yearGroupColor, subjectColor } = data as {
        userPreference: string;
        yearGroupColor: string;
        subjectColor: string;
      };
      /* istanbul ignore next */
      if (
        data.eventTypeCode === 'TTNTPer' ||
        (data.eventTypeCode === 'TTPeriod' &&
        data?.group?.externalId === '00000000-0000-0000-0000-000000000000' &&
          (data?.group?.shortName !== '' || data?.group?.shortName  !== null))
      )
      {
        backgroundColor= EventCardStatus.NEUTRAL;
      }
      else if(data.coveringStaffExternalID && (data.isCovered || data.isCovering))
      {
        backgroundColor= EventCardStatus.PRIMARY800;
      }
      else {
        /* istanbul ignore next */
         backgroundColor  =
        /* eslint-disable */
        userPreference === 'yeargroup'
          ? yearGroupColor === null
            ? EventCardStatus.PRIMARY
            : (yearGroupColor.split("-")[1] 
            ? (yearGroupColor.split("-")[1].toLowerCase() as EventCardStatus)
             : (yearGroupColor.split("-")[0].toLowerCase() as EventCardStatus))
          : subjectColor === null
          ? EventCardStatus.PRIMARY
          : (subjectColor.split("-")[1]
          ? (subjectColor.split("-")[1].toLowerCase() as EventCardStatus)
          : (subjectColor.split("-")[0].toLowerCase() as EventCardStatus))
          /* eslint-enable  */
      }
      return backgroundColor;
  };