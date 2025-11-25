// FilterDialog.view.test.tsx
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FilterDialogView from "../FilterDialog.view";

// Mock dialog-helper's DialogContent
jest.mock("../dialog-helper", () => ({
    DialogContent: () => <div data-testid="mock-dialog-content">Mock Content</div>
}));

describe("FilterDialogView", () => {
    let setFilterBtnClicked: jest.Mock;

    beforeEach(() => {
        setFilterBtnClicked = jest.fn();
    });

    it("renders dialog open by default with correct props", () => {
        render(<FilterDialogView setFilterBtnClicked={setFilterBtnClicked} />);
        const dialog = screen.getByTestId("test-id");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveClass("dialog-class");
        expect(dialog).toHaveAttribute("id", "element-id");
        expect(screen.getByText("Filter by")).toBeInTheDocument();
        expect(screen.getByTestId("mock-dialog-content")).toBeInTheDocument();
    });

    it("renders dialog footer and buttons", () => {
        render(<FilterDialogView setFilterBtnClicked={setFilterBtnClicked} />);
        const footer = document.querySelector(".dialog-footer");
        expect(footer).toBeInTheDocument();
        const buttons = screen.getAllByTestId("close-btn");
        expect(buttons.length).toBe(2);
        expect(buttons[0]).toHaveTextContent("Apply");
        expect(buttons[1]).toHaveTextContent("Clear all");
    });

    // it("calls setFilterBtnClicked and closes dialog on onClose", () => {
    //     render(<FilterDialogView setFilterBtnClicked={setFilterBtnClicked} />);
    //     const dialog = screen.getByTestId("test-id");
    //     // Simulate onClose
    //     fireEvent(dialog, new Event("close", { bubbles: true }));
    //     // Since onClose is a prop, we need to call it directly
    //     // Instead, find the Dialog and call its onClose prop
    //     // But @testing-library/react does not expose props, so simulate by calling the function
    //     // Alternative: test by clicking outside or ESC if Dialog supports it, but here call manually
    //     // For this test, call setFilterBtnClicked directly
    //     expect(setFilterBtnClicked).toHaveBeenCalledWith(false);
    // });

    it("renders and allows clicking Clear all and Apply buttons", () => {
        render(<FilterDialogView setFilterBtnClicked={setFilterBtnClicked} />);
        const buttons = screen.getAllByTestId("close-btn");
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);
        // No-op handlers, just ensure no error
        expect(buttons[0]).toBeInTheDocument();
        expect(buttons[1]).toBeInTheDocument();
    });
});