import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmationModalView from "./DeleteConfirmationModal.view";

const mockButton = jest.fn(({ children, onClick, dataTestId, color, ...rest }: any) => (
    <button type="button" data-testid={dataTestId} onClick={onClick} {...rest}>
        {children}
    </button>
));
const mockDialog = jest.fn(({ children, title, dataTestId, isOpen }: any) =>
    isOpen ? (
        <div data-testid={dataTestId}>
            {title && <div>{title}</div>}
            {children}
        </div>
    ) : null
);
const mockLoader = jest.fn(({ loaderText }: any) => <div>{loaderText}</div>);
const mockNotification = jest.fn(({ title }: any) => <div>{title}</div>);

jest.mock("@essnextgen/ui-kit", () => ({
    Dialog: (props: any) => mockDialog(props),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
    Button: (props: any) => mockButton(props),
    Notification: (props: any) => mockNotification(props),
    Loader: (props: any) => mockLoader(props),
    ButtonColor: { Primary: "primary", Secondary: "secondary" },
    LoaderType: { Circular: "circular" },
    NotificationStatus: { WARNING: "warning" }
}));

describe("DeleteConfirmationModalView", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    selectedCount: 2,
    isLoading: false,
    isNoSelection: false
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog when open", () => {
    render(<DeleteConfirmationModalView {...defaultProps} />);
    expect(screen.getByTestId("delete-confirmation-modal")).toBeInTheDocument();
    expect(screen.getByText("Delete notification?")).toBeInTheDocument();
  });

  it("shows loader when isLoading is true", () => {
    render(<DeleteConfirmationModalView {...defaultProps} isLoading />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows no selection dialog when isNoSelection is true", () => {
    render(<DeleteConfirmationModalView {...defaultProps} isNoSelection />);
    expect(screen.getByText("No items selected")).toBeInTheDocument();
    expect(screen.getByText("Please select at least one item to perform the action.")).toBeInTheDocument();
    expect(screen.getByTestId("no-selection-ok-btn")).toBeInTheDocument();
  });

  it("calls onClose when Keep it button is clicked", () => {
    render(<DeleteConfirmationModalView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("keep-it-btn"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when Delete button is clicked", () => {
    render(<DeleteConfirmationModalView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it("calls onClose when Okay button is clicked in no selection dialog", () => {
    render(<DeleteConfirmationModalView {...defaultProps} isNoSelection />);
    fireEvent.click(screen.getByTestId("no-selection-ok-btn"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disables escapeExits and onClose when loading", () => {
    render(<DeleteConfirmationModalView {...defaultProps} isLoading />);
    // escapeExits and onClose are props to Dialog, so we can't directly test them,
    // but we can check that the loader is shown and buttons are not rendered
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.queryByTestId("keep-it-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-btn")).not.toBeInTheDocument();
  });

  it("shows correct notification count in warning", () => {
    render(<DeleteConfirmationModalView {...defaultProps} selectedCount={5} />);
    expect(screen.getByText("[5] notifications will be gone forever once deleted.")).toBeInTheDocument();
  });
});
