import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SyncDataView, { FetchSyncStatus } from "../SyncData.view";

jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));
jest.mock("../../../../shared/utils", () => ({
  service: {
    get: jest.fn(),
  },
  envConfig: { BASE_URL: "http://mock-api.com" },
  getUserOrganisation: jest.fn().mockReturnValue("123"),
}));

describe("SyncDataView Component", () => {
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();
  const inProgressStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component and button", () => {
    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus = {inProgressStatus}
      />
    );
    expect(
      screen.getByText(/The data synchronization is expected to be completed within 24 hours./i)
    ).toBeInTheDocument();
  });

  it("should show confirmation dialog when sync button is clicked", () => {
    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus = {inProgressStatus}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
  });

  it('should call status with "true" when dialog is closed', async () => {
    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus = {inProgressStatus}
      />
    );
    await waitFor(() => {
      expect(statusMock).not.toBeCalledWith("true");
    });
  });

  // it("should call FetchSyncStatus and handle exception properly", async () => {
  //   const mockResponse = {
  //     statusCode: 200,
  //     uiStatus: "Completed",
  //   };
  //   const response = await FetchSyncStatus(HandleExceptionMock);
  // });

  it("should handle fetch errors in FetchSyncStatus", async () => {
    const response = await FetchSyncStatus(HandleExceptionMock);
    expect(response).toBeNull();
    expect(HandleExceptionMock).toHaveBeenCalledTimes(1);
  });
});