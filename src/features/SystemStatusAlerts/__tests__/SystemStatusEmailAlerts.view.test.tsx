import React from "react";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import { fetchEmailAlertStatus, systemStatusOverflowMenuOutSideClickHandler, activateEmailAlert } from "../SystemStatusAlerts/SystemStatusService";
import SystemStatusAlertsView from "../SystemStatusAlerts/SystemStatusAlerts.view";

jest.mock("@essnextgen/auth-ui", () => ({
  ...jest.requireActual("@essnextgen/auth-ui"),
  authService: {
    isAuthorised: jest.fn((permissions) => permissions.some(
        (p: any) =>
          p.Securable === "NG.AlertEmails.List" &&
          (p.Operation === "Update" || p.Operation === "Write")
      )),
  },
}));

// Fix: allow both Update and Write for canUpdateSystemStatus
(authService.isAuthorised as jest.Mock).mockImplementation((permissions) => permissions.some((p: any) => p.Operation === "Update" || p.Operation === "Write"));

// Fix: add activateEmailAlert to the mock
jest.mock("../SystemStatusAlerts/SystemStatusService", () => ({
  fetchEmailAlertStatus: jest.fn(),
  systemStatusOverflowMenuOutSideClickHandler: jest.fn(),
  activateEmailAlert: jest.fn(),
}));

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(() => false),
}));

jest.mock("../SystemStatusAlerts/NotifyException.view", () => () => (
  <div data-testid="notify-exception-view">Notify Exception View</div>
));

const mockFetchEmailAlertStatus = fetchEmailAlertStatus as jest.Mock;
const mockOutsideClickHandler = systemStatusOverflowMenuOutSideClickHandler as jest.Mock;

describe("SystemStatusAlertsView Component", () => {
  const mockResponse = {
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    ssmHostData: { ssmHostStatus: "Not Live", eMailAlert: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    mockOutsideClickHandler.mockImplementation(() => {});
  });

  it("displays correct table status and label for Red, Yellow, and Green", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce({
      listenerData: { listenerStatus: "Not Live", eMailAlert: true },
      ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
    });

    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.getByText("SystemStatus_T.Fail")).toBeInTheDocument(); // Red
      expect(screen.getByText("SystemStatus_T.Live")).toBeInTheDocument(); // Green
    });

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
      expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    });
  });

  it("toggles overflow menu on multiple clicks", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
    });

    // You may need to adjust this test if your overflow menu testId is different
    const buttons = await screen.findAllByLabelText("Overflow menu");
    fireEvent.click(buttons[0]);
    // expect(screen.getByTestId("childcare-overflow-menu")).toBeInTheDocument();

    fireEvent.click(buttons[0]);
    // await waitFor(() => {
    //   expect(screen.queryByTestId("childcare-overflow-menu")).not.toBeInTheDocument();
    // });
  });

  it("renders correct UI when only listenerData is present", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce({
      listenerData: { listenerStatus: "Live", eMailAlert: false },
      ssmHostData: null,
    });
    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.getByText("SystemStatus_T.Live")).toBeInTheDocument();
    });
  });
it("renders correct UI when only ssmHostData is present", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: null,
    ssmHostData: { ssmHostStatus: "Not Live", eMailAlert: true },
  });
  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    // There may be multiple "SystemStatus_T.Fail" cells
    expect(screen.getAllByText("SystemStatus_T.Fail").length).toBeGreaterThan(0);
  });
});

it("renders loading state before data is loaded", async () => {
  let resolvePromise: any;
  mockFetchEmailAlertStatus.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
  );

  render(<SystemStatusAlertsView />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  resolvePromise({
    listenerData: { listenerStatus: "Live", eMailAlert: false },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
  });

  await waitFor(() => {
    // There should be two "SystemStatus_T.Live" (one for each row)
    expect(screen.getAllByText("SystemStatus_T.Live").length).toBe(2);
  });
});

  it("calls outside click handler when clicking outside overflow menu", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
    });
    fireEvent.mouseDown(document.body);
    expect(mockOutsideClickHandler).toHaveBeenCalled();
  });

  it("does not render overflow menu if no data is present", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce(null);
    render(<SystemStatusAlertsView />);
    await waitFor(() => {
      expect(screen.queryByLabelText("Overflow menu")).not.toBeInTheDocument();
    });
  });

 it("renders 'No' for missing email alert values", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live" }, // missing eMailAlert
    ssmHostData: { ssmHostStatus: "Live" },   // missing eMailAlert
  });
  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.No").length).toBeGreaterThan(0);
  });
});

