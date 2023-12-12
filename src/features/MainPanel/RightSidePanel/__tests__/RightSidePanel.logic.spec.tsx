import React from "react";
import { render, waitFor ,screen} from "@testing-library/react";
import { RightSidePanel } from "../RightSidePanel.logic";
import * as schoolDomainservices from "../../../../shared/services/schoolDomain/schoolServices";
import { IRightSidePanelProps } from "../RightSidePanelProps";
import { IGroupMemberDetailsResponse } from "../../../../shared/model/SchoolDomain/responsemodels";
import { RightSidePanelView } from "../RightSidePanel.View";
import { IRightSidePanelViewProps } from "../RightSidePanelViewProps";

const mockEventTitleMeetingTTPeriod: IRightSidePanelProps = {
  SchoolEventexternalId: "123",
  EventTitle: "Meeting",
  RoomCode: "Room A",
  EventStart: "2023-11-10T09:00:00.000Z",
  EventEnd: "2023-11-10T10:00:00.000Z",
  GroupExternalId: "00000000-0000-0000-0000-000000000000",
  EventPeriodNo: "1",
  togglePanel: jest.fn(),
  isOpen: true,
  GroupDescription: "Sample Group",
  StaffName: "John Doe",
  EventTypeCode: "TTPeriod",
  ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
};
const mockEventTitleMeeting: IRightSidePanelProps = {
  SchoolEventexternalId: "123",
  EventTitle: "Meeting",
  RoomCode: "Room A",
  EventStart: "2023-11-10T09:00:00.000Z",
  EventEnd: "2023-11-10T10:00:00.000Z",
  GroupExternalId: "00000000-0000-0000-0000-000000000000",
  EventPeriodNo: "1",
  togglePanel: jest.fn(),
  isOpen: true,
  GroupDescription: "Sample Group",
  StaffName: "John Doe",
  EventTypeCode: "TTNTPer",
  ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
  
};

const mockHealthyEvent: IRightSidePanelProps = {
  SchoolEventexternalId: "123",
  EventTitle: "Test",
  RoomCode: "Room A",
  EventStart: "2023-11-10T09:00:00.000Z",
  EventEnd: "2023-11-10T10:00:00.000Z",
  GroupExternalId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
  EventPeriodNo: "1",
  togglePanel: jest.fn(),
  isOpen: true,
  GroupDescription: "Sample Group",
  StaffName: "John Doe",
  EventTypeCode: "AttendanceSession",
  ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"     
};

const mockListofGroupExternalId: IGroupMemberDetailsResponse[] = [
  {
    membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
    pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7",
    },
    regGroup: {
      externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
      name: "7A",
    },
    personalInfo: {
      preferredForename: "Borris",
      preferredSurname: "Becker",
      preferredName: "Borris Becker",
      legalForename: "Borris",
      legalSurname: "Becker",
      legalName: "Borris Becker",
    },
    personImage: null,
  },
  {
    membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
    pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7",
    },
    regGroup: {
      externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
      name: "7C",
    },
    personalInfo: {
      preferredForename: "Harvey",
      preferredSurname: "Anderson",
      preferredName: "Harvey Anderson",
      legalForename: "Harvey",
      legalSurname: "Anderson",
      legalName: "Harvey Anderson",
    },
    personImage: null,
  }
];

const mockSortedListofGroupExternalIdBySurname: IGroupMemberDetailsResponse[] =
  [
    {
      membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
      pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
        name: "7C",
      },
      personalInfo: {
        preferredForename: "Harvey",
        preferredSurname: "Anderson",
        preferredName: "Harvey Anderson",
        legalForename: "Harvey",
        legalSurname: "Anderson",
        legalName: "Harvey Anderson",
      },
      personImage: null,
    },
    {
      membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
      pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
        name: "7A",
      },
      personalInfo: {
        preferredForename: "Borris",
        preferredSurname: "Becker",
        preferredName: "Borris Becker",
        legalForename: "Borris",
        legalSurname: "Becker",
        legalName: "Borris Becker",
      },
      personImage: null,
    }
  ];

