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

  it("should show deletion dialog when precheckStatus is 'Not Deleted'", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "Not Deleted" } });

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(screen.getByText(/Delete Next Gen Data?/i)).toBeTruthy();
    });
  });

  it("should show in-progress dialog when precheckStatus is 'In Progress'", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { deleteNGDataStatus: "In Progress" } });

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));

    await waitFor(() => {
      expect(screen.findByText(/Deletion of NG Data in Progress/i)).toBeTruthy();
    });
  });

  it("should handle API error during precheckStatus fetch", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

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

  it("should handle deletion process and update status to 'In Progress'", async () => {
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
      fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    });

    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
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
      fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    });

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
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
      expect(screen.queryByText(/Delete Next Gen Data?/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Deletion of NG Data in Progress/i)).not.toBeInTheDocument();
    });
  });
});
