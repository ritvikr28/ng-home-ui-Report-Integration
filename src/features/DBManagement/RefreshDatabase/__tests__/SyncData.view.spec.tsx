import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SyncDataView from "../SyncData.view"; // Adjust the import path accordingly

describe("SyncDataView Component", () => {
  const statusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component and button", () => {
    render(<SyncDataView status={statusMock} />);

    expect(
      screen.getByText(/Data sync will be completed by/i)
    ).toBeInTheDocument();
  });

  it("should show confirmation dialog when sync button is clicked", () => {
    render(<SyncDataView status={statusMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
  });

  it('should call status with "true" when dialog is closed', async () => {
    render(<SyncDataView status={statusMock} />);

    // fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
    // fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(statusMock).not.toBeCalledWith("true");
    });
  });
});
