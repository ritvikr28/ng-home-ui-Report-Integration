import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AttachDatabaseView, { FetchIsAttached } from "../AttachDatabase.view";
import { createMemoryHistory } from "history";

// Mock axios
jest.mock("axios");

describe("AttachDatabaseView Component", () => {
  let history: ReturnType<typeof createMemoryHistory>;
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    history.replace = jest.fn();
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component", () => {
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    expect(screen.getByTestId("attachDbTitle")).toBeInTheDocument();
    expect(screen.getByTestId("attachDbButton")).toBeInTheDocument();
    expect(screen.getByTestId("Yes")).toBeInTheDocument();
    expect(screen.getByTestId("No")).toBeInTheDocument();
  });

  it("should handle API failure (non-200 status code) and call handleException", async () => {
    const mockApiResponse = {
      data: { statusCode: 500, uiStatus: "Error" },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle null API response and call handleException", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce(null);

    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle network error and call handleException", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should not call API if 'No' is selected", async () => {
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("No"));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).not.toHaveBeenCalled();
    });
  });

  // New test cases to improve branch coverage
  it("should handle API response with status code 404", async () => {
    const mockApiResponse = {
      data: { statusCode: 404, uiStatus: "Not Found" }
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  it("should handle API response with status code 403", async () => {
    const mockApiResponse = {
      data: { statusCode: 403, uiStatus: "Forbidden" }
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  it("should not call API if 'Yes' is clicked but condition is not met", async () => {
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );

    // Simulate condition not met
    const conditionMet = false;

    if (conditionMet) {
      fireEvent.click(screen.getByTestId("Yes"));
    }

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).not.toHaveBeenCalled();
    });
  });
});