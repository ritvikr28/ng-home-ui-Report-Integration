import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DeleteNGDataView from "../DeleteNGData.view";

// Mock dependencies
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));

jest.mock("../../../../shared/utils", () => ({
  service: {
    post: jest.fn(),
    get: jest.fn()
  },
  getUserOrganisation: jest.fn().mockReturnValue("123"),
  envConfig: { BASE_URL: "http://mock-api.com" },
}));

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn().mockReturnValue("testUser"),
  }
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn()
}));

describe("DeleteNGDataView Component", () => {
  const statusMock = jest.fn();
  const inProgressStatusMock = jest.fn();
  const handleExceptionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle case when API returns null", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce(null);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle deletion API failure with non-401 errors", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Not Deleted" } });
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Deletion Failed"));

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    });

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle unauthorized error (401) gracefully", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Not Deleted" } });
    (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
  
    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );
  
    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
  
    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    });
  
    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle unexpected error during button click", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Unexpected API Error"));

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });
});