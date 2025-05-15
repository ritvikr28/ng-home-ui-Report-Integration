import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { activateEmailAlert, fetchEmailAlertStatus } from "../SystemStatusAlerts/SystemStatusService";
import SystemStatusAlertsView from "../SystemStatusAlerts/SystemStatusAlerts.view";

jest.mock("../SystemStatusAlerts/SystemStatusService", () => ({
  fetchEmailAlertStatus: jest.fn(),
  activateEmailAlert: jest.fn(),
}));

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(() => false),
}));

jest.mock("../SystemStatusAlerts/NotifyException.view", () => () => (
  <div data-testid="notify-exception-view">Notify Exception View</div>
));

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
      expect(screen.getByText("Data Sync")).toBeInTheDocument();
      expect(screen.getByText("SSM Package")).toBeInTheDocument();
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

it("handles overflow menu actions - View", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("Data Sync"));

  // Click overflow button
  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);

  // Click 'View' option
  fireEvent.click(screen.getByText("View"));

  await waitFor(() => {
    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
  });
});

it("handles Activate Email action", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
const mockActivateEmailAlert = activateEmailAlert as jest.Mock;
  mockActivateEmailAlert.mockImplementation((id, emailSubscribed, onSuccess) => {
    onSuccess(); // Simulate success callback
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("Data Sync"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("Activate Email"));

  await waitFor(() =>
    expect(screen.getByText("Changes Saved.")).toBeInTheDocument()
  );
});

it("handles Deactivate Email action with error", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
const mockActivateEmailAlert = activateEmailAlert as jest.Mock;
  mockActivateEmailAlert.mockImplementation((id, emailSubscribed, onSuccess, onError) => {
    onError("Failed to update email alert."); // Simulate error callback
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("Data Sync"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]);
  fireEvent.click(screen.getByText("Deactivate Email"));

  await waitFor(() =>
    expect(screen.getByText("Failed to update email alert.")).toBeInTheDocument()
  );
});
it("closes the side panel on button click", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("Data Sync"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("View"));

  await waitFor(() => screen.getByTestId("side-panel"));
  fireEvent.click(screen.getByTestId("btn-close"));

});


it("renders TableComponent when alerts are available", async () => {
  (fetchEmailAlertStatus as jest.Mock).mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: true, latestSSMHostVersion: "2.0", currentSSMHostVersion: "1.5" }
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("Data Sync")).toBeInTheDocument();
    expect(screen.getByText("SSM Package")).toBeInTheDocument();
  });
});

it("opens SidePanel and shows SSM Package error messages for Red status", async () => {
  const redAlertResponse = {
    listenerData: {
      listenerStatus: "Live",
      eMailAlert: false,
    },
    ssmHostData: {
      ssmHostStatus: "Not Live", // Triggers Red status
      eMailAlert: true,
      latestSSMHostVersion: "2.1",
      currentSSMHostVersion: "2.0"
    },
  };
  (fetchEmailAlertStatus as jest.Mock).mockResolvedValueOnce(redAlertResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => expect(screen.getByText("SSM Package")).toBeInTheDocument());

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]); // Open overflow menu for second alert
  fireEvent.click(screen.getByText("View"));

  await waitFor(() => {
    expect(screen.getByText("2.1")).toBeInTheDocument(); // Version display
    expect(screen.getByText("2.0")).toBeInTheDocument();
  });
});

});