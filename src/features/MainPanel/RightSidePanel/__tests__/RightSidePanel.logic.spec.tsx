import React from "react";
import { render, waitFor } from "@testing-library/react";
import { RightSidePanel } from "../RightSidePanel.logic";
import * as schoolDomainservices from "../../../../shared/services/schoolDomain/schoolServices";
import { IRightSidePanelProps } from "../RightSidePanelProps";
import { IGroupMemberDetailsResponse } from "../../../../shared/model/SchoolDomain/responsemodels";

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
  EventTypeCode: "TTPeriod"  
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
  EventTypeCode: "TTNTPer"
  
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
  EventTypeCode: "ttperiod"  
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

  test("should set values if eventtitle is not break or meeting or external is not empty", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [false, setLoader])
      .mockImplementationOnce(() => [false, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData]);

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
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith(
        mockSortedListofGroupExternalIdBySurname
      );
    });
  });
 

  test("should handle unsuccessful data fetch", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData]);

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
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(true);
      expect(setPupilDetailErrorCodeMessage).toHaveBeenCalledWith(
        "We've experienced a technical issue that's stopped us from showing pupil information for this register. Please check back in a bit."
      );
    });
  });
  test("should not set any values if EventTypecode is ttntper", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData]);
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
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
    });
  });

  test("should not set any values if EventTypecode is ttperiod and GroupExternalId is empty", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData]);
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
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
    });
  });
});
