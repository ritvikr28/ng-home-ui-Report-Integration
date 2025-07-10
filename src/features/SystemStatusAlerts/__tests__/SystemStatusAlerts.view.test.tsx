import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { fetchEmailAlertStatus , systemStatusOverflowMenuOutSideClickHandler } from "../SystemStatusAlerts/SystemStatusService";
import SystemStatusAlertsView from "../SystemStatusAlerts/SystemStatusAlerts.view";


jest.mock("../SystemStatusAlerts/SystemStatusService", () => ({
  fetchEmailAlertStatus: jest.fn()
  
}));

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(() => false),
}));

jest.mock("../SystemStatusAlerts/NotifyException.view", () => () => (
  <div data-testid="notify-exception-view">Notify Exception View</div>
));
jest.mock("../SystemStatusAlerts/SystemStatusService", () => ({
  fetchEmailAlertStatus: jest.fn(),

  systemStatusOverflowMenuOutSideClickHandler:jest.fn()
}));

describe("SystemStatusAlertsView Component", () => {
  const mockFetchEmailAlertStatus = fetchEmailAlertStatus as jest.Mock;

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
  });

  it("renders loading state initially", () => {
    render(<SystemStatusAlertsView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders alerts after successful fetch", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

    render(<SystemStatusAlertsView />);

    await waitFor(() => {
      expect(screen.queryByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
      expect(screen.queryByText("SystemStatus_T.SSMPackage")).toBeInTheDocument();
    });
  });

  it("renders NotifyExceptionView when error handled", async () => {
    mockFetchEmailAlertStatus.mockImplementationOnce((handleException) => {
      handleException();
      return Promise.resolve(mockResponse);
    });

    render(<SystemStatusAlertsView />);

    await waitFor(() => {
      expect(screen.getByTestId("notify-exception-view")).toBeInTheDocument();
    });
  });

  it("renders TableComponent when alerts are available", async () => {
    (fetchEmailAlertStatus as jest.Mock).mockResolvedValueOnce({
      listenerData: { listenerStatus: "Live", eMailAlert: false },
      ssmHostData: { ssmHostStatus: "Live", eMailAlert: true, latestSSMHostVersion: "2.0", currentSSMHostVersion: "1.5" },
    });

    render(<SystemStatusAlertsView />);

    await waitFor(() => {
      expect(screen.queryByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
      expect(screen.queryByText("SystemStatus_T.SSMPackage")).toBeInTheDocument();
    });
  });

it("should set yellow alerts when fetchEmailAlertStatus returns null", async () => {
  (fetchEmailAlertStatus as jest.Mock).mockResolvedValue(null);

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument(); // Replace with actual t(...) value
  });

  const statusPills = screen.getAllByText(/No Data|Warning/);
  expect(statusPills.length).toBeGreaterThan(0);
});

it("renders yellow status alerts when API returns null", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(null);
  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.WarningMessage")).toHaveLength(2);
  });
});

it("displays 'Yes' when emailSubscribed is true", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: true },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.Yes")).toHaveLength(2);
  });
});

it("calls overflow outside click handler when document is clicked outside overflow menu", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.SSMPackage"));

  fireEvent.click(document);

  expect(systemStatusOverflowMenuOutSideClickHandler).toHaveBeenCalled();
});

it("renders fallback status when ssmHostData is missing from API response", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    // ssmHostData intentionally omitted
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  // Match what actually renders in your fallback
  expect(
    screen.getAllByText((content) =>
      content.includes("SystemStatus_T.Fail") || content.includes("SystemStatus_T.SSMNotLiveInfo")
    )
  ).not.toHaveLength(0);
});
it("renders warning icon in TableComponent for alert with isErrorResponse true", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(null); // triggers fallback with isErrorResponse

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    // The fallback warning icon + text should appear in both rows
    expect(screen.getAllByTestId("btn-90")).toHaveLength(2);
  });
});
it("renders NotificationStatus.WARNING when alert has isErrorResponse true", async () => {
  // Return null to force isErrorResponse in fallback
  mockFetchEmailAlertStatus.mockResolvedValueOnce(null);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByText(/View/)[0]); // fallback alerts render "View" buttons directly
  await waitFor(() => {
    expect(screen.getByTestId("notification-yellow")).toBeInTheDocument();
  });
});
});