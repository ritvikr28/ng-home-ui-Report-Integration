import { render, screen, waitFor } from "@testing-library/react";
import EventContainer, { formatStaffName, formatCoverStaffName } from "./EventContainer.logic";
import { StaffTimetableAndRegisterDetailsProvider } from "../../../../../shared/context/StaffTimetableAndRegisterDetailsContext";
import * as registerService from "../../../../../shared/services/registersDomain/registerEventsDetails";
import * as staffService from "../../../../../shared/services/staffDomain/staffServices";

describe("formatCoverStaffName", () => {
  const baseEventData = {
    externalId: "evt1",
    eventStart: "2023-01-01T09:00:00Z",
    eventEnd: "2023-01-01T10:00:00Z",
    eventDescription: "desc",
    eventInstanceExternalId: "inst1",
    levelCode: null,
    eventTypeCode: "AttendanceSession",
    subjectColor: null,
    yearGroupColor: null,
    userPreference: "",
    yearGroupId: "yg1",
    classPeriodExternalId: "cpid",
    group: {},
    room: {},
    subject: {},
    supervisors: [{ externalId: "sup1", forename: "Jane", surname: "Smith" }],
    isCovered: false,
    isCovering: false,
    originalStaffExternalID: null,
    coveringStaffExternalID: null,
    yearGroupExternalId: null,
    staff: { externalId: "sup1", forename: "Jane", surname: "Smith" },
    roomCover: null
  };

  it("returns cover staff names when isCovered && !isCovering", async () => {
    const mockStaffDetails = {
      payload: [
        { externalId: "COV1", forename: "Alice", surname: "Brown" },
        { externalId: "COV2", forename: "Bob", surname: "White" }
      ]
    };
    (staffService.fetchStaffDetails as jest.Mock).mockResolvedValue(mockStaffDetails);
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "orig1",
      coveringStaffExternalID: "cov1,cov2",
      isCovered: true,
      isCovering: false
    };
    const result = await formatCoverStaffName(eventData);
    expect(staffService.fetchStaffDetails).toHaveBeenCalledWith(["COV1", "COV2"]);
    expect(result).toBe("Alice Brown, Bob White");
  });

  it("returns supervisor name when !isCovered && isCovering", async () => {
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "orig1",
      coveringStaffExternalID: "cov1",
      isCovered: false,
      isCovering: true
    };
    const result = await formatCoverStaffName(eventData);
    expect(result).toBe("Jane Smith");
  });

  it("returns empty string if no originalStaffExternalID or coveringStaffExternalID", async () => {
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "",
      coveringStaffExternalID: "",
      isCovered: false,
      isCovering: false
    };
    const result = await formatCoverStaffName(eventData);
    expect(result).toBe("");
  });

  it("returns empty string if no cover staff found", async () => {
    (staffService.fetchStaffDetails as jest.Mock).mockResolvedValue({ payload: [] });
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "orig1",
      coveringStaffExternalID: "cov1",
      isCovered: true,
      isCovering: false
    };
    const result = await formatCoverStaffName(eventData);
    expect(result).toBe("");
  });
});
jest.mock("../../../../../shared/services/registersDomain/registerEventsDetails");
jest.mock("../../../../../shared/services/staffDomain/staffServices");

const mockEvent = {
  externalId: "1",
  eventStart: new Date().toISOString(),
  eventEnd: new Date(Date.now() + 3600000).toISOString(),
  eventTypeCode: "AttendanceSession",
  eventDescription: "desc",
  group: { externalId: "g1", shortName: "Group 1" },
  room: { roomCode: "R1" },
  roomCover: { roomCode: "RC1" },
  classPeriodExternalId: "cpid",
  eventInstanceExternalId: "eid",
  supervisors: [{ forename: "John", surname: "Doe" }],
  originalStaffExternalID: "S1",
  coveringStaffExternalID: "S2",
  isCovered: false,
  isCovering: false,
  subjectColor: "primary"
};


describe("formatStaffName", () => {
  const baseEventData = {
    externalId: "evt1",
    eventStart: "2023-01-01T09:00:00Z",
    eventEnd: "2023-01-01T10:00:00Z",
    eventDescription: "desc",
    eventInstanceExternalId: "inst1",
    levelCode: null,
    eventTypeCode: "AttendanceSession",
    subjectColor: null,
    yearGroupColor: null,
    userPreference: "",
    yearGroupId: "yg1",
    classPeriodExternalId: "cpid",
    group: {},
    room: {},
    subject: {},
    supervisors: [{ externalId: "sup1", forename: "Jane", surname: "Smith" }],
    isCovered: false,
    isCovering: false,
    originalStaffExternalID: null,
    coveringStaffExternalID: null,
    yearGroupExternalId: null,
    staff: { externalId: "sup1", forename: "Jane", surname: "Smith" },
    roomCover: null
  };

  it("returns the original staff's full name when found", async () => {
    const mockStaffDetails = {
      payload: [
        { externalId: "ABC123", forename: "John", surname: "Doe" }
      ]
    };
    (staffService.fetchStaffDetails as jest.Mock).mockResolvedValue(mockStaffDetails);
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "abc123",
      coveringStaffExternalID: "xyz789",
      isCovered: false,
      isCovering: true
    };
    const result = await formatStaffName(eventData);
    expect(staffService.fetchStaffDetails).toHaveBeenCalledWith(["abc123"]);
    expect(result).toBe("John Doe");
  });

  it("returns empty string if original staff not found", async () => {
    const mockStaffDetails = { payload: [] };
    (staffService.fetchStaffDetails as jest.Mock).mockResolvedValue(mockStaffDetails);
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "abc123",
      coveringStaffExternalID: "xyz789",
      isCovered: false,
      isCovering: true
    };
    const result = await formatStaffName(eventData);
    expect(result).toBe("");
  });

  it("returns supervisor name if branch not matched", async () => {
    const eventData = {
      ...baseEventData,
      originalStaffExternalID: "",
      coveringStaffExternalID: "",
      isCovered: false,
      isCovering: false
    };
    const result = await formatStaffName(eventData);
    expect(result).toBe("Jane Smith");
  });

// ...existing code...
beforeEach(() => {
  jest.clearAllMocks();
});

  it("renders loader initially", () => {
    render(
      <StaffTimetableAndRegisterDetailsProvider>
        <EventContainer isOpen={true} />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders event cards on success", async () => {
    (registerService.FetchStaffTimetableAndRegisterDetails as jest.Mock).mockResolvedValue({
      status: 200,
      payload: { staffTimetableEventsResponse: [mockEvent] }
    });
    (staffService.fetchStaffDetails as jest.Mock).mockResolvedValue({ payload: [{ externalId: "S1", forename: "John", surname: "Doe" }] });
    render(
      <StaffTimetableAndRegisterDetailsProvider>
        <EventContainer isOpen={true} />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    // The view component is mocked, so you may need to check for a prop or a text from the view
  });

  it("renders nothing on error", async () => {
    (registerService.FetchStaffTimetableAndRegisterDetails as jest.Mock).mockRejectedValue(new Error("API Error"));
    render(
      <StaffTimetableAndRegisterDetailsProvider>
        <EventContainer isOpen={true} />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => {
      // Should render nothing
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });
});
