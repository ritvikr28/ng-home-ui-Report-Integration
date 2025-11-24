import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationSidePanelView from "../NotificationSidePanel.view";

describe("NotificationSidePanelView", () => {
    const mockSetSideIsOpen = jest.fn();
    const notificationText = "Test notification message";
    const staticMessage =
        "The role Headteacher has been updated by the Trust and is now ready for use. Historical data will not be affected.Historical data will not be affected.";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders SidePanel when sideIsOpen is true", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={[{ notification: notificationText }]}
            />
        );
        expect(screen.getByText("Notification")).toBeInTheDocument();
        expect(screen.getByText(notificationText)).toBeInTheDocument();
        expect(screen.getByText(staticMessage)).toBeInTheDocument();
        // expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("does not render SidePanel when sideIsOpen is false", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={false}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={[{ notification: notificationText }]}
            />
        );
        expect(screen.queryByText("Notification")).not.toBeInTheDocument();
    });

    it("calls setSideIsOpen(false) when Close button is clicked", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={[{ notification: notificationText }]}
            />
        );
        fireEvent.click(screen.getByTestId("close-side-panel-btn"));
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(false);
    });

    it("renders nothing for notification text if selectedItem is empty array", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={[{ notification: "" }]}
            />
        );
        const notificationDiv = screen.getByTestId("notification-text");
        expect(notificationDiv).toBeInTheDocument();
    });

     it("renders notification text as null when selectedItem is undefined", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
            />
        );
        const notificationDiv = screen.getByTestId("notification-text");
        expect(notificationDiv).toBeInTheDocument();
        expect(notificationDiv.textContent).toBe("");
    });

    it("always renders static message when panel is open", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={[{ notification: "abc" }]}
            />
        );
        expect(screen.getByTestId("static-message")).toBeInTheDocument();
        expect(screen.getByTestId("static-message").textContent).toContain("The role Headteacher has been updated by the Trust");
    });

    it("calls setSideIsOpen(false) when SidePanel onClose is triggered", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={[{ notification: "abc" }]}
            />
        );
        // Simulate SidePanel onClose by clicking the close button
        fireEvent.click(screen.getByTestId("close-side-panel-btn"));
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(false);
    });

    it("Button has correct props", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={[{ notification: "abc" }]}
            />
        );
        const btn = screen.getByTestId("close-side-panel-btn");
        expect(btn).toHaveClass("btn-full-width");
        expect(btn).toHaveTextContent("Close");
    });

    it("SidePanel receives correct props", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={[{ notification: "abc" }]}
            />
        );
        const sidePanel = screen.getByTestId("test-id");
        expect(sidePanel).toBeInTheDocument();
    });

    it("updates notification text when selectedItem changes", () => {
        const { rerender } = render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={[{ notification: "First" }]}
            />
        );
        expect(screen.getByTestId("notification-text").textContent).toBe("First");
        rerender(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={[{ notification: "Second" }]}
            />
        );
        expect(screen.getByTestId("notification-text").textContent).toBe("Second");
    });
});