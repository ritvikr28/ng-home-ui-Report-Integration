import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import SyncDataView, { FetchSyncStatus, TriggerSync, handleButtonClick } from "../SyncData.view";
import { service } from "../../../../shared/utils";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../../shared/model/RefreshDatabase/responsemodel";
import ConfirmDialog from "../ConfirmationDialog.logic";

jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(),
}));

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
  let history: ReturnType<typeof createMemoryHistory>;
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
  const setIsLoading = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    history.replace = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should call FetchSyncStatus with history and handle success response", async () => {
    const mockResponse = { statusCode: 200, uiStatus: "Completed" };
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await FetchSyncStatus(mockHandleException, history);

    expect(result).toEqual(mockResponse);
    expect(history.replace).not.toHaveBeenCalled();
  });

  it("should redirect to unauthorized page when FetchSyncStatus gets 401", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });

    await FetchSyncStatus(mockHandleException, history);

    expect(history.replace).toHaveBeenCalledWith("/unauthorized");
  });

  it("should call TriggerSync and handle success response", async () => {
    const mockResponse = { statusCode: 200 };
    (service.post as jest.Mock).mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await TriggerSync(mockHandleException, history);

    expect(result).toEqual(mockResponse);
    expect(history.replace).not.toHaveBeenCalled();
  });

  it("should redirect to unauthorized page when TriggerSync gets 401", async () => {
    (service.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });

    await TriggerSync(mockHandleException, history);

    expect(history.replace).toHaveBeenCalledWith("/unauthorized");
  });

  it("should render the component and sync button", () => {
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus="In Progress"
      />
    );

    expect(screen.getByTestId("modelSyncComplete")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sync/i })).toBeInTheDocument();
  });

  it("should call handleException on API failure", async () => {
    (useFetchSchoolNameData as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus=""
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

    const response = await FetchSyncStatus(handleExceptionMock, history);
    expect(response).toEqual(mockResponse);
    expect(handleExceptionMock).not.toHaveBeenCalled();
  });

  it("should return null if FetchSyncStatus fails", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const response = await FetchSyncStatus(handleExceptionMock, history);
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
      mockSetShowSyncFailedDialog,
      setIsLoading,
      history,
      ""
    );

    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus=""
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
  
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="In Progress"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
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
      mockSetShowSyncFailedDialog,
      setIsLoading,
      history,
      "Completed"
    );
    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus="Completed"
      />
    );
    fireEvent.click(screen.getByText('Sync'));

    await waitFor(() => {
      expect(mockSetShowSyncCompleteDialog).toHaveBeenCalledWith(true);
    });
  });

  it("should handle fetch sync status failure on mount", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus="Not Started"
      />
    );

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalledTimes(0);
    });
  });

  it("should close Sync Complete dialog when onCloseHandle is called", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="Completed"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).toBeInTheDocument();
    });
  
    const closeButton = screen.getByTestId("dialog-close-button");
    fireEvent.click(closeButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).not.toBeInTheDocument();
    });
  });

  it("should call onClose when cancel button is clicked", async () => {
    const onCloseMock = jest.fn();

    render(
      <ConfirmDialog
        title="Test Dialog"
        description="Test description"
        isOpen={true}
        optionalButton={true}
        onSubmitHandle={jest.fn()}
        onCloseHandle={onCloseMock}
      />
    );

    const cancelButton = screen.queryByTestId("default-dialog-close-btn");
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton!);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should handle null school data gracefully", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({ data: null });

    const result = await FetchSyncStatus(handleExceptionMock, history);

    expect(result).toBeNull();
  });

  it("should show Sync in Progress dialog on second click", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="In Progress"
        />
      </Router>
    );

    const syncButton = screen.getByRole("button", { name: /Sync/i });

    fireEvent.click(syncButton);

    (service.get as jest.Mock).mockResolvedValueOnce({
      data: { uiStatus: "InProgress" },
    });

    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content2")).toBeInTheDocument();
    });
  });

  it("should close Sync Failed dialog when onCloseHandle is called", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="Error"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content1")).toBeInTheDocument();
    });
  
    const closeButton = screen.getByTestId("dialog-close-button");
    fireEvent.click(closeButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content1")).not.toBeInTheDocument();
    });
  });

  it("should handle onSubmitHandle for Sync Complete dialog", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="Completed"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).toBeInTheDocument();
    });
  
    const submitButton = screen.getByTestId("default-dialog-ok-btn");
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).not.toBeInTheDocument();
    });
  });

  it("should handle onSubmitHandle for Sync Failed dialog", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="Error"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content1")).toBeInTheDocument();
    });
  
    const submitButton = screen.getByTestId("default-dialog-ok-btn");
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content1")).not.toBeInTheDocument();
    });
  });

  it("should handle onCloseHandle for Sync Complete dialog", async () => {
    render(
      <Router history={history}>
        <SyncDataView
          handleException={handleExceptionMock}
          inProgressStatus={inProgressStatusMock}
          status={statusMock}
          syncDataStatus="Completed"
        />
      </Router>
    );
  
    const syncButton = screen.getByRole("button", { name: /Sync/i });
  
    fireEvent.click(syncButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).toBeInTheDocument();
    });
  
    const closeButton = screen.getByTestId("dialog-close-button");
    fireEvent.click(closeButton);
  
    await waitFor(() => {
      expect(screen.queryByText("RefreshDB_T.moduleBlock.modal.content")).not.toBeInTheDocument();
    });
  });

  it("should handle successful TriggerSync call", async () => {
    const mockResponse = { statusCode: 200 };
    (service.post as jest.Mock).mockResolvedValueOnce({
      data: mockResponse,
    });
  
    const result = await TriggerSync(mockHandleException, history);
  
    expect(result).toEqual(mockResponse);
    expect(history.replace).not.toHaveBeenCalled();
  });

  it("should handle TriggerSync call failure without a response", async () => {
    (service.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
  
    const result = await TriggerSync(mockHandleException, history);
  
    expect(result).toBeNull();
    expect(mockHandleException).not.toHaveBeenCalledWith("Network Error");
  });

it("should handle TriggerSync API call failure with invalid token", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Invalid token",
  });

  await TriggerSync(mockHandleException, history);

  expect(history.replace).toHaveBeenCalledWith("/unauthorized");
});

it("should handle TriggerSync API call failure without response", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

  const result = await TriggerSync(mockHandleException, history);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});

it("should handle button click when syncDataStatus is 'In Progress'", async () => {
  render(
    <Router history={history}>
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus="In Progress"
      />
    </Router>
  );

  const syncButton = screen.getByRole("button", { name: /Sync/i });
  fireEvent.click(syncButton);

  await waitFor(() => {
    expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
  });
});

it("should handle button click when clicked before", async () => {
  render(
    <Router history={history}>
      <SyncDataView
        handleException={handleExceptionMock}
        inProgressStatus={inProgressStatusMock}
        status={statusMock}
        syncDataStatus="In Progress"
      />
    </Router>
  );

  const syncButton = screen.getByRole("button", { name: /Sync/i });
  fireEvent.click(syncButton);
  fireEvent.click(syncButton);

  await waitFor(() => {
    expect(mockSetShowSyncDialog).not.toHaveBeenCalledWith(true);
  });
});

});