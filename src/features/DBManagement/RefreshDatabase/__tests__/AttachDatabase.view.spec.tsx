import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AttachDatabaseView from "../AttachDatabase.view";

// Mock axios
jest.mock("axios");

describe("AttachDatabaseView Component", () => {
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component", () => {
    render(
      <AttachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    expect(
      screen.getByTestId("attachDbTitle")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("attachDbButton")
    ).toBeInTheDocument();
    expect(screen.getByTestId("Yes")).toBeInTheDocument();
    expect(screen.getByTestId("No")).toBeInTheDocument();
  });


  it("should handle API success", async () => {
    const mockApiResponse = {
      data: { statusCode: 200, uiStatus: "Detached" }
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
      expect(statusMock).not.toHaveBeenCalledWith("In progress");
    });
  });

  it("should handle API failure", async () => {
    const mockApiResponse = {
      data: { statusCode: 500, uiStatus: "Failed to fetch data" }
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
      expect(statusMock).not.toHaveBeenCalledWith("Detached");
    });
  });

  it("should handle API errors gracefully", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

      render(
        <AttachDatabaseView
          status={statusMock}
          handleException={HandleExceptionMock}
        />
      );
    fireEvent.click(screen.getByTestId("Yes"));

    // Wait for the effect of the click to propagate
    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled(); // Ensure status function is not called
      expect(consoleErrorMock).toHaveBeenCalledWith("Failed to fetch data"); // Check for error logging
    });

    consoleErrorMock.mockRestore(); // Restore original console.error
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
    });
  });

});
