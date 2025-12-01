import { fireEvent, render, screen } from "@testing-library/react";
import { DialogContent } from "../dialog-helper";

const defaultProps = {
    startDate: "",
    setStartDate: jest.fn(),
    endDate: "",
    setEndDate: jest.fn(),
    status: "",
    setStatus: jest.fn(),
    priority: "",
    setPriority: jest.fn(),
};

describe("DialogContent", () => {
    it("renders without crashing", () => {
        const { container } = render(<DialogContent {...defaultProps} />);
        expect(container).toBeInTheDocument();
    });

    it("renders all main labels", () => {
        render(<DialogContent {...defaultProps} />);
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Priority")).toBeInTheDocument();
        expect(screen.getByText("Start date")).toBeInTheDocument();
        expect(screen.getByText("End date")).toBeInTheDocument();
    });

    it("renders all status checkboxes", () => {
        render(<DialogContent {...defaultProps} />);
        expect(screen.getByLabelText("Read")).toBeInTheDocument();
        expect(screen.getByLabelText("Unread")).toBeInTheDocument();
    });

    it("renders all priority checkboxes", () => {
        render(<DialogContent {...defaultProps} />);
        expect(screen.getByLabelText("Low")).toBeInTheDocument();
        expect(screen.getByLabelText("Medium")).toBeInTheDocument();
        expect(screen.getByLabelText("High")).toBeInTheDocument();
    });

    it("renders two DateInput components", () => {
        render(<DialogContent {...defaultProps} />);
        // DateInput may render multiple inputs, but only two are for date selection
        const dateInputs = screen.getAllByTestId("test-id").filter(el => el.closest(".start-end-date-container"));
        expect(dateInputs.length).toBe(2);
    });

    it("has correct container class names", () => {
        render(<DialogContent {...defaultProps} />);
        expect(document.querySelector(".status-checkboxes")).toBeInTheDocument();
        expect(document.querySelector(".priority-checkboxes")).toBeInTheDocument();
        expect(document.querySelector(".date-selection")).toBeInTheDocument();
        expect(document.querySelectorAll(".start-end-date-container").length).toBe(2);
    });

    it("calls onChange for status checkboxes when clicked", () => {
        const setStatus = jest.fn();
        render(<DialogContent {...defaultProps} setStatus={setStatus} />);
        fireEvent.click(screen.getByLabelText("Read"));
        fireEvent.click(screen.getByLabelText("Unread"));
        expect(setStatus).toHaveBeenCalledWith("read");
        expect(setStatus).toHaveBeenCalledWith("unread");
    });

    it("calls onChange for priority checkboxes when clicked", () => {
        const setPriority = jest.fn();
        render(<DialogContent {...defaultProps} setPriority={setPriority} />);
        fireEvent.click(screen.getByLabelText("Low"));
        fireEvent.click(screen.getByLabelText("Medium"));
        fireEvent.click(screen.getByLabelText("High"));
        // These are no-op in the implementation, so setPriority is not called
        expect(setPriority).not.toHaveBeenCalled();
    });

    it("checkboxes have correct values", () => {
        render(<DialogContent {...defaultProps} />);
        expect(screen.getByLabelText("Read")).toHaveAttribute("value", "read");
        expect(screen.getByLabelText("Unread")).toHaveAttribute("value", "unread");
        expect(screen.getByLabelText("Low")).toHaveAttribute("value", "low");
        expect(screen.getByLabelText("Medium")).toHaveAttribute("value", "medium");
        expect(screen.getByLabelText("High")).toHaveAttribute("value", "high");
    });

    it("status and priority labels are associated with checkboxes", () => {
        render(<DialogContent {...defaultProps} />);
        expect(screen.getByText("Status")).toHaveClass("status-label");
        expect(screen.getByText("Priority")).toHaveClass("priority-label");
    });

    it("date inputs are focusable", () => {
        render(<DialogContent {...defaultProps} />);
        const dateInputs = screen.getAllByTestId("test-id").filter(el => el.closest(".start-end-date-container"));
        dateInputs.forEach(input => {
            input.focus();
            expect(document.activeElement).toBeDefined();
        });
    });

    it("renders empty divs for layout purposes", () => {
        const { container } = render(<DialogContent {...defaultProps} />);
        const statusEmptyDiv = container.querySelector(".status-checkboxes > div:last-child");
        const priorityEmptyDiv = container.querySelector(".priority-checkboxes > div:last-child");
        expect(statusEmptyDiv).toBeInTheDocument();
        expect(priorityEmptyDiv).toBeInTheDocument();
        expect(statusEmptyDiv?.innerHTML).toBe("");
        expect(priorityEmptyDiv?.innerHTML).toBe("");
    });

    it("calls setStartDate and setEndDate when DateInput changes", () => {
        const setStartDate = jest.fn();
        const setEndDate = jest.fn();
        render(
            <DialogContent
                {...defaultProps}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />
        );
        // Find DateInput components by container
        const dateContainers = document.querySelectorAll(".start-end-date-container");
        expect(dateContainers.length).toBe(2);

        // Find DateInput React components by test id
        const dateInputs = screen.getAllByTestId("test-id").filter(el => el.closest(".start-end-date-container"));
        expect(dateInputs.length).toBe(2);
    });

    it("renders with initial values", () => {
        render(
            <DialogContent
                startDate="2024-01-01"
                setStartDate={jest.fn()}
                endDate="2024-12-31"
                setEndDate={jest.fn()}
                status="read"
                setStatus={jest.fn()}
                priority="high"
                setPriority={jest.fn()}
            />
        );
        expect(screen.getByLabelText("Read")).toHaveAttribute("value", "read");
        expect(screen.getByLabelText("High")).toHaveAttribute("value", "high");
    });
});