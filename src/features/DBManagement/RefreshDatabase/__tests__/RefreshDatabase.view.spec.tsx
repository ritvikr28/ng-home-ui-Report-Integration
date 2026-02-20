import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { service } from "../../../../shared/utils";

import RefreshDatabaseView from "../RefreshDatabase.view";
import { FetchPreCheckStatus, handleComplete, IHandleCompleteProps } from "../RefreshDatabaseUtils";
// Mock dependencies
jest.mock("../DeleteNGData.view", () => () => <div>DeleteNGDataView</div>);
jest.mock("../AttachDatabase.view", () => () => <div>AttachDatabaseView</div>);


jest.mock("../NotifyException.view", () => jest.fn(() => <div>NotifyExceptionView</div>));
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(() =>
    Promise.resolve({ schoolName: "Test School" })
  ),
}));
jest.mock("../../../../shared/utils", () => ({
  envConfig: { BASE_URL: "http://test-url" },
  getUserOrganisation: jest.fn(() => "TestOrgId"),
  service: {
    get: jest.fn(),
  },
}));

describe("RefreshDatabaseView Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockHistory = {
    push: jest.fn(),
  };

  it("should display loading state initially", async () => {
    render(<RefreshDatabaseView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await act(async () => { });
  });

  it("renders the steps after fetching precheck status", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        dbDetachedStatus: "Detached",
        deleteNGDataStatus: "Deleted",
        dbReAttachedStatus: "Attached",
        syncDataStatus: "Completed"
      }
    };

    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    await act(async () => {
      render(<RefreshDatabaseView />);
    });
  });

  it("calls FetchPreCheckStatus and handles success response", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        dbDetachedStatus: "Detached",
        deleteNGDataStatus: "Deleted",
        dbReAttachedStatus: "Attached",
        syncDataStatus: "Completed",
      },
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const handleException = jest.fn();
    const result = await FetchPreCheckStatus(handleException, mockHistory);

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle exception and show notification panel", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce({ response: { status: 400 } });

    render(<RefreshDatabaseView />);

    // Wait for React updates
    await act(async () => { });

    expect(screen.getByText("NotifyExceptionView")).toBeInTheDocument();
  });

  it("calls FetchPreCheckStatus and handles error response", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });

    const handleException = jest.fn();
    await FetchPreCheckStatus(handleException, mockHistory);

    expect(mockHistory.push).toHaveBeenCalledWith("/unauthorized");
  });

  it("should correctly execute handleComplete function", () => {
    const mockSetFlagValues = jest.fn();
    const mockSetActiveIndex = jest.fn();
    const mockHandleCompleteProps: IHandleCompleteProps = {
      index: 0,
      value: "Detached",
      flagValues: ["", "Deleted", "Attached", "Completed"],
      setFlagValues: mockSetFlagValues,
      setActiveIndex: mockSetActiveIndex,
      items: [
        { title: "step1", component: jest.fn() },
        { title: "step2", component: jest.fn() },
        { title: "step3", component: jest.fn() },
        { title: "step4", component: jest.fn() }
      ],
    };

    const result = handleComplete(mockHandleCompleteProps);
    expect(mockSetFlagValues).toHaveBeenCalledWith([
      "Detached",
      "Deleted",
      "Attached",
      "Completed"
    ]);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(1);
    expect(result).toBe("Detached");
  });

  it("handles completion of the final step and resets the workflow", () => {
    const mockSetFlagValues = jest.fn();
    const mockSetActiveIndex = jest.fn();
    const mockHandleCompleteProps: IHandleCompleteProps = {
      index: 3,
      value: "Completed",
      flagValues: ["Detached", "Deleted", "Attached", ""],
      setFlagValues: mockSetFlagValues,
      setActiveIndex: mockSetActiveIndex,
      items: [
        { title: "step1", component: jest.fn() },
        { title: "step2", component: jest.fn() },
        { title: "step3", component: jest.fn() },
        { title: "step4", component: jest.fn() }
      ],
    };

    const result = handleComplete(mockHandleCompleteProps);
    // The function first updates the flags, then resets them
    expect(mockSetFlagValues).toHaveBeenNthCalledWith(1, [
      "Detached",
      "Deleted",
      "Attached",
      "Completed"
    ]);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(0);
    expect(mockSetFlagValues).toHaveBeenNthCalledWith(2, ["", "", "", ""]);
    expect(result).toBe("Completed");
  });


  it("displays notification panel on exception", async () => {
    jest.spyOn(service, "get").mockRejectedValueOnce(new Error("Fetch failed"));
    await act(async () => {
      render(<RefreshDatabaseView />);
    });

    const handleException = jest.fn();
    act(() => {
      handleException();
    });
  });

  it("FetchPreCheckStatus returns null on error", async () => {
    const handleExceptionMock = jest.fn();
    jest.spyOn(service, "get").mockRejectedValueOnce(new Error("Fetch failed"));
    const result = await FetchPreCheckStatus(handleExceptionMock, mockHistory);
    expect(result).toBeNull();
  });

  it("FetchPreCheckStatus should return data on success", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        dbDetachedStatus: "Detached",
        deleteNGDataStatus: "Deleted",
        dbReAttachedStatus: "Attached",
        syncDataStatus: "Completed",
      },
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);
    const result = await FetchPreCheckStatus(jest.fn(), mockHistory);
    expect(result).toEqual(mockResponse.data);
  });

});
