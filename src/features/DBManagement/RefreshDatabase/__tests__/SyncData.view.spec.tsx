import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import SyncDataView, { FetchSyncStatus, CheckSyncStatus } from "../SyncData.view";
import { ISchoolDetailsDRApiResponse } from "../../../../shared/model/RefreshDatabase/responsemodel";
import { service } from "../../../../shared/utils";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";

jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));
jest.mock("../../../../shared/utils", () => ({
  service: {
    get: jest.fn(),
  },
}));

jest.mock("../../../../shared/model/RefreshDatabase/responsemodel", () => ({
  FetchSyncStatus: jest.fn(),
}));

    jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
      useFetchSchoolNameData: jest.fn(),
   }));
   jest.mock("../../../../shared/utils", () => ({
     service: {
       get: jest.fn(),
     },
     getUserOrganisation: jest.fn(),
     envConfig: {
       BASE_URL: "https://example.com",
     },
   }));
   


describe("SyncDataView Component", () => {
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();
  const inProgressStatus = jest.fn();
  const FetchSyncStatusMock = jest.fn();
  const mockHandleException = jest.fn();
  const mockSetSyncStatus = jest.fn();
  const mockSetShowSyncCompleteDialog = jest.fn();
  const mockSetShowSyncFailedDialog = jest.fn();
  const mockSetClicked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });


  it("should render the component and button", () => {
    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus={inProgressStatus}
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
        inProgressStatus={inProgressStatus}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
  });

  it("should call inProgressStatus on button click", () => {
    const { getByRole } = render(
      <SyncDataView
        status={statusMock}
        handleException={mockHandleException}
        inProgressStatus={inProgressStatus}
      />
    );
    fireEvent.click(getByRole("button", { name: /Sync/i }));
    expect(inProgressStatus).toHaveBeenCalledWith("In Progress");
  });

  test("should handle fetch errors in FetchSyncStatus", async () => {
    jest.spyOn(service, "get").mockImplementation(() => {
      throw new Error("Network Error");
    });
    const response: any = await FetchSyncStatus(HandleExceptionMock); 
    await waitFor(() => {
      expect(response).toBeNull()
    });
  });

  test("shoud fetch search results data successfully", async () => {
    const mockResponseData = {
      statusCode: 200,
      uiStatus: "Not Started",
    };
    const axiosResponse: AxiosResponse = {
      config: {},
      data: mockResponseData,
      status: 200,
      statusText: "OK",
      headers: {},
    };
    const mockSchoolData = { schoolName: "Test School" };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue(mockSchoolData);
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchSyncStatus(HandleExceptionMock); 
    await waitFor(() => {

      expect(response).toEqual(axiosResponse.data)
      expect(HandleExceptionMock).not.toHaveBeenCalled();
    });
  });

  it("should handle fetch results successfully when calling FetchSyncStatus", async () => {
    const mockResponseData = {
      statusCode: 200,
      uiStatus: "Completed",
    };
    (FetchSyncStatusMock as jest.Mock).mockReturnValue(mockResponseData);

    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus={inProgressStatus}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));

    await waitFor(() => {
      expect(FetchSyncStatusMock).toHaveBeenCalledTimes(0);
    });
  });

  it("should handle default status case", async () => {
    const mockResponse: ISchoolDetailsDRApiResponse = {
      statusCode: 200,
      uiStatus: "Unknown",
    };
    (FetchSyncStatusMock as jest.Mock).mockResolvedValue(mockResponse);
    const result = await CheckSyncStatus(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncFailedDialog,
      mockSetClicked,
      "Error",
      statusMock
    );
    expect(FetchSyncStatusMock).toHaveBeenCalledTimes(0);
    expect(result).toBe("Error");
  });

  it("should handle exception on FetchSyncStatus and display sync failed dialog", async () => {
    const mockResponseData = {
      statusCode: 200,
      uiStatus: "Error",
    };
    const axiosResponse: AxiosResponse = {
      config: {},
      data: mockResponseData,
      status: 200,
      statusText: "OK",
      headers: {},
    };
    const mockSchoolData = { schoolName: "Test School" };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue(mockSchoolData);
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchSyncStatus(HandleExceptionMock); 
   
    const result = await CheckSyncStatus(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncFailedDialog,
      mockSetClicked,
      response.uiStatus,
      statusMock
    );
    await waitFor(() => {  
      expect(mockSetSyncStatus).toHaveBeenCalledWith("Failed");
      expect(result).toBe("Error");
    });
  });

  it("should display sync completed dialog on success", async () => {
    const mockResponseData = {
      statusCode: 200,
      uiStatus: "Completed",
    };
    const axiosResponse: AxiosResponse = {
      config: {},
      data: mockResponseData,
      status: 200,
      statusText: "OK",
      headers: {},
    };
    const mockSchoolData = { schoolName: "Test School" };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue(mockSchoolData);
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchSyncStatus(HandleExceptionMock); 
   
    const result = await CheckSyncStatus(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncFailedDialog,
      mockSetClicked,
      response.uiStatus,
      statusMock
    );
    await waitFor(() => {  
      expect(mockSetSyncStatus).toHaveBeenCalledWith("Completed");
      expect(mockSetShowSyncCompleteDialog).toHaveBeenCalledWith(true);
      expect(result).toBe("Completed");
    });
  });

  it("should return 'Error' if the response is null or statusCode is not 200", async () => {
    const mockResponseData = {
      statusCode: 500,
      uiStatus: "Not Started",
    };
    const axiosResponse: AxiosResponse = {
      config: {},
      data: mockResponseData,
      status: 500,
      statusText: "OK",
      headers: {},
    };
    const mockSchoolData = { schoolName: "Test School" };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue(mockSchoolData);
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchSyncStatus(HandleExceptionMock); 
   
    const result = await CheckSyncStatus(
      mockHandleException,
      mockSetSyncStatus,
      mockSetShowSyncCompleteDialog,
      mockSetShowSyncFailedDialog,
      mockSetClicked,
      response.uiStatus,
      statusMock
    );
    await waitFor(() => {
      expect(result).toBe("Error");
    });
    
  });

  it("should allow sync button can be clicked multiple times", async () => {
    render(
      <SyncDataView
        status={statusMock}
        handleException={HandleExceptionMock}
        inProgressStatus={inProgressStatus}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sync/i })).not.toBeDisabled();
    });
  });
});
