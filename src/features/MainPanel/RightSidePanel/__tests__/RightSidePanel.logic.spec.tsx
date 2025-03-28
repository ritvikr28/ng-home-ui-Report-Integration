import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
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
  CoverStaffName: "Brenda Peters",
  EventTypeCode: "TTPeriod",
  ClassPeriodExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
  EventDescription: "test"
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
  CoverStaffName: "Brenda Peters",
  EventTypeCode: "TTNTPer",
  ClassPeriodExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
  EventDescription: "test"
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
  CoverStaffName: "Brenda Peters",
  EventTypeCode: "AttendanceSession",
  ClassPeriodExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
  EventInstanceExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
  EventDescription: "test"
};
const mockNullClassViewEvent: IRightSidePanelProps = {
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
  CoverStaffName: "Brenda Peters",
  EventTypeCode: "AttendanceSession",
  ClassPeriodExternalId: null,
  EventInstanceExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
  EventDescription: "test"
};
const mockListofGroupExternalId: IGroupMemberDetailsResponse[] = [
  {
    membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
    pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7"
    },
    regGroup: {
      externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
      name: "7A"
    },
    personalInfo: {
      preferredForename: "Borris",
      preferredSurname: "Becker",
      preferredName: "Borris Becker",
      legalForename: "Borris",
      legalSurname: "Becker",
      legalName: "Borris Becker"
    },
    personImage: null
  },
  {
    membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
    pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7"
    },
    regGroup: {
      externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
      name: "7C"
    },
    personalInfo: {
      preferredForename: "Harvey",
      preferredSurname: "Anderson",
      preferredName: "Harvey Anderson",
      legalForename: "Harvey",
      legalSurname: "Anderson",
      legalName: "Harvey Anderson"
    },
    personImage: null
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
        name: "Year  7"
      },
      regGroup: {
        externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
        name: "7C"
      },
      personalInfo: {
        preferredForename: "Harvey",
        preferredSurname: "Anderson",
        preferredName: "Harvey Anderson",
        legalForename: "Harvey",
        legalSurname: "Anderson",
        legalName: "Harvey Anderson"
      },
      personImage: null
    },
    {
      membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
      pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7"
      },
      regGroup: {
        externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
        name: "7A"
      },
      personalInfo: {
        preferredForename: "Borris",
        preferredSurname: "Becker",
        preferredName: "Borris Becker",
        legalForename: "Borris",
        legalSurname: "Becker",
        legalName: "Borris Becker"
      },
      personImage: null
    }
  ];
// handleClassViewClick.js
export const handleClassViewClick = (params: {
  ClassPeriodExternalId: any;
  EventDescription: any;
  GroupExternalId: any;
  ExternalId: any;
  envConfig: any;
  setClassViewURL: any;
}) => {
  const {
    ClassPeriodExternalId,
    EventDescription,
    GroupExternalId,
    ExternalId,
    envConfig,
    setClassViewURL
  } = params;

  const classPeriodOrSessionId =
    ClassPeriodExternalId === null ? EventDescription : ClassPeriodExternalId;

  const classViewUrl = `${envConfig.SEATING_PLAN_CLASS_VIEW_URL}/classview/select-seating-plan/${GroupExternalId}/${classPeriodOrSessionId}/${ExternalId}`;
  setClassViewURL(classViewUrl);
};

