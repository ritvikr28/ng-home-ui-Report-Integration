import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";
import { EventCardStatus } from "@essnextgen/ui-kit";
import { EventContainerView } from "../EventContainer.view";

describe("EventContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn(),
  }));

  test("togglePanel prop functions correctly in EventContainerView phase 2", async () => {
    const togglePanel1 = jest.fn();

    render(
      <EventContainerView
        SchoolEventexternalId="1"
        EventTitle="Title: Some description: 1"
        EventTime={{
          truncated: "08:00 AM - 09:00 AM",
          full: "2023-11-08T08:00:00 - 2023-11-08T09:00:00"
        }}
        RoomCode="A101"
        EventStartDate="2023-11-08T08:00:00"
        EventEndDate="2023-11-08T09:00:00"
        GroupExternalId="G1"
        EventPeriodNum=" 1"
        togglePanel={togglePanel1}
        isOpen={false}
        GroupDescription="Group 1"
        StaffName="John Doe"
        CoverStaffName="Brenda Peters"
        index={0}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode="TTPeriod"
        ClassPeriodExternalId="62e2f4e9-453a-4a53-a940-139a492f5f96"
        EventInstanceExternalId="9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"
        SelectedItem="1"
        EventDescription="test"
      />
    );

    fireEvent.click(screen.getByTestId("eventid0"));
    expect(togglePanel1).toHaveBeenCalledWith("1");
  });

  test("should render the component with isOpen set to true if the panel is open", () => {
    const togglePanel1 = jest.fn();

    render(
      <EventContainerView
        SchoolEventexternalId="1"
        EventTitle="Title: Some description: 1"
        EventTime={{
          truncated: "08:00 AM - 09:00 AM",
          full: "2023-11-08T08:00:00 - 2023-11-08T09:00:00"
        }}
        RoomCode="A101"
        EventStartDate="2023-11-08T08:00:00"
        EventEndDate="2023-11-08T09:00:00"
        GroupExternalId="G1"
        EventPeriodNum=" 1"
        togglePanel={togglePanel1}
        isOpen
        isOpenPanel
        GroupDescription="Group 1"
        StaffName="John Doe"
        CoverStaffName="Brenda Peters"
        index={0}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode="TTPeriod"
        ClassPeriodExternalId="62e2f4e9-453a-4a53-a940-139a492f5f96"
        EventInstanceExternalId="9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"
        SelectedItem="1"
        EventDescription="test"
      />
    );
    expect(screen.getByTestId("side-panel-header")).toBeInTheDocument();
  });
});
