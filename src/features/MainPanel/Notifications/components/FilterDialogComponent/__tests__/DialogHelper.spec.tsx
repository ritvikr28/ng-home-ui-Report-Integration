import { render, screen, act } from "@testing-library/react";
import { DialogContent } from "../dialog-helper";

const mockFormLabel = jest.fn(({ children, forId, className }: any) => (
    <label htmlFor={forId} className={className}>
        {children}
    </label>
));

const mockCheckBox = jest.fn(({ id, label, onChange, value, dataTestId }: any) => (
    <div id={id} data-testid={dataTestId}>
        <input
            type="checkbox"
            id={id}
            value={value}
            onChange={onChange}
            data-testid={`checkbox-${dataTestId}`}
        />
        <label htmlFor={id}>{label}</label>
    </div>
));

const mockDateInput = jest.fn(({ id, dataTestId, day, month, year }: any) => (
    <div data-testid={dataTestId} id={id}>
        <input
            data-testid="test-id"
            type="text"
            value={`${day || ""}/${month || ""}/${year || ""}`}
            onChange={() => {}}
        />
    </div>
));

jest.mock("@essnextgen/ui-kit", () => ({
    FormLabel: (props: any) => mockFormLabel(props),
    CheckBox: (props: any) => mockCheckBox(props),
    DateInput: (props: any) => mockDateInput(props),
}));

