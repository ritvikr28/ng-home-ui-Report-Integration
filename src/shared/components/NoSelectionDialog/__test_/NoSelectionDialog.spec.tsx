import { render, screen, fireEvent } from "@testing-library/react";
import NoSelectionDialog from "../NoSelectionDialog";

describe("NoSelectionDialog", () => {
  it("calls setShowDialog(false) and onClose when Okay button is clicked", () => {
    const setShowDialog = jest.fn();
    const onClose = jest.fn(); // Mock the onClose function
    render(
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /okay/i }));
    expect(setShowDialog).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalled(); // Ensure onClose is called
  });

  it("renders loader when loading is true and hides title/message/notification", () => {
    const setShowDialog = jest.fn();
    render(
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        loading={true}
        title="Test Title"
        message="Test Message"
        notificationTitle="Test Notification"
        onClose={jest.fn()} // Provide a mock onClose function
      />
    );
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
        onClose={jest.fn()} // Provide a mock onClose function
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
        onClose={jest.fn()} // Provide a mock onClose function
      />
    );
    expect(screen.queryByText("Dialog Notification")).not.toBeInTheDocument();
  });

  it("calls setShowDialog(false) when dialog is closed", () => {
    const setShowDialog = jest.fn();
    const onClose = jest.fn(); // Mock the onClose function
    render(
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        onClose={onClose}
      />
    );
    // Simulate dialog close by clicking the close button
    fireEvent.click(screen.getByTestId("dialog-close-button"));
    expect(setShowDialog).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalled(); // Ensure onClose is called
  });
});