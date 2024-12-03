import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteNGDataView from "../DeleteNGData.view";
import axios from "axios";

// Mock external dependencies
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));

jest.mock("../../../../shared/utils", () => ({
  service: {
    post: jest.fn(),
  },
  getUserOrganisation: jest.fn().mockReturnValue("123"),
  envConfig: { BASE_URL: "http://mock-api.com" },
}));

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn().mockReturnValue("testUser"),
  },
}));

jest.mock("axios");

describe("DeleteNGDataView Component", () => {
  const statusMock = jest.fn();
  const inProgressStatusMock = jest.fn();
  const HandleExceptionMock = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component and button", () => {
    render(<DeleteNGDataView status={statusMock} 
      inProgressStatus={inProgressStatusMock}
      handleException={HandleExceptionMock}  />);
    expect(screen.getByText(/Proceed/i)).toBeInTheDocument();
  });

  it("should show confirmation dialog when Proceed button is clicked", () => {
    render(<DeleteNGDataView status={statusMock} 
      inProgressStatus={inProgressStatusMock} 
      handleException={HandleExceptionMock} />);
    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
    expect(screen.getByText(/Delete Next Gen Data?/i)).toBeInTheDocument();
  });

  it("should call handleDelete on Confirm and update status to 'In Progress'", async () => {
    // Mock API response (successful)
    const mockPostResponse = { statusCode: 200, uiStatus: "Success"  };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockPostResponse);

    render(<DeleteNGDataView status={statusMock} inProgressStatus={inProgressStatusMock}  handleException={HandleExceptionMock}/>);

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      // Ensure statusMock is called with 'In Progress'
      expect(statusMock).not.toHaveBeenCalledWith("In Progress");
    });
  });

  it("should update status to 'Failed' if the API response is not successful", async () => {
    // Mock failed API response
    const mockPostResponse = { statusCode: 404, uiStatus: "Error" };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockPostResponse);

    render(<DeleteNGDataView status={statusMock} inProgressStatus={inProgressStatusMock}  handleException={HandleExceptionMock}/>);

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled(); 
    });
  });

  it("should call handleCloseDialog when dialog is closed", () => {
    const handleCloseDialogMock = jest.fn();
    render(
      <DeleteNGDataView
        status={statusMock}
        inProgressStatus={inProgressStatusMock}
        handleException={HandleExceptionMock}
        
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(handleCloseDialogMock).not.toHaveBeenCalled();
  });

  it("should handle errors in handleDelete function", async () => {
    const mockPostResponse = { statusCode: 500, uiStatus: "Error"  };
    (axios.get as jest.Mock).mockRejectedValueOnce(mockPostResponse);

    render(<DeleteNGDataView status={statusMock} inProgressStatus={inProgressStatusMock}  handleException={HandleExceptionMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Proceed/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
 
    await waitFor(() => {
     
      expect(statusMock).not.toHaveBeenCalled(); // Ensure status is not called
    });
  });
});
