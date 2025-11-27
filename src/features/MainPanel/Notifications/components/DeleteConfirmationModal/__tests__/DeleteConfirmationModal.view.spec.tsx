import React from "react";
import { render, screen } from "@testing-library/react";
import DeleteConfirmationModalView from "../DeleteConfirmationModal.view";

const mockDialog = jest.fn(({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
        {children}
    </div>
));

const mockDialogContent = jest.fn(({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>
        {children}
    </div>
));

const mockDialogFooter = jest.fn(({ children, ...props }: any) => (
    <div data-testid="dialog-footer" {...props}>
        {children}
    </div>
));

const mockNotification = jest.fn((props: any) => (
    <div data-testid="notification" {...props} />
));

const mockLoader = jest.fn((props: any) => (
    <div data-testid="loader" {...props} />
));

const forwardButton = React.forwardRef<HTMLButtonElement, any>(({ children, onClick, ...props }, ref) => (
    <button ref={ref} onClick={onClick} type="button" {...props}>
        {children}
    </button>
));
const mockButton = jest.fn((props: any) => forwardButton(props));

jest.mock("@essnextgen/ui-kit", () => {
    const mocks = {
        Dialog: (props: any) => mockDialog(props),
        DialogContent: (props: any) => mockDialogContent(props),
        DialogFooter: (props: any) => mockDialogFooter(props),
        Notification: (props: any) => mockNotification(props),
        Loader: (props: any) => mockLoader(props),
        LoaderType: { Circular: "circular" },
        NotificationStatus: { WARNING: "warning" },
        Button: (props: any) => mockButton(props),
        ButtonColor: { Secondary: "secondary", Primary: "primary" }
    };
    return mocks;
});

describe("DeleteConfirmationModalView", () => {
    const baseProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        selectedCount: 3,
        isLoading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows loader and disables close actions while loading", () => {
        render(<DeleteConfirmationModalView {...baseProps} isLoading />);

        expect(screen.getByTestId("loader")).toBeInTheDocument();
        expect(screen.queryByTestId("dialog-footer")).not.toBeInTheDocument();

        const dialogProps = mockDialog.mock.calls[0][0];
        expect(dialogProps.escapeExits).toBe(false);
        expect(dialogProps.onClose).toBeUndefined();
    });
});

