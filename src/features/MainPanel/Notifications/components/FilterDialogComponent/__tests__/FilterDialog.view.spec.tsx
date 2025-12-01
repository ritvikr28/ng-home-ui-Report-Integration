// FilterDialog.view.test.tsx
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FilterDialogView from "../FilterDialog.view";

// Mock dialog-helper's DialogContent
jest.mock("../dialog-helper", () => ({
    DialogContent: () => <div data-testid="mock-dialog-content">Mock Content</div>
}));

const defaultProps = {
    status: "",
    setStatus: jest.fn(),
    priority: "",
    setPriority: jest.fn(),
    startDate: "",
    setStartDate: jest.fn(),
    endDate: "",
    setEndDate: jest.fn(),
};

describe("FilterDialogView", () => {

    it("renders dialog open by default with correct props", () => {
        render(<FilterDialogView {...defaultProps} />);
        const dialog = screen.getByTestId("test-id");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveClass("dialog-class");
        expect(dialog).toHaveAttribute("id", "element-id");
        expect(screen.getByText("Filter by")).toBeInTheDocument();
        expect(screen.getByTestId("mock-dialog-content")).toBeInTheDocument();
    });

    it("renders dialog footer and buttons", () => {
        render(<FilterDialogView {...defaultProps} />);
        const footer = document.querySelector(".dialog-footer");
        expect(footer).toBeInTheDocument();
        const buttons = screen.getAllByTestId("close-btn");
        expect(buttons.length).toBe(2);
        expect(buttons[0]).toHaveTextContent("Apply");
        expect(buttons[1]).toHaveTextContent("Clear all");
    });

    it("renders and allows clicking Clear all and Apply buttons", () => {
        render(<FilterDialogView {...defaultProps} />);
        const buttons = screen.getAllByTestId("close-btn");
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);
        expect(buttons[0]).toBeInTheDocument();
        expect(buttons[1]).toBeInTheDocument();
    });
});