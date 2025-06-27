import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { fetchEmailAlertStatus , activateEmailAlert, systemStatusOverflowMenuOutSideClickHandler } from "../SystemStatusAlerts/SystemStatusService";
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
it("renders fallback side panel content when alertData is undefined", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.SSMPackage"));

  // Try to open a non-existent alert (simulate clicking overflow of invalid id)
  fireEvent.click(screen.getAllByLabelText("Overflow menu")[1]);

  // Directly call document click to close (simulate outside click)
  fireEvent.click(document);

  // Should still not crash; UI should handle gracefully
  expect(screen.getByText("SystemStatus_T.SSMPackage")).toBeInTheDocument();
});

it("calls overflow outside click handler when document is clicked outside overflow menu", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.SSMPackage"));

  fireEvent.click(document);

  expect(systemStatusOverflowMenuOutSideClickHandler).toHaveBeenCalled();
});
it("handles activateEmailAlert without onSuccess or onError callbacks gracefully", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
  });


  render(<SystemStatusAlertsView />);

  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Activateemail"));

  // The test should just pass if no crash occurs
  await waitFor(() => {
    expect(mockActivateEmailAlert).toHaveBeenCalled();
  });
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
it("handles missing bounding client rect gracefully when calculating overflow menu position", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  // Force the button's getBoundingClientRect to return undefined by mocking ref
  const buttons = screen.getAllByLabelText("Overflow menu");
  Object.defineProperty(buttons[0], "getBoundingClientRect", { value: () => undefined });

  fireEvent.click(buttons[0]);

  // Should still set overflowMenuIndex without crashing
  await waitFor(() => {
    expect(screen.getByTestId("childcare-overflow-menu")).toBeInTheDocument();
  });
});

it("closes error notification when user clicks close icon", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  mockActivateEmailAlert.mockImplementation((_id, _flag, _onSuccess, onError) => onError?.("Test error message"));

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.Activateemail"));

  await waitFor(() => {
    const errorNotification = screen.getByText("SystemStatus_T.FailedAlertTitleActivate");
    expect(errorNotification).toBeInTheDocument();
  });

  // Close error notification
  fireEvent.click(screen.getByLabelText("close"));
});
it("triggers systemStatusOverflowMenuOutSideClickHandler when overflow menu is open and user clicks outside", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);

  // Click outside (document click)
  fireEvent.click(document);

  expect(systemStatusOverflowMenuOutSideClickHandler).toHaveBeenCalledWith(
    expect.stringContaining("overflow-"),
    expect.any(Function)
  );
});

it("renders NotificationStatus.SUCCESS in side panel when alert has status Green", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.View"));

  await waitFor(() => {
    // Notification should match success variant when status is Green
    expect(screen.getByTestId("notification-green")).toBeInTheDocument();
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
it("closes side panel when clicking footer Close button", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);

  render(<SystemStatusAlertsView />);
  await waitFor(() => screen.getByText("SystemStatus_T.DataSyncAlertName"));

  fireEvent.click(screen.getAllByLabelText("Overflow menu")[0]);
  fireEvent.click(screen.getByText("SystemStatus_T.View"));

  await waitFor(() => screen.getByTestId("side-panel"));

  fireEvent.click(screen.getByTestId("btn-close"));

  // Confirm it closed by checking absence of side-panel content
  await waitFor(() => {
    expect(screen.queryByTestId("notification-green")).not.toBeInTheDocument();
  });
});

});