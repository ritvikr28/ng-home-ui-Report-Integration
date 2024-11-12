import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AttachDatabaseView from "../AttachDatabase.view";

// Mock axios
jest.mock("axios");

describe("AttachDatabaseView Component", () => {
  const statusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component", () => {
    render(<AttachDatabaseView status={statusMock} />);
    expect(
      screen.getByText("Is the SIMS7 database attached?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please click on Yes to attach")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Yes")).toBeInTheDocument();
    expect(screen.getByLabelText("No")).toBeInTheDocument();
  });

  it("should handle API errors gracefully", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<AttachDatabaseView status={statusMock} />);
    fireEvent.click(screen.getByLabelText("Yes"));

    // Wait for the effect of the click to propagate
    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled(); // Ensure status function is not called
      expect(consoleErrorMock).toHaveBeenCalledWith("Failed to fetch data"); // Check for error logging
    });

    consoleErrorMock.mockRestore(); // Restore original console.error
  });
});
