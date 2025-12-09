import { render, screen, fireEvent } from "@testing-library/react";
import FilterDialogLogic from "../FilterDialog.logic";

const mockSetFilterBtnClicked = jest.fn();
const mockOnApply = jest.fn();
const mockOnClear = jest.fn();

const mockFilterDialogView = jest.fn((props: any) => (
    <div data-testid="mocked-view">
        <div data-testid="status">{JSON.stringify(props.status)}</div>
        <div data-testid="priority">{JSON.stringify(props.priority)}</div>
        <div data-testid="start-date">{props.startDate}</div>
        <div data-testid="end-date">{props.endDate}</div>
        <button type="button" data-testid="apply-btn" onClick={props.onApply}>
            Apply
        </button>
        <button type="button" data-testid="clear-btn" onClick={props.onClear}>
            Clear
        </button>
        <button type="button" data-testid="close-btn" onClick={props.onClose}>
            Close
        </button>
    </div>
));

jest.mock("../FilterDialog.view", () => (props: any) => mockFilterDialogView(props));

describe("FilterDialogLogic", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("initial state", () => {
        it("should initialize with empty arrays and empty strings when filters prop is not provided", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent("[]");
            expect(screen.getByTestId("priority")).toHaveTextContent("[]");
            expect(screen.getByTestId("start-date")).toHaveTextContent("");
            expect(screen.getByTestId("end-date")).toHaveTextContent("");
        });

        it("should initialize with filters prop values when provided", () => {
            const filters = {
                status: ["read", "unread"],
                priority: ["high"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent(JSON.stringify(["read", "unread"]));
            expect(screen.getByTestId("priority")).toHaveTextContent(JSON.stringify(["high"]));
            expect(screen.getByTestId("start-date")).toHaveTextContent("2024-01-01");
            expect(screen.getByTestId("end-date")).toHaveTextContent("2024-12-31");
        });

        it("should initialize with empty arrays when filters prop has undefined status and priority", () => {
            const filters = {
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent("[]");
            expect(screen.getByTestId("priority")).toHaveTextContent("[]");
        });

        it("should initialize with empty strings when filters prop has undefined dates", () => {
            const filters = {
                status: ["read"],
                priority: ["high"],
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("start-date")).toHaveTextContent("");
            expect(screen.getByTestId("end-date")).toHaveTextContent("");
        });
    });

    describe("useEffect - filters prop updates", () => {
        it("should update state when filters prop changes", () => {
            const initialFilters = {
                status: ["read"],
                priority: ["high"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            const { rerender } = render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={initialFilters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent(JSON.stringify(["read"]));

            const updatedFilters = {
                status: ["unread"],
                priority: ["low", "medium"],
                startDate: "2023-01-01",
                endDate: "2023-12-31",
            };

            rerender(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={updatedFilters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent(JSON.stringify(["unread"]));
            expect(screen.getByTestId("priority")).toHaveTextContent(JSON.stringify(["low", "medium"]));
            expect(screen.getByTestId("start-date")).toHaveTextContent("2023-01-01");
            expect(screen.getByTestId("end-date")).toHaveTextContent("2023-12-31");
        });

        it("should update state to empty arrays when filters prop changes to undefined arrays", () => {
            const initialFilters = {
                status: ["read"],
                priority: ["high"],
            };

            const { rerender } = render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={initialFilters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent(JSON.stringify(["read"]));

            rerender(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent("[]");
            expect(screen.getByTestId("priority")).toHaveTextContent("[]");
        });

        it("should update state to empty strings when filters prop changes to undefined dates", () => {
            const initialFilters = {
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            const { rerender } = render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={initialFilters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("start-date")).toHaveTextContent("2024-01-01");

            rerender(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("start-date")).toHaveTextContent("");
            expect(screen.getByTestId("end-date")).toHaveTextContent("");
        });
    });

    describe("handleApply", () => {
        it("should call onApply with non-empty arrays and strings when they have values", () => {
            const filters = {
                status: ["read"],
                priority: ["high"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("apply-btn"));

            expect(mockOnApply).toHaveBeenCalledTimes(1);
            expect(mockOnApply).toHaveBeenCalledWith({
                status: ["read"],
                priority: ["high"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            });
        });

        it("should call onApply with undefined for empty arrays", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("apply-btn"));

            expect(mockOnApply).toHaveBeenCalledTimes(1);
            expect(mockOnApply).toHaveBeenCalledWith({
                status: undefined,
                priority: undefined,
                startDate: undefined,
                endDate: undefined,
            });
        });

        it("should call onApply with undefined for empty strings", () => {
            const filters = {
                status: ["read"],
                priority: ["high"],
                startDate: "",
                endDate: "",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("apply-btn"));

            expect(mockOnApply).toHaveBeenCalledTimes(1);
            expect(mockOnApply).toHaveBeenCalledWith({
                status: ["read"],
                priority: ["high"],
                startDate: undefined,
                endDate: undefined,
            });
        });

        it("should call setFilterBtnClicked with false after applying filters", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("apply-btn"));

            expect(mockSetFilterBtnClicked).toHaveBeenCalledTimes(1);
            expect(mockSetFilterBtnClicked).toHaveBeenCalledWith(false);
        });

        it("should handle mixed empty and non-empty values correctly", () => {
            const filters = {
                status: ["read"],
                priority: [],
                startDate: "2024-01-01",
                endDate: "",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("apply-btn"));

            expect(mockOnApply).toHaveBeenCalledWith({
                status: ["read"],
                priority: undefined,
                startDate: "2024-01-01",
                endDate: undefined,
            });
        });
    });

    describe("handleClear", () => {
        it("should clear all state values to empty arrays and empty strings", () => {
            const filters = {
                status: ["read", "unread"],
                priority: ["high", "low"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            };

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={filters}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent(JSON.stringify(["read", "unread"]));

            fireEvent.click(screen.getByTestId("clear-btn"));

            expect(screen.getByTestId("status")).toHaveTextContent("[]");
            expect(screen.getByTestId("priority")).toHaveTextContent("[]");
            expect(screen.getByTestId("start-date")).toHaveTextContent("");
            expect(screen.getByTestId("end-date")).toHaveTextContent("");
        });

        it("should call onApply with all undefined values when clearing", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("clear-btn"));

            expect(mockOnApply).toHaveBeenCalledTimes(1);
            expect(mockOnApply).toHaveBeenCalledWith({
                status: undefined,
                priority: undefined,
                startDate: undefined,
                endDate: undefined,
            });
        });

        it("should call onClear callback when clearing", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("clear-btn"));

            expect(mockOnClear).toHaveBeenCalledTimes(1);
        });

        it("should call setFilterBtnClicked with false after clearing", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("clear-btn"));

            expect(mockSetFilterBtnClicked).toHaveBeenCalledTimes(1);
            expect(mockSetFilterBtnClicked).toHaveBeenCalledWith(false);
        });

        it("should call onApply before onClear when clearing", () => {
            const callOrder: string[] = [];
            const onApplyWithTracking = jest.fn(() => {
                callOrder.push("onApply");
            });
            const onClearWithTracking = jest.fn(() => {
                callOrder.push("onClear");
            });

            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={onApplyWithTracking}
                    onClear={onClearWithTracking}
                />
            );

            fireEvent.click(screen.getByTestId("clear-btn"));

            expect(callOrder).toEqual(["onApply", "onClear"]);
        });
    });

    describe("handleClose", () => {
        it("should call setFilterBtnClicked with false when closing", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("close-btn"));

            expect(mockSetFilterBtnClicked).toHaveBeenCalledTimes(1);
            expect(mockSetFilterBtnClicked).toHaveBeenCalledWith(false);
        });

        it("should not call onApply or onClear when closing", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            fireEvent.click(screen.getByTestId("close-btn"));

            expect(mockOnApply).not.toHaveBeenCalled();
            expect(mockOnClear).not.toHaveBeenCalled();
        });
    });

    describe("default filters prop", () => {
        it("should handle default empty filters prop", () => {
            render(
                <FilterDialogLogic
                    setFilterBtnClicked={mockSetFilterBtnClicked}
                    filters={{}}
                    onApply={mockOnApply}
                    onClear={mockOnClear}
                />
            );

            expect(screen.getByTestId("status")).toHaveTextContent("[]");
            expect(screen.getByTestId("priority")).toHaveTextContent("[]");
            expect(screen.getByTestId("start-date")).toHaveTextContent("");
            expect(screen.getByTestId("end-date")).toHaveTextContent("");
        });
    });
});
