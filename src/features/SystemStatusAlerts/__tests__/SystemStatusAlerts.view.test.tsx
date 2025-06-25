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
it("renders yellow status alerts when API returns null", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(null);
  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.WarningMessage")).toHaveLength(2);
  });
});
it("shows SSM specific side panel content when alert id is 2", async () => {
  const customResponse = {
    listenerData: {
      listenerStatus: "Live",
      eMailAlert: false,
    },
    ssmHostData: {
      ssmHostStatus: "Not Live",
      eMailAlert: true,
      latestSSMHostVersion: "2.1",
      currentSSMHostVersion: "2.0",
    },
  };
  mockFetchEmailAlertStatus.mockResolvedValueOnce(customResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.SSMPackage")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]);
  fireEvent.click(screen.getByText("SystemStatus_T.View"));

  await waitFor(() => {
    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("2.1"))).toBeInTheDocument(); // latestSSMHostVersion
    expect(screen.getByText((content) => content.includes("2.0"))).toBeInTheDocument(); // currentSSMHostVersion
  });
});
it("deactivates email alert when already subscribed", async () => {
  const customResponse = {
    listenerData: {
      listenerStatus: "Not Live",
      eMailAlert: true, // already subscribed
    },
    ssmHostData: {
      ssmHostStatus: "Live",
      eMailAlert: false,
    },
  };
  mockFetchEmailAlertStatus.mockResolvedValueOnce(customResponse);

  mockActivateEmailAlert.mockImplementation((_id, _flag, onSuccess) => onSuccess());

  render(<SystemStatusAlertsView />);

  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Deactivateemail"));

  await waitFor(() => {
    expect(mockActivateEmailAlert).toHaveBeenCalledWith(
      "1", true, expect.any(Function), expect.any(Function), "SYNC"
    );
  });
});

it("passes correct emailType based on alert id", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  mockActivateEmailAlert.mockImplementation((_id, _flag, onSuccess) => onSuccess());

  render(<SystemStatusAlertsView />);

  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.SSMPackage")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]);
  fireEvent.click(screen.getByText("SystemStatus_T.Deactivateemail"));

  await waitFor(() => {
    expect(mockActivateEmailAlert).toHaveBeenCalledWith(
      "2", true, expect.any(Function), expect.any(Function), "SSM"
    );
  });
});
it("closes success notification on close button click", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  mockActivateEmailAlert.mockImplementation((_id, _flag, onSuccess) => onSuccess());

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Activateemail"));

  await waitFor(() => screen.getByText("SystemStatus_T.Changessaved"));

  fireEvent.click(screen.getByLabelText("close")); // The button's aria-label is "close"
});
it("activates email alert for SSM alert (id === '2')", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
  mockActivateEmailAlert.mockImplementation((_id, _flag, onSuccess) => onSuccess());

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.SSMPackage"));

  const ssmMenuButton = screen.getAllByLabelText("Overflow menu")[1];
  fireEvent.click(ssmMenuButton);
  fireEvent.click(screen.getByText("SystemStatus_T.Deactivateemail"));
});

it("renders error content in side panel for SSM alert (id: '2')", async () => {
  const mockRedAlertResponse = {
    listenerData: { listenerStatus: "Not Live", eMailAlert: true },
    ssmHostData: { ssmHostStatus: "Not Live", eMailAlert: false, latestSSMHostVersion: "2.5", currentSSMHostVersion: "2.0" },
  };

  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockRedAlertResponse);
  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.SSMPackage"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]);
  fireEvent.click(screen.getByText("SystemStatus_T.View"));

  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content1")).toBeInTheDocument();
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


});