describe("RigthSidePanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn(),
  }));

  const setLoader = jest.fn();
  const setErrCodeMessage = jest.fn();
  const setGroupMemberDetailsData = jest.fn();
  const setPupilDetailErrorCodeMessage = jest.fn();
  const setPupilSection = jest.fn();

  test("should set values if eventtitle is not break or meeting or external is not empty", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [false, setLoader])
      .mockImplementationOnce(() => [false, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);

    jest
      .spyOn(schoolDomainservices, "FetchGroupMemberDetailsData")
      .mockResolvedValue(mockListofGroupExternalId);

    render(
      <RightSidePanel
        SchoolEventexternalId={mockHealthyEvent.SchoolEventexternalId}
        EventTitle={mockHealthyEvent.EventTitle}
        RoomCode={mockHealthyEvent.RoomCode}
        EventStart={mockHealthyEvent.EventStart}
        EventEnd={mockHealthyEvent.EventEnd}
        GroupExternalId={mockHealthyEvent.GroupExternalId}
        EventPeriodNo={mockHealthyEvent.EventPeriodNo}
        togglePanel={mockHealthyEvent.togglePanel}
        isOpen={mockHealthyEvent.isOpen}
        GroupDescription={mockHealthyEvent.GroupDescription}
        StaffName={mockHealthyEvent.StaffName}
        EventTypeCode=""
        ClassPeriodExternalId={mockHealthyEvent.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent.EventInstanceExternalId}          
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith(
        mockSortedListofGroupExternalIdBySurname
      );
      expect(setPupilSection).toHaveBeenCalledWith(true);
    });
  });

  test("should set values if eventtitle is not break or meeting or external is not empty and group desc is empty", async () => {
    const mockHealthyEvent1: IRightSidePanelProps = {
      SchoolEventexternalId: "123",
      EventTitle: "Test",
      RoomCode: "Room A",
      EventStart: "2023-11-10T09:00:00.000Z",
      EventEnd: "2023-11-10T10:00:00.000Z",
      GroupExternalId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
      EventPeriodNo: "1",
      togglePanel: jest.fn(),
      isOpen: true,
      GroupDescription: "",
      StaffName: "John Doe",
      EventTypeCode: "AttendanceSession",
      ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"     
    };
    
    
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [false, setLoader])
      .mockImplementationOnce(() => [false, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);

    jest
      .spyOn(schoolDomainservices, "FetchGroupMemberDetailsData")
      .mockResolvedValue(mockListofGroupExternalId);

    render(
      <RightSidePanel
        SchoolEventexternalId={mockHealthyEvent1.SchoolEventexternalId}
        EventTitle={mockHealthyEvent1.EventTitle}
        RoomCode={mockHealthyEvent1.RoomCode}
        EventStart={mockHealthyEvent1.EventStart}
        EventEnd={mockHealthyEvent1.EventEnd}
        GroupExternalId={mockHealthyEvent1.GroupExternalId}
        EventPeriodNo={mockHealthyEvent1.EventPeriodNo}
        togglePanel={mockHealthyEvent1.togglePanel}
        isOpen={mockHealthyEvent1.isOpen}
        GroupDescription={mockHealthyEvent1.GroupDescription}
        StaffName={mockHealthyEvent1.StaffName}
        EventTypeCode="TTPeriod"
        ClassPeriodExternalId={mockHealthyEvent1.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent1.EventInstanceExternalId}          
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith(
        mockSortedListofGroupExternalIdBySurname
      );
      expect(setPupilSection).toHaveBeenCalledWith(true);
    });
  });
 

  test("should handle unsuccessful data fetch", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);

    jest
      .spyOn(schoolDomainservices, "FetchGroupMemberDetailsData")
      .mockRejectedValue(new Error());

    render(
      <RightSidePanel
        SchoolEventexternalId={mockHealthyEvent.SchoolEventexternalId}
        EventTitle={mockHealthyEvent.EventTitle}
        RoomCode={mockHealthyEvent.RoomCode}
        EventStart={mockHealthyEvent.EventStart}
        EventEnd={mockHealthyEvent.EventEnd}
        GroupExternalId={mockHealthyEvent.GroupExternalId}
        EventPeriodNo={mockHealthyEvent.EventPeriodNo}
        togglePanel={mockHealthyEvent.togglePanel}
        isOpen={mockHealthyEvent.isOpen}
        GroupDescription={mockHealthyEvent.GroupDescription}
        StaffName={mockHealthyEvent.StaffName}
        EventTypeCode={mockHealthyEvent.EventTypeCode} 
        ClassPeriodExternalId={mockHealthyEvent.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent.EventInstanceExternalId}          
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(true);
      expect(setPupilDetailErrorCodeMessage).toHaveBeenCalledWith(
        "We've experienced a technical issue that's stopped us from showing pupil information for this register. Please check back in a bit."
      );
      expect(setPupilSection).toHaveBeenCalledWith(true);

    });
  });
  test("should not set any values if EventTypecode is ttntper", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);
    render(
      <RightSidePanel
        SchoolEventexternalId={mockEventTitleMeeting.SchoolEventexternalId}
        EventTitle={mockEventTitleMeeting.EventTitle}
        RoomCode={mockEventTitleMeeting.RoomCode}
        EventStart={mockEventTitleMeeting.EventStart}
        EventEnd={mockEventTitleMeeting.EventEnd}
        GroupExternalId={mockEventTitleMeeting.GroupExternalId}
        EventPeriodNo={mockEventTitleMeeting.EventPeriodNo}
        togglePanel={mockEventTitleMeeting.togglePanel}
        isOpen={mockEventTitleMeeting.isOpen}
        GroupDescription={mockEventTitleMeeting.GroupDescription}
        StaffName={mockEventTitleMeeting.StaffName}
        EventTypeCode={mockEventTitleMeeting.EventTypeCode}   
        ClassPeriodExternalId={mockEventTitleMeeting.ClassPeriodExternalId}
        EventInstanceExternalId={mockEventTitleMeeting.EventInstanceExternalId}        
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
      expect(setPupilSection).toHaveBeenCalledWith(false);
    });
  });

  test("should not set any values if EventTypecode is ttperiod and GroupExternalId is empty", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);

    render(
      <RightSidePanel
        SchoolEventexternalId={mockEventTitleMeetingTTPeriod.SchoolEventexternalId}
        EventTitle={mockEventTitleMeetingTTPeriod.EventTitle}
        RoomCode={mockEventTitleMeetingTTPeriod.RoomCode}
        EventStart={mockEventTitleMeetingTTPeriod.EventStart}
        EventEnd={mockEventTitleMeetingTTPeriod.EventEnd}
        GroupExternalId={mockEventTitleMeetingTTPeriod.GroupExternalId}
        EventPeriodNo={mockEventTitleMeetingTTPeriod.EventPeriodNo}
        togglePanel={mockEventTitleMeetingTTPeriod.togglePanel}
        isOpen={mockEventTitleMeetingTTPeriod.isOpen}
        GroupDescription={mockEventTitleMeetingTTPeriod.GroupDescription}
        StaffName={mockEventTitleMeetingTTPeriod.StaffName}
        EventTypeCode={mockEventTitleMeetingTTPeriod.EventTypeCode} 
        ClassPeriodExternalId={mockEventTitleMeetingTTPeriod.ClassPeriodExternalId}
        EventInstanceExternalId={mockEventTitleMeetingTTPeriod.EventInstanceExternalId}        
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
      expect(setPupilSection).toHaveBeenCalledWith(false);
    });
  });

  describe('RightSidePanel View', () => {  
   
    test('renders loader when isLoader is true', () => {
      const otherEventTypeProps:IRightSidePanelViewProps = {
        SchoolEventexternalId: "123",
        EventTitle: "Test",
        EventTime:"1 | 09:00 15:30",
        StaffName:"Abc",
        Location:"Xyz",
        GroupMembersData:[],
        togglePanel:jest.fn(),
        isOpen:true,
        GroupDescription:null,
        isLoader:true,
        errCodeMessage:false,
        pupilDetailErrorCodeMessage:"error",
        isPupilSectionEnable:true,
        EventTypeCode:"AttendanceSession",
        BaseGroupId:"123",
        ClassPeriodExternalId:"123",
        EventInstanceExternalId:"123",
        EventPeriodNo:"1"
      };
      render(
        <RightSidePanelView {...otherEventTypeProps}
        />
      );
      expect(screen.getByTestId("error-loader")).toBeInTheDocument();
    })
  });
});
