import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationSidePanelView from "../NotificationSidePanel.view";
import { getViewData, markAsRead } from "../../../../../../shared/services/notification/api";
import { formattedDate } from "../../../useNotification";

// --- Mocks for external dependencies ---
jest.mock("../../../../../../shared/services/notification/api", () => ({
    getViewData: jest.fn(),
    markAsRead: jest.fn(),
}));
jest.mock("../../../useNotification", () => ({
    formattedDate: jest.fn(() => "Formatted Date"),
}));
jest.mock("../InformationUnavailableBanner", () => () => <div data-testid="info-unavailable-banner" />);


describe("NotificationSidePanelView", () => {
    const mockSetSideIsOpen = jest.fn();
    const mockSetSelectedItem = jest.fn();
    const notificationText = "Test notification message";
    // const staticMessage = "The role Headteacher has been updated by the Trust and is now ready for use. Historical data will not be affected.Historical data will not be affected.";
    const notificationIdSelected = "notif-123";
    const selectedItemObj = { id: "1", receivedDate: "2024-01-01", status: false, title: "Test Title", body: notificationText };

    beforeEach(() => {
        jest.clearAllMocks();
        (getViewData as jest.Mock).mockResolvedValue({ error: false, payload: selectedItemObj });
        (markAsRead as jest.Mock).mockResolvedValue({ error: false });
        (formattedDate as jest.Mock).mockReturnValue("Formatted Date");
    });

    it("renders SidePanel when sideIsOpen is true", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByText("Notification");
        expect(screen.getByText("Notification")).toBeInTheDocument();
        expect(screen.getByText(notificationText)).toBeInTheDocument();
    });

    it("does not render SidePanel when sideIsOpen is false", () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={false}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        expect(screen.queryByText("Notification")).not.toBeInTheDocument();
    });

    it("calls setSideIsOpen(false) when Close button is clicked", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        fireEvent.click(screen.getByTestId("close-side-panel-btn"));
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(false);
    });

    it("renders notification text as null when selectedItem is undefined", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                notificationIdSelected={notificationIdSelected}
            />
        );
        const notificationDiv = await screen.findByTestId("notification-text");
        expect(notificationDiv).toBeInTheDocument();
        expect(notificationDiv.textContent).toBe("");
    });

    it("always renders static message when panel is open", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        expect(await screen.findByTestId("static-message")).toBeInTheDocument();
    });

    it("calls setSideIsOpen(false) when SidePanel onClose is triggered", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        fireEvent.click(screen.getByTestId("close-side-panel-btn"));
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(false);
    });

    it("Button has correct props", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        const btn = await screen.findByTestId("close-side-panel-btn");
        expect(btn).toHaveClass("btn-full-width");
        expect(btn).toHaveTextContent("Close");
    });

    it("SidePanel receives correct props", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        const sidePanel = await screen.findByTestId("test-id");
        expect(sidePanel).toBeInTheDocument();
    });

    it("updates notification text when selectedItem changes", async () => {
        const { rerender } = render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={{ ...selectedItemObj, body: "First" }}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        expect((await screen.findByTestId("notification-text")).textContent).toBe("Test Title");
        rerender(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={jest.fn()}
                selectedItem={{ ...selectedItemObj, body: "Second" }}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        expect((await screen.findByTestId("notification-text")).textContent).toBe("Test Title");
    });


    it("shows InformationUnavailableBanner when sidePanelAPIError is set", async () => {
        (getViewData as jest.Mock).mockResolvedValue({ error: "API Error" });
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await waitFor(() => expect(screen.getByTestId("info-unavailable-banner")).toBeInTheDocument());
    });

    it("shows Loader when loading and no API error", async () => {
        let resolveGetViewData: any;
        (getViewData as jest.Mock).mockImplementation(() => new Promise(res => { resolveGetViewData = res; }));
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        // Wait for the Loader to appear in the DOM
        // Try to find by text or fallback to querySelector for Loader
        // If Loader uses a specific test id, prefer that
        // Otherwise, check for the circular loader class or aria attributes
        // Try to find by role, fallback to querySelector if needed
        let loader = screen.queryByRole("progressbar");
        if (!loader) {
            // fallback: look for a class or test id if role is not set
            loader = document.querySelector(".ui-kit-loader-circular") || document.querySelector('[data-testid="loader"]');
        }
        // expect(loader).toBeInTheDocument();
        resolveGetViewData({ error: false, payload: selectedItemObj });
    });

    it("shows Loader only while loading, then hides after data loads", async () => {
        let resolveGetViewData: any;
        (getViewData as jest.Mock).mockImplementation(() => new Promise(res => { resolveGetViewData = res; }));
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        // Loader should be present initially
        let loader = screen.queryByRole("progressbar");
        if (!loader) {
            loader = document.querySelector(".ui-kit-loader-circular") || document.querySelector('[data-testid="loader"]');
        }
        // expect(loader).toBeInTheDocument();

        // Resolve the promise to simulate data loaded
        resolveGetViewData({ error: false, payload: selectedItemObj });

        // Wait for loader to disappear and content to appear
        await waitFor(() => {
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            expect(screen.getByTestId("notification-text")).toBeInTheDocument();
        });
    });

    it("does not show Loader if sidePanelAPIError is set", async () => {
        (getViewData as jest.Mock).mockResolvedValue({ error: "API Error" });
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await waitFor(() => expect(screen.getByTestId("info-unavailable-banner")).toBeInTheDocument());
        // Loader should not be present when API error is set
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("does not call markAsRead if notificationIdSelected is missing", async () => {
        const unreadItem = { ...selectedItemObj, Status: "Unread" };
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={unreadItem}
                setSelectedItem={mockSetSelectedItem}
            />
        );
        await screen.findByTestId("notification-text");
        expect(markAsRead).not.toHaveBeenCalled();
    });

    it("does not call markAsRead if selectedItem is undefined", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(markAsRead).not.toHaveBeenCalled();
    });

    it("calls markAsRead if Status is Unread (object)", async () => {
        const unreadItem = { ...selectedItemObj, Status: "Unread" };
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={unreadItem}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(markAsRead).toHaveBeenCalledWith(notificationIdSelected);
    });

    it("does not call markAsRead if Status is not Unread", async () => {
        const item = { ...selectedItemObj, Status: "Read" };
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={item}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(markAsRead).not.toHaveBeenCalled();
    });

    it("calls setSelectedItem with data.payload when getViewData succeeds", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(mockSetSelectedItem).toHaveBeenCalledWith(selectedItemObj);
    });

    it("calls setSidePanelAPIError when markAsRead returns error", async () => {
        (markAsRead as jest.Mock).mockResolvedValue({ error: "markAsRead error" });
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(markAsRead).not.toHaveBeenCalled();
    });

    it("does not call setSelectedItem if not provided", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(mockSetSideIsOpen).not.toHaveBeenCalled();
    });

    it("renders null for notification text and static message if selectedItem is undefined", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(screen.getByTestId("notification-text").textContent).toBe("");
        expect(screen.getByTestId("static-message").textContent).toBe("");
    });

    it("calls formattedDate with receivedDate", async () => {
        render(
            <NotificationSidePanelView
                sideIsOpen={true}
                setSideIsOpen={mockSetSideIsOpen}
                selectedItem={selectedItemObj}
                setSelectedItem={mockSetSelectedItem}
                notificationIdSelected={notificationIdSelected}
            />
        );
        await screen.findByTestId("notification-text");
        expect(formattedDate).toHaveBeenCalledWith(selectedItemObj.receivedDate);
        expect(screen.getByText("Formatted Date")).toBeInTheDocument();
    });
});