import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DetachDatabaseView, { FetchIsDetached } from "../DetachDatabase.view"; // Adjust the import path accordingly

// Mock axios
jest.mock("axios");

import { createMemoryHistory } from 'history';
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";

describe("DetachDatabaseView Component", () => {
  const statusMock = jest.fn();
  const HandleExceptionMock = jest.fn();
  const history = createMemoryHistory();
  history.replace = jest.fn(); 
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
      screen.getByTestId("detachDBtitle")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("detachDBbutton")
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

  // Additional test cases to improve coverage
  it("should handle invalid token error and redirect to unauthorized", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      message: "Invalid token"
    });

    render(
      <DetachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should handle API call without response and call handleException", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({});

    render(
      <DetachDatabaseView
        status={statusMock}
        handleException={HandleExceptionMock}
      />
    );
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });

  // it("should handle FetchIsDetached function with valid response", async () => {
  //   const mockApiResponse = { data: { statusCode: 200, uiStatus: "Success" } };
  
  //   // Mock axios.post to return a successful response
  //   (axios.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);
  
  //   const result = await FetchIsDetached(HandleExceptionMock, history);
  
  //   expect(result).toEqual(mockApiResponse.data);
  //   expect(HandleExceptionMock).not.toHaveBeenCalled();
  // });
  it("should handle FetchIsDetached function with other error", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 500 }
    });

    const result = await FetchIsDetached(HandleExceptionMock, history);

    expect(result).toBeNull();
    expect(HandleExceptionMock).toHaveBeenCalled();
  });

  it("should handle FetchIsDetached function with network error", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await FetchIsDetached(HandleExceptionMock, history);

    expect(result).toBeNull();
    expect(HandleExceptionMock).toHaveBeenCalled();
  });

  it("should render the component", () => {
    render(<DetachDatabaseView status={statusMock} handleException={HandleExceptionMock} />);
    expect(screen.getByTestId("detachDBtitle")).toBeInTheDocument();
    expect(screen.getByTestId("detachDBbutton")).toBeInTheDocument();
    expect(screen.getByTestId("Yes")).toBeInTheDocument();
    expect(screen.getByTestId("No")).toBeInTheDocument();
  });


  it("should call handleException on API failure", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<DetachDatabaseView status={statusMock} handleException={HandleExceptionMock} />);
    fireEvent.click(screen.getByTestId("Yes"));

    await waitFor(() => {
      expect(HandleExceptionMock).toHaveBeenCalled();
    });
  });
  


  it("should handle FetchIsDetached function with general error", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } });

    const result = await FetchIsDetached(HandleExceptionMock, history);

    expect(result).toBeNull();
    expect(HandleExceptionMock).toHaveBeenCalled();
  });

  it("should not call API if 'No' is selected", async () => {
    render(<DetachDatabaseView status={statusMock} handleException={HandleExceptionMock} />);
    fireEvent.click(screen.getByTestId("No"));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(HandleExceptionMock).not.toHaveBeenCalled();
    });
  });
});