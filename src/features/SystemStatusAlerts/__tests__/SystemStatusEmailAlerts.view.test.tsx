import React from "react";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { fetchEmailAlertStatus, systemStatusOverflowMenuOutSideClickHandler } from "../SystemStatusAlerts/SystemStatusService";
import SystemStatusAlertsView from "../SystemStatusAlerts/SystemStatusAlerts.view";

// Mock SystemStatusService
jest.mock("../SystemStatusAlerts/SystemStatusService", () => ({
  fetchEmailAlertStatus: jest.fn(),
 
  systemStatusOverflowMenuOutSideClickHandler: jest.fn(),
}));

// Mock useMediaQuery from UI kit
jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(() => false),
}));

// Mock NotifyExceptionView
jest.mock("../SystemStatusAlerts/NotifyException.view", () => () => (
  <div data-testid="notify-exception-view">Notify Exception View</div>
));

const mockFetchEmailAlertStatus = fetchEmailAlertStatus as jest.Mock;

const mockOutsideClickHandler = systemStatusOverflowMenuOutSideClickHandler as jest.Mock;

describe("SystemStatusAlertsView Component", () => {
  const mockResponse = {
    listenerData: {
      listenerStatus: "Live",
      eMailAlert: false,
    },
    ssmHostData: {
      ssmHostStatus: "Not Live",
      eMailAlert: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    // Provide empty implementation for handler
    mockOutsideClickHandler.mockImplementation(() => {});
  });

  it("displays correct table status and label for Red, Yellow, and Green", async () => {
    // Red & Green state
    mockFetchEmailAlertStatus.mockResolvedValueOnce({
      listenerData: { listenerStatus: "Not Live", eMailAlert: true },
      ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
    });

    render(<SystemStatusAlertsView />);

    await waitFor(() => {
      expect(screen.getByText("SystemStatus_T.Fail")).toBeInTheDocument(); // Red
      expect(screen.getByText("SystemStatus_T.Live")).toBeInTheDocument(); // Green
    });

    // Yellow fallback (no data)
    mockFetchEmailAlertStatus.mockResolvedValueOnce(null);

    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.getAllByText("SystemStatus_T.NoData")).toHaveLength(2);
    });
  });

  it("renders '-' for email alerts if isErrorResponse is true", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(null);

    render(<SystemStatusAlertsView />);

    await waitFor(() => {
      const emailAlerts = screen.getAllByText("-");
      expect(emailAlerts.length).toBeGreaterThan(0);
    });
  });

  it("toggles overflow menu on multiple clicks", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

    render(<SystemStatusAlertsView />);
    await waitFor(() =>
      expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument()
    );

    const button = screen.getAllByLabelText("Overflow menu")[0];

    // Open
    fireEvent.click(button);
    expect(screen.getByTestId("childcare-overflow-menu")).toBeInTheDocument();

    // Close
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId("childcare-overflow-menu")).not.toBeInTheDocument();
    });
  });

  it("renders empty paragraph when alert ID is not 1 or 2", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce({
      listenerData: null,
      ssmHostData: null,
    });

    render(<SystemStatusAlertsView />);

    await waitFor(() =>
      expect(screen.getAllByLabelText("Overflow menu")[0]).toBeInTheDocument()
    );

    fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);

    await waitFor(() =>
      expect(screen.getByText("SystemStatus_T.View")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("SystemStatus_T.View"));

    await waitFor(() => {
      expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    });
  });
});
