import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SyncDataView, { FetchSyncStatus, handleButtonClick } from "../SyncData.view";
import { service } from "../../../../shared/utils";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../../shared/model/RefreshDatabase/responsemodel";

// Mocking modules
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(),
}));

jest.mock("../../../../shared/utils", () => ({
  service: {
    get: jest.fn(),
    post : jest.fn()
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
  const inProgressStatus = jest.fn();
  const mockHandleException = jest.fn();
  const mockSetSyncStatus = jest.fn();
  const mockSetShowSyncCompleteDialog = jest.fn();
  const mockSetShowSyncFailedDialog = jest.fn();
  const mockSetClicked = jest.fn();
  const mockSetShowSyncDialog = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component and sync button", () => {
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );

    expect(
      screen.getByText(/The data synchronization is expected to be completed within 24 hours./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sync/i })).toBeInTheDocument();
  });

  it("should handle sync button click and show the appropriate dialog", async () => {
    const mockTriggerSyncResponse = { statusCode: 200, uiStatus: "In Progress" };
    const mockFetchSyncResponse = { statusCode: 200, uiStatus: "Completed" };
  
    (service.post as jest.Mock).mockResolvedValue({
      data: mockTriggerSyncResponse,
    });
    (service.get as jest.Mock).mockResolvedValue({
      data: mockFetchSyncResponse,
    });
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );
  
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
    });
  });

  it("should call handleException on API failure", async () => {
    (useFetchSchoolNameData as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle FetchSyncStatus successfully", async () => {
    const mockResponse: ISchoolDetailsDRApiResponse = {
      statusCode: 200,
      uiStatus: "In Progress",
    };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School",
    });
    (service.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const response = await FetchSyncStatus(handleExceptionMock);
    expect(response).toEqual(mockResponse);
    expect(handleExceptionMock).not.toHaveBeenCalled();
  });

  it("should return null if FetchSyncStatus fails", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const response = await FetchSyncStatus(handleExceptionMock);
    expect(response).toBeNull();
    expect(handleExceptionMock).toHaveBeenCalled();
  });

  it("should display 'Data Sync Failed' dialog when API response indicates failure", async () => {
    const mockResponse: ISchoolDetailsDRApiResponse = {
      statusCode: 500,
      uiStatus: "Error",
    };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School",
    });
    (service.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });
    handleButtonClick(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncDialog,
      true,
      mockSetClicked,
      inProgressStatus,
      mockSetShowSyncFailedDialog
      );

    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));

    await waitFor(() => {
      expect(mockSetShowSyncFailedDialog).toHaveBeenCalledWith(true);
    });
  });

  it('should open Data Sync in progress dialog when API response indicates in progress status', async () => {
    const mockResponse: ISchoolDetailsDRApiResponse = {
      statusCode: 200,
      uiStatus: "In Progress",
    };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School",
    });
    (service.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });
    handleButtonClick(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncDialog,
      true,
      mockSetClicked,
      inProgressStatus,
      mockSetShowSyncFailedDialog
      );
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );

    fireEvent.click(screen.getByText('Sync'));
    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress")
    });
  });

 
  it('should open Data Sync successful dialog when API response indicates completed status', async () => {
    const mockResponse = {
      statusCode: 200,
      uiStatus: 'Completed',
    };
    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: 'Test School',
    });
    (service.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    handleButtonClick(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncDialog,
      true,
      mockSetClicked,
      inProgressStatus,
      mockSetShowSyncFailedDialog
      );
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );
    fireEvent.click(screen.getByText('Sync'));

    await waitFor(() => {
      expect(mockSetSyncStatus).toHaveBeenCalledWith('Completed');
      expect(mockSetShowSyncCompleteDialog).toHaveBeenCalledWith(true);
      expect(mockSetClicked).toHaveBeenCalledWith(false);
    });
  });

  it("should allow multiple sync button clicks", async () => {
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sync/i })).not.toBeDisabled();
    });
  });
});
