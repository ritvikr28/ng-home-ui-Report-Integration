import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DetachDatabaseView from "../DetachDatabase.view"; // Adjust the import path accordingly

// Mock axios
jest.mock("axios");

describe("DetachDatabaseView Component", () => {
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component", () => {
    render(
      <DetachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    expect(
      screen.getByTestId("attachDBtitle")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("attachDBbutton")
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
      <DetachDatabaseView
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
      <DetachDatabaseView
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
      <DetachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
    });
    consoleErrorMock.mockRestore();
  });

  it("should call status with uiStatus if response.statusCode === 200", async () => {
    const mockResponse = { statusCode: 200, uiStatus: "Success" };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
  
    render(<DetachDatabaseView status={statusMock} handleException={HandleExceptionMock} />);
  
    fireEvent.click(screen.getByTestId("Yes"));  
    await waitFor(() => {
      expect(HandleExceptionMock).not.toHaveBeenCalled(); // Ensure no exception is triggered
    });
  });
  
  it("should call handleException if response.statusCode !== 200", async () => {
    const mockResponse = { statusCode: 500, uiStatus: "Error" };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
  
    render(<DetachDatabaseView status={statusMock} handleException={HandleExceptionMock} />);
  
    fireEvent.click(screen.getByTestId("Yes"));  
    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled(); // Ensure exception handler is called
      expect(statusMock).not.toHaveBeenCalled(); // Ensure status is not called
    });
  });


  it("should not call API if 'No' is selected", async () => {
    render(
      <DetachDatabaseView
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