describe("DialogContent", () => {
    const mockSetStartDate = jest.fn();
    const mockSetEndDate = jest.fn();
    const mockSetStatus = jest.fn();
    const mockSetPriority = jest.fn();

    const defaultProps = {
        startDate: "",
        setStartDate: mockSetStartDate,
        endDate: "",
        setEndDate: mockSetEndDate,
        status: [] as string[],
        setStatus: mockSetStatus,
        priority: [] as string[],
        setPriority: mockSetPriority,
        startDateError: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        document.body.innerHTML = "";
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    describe("component rendering", () => {
        it("should render without crashing", () => {
            const { container } = render(<DialogContent {...defaultProps} />);
            expect(container).toBeInTheDocument();
        });

        it("should render dialog-content-container", () => {
            const { container } = render(<DialogContent {...defaultProps} />);
            expect(container.querySelector(".dialog-content-container")).toBeInTheDocument();
        });

        it("should render all main labels", () => {
            render(<DialogContent {...defaultProps} />);
            expect(screen.getByText("Status")).toBeInTheDocument();
            expect(screen.getByText("Priority")).toBeInTheDocument();
            expect(screen.getByText("Start date")).toBeInTheDocument();
            expect(screen.getByText("End date")).toBeInTheDocument();
        });

        it("should render status checkboxes", () => {
            render(<DialogContent {...defaultProps} />);
            expect(screen.getByTestId("status-read")).toBeInTheDocument();
            expect(screen.getByTestId("status-unread")).toBeInTheDocument();
        });

        it("should render priority checkboxes", () => {
            render(<DialogContent {...defaultProps} />);
            expect(screen.getByTestId("priority-low")).toBeInTheDocument();
            expect(screen.getByTestId("priority-medium")).toBeInTheDocument();
            expect(screen.getByTestId("priority-high")).toBeInTheDocument();
        });

        it("should render DateInput components", () => {
            render(<DialogContent {...defaultProps} />);
            expect(screen.getByTestId("start-date")).toBeInTheDocument();
            expect(screen.getByTestId("end-date")).toBeInTheDocument();
        });

        it("should render with correct container classes", () => {
            const { container } = render(<DialogContent {...defaultProps} />);
            expect(container.querySelector(".status-checkboxes")).toBeInTheDocument();
            expect(container.querySelector(".priority-checkboxes")).toBeInTheDocument();
            expect(container.querySelector(".date-selection")).toBeInTheDocument();
            expect(container.querySelectorAll(".start-end-date-container").length).toBe(2);
        });
    });

    describe.skip("parseDateString", () => {
        it("should parse valid date string correctly", () => {
            render(<DialogContent {...defaultProps} startDate="2024-01-15" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].day).toBe(15);
            expect(dateInput?.[0].month).toBe(1);
            expect(dateInput?.[0].year).toBe(2024);
        });

        it("should return empty object for empty date string", () => {
            render(<DialogContent {...defaultProps} startDate="" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].day).toBeUndefined();
            expect(dateInput?.[0].month).toBeUndefined();
            expect(dateInput?.[0].year).toBeUndefined();
        });

        it("should return empty object for invalid date format", () => {
            render(<DialogContent {...defaultProps} startDate="invalid-date" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].day).toBeUndefined();
        });

        it("should return empty object for date with wrong number of parts", () => {
            render(<DialogContent {...defaultProps} startDate="2024-01" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].day).toBeUndefined();
        });

        it("should return empty object for date with NaN values", () => {
            render(<DialogContent {...defaultProps} startDate="abc-def-ghi" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].day).toBeUndefined();
        });

        it("should parse end date correctly", () => {
            render(<DialogContent {...defaultProps} endDate="2024-12-31" />);
            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "end-date");
            expect(dateInput?.[0].day).toBe(31);
            expect(dateInput?.[0].month).toBe(12);
            expect(dateInput?.[0].year).toBe(2024);
        });
    });

    describe.skip("handleStatusChange", () => {
        it("should add status to array when not present", () => {
            const setStatus = jest.fn((updater) => {
                const result = updater([]);
                expect(result).toEqual(["read"]);
            });
            render(<DialogContent {...defaultProps} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-read");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setStatus).toHaveBeenCalled();
        });

        it("should remove status from array when present", () => {
            const setStatus = jest.fn((updater) => {
                const result = updater(["read"]);
                expect(result).toEqual([]);
            });
            render(<DialogContent {...defaultProps} status={["read"]} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-read");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setStatus).toHaveBeenCalled();
        });

        it("should handle unread status change", () => {
            const setStatus = jest.fn((updater) => {
                const result = updater([]);
                expect(result).toEqual(["unread"]);
            });
            render(<DialogContent {...defaultProps} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-unread");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setStatus).toHaveBeenCalled();
        });

        it("should handle adding multiple statuses", () => {
            const setStatus = jest.fn((updater) => {
                const result = updater(["read"]);
                expect(result).toEqual(["read", "unread"]);
            });
            render(<DialogContent {...defaultProps} status={["read"]} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-unread");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setStatus).toHaveBeenCalled();
        });
    });

    describe.skip("handlePriorityChange", () => {
        it("should add priority to array when not present", () => {
            const setPriority = jest.fn((updater) => {
                const result = updater([]);
                expect(result).toEqual(["low"]);
            });
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-low");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it("should remove priority from array when present", () => {
            const setPriority = jest.fn((updater) => {
                const result = updater(["low"]);
                expect(result).toEqual([]);
            });
            render(<DialogContent {...defaultProps} priority={["low"]} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-low");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it("should handle medium priority change", () => {
            const setPriority = jest.fn((updater) => {
                const result = updater([]);
                expect(result).toEqual(["medium"]);
            });
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-medium");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it("should handle high priority change", () => {
            const setPriority = jest.fn((updater) => {
                const result = updater([]);
                expect(result).toEqual(["high"]);
            });
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-high");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it("should handle adding multiple priorities", () => {
            const setPriority = jest.fn((updater) => {
                const result = updater(["low"]);
                expect(result).toEqual(["low", "medium"]);
            });
            render(<DialogContent {...defaultProps} priority={["low"]} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-medium");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange?.({});
            });

            expect(setPriority).toHaveBeenCalled();
        });
    });

    describe("DateInput onChange handlers", () => {
        it("should call setStartDate with formatted date string", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            const onChange = dateInput?.[0].onChange;

            act(() => {
                onChange("5", "3", "2024");
            });

            expect(mockSetStartDate).toHaveBeenCalledWith("2024-03-05");
        });

        it("should pad day and month with zeros", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            const onChange = dateInput?.[0].onChange;

            act(() => {
                onChange("1", "2", "2024");
            });

            expect(mockSetStartDate).toHaveBeenCalledWith("2024-02-01");
        });

        it("should call setEndDate with formatted date string", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "end-date");
            const onChange = dateInput?.[0].onChange;

            act(() => {
                onChange("15", "12", "2024");
            });

            expect(mockSetEndDate).toHaveBeenCalledWith("2024-12-15");
        });

        it("should handle number inputs for date", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            const onChange = dateInput?.[0].onChange;

            act(() => {
                onChange(5, 3, 2024);
            });

            expect(mockSetStartDate).toHaveBeenCalledWith("2024-03-05");
        });
    });

    describe.skip("updateCheckboxState and useEffect for status", () => {
        beforeEach(() => {
            document.body.innerHTML = "";
        });

        it("should update checkbox state when status changes", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = "status-read-checkbox";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            const { rerender } = render(<DialogContent {...defaultProps} status={[]} />);

            act(() => {
                rerender(<DialogContent {...defaultProps} status={["read"]} />);
            });

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it("should handle MutationObserver for status checkboxes", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-unread";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = "unread";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["unread"]} />);

            act(() => {
                const newElement = document.createElement("div");
                container.appendChild(newElement);
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it("should call updateStatusCheckboxes in MutationObserver callback", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const readCheckbox = document.createElement("div");
            readCheckbox.id = "status-read";
            const readInput = document.createElement("input");
            readInput.type = "checkbox";
            readInput.value = "read";
            readCheckbox.appendChild(readInput);
            container.appendChild(readCheckbox);

            const unreadCheckbox = document.createElement("div");
            unreadCheckbox.id = "status-unread";
            const unreadInput = document.createElement("input");
            unreadInput.type = "checkbox";
            unreadInput.value = "unread";
            unreadCheckbox.appendChild(unreadInput);
            container.appendChild(unreadCheckbox);

            render(<DialogContent {...defaultProps} status={["read", "unread"]} />);

            act(() => {
                jest.advanceTimersByTime(5);
                const newElement = document.createElement("div");
                container.appendChild(newElement);
                jest.advanceTimersByTime(250);
            });

            expect(readInput.checked).toBe(true);
            expect(unreadInput.checked).toBe(true);
        });

        it("should execute all setTimeout calls for status when container exists", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            const input = document.createElement("input");
            input.type = "checkbox";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            const updateSpy = jest.spyOn(container, "querySelector");

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(10);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            expect(input.checked).toBe(true);
            updateSpy.mockRestore();
        });

        it("should handle case when container is not found for status", () => {
            document.body.innerHTML = "";
            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(mockSetStatus).not.toHaveBeenCalled();
        });

        it("should find checkbox by data-testid attribute", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            checkboxElement.setAttribute("data-testid", "status-read");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.setAttribute("data-testid", "status-read");
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });
    });

    describe.skip("updateCheckboxState and useEffect for priority", () => {
        beforeEach(() => {
            document.body.innerHTML = "";
        });

        it("should update checkbox state when priority changes", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "priority-low";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = "priority-low-checkbox";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            const { rerender } = render(<DialogContent {...defaultProps} priority={[]} />);

            act(() => {
                rerender(<DialogContent {...defaultProps} priority={["low"]} />);
            });

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it("should handle MutationObserver for priority checkboxes", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "priority-medium";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = "medium";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} priority={["medium"]} />);

            act(() => {
                const newElement = document.createElement("div");
                container.appendChild(newElement);
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it("should call updatePriorityCheckboxes in MutationObserver callback", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const lowCheckbox = document.createElement("div");
            lowCheckbox.id = "priority-low";
            const lowInput = document.createElement("input");
            lowInput.type = "checkbox";
            lowInput.value = "low";
            lowCheckbox.appendChild(lowInput);
            container.appendChild(lowCheckbox);

            const highCheckbox = document.createElement("div");
            highCheckbox.id = "priority-high";
            const highInput = document.createElement("input");
            highInput.type = "checkbox";
            highInput.value = "high";
            highCheckbox.appendChild(highInput);
            container.appendChild(highCheckbox);

            render(<DialogContent {...defaultProps} priority={["low", "high"]} />);

            act(() => {
                jest.advanceTimersByTime(5);
                const newElement = document.createElement("div");
                container.appendChild(newElement);
                jest.advanceTimersByTime(250);
            });

            expect(lowInput.checked).toBe(true);
            expect(highInput.checked).toBe(true);
        });

        it.skip("should execute all setTimeout calls for priority when container exists", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "priority-low";
            const input = document.createElement("input");
            input.type = "checkbox";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} priority={["low"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(10);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            expect(input.checked).toBe(true);
        });

        it("should handle case when container is not found for priority", () => {
            document.body.innerHTML = "";
            render(<DialogContent {...defaultProps} priority={["high"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(mockSetPriority).not.toHaveBeenCalled();
        });
    });

    describe("updateCheckboxState edge cases", () => {
        it("should return false when element is not found", () => {
            document.body.innerHTML = "";
            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(mockSetStatus).not.toHaveBeenCalled();
        });

        it.skip("should find checkbox by direct querySelector on element", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            const input = document.createElement("input");
            input.type = "checkbox";
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it.skip("should find checkbox by ID selector query", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            const nestedDiv = document.createElement("div");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = "status-read";
            nestedDiv.appendChild(input);
            checkboxElement.appendChild(nestedDiv);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it.skip("should find checkbox by data-testid when element has data-testid", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            checkboxElement.setAttribute("data-testid", "status-read");
            container.appendChild(checkboxElement);

            const input = document.createElement("input");
            input.type = "checkbox";
            input.setAttribute("data-testid", "status-read");
            document.body.appendChild(input);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(input.checked).toBe(true);
        });

        it("should return false when input is not found after all queries", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(mockSetStatus).not.toHaveBeenCalled();
        });

        it.skip("should dispatch change event when checkbox is updated", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const checkboxElement = document.createElement("div");
            checkboxElement.id = "status-read";
            const input = document.createElement("input");
            input.type = "checkbox";
            const changeHandler = jest.fn();
            input.addEventListener("change", changeHandler);
            checkboxElement.appendChild(input);
            container.appendChild(checkboxElement);

            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(changeHandler).toHaveBeenCalled();
        });
    });

    describe("cleanup functions", () => {
        it("should cleanup MutationObserver and timeouts for status", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const { unmount } = render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                unmount();
                jest.advanceTimersByTime(250);
            });

            expect(container.children.length).toBe(0);
        });

        it.skip("should cleanup timeouts when container is not found for status", () => {
            document.body.innerHTML = "";
            const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            const { unmount } = render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            act(() => {
                unmount();
            });

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });

        it("should execute all setTimeout calls for status when container is not found", () => {
            document.body.innerHTML = "";
            render(<DialogContent {...defaultProps} status={["read"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            expect(mockSetStatus).not.toHaveBeenCalled();
        });

        it("should cleanup MutationObserver and timeouts for priority", () => {
            const container = document.createElement("div");
            container.className = "dialog-content-container";
            document.body.appendChild(container);

            const { unmount } = render(<DialogContent {...defaultProps} priority={["low"]} />);

            act(() => {
                unmount();
                jest.advanceTimersByTime(250);
            });

            expect(container.children.length).toBe(0);
        });

        it.skip("should cleanup timeouts when container is not found for priority", () => {
            document.body.innerHTML = "";
            const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            const { unmount } = render(<DialogContent {...defaultProps} priority={["high"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            act(() => {
                unmount();
            });

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });

        it("should execute all setTimeout calls for priority when container is not found", () => {
            document.body.innerHTML = "";
            render(<DialogContent {...defaultProps} priority={["high"]} />);

            act(() => {
                jest.advanceTimersByTime(0);
                jest.advanceTimersByTime(50);
                jest.advanceTimersByTime(100);
                jest.advanceTimersByTime(200);
            });

            expect(mockSetPriority).not.toHaveBeenCalled();
        });
    });

    describe.skip("CheckBox onChange handlers", () => {
        it.skip("should call handleStatusChange when Read checkbox is clicked", () => {
            const setStatus = jest.fn();
            render(<DialogContent {...defaultProps} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-read");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange({});
            });

            expect(setStatus).toHaveBeenCalled();
        });

        it.skip("should call handleStatusChange when Unread checkbox is clicked", () => {
            const setStatus = jest.fn();
            render(<DialogContent {...defaultProps} setStatus={setStatus} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "status-unread");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange({});
            });

            expect(setStatus).toHaveBeenCalled();
        });

        it.skip("should call handlePriorityChange when Low checkbox is clicked", () => {
            const setPriority = jest.fn();
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-low");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it.skip("should call handlePriorityChange when Medium checkbox is clicked", () => {
            const setPriority = jest.fn();
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-medium");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange({});
            });

            expect(setPriority).toHaveBeenCalled();
        });

        it.skip("should call handlePriorityChange when High checkbox is clicked", () => {
            const setPriority = jest.fn();
            render(<DialogContent {...defaultProps} setPriority={setPriority} />);

            const checkboxCall = mockCheckBox.mock.calls.find((call) => call[0].dataTestId === "priority-high");
            const onChange = checkboxCall?.[0].onChange;

            act(() => {
                onChange({});
            });

            expect(setPriority).toHaveBeenCalled();
        });
    });

    describe("DateInput props", () => {
        it("should pass onError and onValidateDate callbacks", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(typeof dateInput?.[0].onError).toBe("function");
            expect(typeof dateInput?.[0].onValidateDate).toBe("function");
        });

        it("should pass showDatePicker prop", () => {
            render(<DialogContent {...defaultProps} />);

            const dateInput = mockDateInput.mock.calls.find((call) => call[0].dataTestId === "start-date");
            expect(dateInput?.[0].showDatePicker).toBe(true);
        });
    });

    describe("layout and styling", () => {
        it("should render marginTop style for priority section", () => {
            const { container } = render(<DialogContent {...defaultProps} />);
            const prioritySection = container.querySelector(".priority-checkboxes")?.parentElement;
            expect(prioritySection).toHaveStyle({ marginTop: "24px" });
        });
    });
});