describe("RigthSidePanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn()
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
        CoverStaffName={mockHealthyEvent.CoverStaffName}
        EventTypeCode={mockHealthyEvent.EventTypeCode}
        ClassPeriodExternalId={mockHealthyEvent.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent.EventInstanceExternalId}
        EventDescription={mockHealthyEvent.EventDescription}
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
      GroupExternalId: "00000000-0000-0000-0000-000000000000",
      EventPeriodNo: "1",
      togglePanel: jest.fn(),
      isOpen: true,
      GroupDescription: "",
      StaffName: "John Doe",
      CoverStaffName: "Brenda Peters",
      EventTypeCode: "AttendanceSession",
      ClassPeriodExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      EventInstanceExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      EventDescription: "test"
    };

    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [false, setLoader])
      .mockImplementationOnce(() => [false, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [false, setPupilSection]);

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
        CoverStaffName={mockHealthyEvent1.CoverStaffName}
        EventTypeCode="TTPeriod"
        ClassPeriodExternalId={mockHealthyEvent1.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent1.EventInstanceExternalId}
        EventDescription={mockHealthyEvent1.EventDescription}
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
      expect(setPupilSection).toHaveBeenCalledWith(false);
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
        CoverStaffName={mockHealthyEvent.CoverStaffName}
        EventTypeCode={mockHealthyEvent.EventTypeCode}
        ClassPeriodExternalId={mockHealthyEvent.ClassPeriodExternalId}
        EventInstanceExternalId={mockHealthyEvent.EventInstanceExternalId}
        EventDescription={mockHealthyEvent.EventDescription}
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
        CoverStaffName={mockEventTitleMeeting.CoverStaffName}
        EventTypeCode={mockEventTitleMeeting.EventTypeCode}
        ClassPeriodExternalId={mockEventTitleMeeting.ClassPeriodExternalId}
        EventInstanceExternalId={mockEventTitleMeeting.EventInstanceExternalId}
        EventDescription={mockEventTitleMeeting.EventDescription}
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
        SchoolEventexternalId={
          mockEventTitleMeetingTTPeriod.SchoolEventexternalId
        }
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
        CoverStaffName={mockEventTitleMeetingTTPeriod.CoverStaffName}
        EventTypeCode={mockEventTitleMeetingTTPeriod.EventTypeCode}
        ClassPeriodExternalId={
          mockEventTitleMeetingTTPeriod.ClassPeriodExternalId
        }
        EventInstanceExternalId={
          mockEventTitleMeetingTTPeriod.EventInstanceExternalId
        }
        EventDescription={mockEventTitleMeetingTTPeriod.EventDescription}
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
      expect(setErrCodeMessage).toHaveBeenCalledWith(false);
      expect(setGroupMemberDetailsData).toHaveBeenCalledWith([]);
      expect(setPupilSection).toHaveBeenCalledWith(false);
    });
  });

  test("class period externalID", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setLoader])
      .mockImplementationOnce(() => [true, setErrCodeMessage])
      .mockImplementationOnce(() => ["", setPupilDetailErrorCodeMessage])
      .mockImplementationOnce(() => [[], setGroupMemberDetailsData])
      .mockImplementationOnce(() => [true, setPupilSection]);

    render(
      <RightSidePanel
        SchoolEventexternalId={mockNullClassViewEvent.SchoolEventexternalId}
        EventTitle={mockNullClassViewEvent.EventTitle}
        RoomCode={mockNullClassViewEvent.RoomCode}
        EventStart={mockNullClassViewEvent.EventStart}
        EventEnd={mockNullClassViewEvent.EventEnd}
        GroupExternalId={mockNullClassViewEvent.GroupExternalId}
        EventPeriodNo={mockNullClassViewEvent.EventPeriodNo}
        togglePanel={mockNullClassViewEvent.togglePanel}
        isOpen={mockNullClassViewEvent.isOpen}
        GroupDescription={mockNullClassViewEvent.GroupDescription}
        StaffName={mockNullClassViewEvent.StaffName}
        CoverStaffName={mockNullClassViewEvent.CoverStaffName}
        EventTypeCode={mockNullClassViewEvent.EventTypeCode}
        ClassPeriodExternalId={mockNullClassViewEvent.ClassPeriodExternalId}
        EventInstanceExternalId={mockNullClassViewEvent.EventInstanceExternalId}
        EventDescription={mockNullClassViewEvent.EventDescription}
      />
    );
    await waitFor(() => {
      expect(setLoader).toHaveBeenCalledWith(false);
    });
  });
  describe("RightSidePanel View", () => {
    test("renders loader when isLoader is true", () => {
      const otherEventTypeProps: IRightSidePanelViewProps = {
        SchoolEventexternalId: "123",
        EventTitle: "Test",
        EventTime: "1 | 09:00 15:30",
        StaffName: "Abc",
        CoverStaffName: "Brenda Peters",
        Location: "Xyz",
        GroupMembersData: [],
        togglePanel: jest.fn(),
        isOpen: true,
        GroupDescription: null,
        isLoader: true,
        errCodeMessage: false,
        pupilDetailErrorCodeMessage: "error",
        isPupilSectionEnable: true,
        EventTypeCode: "AttendanceSession",
        BaseGroupId: "123",
        ClassPeriodExternalId: "123",
        EventInstanceExternalId: "123",
        EventPeriodNo: "1",
        handleClassViewClick: jest.fn(),
        classViewURL: ""
      };
      render(<RightSidePanelView {...otherEventTypeProps} />);
      expect(screen.getByTestId("error-loader")).toBeInTheDocument();
    });
  });
});
describe("handleClassViewClick", () => {
  let setClassViewURL: jest.Mock<any, any>;
  const envConfig = {
    SEATING_PLAN_CLASS_VIEW_URL: "http://example.com"
  };

  beforeEach(() => {
    setClassViewURL = jest.fn();
  });

  test("should use ClassPeriodExternalId when it is not null", () => {
    const params = {
      ClassPeriodExternalId: "CP123",
      EventDescription: "EventA",
      GroupExternalId: "Group1",
      ExternalId: "Ext1",
      envConfig,
      setClassViewURL
    };

    handleClassViewClick(params);

    expect(setClassViewURL).toHaveBeenCalledWith(
      "http://example.com/classview/select-seating-plan/Group1/CP123/Ext1"
    );
  });

  test("should use EventDescription when ClassPeriodExternalId is null", () => {
    const params = {
      ClassPeriodExternalId: null,
      EventDescription: "EventA",
      GroupExternalId: "Group1",
      ExternalId: "Ext1",
      envConfig,
      setClassViewURL
    };

    handleClassViewClick(params);

    expect(setClassViewURL).toHaveBeenCalledWith(
      "http://example.com/classview/select-seating-plan/Group1/EventA/Ext1"
    );
  });

  // test('should handle undefined ClassPeriodExternalId correctly', () => {
  //     const params = {
  //         ClassPeriodExternalId: undefined,
  //         EventDescription: 'EventA',
  //         GroupExternalId: 'Group1',
  //         ExternalId: 'Ext1',
  //         envConfig,
  //         setClassViewURL
  //     };

  //     handleClassViewClick(params);

  //     expect(setClassViewURL).toHaveBeenCalledWith('http://example.com/classview/select-seating-plan/Group1/EventA/Ext1');
  // });
});