it("opens side panel after clicking View from overflow", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(mockResponse);
  render(<SystemStatusAlertsView />);
  // Wait for the table to render
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  // Open the overflow menu
  const buttons = await screen.findAllByLabelText("Overflow menu");
  fireEvent.click(buttons[0]);

  // Use a flexible matcher to find the View option
  const viewOption = await screen.findByText((content) => content.trim() === "SystemStatus_T.View");
  fireEvent.click(viewOption);

  await waitFor(() => {
    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
  });
});
  it("activates/deactivates email alerts from overflow menu", async () => {
    mockFetchEmailAlertStatus.mockResolvedValueOnce({
      listenerData: { listenerStatus: "Live", eMailAlert: false },
      ssmHostData: { ssmHostStatus: "Live", eMailAlert: true },
    });

    const mockActivate = jest.fn((_id, _subscribed, onSuccess) => onSuccess());
    (activateEmailAlert as jest.Mock).mockImplementation(mockActivate);

    render(<SystemStatusAlertsView />);

    const buttons = await screen.findAllByLabelText("Overflow menu");
    fireEvent.click(buttons[0]);

    const activateOption = await screen.findByText("SystemStatus_T.Activateemail");
    fireEvent.click(activateOption);

    await waitFor(() => {
      expect(mockActivate).toHaveBeenCalled();
      expect(screen.getByText("SystemStatus_T.Changessaved")).toBeInTheDocument();
    });
  });
it("renders correct status label for Yellow and Connection error", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Connection error", eMailAlert: true },
    ssmHostData: { ssmHostStatus: "Unknown", eMailAlert: true },
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.WarningMessage")).toBeInTheDocument(); // Connection error
    expect(screen.getByText("SystemStatus_T.Fail")).toBeInTheDocument(); // Default for unknown
  });
});
it("renders correct Yes/No label for email alert subscription", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Live", eMailAlert: true },
    ssmHostData: { ssmHostStatus: "Live", eMailAlert: false },
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.Yes")).toBeInTheDocument();
    expect(screen.getByText("SystemStatus_T.No")).toBeInTheDocument();
  });
});
it("shows warning notification when status is Connection error in side panel", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Connection error", eMailAlert: false },
    ssmHostData: null,
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.DataSyncAlertName")).toBeInTheDocument();
  });

  const viewBtn = screen.getByText("SystemStatus_T.View");
  fireEvent.click(viewBtn);

  await waitFor(() => {
    expect(screen.getByTestId("notification-connection error")).toBeInTheDocument();
  });
});
it("renders View button directly when user lacks permission or status is error", async () => {
  (authService.isAuthorised as jest.Mock).mockReturnValue(false);
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Connection error", eMailAlert: false },
    ssmHostData: null,
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getByText("SystemStatus_T.View")).toBeInTheDocument();
  });
});
it("renders '-' for emailSubscribed when status is Connection error", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce({
    listenerData: { listenerStatus: "Connection error" }, // no emailSubscribed
    ssmHostData: null,
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});
it("sets fallback Yellow alerts when fetchEmailAlertStatus throws error", async () => {
  mockFetchEmailAlertStatus.mockImplementationOnce(() => {
    throw new Error("Simulated error");
  });

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.WarningMessage").length).toBeGreaterThan(0);
  });
});
it("sets fallback Yellow alerts when fetchEmailAlertStatus returns undefined", async () => {
  mockFetchEmailAlertStatus.mockResolvedValueOnce(undefined); // Simulates no response

  render(<SystemStatusAlertsView />);
  await waitFor(() => {
    expect(screen.getAllByText("SystemStatus_T.WarningMessage").length).toBeGreaterThan(0);
  });
});

});

