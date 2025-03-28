import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import DeleteNGDataView from "../DeleteNGData.view";
import { service } from "../../../../shared/utils";

jest.mock("axios");

// Mock service
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

describe("DeleteNGDataView Component", () => {
  let history: ReturnType<typeof createMemoryHistory>;
  const statusMock = jest.fn();
  const inProgressStatusMock = jest.fn();
  const handleExceptionMock = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    history.replace = jest.fn();
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
  });

  it("should render the component", () => {
    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  it("should handle button click and show in progress dialog", async () => {
    const mockApiResponse = {
      data: { deleteNGDataStatus: "In Progress" }
    };
    (service.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
    });

    expect(await screen.findByText("Deletion of NG Data in Progress")).toBeInTheDocument();
  });

  it("should handle button click and disable proceed button if already deleted", async () => {
    const mockApiResponse = {
      data: { deleteNGDataStatus: "Deleted" }
    };
    (service.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(statusMock).toHaveBeenCalledWith("Deleted");
    });

    const proceedButton = await screen.findByRole("button", { name: /Proceed/i });
    expect(proceedButton).toBeDisabled();
  });

  it("should handle button click and call handleException on error", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle delete action and call inProgressStatus", async () => {
    const mockApiResponse = {
      data: { statusCode: 200 }
    };
    (service.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Delete"));
    });

    await waitFor(() => {
      expect(inProgressStatusMock).toHaveBeenCalledWith("In Progress");
    });
  });

  it("should handle delete action and call handleException on error", async () => {
    (service.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Delete"));
    });

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle close dialog action", async () => {
    const mockApiResponse = {
      data: { deleteNGDataStatus: "Not Deleted" }
    };
    (service.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(screen.queryByText("Delete Next Gen Data?")).not.toBeInTheDocument();
  });

  it("should handle FetchPreCheckStatus 401 error and call errorHandler", async () => {
    const errorResponse = { response: { status: 401 } };
    (service.get as jest.Mock).mockRejectedValueOnce(errorResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });


  it("should disable the Proceed button when data is Deleted", async () => {
    const mockApiResponse = {
      data: { deleteNGDataStatus: "Deleted" }
    };
    (service.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(screen.getByText("Proceed")).toBeDisabled();
    });
  });

  it("should correctly format API request on delete action", async () => {
    const mockApiResponse = { data: { statusCode: 200 } };
    (service.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));
    await waitFor(() => fireEvent.click(screen.getByText("Delete")));

    expect(service.post).toHaveBeenCalledWith(
      expect.stringContaining("/TrainingDB/ProcessNGDeletion"),
      expect.objectContaining({
        dataDeletedStatus: "N"
      })
    );
  });

  it("should close the delete dialog when cancel is clicked", async () => {
    const mockApiResponse = {
      data: { deleteNGDataStatus: "Not Deleted" }
    };
    (service.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={handleExceptionMock}
      />
    );

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(screen.queryByText("Delete Next Gen Data?")).not.toBeInTheDocument();
  });
});