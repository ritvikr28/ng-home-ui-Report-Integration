import { render, screen, fireEvent } from "@testing-library/react";
import NoSelectionDialog from "../NoSelectionDialog";

describe("NoSelectionDialog", () => {

  it("calls setShowDialog(false) when Okay button is clicked", () => {
    const setShowDialog = jest.fn();
    render(<NoSelectionDialog setShowDialog={setShowDialog} />);
    fireEvent.click(screen.getByRole("button", { name: /okay/i }));
    expect(setShowDialog).toHaveBeenCalledWith(false);
  });

 it("renders loader when loading is true and hides title/message/notification", () => {
    const setShowDialog = jest.fn();
    render(<NoSelectionDialog setShowDialog={setShowDialog} loading={true} title="Test Title" message="Test Message" notificationTitle="Test Notification" />);
    expect(screen.getByTestId("test-id")).toBeInTheDocument();
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Notification")).not.toBeInTheDocument();
  });

  it("renders title, message, and notification when provided", () => {
    const setShowDialog = jest.fn();
    render(
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        title="Dialog Title"
        message="Dialog Message"
        notificationTitle="Dialog Notification"
      />
    );
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog Message")).toBeInTheDocument();
    expect(screen.getByText("Dialog Notification")).toBeInTheDocument();
  });

  it("does not render notification if notificationTitle is not provided", () => {
    const setShowDialog = jest.fn();
    render(
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        title="Dialog Title"
        message="Dialog Message"
      />
    );
    expect(screen.queryByText("Dialog Notification")).not.toBeInTheDocument();
  });

  it("calls setShowDialog(false) when dialog is closed", () => {
  const setShowDialog = jest.fn();
  render(<NoSelectionDialog setShowDialog={setShowDialog} />);
  // Simulate dialog close by clicking the close button
  fireEvent.click(screen.getByTestId("dialog-close-button"));
  expect(setShowDialog).toHaveBeenCalledWith(false);
});
});