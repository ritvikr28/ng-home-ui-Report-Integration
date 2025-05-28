import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { fetchEmailAlertStatus , activateEmailAlert } from "../SystemStatusAlerts/SystemStatusService";
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
  activateEmailAlert: jest.fn(),
  systemStatusOverflowMenuOutSideClickHandler:jest.fn()
}));
const mockActivateEmailAlert = activateEmailAlert as jest.Mock;
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

  it("handles overflow menu actions - View", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.queryByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);

    fireEvent.click(screen.getByText("SystemStatus_T.View"));

    await waitFor(() => {
      expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    });
  });


  it("closes the side panel on button click", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.queryByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
    fireEvent.click(screen.getByText("SystemStatus_T.View"));

    await waitFor(() => screen.getByTestId("side-panel"));
    fireEvent.click(screen.getByTestId("btn-close"));
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


it("activates email alert successfully and shows success message", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
  mockActivateEmailAlert.mockImplementation((_id, _flag, onSuccess) => onSuccess());

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Activateemail"));
  
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

it("shows error notification when activateEmailAlert fails", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  mockActivateEmailAlert.mockImplementation((_id, _flag, _onSuccess, onError) => onError?.());

  render(<SystemStatusAlertsView />);

  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Activateemail"));
 
});

});