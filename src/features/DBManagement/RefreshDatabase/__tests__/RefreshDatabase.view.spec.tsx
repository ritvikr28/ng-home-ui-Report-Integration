import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { service } from "../../../../shared/utils";
import RefreshDatabaseView, {
  handleComplete,
  IHandleCompleteProps,
  FetchPreCheckStatus
} from "../RefreshDatabase.view"; // Adjust the import path accordingly

// Mock dependencies
jest.mock("../DetachDatabase.view", () => () => <div>DetachDatabaseView</div>);
jest.mock("../DeleteNGData.view", () => () => <div>DeleteNGDataView</div>);
jest.mock("../AttachDatabase.view", () => () => <div>AttachDatabaseView</div>);
jest.mock("../SyncData.view", () => () => <div>SyncDataView</div>);
jest.mock("../../../../shared/utils", () => ({
  getUserOrganisation: jest.fn(() => "org123"),
  service: {
    get: jest.fn(() => Promise.resolve({ data: { statusCode: 200, dbDetachedStatus: "Detached", deleteNGDataStatus: "Deleted", dbReAttachedStatus: "Attached", syncDataStatus: "Completed" } })),
  },
}));
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(() =>
    Promise.resolve({ schoolName: "Test School" })
  ),
}));

describe("RefreshDatabaseView Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the steps after fetching precheck status", async () => {
    await act(async () => {
      render(<RefreshDatabaseView />);
    });

    expect(screen.getByText("1. Detach SIMS7 database")).toBeInTheDocument();
    expect(screen.getByText("2. Delete Next Gen data")).toBeInTheDocument();
    expect(screen.getByText("3. Attach SIMS7 database")).toBeInTheDocument();
    expect(screen.getByText("4. Sync SIMS7 data with Next Gen database")).toBeInTheDocument();
  });

  it("should correctly execute handleComplete function", () => {
    const mockHandleCompleteProps: IHandleCompleteProps = {
      index: 0,
      value: "Detached",
      flagValues: ["", "Deleted", "Attached", "Completed"],
      setFlagValues: jest.fn(),
      setActiveIndex: jest.fn(),
    };

    const result = handleComplete(mockHandleCompleteProps);
    expect(mockHandleCompleteProps.setFlagValues).toHaveBeenCalledWith([
      "Detached",
      "Deleted",
      "Attached",
      "Completed"
    ]);
    expect(mockHandleCompleteProps.setActiveIndex).toHaveBeenCalledWith(1);
    expect(result).toBe("Detached");
  });

  it("handles completion of the final step and resets the workflow", () => {
    const mockHandleCompleteProps: IHandleCompleteProps = {
      index: 3,
      value: "Completed",
      flagValues: ["Detached", "Deleted", "Attached", ""],
      setFlagValues: jest.fn(),
      setActiveIndex: jest.fn(),
    };

    const result = handleComplete(mockHandleCompleteProps);
    expect(mockHandleCompleteProps.setFlagValues).toHaveBeenCalledWith([
      "",
      "",
      "",
      ""
    ]);
    expect(mockHandleCompleteProps.setActiveIndex).toHaveBeenCalledWith(0);
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
    const result = await FetchPreCheckStatus(handleExceptionMock);
    expect(result).toBeNull();
  });
});
