import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SyncDataView, { FetchSyncStatus, TriggerSync } from "../SyncData.view";
import { service } from "../../../../shared/utils";

jest.mock("../../../../shared/utils", () => ({
  service: {
    get: jest.fn(),
    post: jest.fn()
  },
  getUserOrganisation: jest.fn().mockReturnValue("test-org-id"),
  envConfig: {
    BASE_URL: "https://example.com",
  },
}));

describe("SyncDataView Component", () => {
  const handleExceptionMock = jest.fn();
  const inProgressStatusMock = jest.fn();
  const statusMock = jest.fn();
  const mockHistory = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should call FetchSyncStatus and handle success response", async () => {
    const mockResponse = { statusCode: 200, uiStatus: "Completed" };
    (service.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });
    const result = await FetchSyncStatus(handleExceptionMock, mockHistory);
    expect(result).toEqual(mockResponse);
    expect(handleExceptionMock).not.toHaveBeenCalled();
  });

   it("should call FetchSyncStatus and handle success response", async () => {
    const mockResponse = { statusCode: 200, uiStatus: "Completed" };
    (service.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });
    const result = await FetchSyncStatus(handleExceptionMock, mockHistory);
    expect(result).toEqual(mockResponse);
    expect(handleExceptionMock).not.toHaveBeenCalled();
  });

  it("should handle 401 error in FetchSyncStatus", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
    await FetchSyncStatus(handleExceptionMock, mockHistory);
    expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
  });

  it("should call TriggerSync and handle success response", async () => {
    const mockResponse = { statusCode: 200 };
    (service.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });
    const result = await TriggerSync(handleExceptionMock, mockHistory);
    expect(result).toEqual(mockResponse);
    expect(handleExceptionMock).not.toHaveBeenCalled();
  });

  it("should handle 401 error in TriggerSync", async () => {
    (service.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
    await TriggerSync(handleExceptionMock, mockHistory);
    expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
  });

  it("should render the component and sync button", () => {
    render(
      <MemoryRouter>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="In Progress"
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId("modelSyncComplete")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sync/i })).toBeInTheDocument();
  });
});