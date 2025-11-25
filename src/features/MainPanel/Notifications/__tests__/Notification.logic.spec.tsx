import { render, screen } from "@testing-library/react";
import NotificationsLogic from "../Notifications.logic";

// Mock NotificationView to isolate NotificationsLogic
jest.mock("../Notifications.view", () => () => (
    <div data-testid="notification-view">Mocked NotificationView</div>
));
describe("NotificationsLogic", () => {
    it("renders NotificationView", () => {
        render(<NotificationsLogic />);
        expect(screen.getByTestId("notification-view")).toBeInTheDocument();
        expect(screen.getByText("Mocked NotificationView")).toBeInTheDocument();
    });
});