import { EventCardStatus } from "@essnextgen/ui-kit";
import {getBackgroundColor} from "../colors";
import { IStaffTimeTableEventsResponse } from "../../model/SchoolDomain/responsemodels";

const mockProps:IStaffTimeTableEventsResponse=
    {
      externalId: "90ec7084-d8fa-4802-9021-1813ce1c48e9",
      eventStart: "2023-11-02T08:45:00",
      eventEnd: "2023-11-02T09:15:00",
      eventDescription: "1Thu:1",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",   
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Science"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,  
    };
describe("Colors tests", () => {
    test("should return color when event type code is TTPeriod and user preference is yeargroup", () => {       
    const result: string =getBackgroundColor(mockProps);       
    expect(result).toBe(`${EventCardStatus.OUTSTANDING}`);        
    });
    test("should return color when event type code is TTPeriod and user preference is yeargroup is primary", () => {
     mockProps.yearGroupColor = "primary" ;
     const result: string =getBackgroundColor(mockProps);        
 
      expect(result).toBe(`${EventCardStatus.PRIMARY}`);
     
    });
    test("should return primary color when event type code is TTPeriod and user preference is yeargroup and yeargroupcolor is null", () => {
     mockProps.yearGroupColor = null ;
     const result: string =getBackgroundColor(mockProps);        
 
      expect(result).toBe(`${EventCardStatus.PRIMARY}`);
     
    });
    test("should return primary color when event type code is TTPeriod and user preference is subjectgroup and subjectcolor is null", () => {
    mockProps.userPreference="subjectColor"
     mockProps.subjectColor = null ;
     const result: string =getBackgroundColor(mockProps);        
 
      expect(result).toBe(`${EventCardStatus.PRIMARY}`);
     
    });
    test("should return primary color when event type code is TTPeriod and user preference is subjectgroup and subjectcolor is not null", () => {
     mockProps.userPreference="subjectColor"
      mockProps.subjectColor = "primary" ;
      const result: string =getBackgroundColor(mockProps);        
  
       expect(result).toBe(`${EventCardStatus.PRIMARY}`);
      
     });
    test("should return primary color when event type code is TTPeriod and user preference is subjectgroup and subjectcolor is not null and not primary or neutral", () => {
        mockProps.userPreference="subjectColor"
        mockProps.subjectColor = "SUPPORTING-HIGHLIGHT" ;
        const result: string =getBackgroundColor(mockProps);        
        expect(result).toBe(`${EventCardStatus.HIGHLIGHT}`);
          
     });
    test("should return neutral color when event type code is TTNTPer", () => {
     mockProps.eventTypeCode="TTNTPer";
      const  result: string =getBackgroundColor(mockProps); 
    expect(result).toBe(`${EventCardStatus.NEUTRAL}`);
        
    });
    test("should return neutral color when event type code is TTPeriod and base group externalId is 00000000-0000-0000-0000-000000000000 and group shortName is not empty", () => {
     mockProps.eventTypeCode="TTPeriod";
     mockProps.group.externalId="00000000-0000-0000-0000-000000000000";
     mockProps.group.shortName="10x/Sc2";
     const result: string =getBackgroundColor(mockProps);
    expect(result).toBe(`${EventCardStatus.NEUTRAL}`);
     
    });
    test("should return primary color when event type code is TTPeriod and base group externalId is 00000000-0000-0000-0000-000000000000 and group shortName is empty", () => {
     mockProps.eventTypeCode="TTPeriod";
     mockProps.group.externalId="00000000-0000-0000-0000-000000000000";
     mockProps.group.shortName= '';
     const result: string =getBackgroundColor(mockProps);
     expect(result).toBe(`${EventCardStatus.NEUTRAL}`);
     
    });
    

});