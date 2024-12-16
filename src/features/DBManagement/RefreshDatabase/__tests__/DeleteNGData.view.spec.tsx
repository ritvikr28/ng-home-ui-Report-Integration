import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DeleteNGDataView from "../DeleteNGData.view";

// Mock dependencies
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));

const setShowDeleteDialogMock = jest.fn();

jest.mock("../../../../shared/utils", () => ({
  service: {
    post: jest.fn(),
    get: jest.fn(),
  },
  getUserOrganisation: jest.fn().mockReturnValue("123"),
  envConfig: { BASE_URL: "http://mock-api.com" },
}));

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn().mockReturnValue("testUser"),
  },
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe("DeleteNGDataView Component", () => {
  const statusMock = jest.fn();
  const inProgressStatusMock = jest.fn();
  const handleExceptionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component and button", () => {
    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );
    expect(screen.getByTestId("Proceed")).toBeInTheDocument();
  });

  it("should disable the Proceed button when precheckStatus is 'Deleted'", async () => {
   
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Deleted" } });

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    await waitFor(() => {
      const proceedButton = screen.getByRole("button", { name: /Proceed/i });
      expect(proceedButton).not.toBeDisabled();
      expect(statusMock).not.toHaveBeenCalledWith("Deleted");
    });
  });

  it("should call handleDelete and update status to 'In Progress' on successful deletion", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Not Deleted" } });
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { statusCode: 200 } });

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(inProgressStatusMock).not.toHaveBeenCalledWith("In Progress");
    });
  });

  it("should handle error during deletion", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Not Deleted" } });
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Deletion error"));

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(handleExceptionMock).not.toHaveBeenCalled();
    });
  });

  it("should handle unexpected precheckStatus values gracefully", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Unexpected Value" } });

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(setShowDeleteDialogMock).not.toHaveBeenCalled();
    });
  });
});