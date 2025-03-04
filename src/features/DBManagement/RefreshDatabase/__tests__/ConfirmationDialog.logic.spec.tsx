import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "../ConfirmationDialog.logic";

describe("ConfirmDialog Component", () => {
  const mockOnSubmitHandle = jest.fn();
  const mockOnCloseHandle = jest.fn();

  const defaultProps = {
    title: "Confirmation Dialog",
    description: "Are you sure you want to proceed?",
    confirmActionButtonText: "Confirm",
    cancelActionButtonText: "Cancel",
    dataTestId: "test-dialog",
    isOpen: true,
    optionalButton: true,
    onSubmitHandle: mockOnSubmitHandle,
    onCloseHandle: mockOnCloseHandle,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the dialog with provided title and description", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it("should render the confirm and cancel buttons with correct text", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText(defaultProps.confirmActionButtonText);
    const cancelButton = screen.getByText(defaultProps.cancelActionButtonText);

    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("should call `onSubmitHandle` when confirm button is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText(defaultProps.confirmActionButtonText);
    fireEvent.click(confirmButton);

    expect(mockOnSubmitHandle).toHaveBeenCalledTimes(1);
  });

  it("should call `onCloseHandle` when cancel button is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const cancelButton = screen.getByText(defaultProps.cancelActionButtonText);
    fireEvent.click(cancelButton);

    expect(mockOnCloseHandle).toHaveBeenCalledTimes(1);
  });

  it("should close the dialog when `onCloseHandle` is called", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);

    const dialogElement = screen.queryByText(defaultProps.title);
    expect(dialogElement).not.toBeInTheDocument();
  });

  it("should handle the absence of optional cancel button", () => {
    render(<ConfirmDialog {...defaultProps} optionalButton={false} />);

    const cancelButton = screen.queryByText(defaultProps.cancelActionButtonText);
    expect(cancelButton).not.toBeInTheDocument();
  });

  it("should remove body no-scroll class on close", () => {
    document.body.classList.add("essui-body--no-scroll");

    render(<ConfirmDialog {...defaultProps} />);
    const cancelButton = screen.getByText(defaultProps.cancelActionButtonText);
    fireEvent.click(cancelButton);

    expect(document.body.classList.contains("essui-body--no-scroll")).toBe(false);
  });

  it("should handle default props if not provided", () => {
    render(
      <ConfirmDialog
        title="Default Props Test"
        description="Testing default props"
        onSubmitHandle={mockOnSubmitHandle}
        onCloseHandle={mockOnCloseHandle}
        isOpen={true} 
      />
    );

    expect(screen.getByRole("button", { name: /Ok/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument();
  });

  it("should not render the dialog when isOpen is false", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);

    const dialogElement = screen.queryByText(defaultProps.title);
    expect(dialogElement).not.toBeInTheDocument();
  });

  it("should render the dialog with default confirm and cancel button text", () => {
    render(
      <ConfirmDialog
        title="Default Button Text Test"
        description="Testing default button text"
        onSubmitHandle={mockOnSubmitHandle}
        onCloseHandle={mockOnCloseHandle}
        isOpen={true}
        optionalButton={true} // Ensure optionalButton is true to render the cancel button
      />
    );

    expect(screen.getByRole("button", { name: /Ok/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });
});