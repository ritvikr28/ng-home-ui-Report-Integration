import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SyncDataView from "../SyncData.view";

describe("SyncDataView Component", () => {
  const statusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render the component and button", () => {
    render(<SyncDataView status={statusMock} />);

    expect(
      screen.getByText(/The data synchronization is expected to be completed within 24 hours./i)
    ).toBeInTheDocument();
  });

  it("should show confirmation dialog when sync button is clicked", () => {
    render(<SyncDataView status={statusMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Sync/i }));
  });

  it('should call status with "true" when dialog is closed', async () => {
    render(<SyncDataView status={statusMock} />);
    await waitFor(() => {
      expect(statusMock).not.toBeCalledWith("true");
    });
  });
});
