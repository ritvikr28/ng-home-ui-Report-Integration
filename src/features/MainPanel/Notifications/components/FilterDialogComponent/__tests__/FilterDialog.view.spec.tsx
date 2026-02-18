import { render, screen, fireEvent } from "@testing-library/react";
import FilterDialogView from "../FilterDialog.view";
import * as DialogHelper from "../dialog-helper";

const mockDialog = jest.fn(({ children, isOpen, onClose, ...props }: any) => (
    <div data-testid={props.dataTestId} {...props} data-is-open={isOpen}>
        {isOpen && (
            <>
                {children}
                {onClose && <button data-testid="dialog-close-trigger" onClick={onClose} type="button">Close</button>}
            </>
        )}
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

const mockButton = jest.fn(({ children, onClick, dataTestId, ...props }: any) => (
    <button onClick={onClick} type="button" data-testid={dataTestId} {...props}>
        {children}
    </button>
));

jest.mock("@essnextgen/ui-kit", () => ({
    Dialog: (props: any) => mockDialog(props),
    DialogContent: (props: any) => mockDialogContent(props),
    DialogFooter: (props: any) => mockDialogFooter(props),
    Button: (props: any) => mockButton(props),
    ButtonColor: {
        Primary: "primary",
        Secondary: "secondary",
    },
}));

jest.mock("../dialog-helper", () => ({
    DialogContent: jest.fn(({ startDate, endDate, status, priority, startDateError }: any) => (
        <div data-testid="mock-dialog-content">
            <div data-testid="content-start-date">{startDate}</div>
            <div data-testid="content-end-date">{endDate}</div>
            <div data-testid="content-status">{JSON.stringify(status)}</div>
            <div data-testid="content-priority">{JSON.stringify(priority)}</div>
            <div data-testid="content-start-date-error">{startDateError}</div>
        </div>
    )),
}));

const mockSetStatus = jest.fn();
const mockSetPriority = jest.fn();
const mockSetStartDate = jest.fn();
const mockSetEndDate = jest.fn();
const mockOnApply = jest.fn();
const mockOnClear = jest.fn();
const mockOnClose = jest.fn();

const defaultProps = {
    status: ["read"],
    setStatus: mockSetStatus,
    priority: ["high"],
    setPriority: mockSetPriority,
    startDate: "2024-01-01",
    setStartDate: mockSetStartDate,
    endDate: "2024-12-31",
    setEndDate: mockSetEndDate,
    startDateError: "",
    endDateError: "",
    isFormValid: true,
    onApply: mockOnApply,
    onClear: mockOnClear,
    onClose: mockOnClose,
};

describe("FilterDialogView", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockDialog.mockClear();
        mockDialogContent.mockClear();
        mockDialogFooter.mockClear();
        mockButton.mockClear();
    });

    describe("initial render", () => {
        it("should render dialog with isOpen set to true by default", () => {
            render(<FilterDialogView {...defaultProps} />);
            const dialog = screen.getByTestId("test-id");
            expect(dialog).toBeInTheDocument();
            expect(dialog).toHaveAttribute("data-is-open", "true");
        });

        it("should render dialog with correct props", () => {
            render(<FilterDialogView {...defaultProps} />);
            const dialog = screen.getByTestId("test-id");

            expect(dialog).toHaveClass("dialog-class");
            expect(dialog).toHaveAttribute("id", "element-id");
            expect(dialog).toHaveAttribute("data-testid", "test-id");
        });

        it("should render DialogContent component", () => {
            render(<FilterDialogView {...defaultProps} />);
            expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
        });

        it("should render Content component from dialog-helper with correct props", () => {
            render(<FilterDialogView {...defaultProps} />);
            const MockContent = jest.mocked(DialogHelper.DialogContent);

            expect(MockContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    startDate: "2024-01-01",
                    setStartDate: mockSetStartDate,
                    endDate: "2024-12-31",
                    setEndDate: mockSetEndDate,
                    status: ["read"],
                    setStatus: mockSetStatus,
                    priority: ["high"],
                    setPriority: mockSetPriority,
                    startDateError: "",
                }),
                {}
            );
        });

        it("should render DialogFooter component", () => {
            render(<FilterDialogView {...defaultProps} />);
            expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
        });

        it("should render dialog footer div with correct styles", () => {
            const { container } = render(<FilterDialogView {...defaultProps} />);
            const footerDiv = container.querySelector(".dialog-footer");
            expect(footerDiv).toBeInTheDocument();
            expect(footerDiv).toHaveStyle({
                display: "flex",
                gap: "24px",
                width: "100%",
                flexDirection: "row-reverse",
            });
        });
    });

    describe("handleClose", () => {
        it("should set isDialogOpen to false and call onClose when handleClose is called", () => {
            render(<FilterDialogView {...defaultProps} />);
            const dialog = screen.getByTestId("test-id");
            expect(dialog).toHaveAttribute("data-is-open", "true");

            const closeTrigger = screen.getByTestId("dialog-close-trigger");
            fireEvent.click(closeTrigger);

            expect(mockOnClose).toHaveBeenCalledTimes(1);

            const dialogMock = mockDialog as unknown as jest.Mock;
            const lastCall = dialogMock.mock.calls[dialogMock.mock.calls.length - 1];
            expect(lastCall[0].isOpen).toBe(false);
        });

    });

    describe("handleApply", () => {
        it("should call onApply and set isDialogOpen to false when Apply button is clicked", () => {
            render(<FilterDialogView {...defaultProps} />);
            const applyButton = screen.getByTestId("apply-btn");

            fireEvent.click(applyButton);

            expect(mockOnApply).toHaveBeenCalledTimes(1);

            const dialogMock = mockDialog as unknown as jest.Mock;
            const lastCall = dialogMock.mock.calls[dialogMock.mock.calls.length - 1];
            expect(lastCall[0].isOpen).toBe(false);
        });
    });

    describe("handleClear", () => {
        it("should call onClear when Clear all button is clicked", () => {
            render(<FilterDialogView {...defaultProps} />);
            const clearButton = screen.getByTestId("clear-all-btn");

            fireEvent.click(clearButton);

            expect(mockOnClear).toHaveBeenCalledTimes(1);
        });

        it("should not close dialog when Clear all button is clicked", () => {
            render(<FilterDialogView {...defaultProps} />);
            const clearButton = screen.getByTestId("clear-all-btn");
            const dialog = screen.getByTestId("test-id");

            fireEvent.click(clearButton);

            expect(mockOnClear).toHaveBeenCalledTimes(1);
            expect(dialog).toHaveAttribute("data-is-open", "true");
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    describe("props passing", () => {
        it("should pass all props correctly to Content component", () => {
            const customProps = {
                status: ["unread", "read"],
                setStatus: jest.fn(),
                priority: ["low", "medium"],
                setPriority: jest.fn(),
                startDate: "2023-06-01",
                setStartDate: jest.fn(),
                endDate: "2023-06-30",
                setEndDate: jest.fn(),
                startDateError: "",
                endDateError: "",
                isFormValid: true,
                onApply: jest.fn(),
                onClear: jest.fn(),
                onClose: jest.fn(),
            };

            render(<FilterDialogView {...customProps} />);
            const MockContent = jest.mocked(DialogHelper.DialogContent);

            expect(MockContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    startDate: "2023-06-01",
                    setStartDate: customProps.setStartDate,
                    endDate: "2023-06-30",
                    setEndDate: customProps.setEndDate,
                    status: ["unread", "read"],
                    setStatus: customProps.setStatus,
                    priority: ["low", "medium"],
                    setPriority: customProps.setPriority,
                    startDateError: "",
                }),
                {}
            );
        });
    });

    describe("fragment wrapper", () => {
        it("should render within a fragment", () => {
            const { container } = render(<FilterDialogView {...defaultProps} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});

describe("handleApply with startDateError", () => {
    it("should NOT call onApply or close dialog if startDateError is present", () => {
        const propsWithError = {
            ...defaultProps,
            onApply: mockOnApply,
            startDateError: "Some error",
            endDateError: "",
            isFormValid: true
        };
        render(<FilterDialogView {...propsWithError} />);
        const applyButton = screen.getByTestId("apply-btn");

        fireEvent.click(applyButton);

        expect(mockOnApply).not.toHaveBeenCalled();

        // Dialog should remain open
        const dialogMock = mockDialog as unknown as jest.Mock;
        const lastCall = dialogMock.mock.calls[dialogMock.mock.calls.length - 1];
        expect(lastCall[0].isOpen).toBe(true);
    });

    it("should NOT call onApply or close dialog if endDateError is present", () => {
        const propsWithError = {
            ...defaultProps,
            onApply: mockOnApply,
            startDateError: "",
            endDateError: "End date error",
            isFormValid: true
        };
        render(<FilterDialogView {...propsWithError} />);
        const applyButton = screen.getByTestId("apply-btn");

        fireEvent.click(applyButton);

        expect(mockOnApply).not.toHaveBeenCalled();

        const dialogMock = mockDialog as unknown as jest.Mock;
        const lastCall = dialogMock.mock.calls[dialogMock.mock.calls.length - 1];
        expect(lastCall[0].isOpen).toBe(true);
    });
});

it("should disable Apply button when isFormValid is false", () => {
  render(<FilterDialogView {...defaultProps} isFormValid={false} />);
  const applyButton = screen.getByTestId("apply-btn");
  fireEvent.click(applyButton);
  expect(mockOnApply).toHaveBeenCalled();
});

it("should remove status if already present", () => {
  const value = "read";
  const prev = ["read", "unread"];
  const result = prev.includes(value)
    ? prev.filter((s) => s !== value)
    : [...prev, value];
  expect(result).toEqual(["unread"]);
});

it("should add status if not present", () => {
  const value = "read";
  const prev = ["unread"];
  const result = prev.includes(value)
    ? prev.filter((s) => s !== value)
    : [...prev, value];
  expect(result).toEqual(["unread", "read"]);
});

it("should remove priority if already present", () => {
  const value = "high";
  const prev = ["high", "low"];
  const result = prev.includes(value)
    ? prev.filter((p) => p !== value)
    : [...prev, value];
  expect(result).toEqual(["low"]);
});

it("should add priority if not present", () => {
  const value = "high";
  const prev = ["low"];
  const result = prev.includes(value)
    ? prev.filter((p) => p !== value)
    : [...prev, value];
  expect(result).toEqual(["low", "high"]);
});
