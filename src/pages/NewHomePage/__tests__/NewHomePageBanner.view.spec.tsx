import { render, screen } from "@testing-library/react";
import NewHomePageBanner from "../NewHomePageBanner.view";

// Mock child components
jest.mock(
    "../../../shared/components/Notification-menu/ClassViewWhatsNewBanner",
    () => () => <div data-testid="mock-whats-new-banner" />
);
jest.mock(
    "../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner",
    () => () => <div data-testid="mock-sims-launcher" />
);

// Mock hook
const mockUseSimsConnectedBanner = jest.fn();
jest.mock(
    "../../../shared/hooks/useSimsConnectedBanner",
    () => ({
        useSimsConnectedBanner: () => mockUseSimsConnectedBanner()
    })
);

describe("NewHomePageBanner", () => {
    let setShowClassViewNotification: jest.Mock;

    beforeEach(() => {
        setShowClassViewNotification = jest.fn();
        jest.clearAllMocks();
    });

    it("renders nothing when loading", () => {
        mockUseSimsConnectedBanner.mockReturnValue([false, true]);
        render(
            <NewHomePageBanner
                showClassViewNotification={true}
                setShowClassViewNotification={setShowClassViewNotification}
            />
        );
        expect(screen.queryByTestId("mock-whats-new-banner")).toBeNull();
        expect(screen.queryByTestId("mock-sims-launcher")).toBeNull();
    });

    it("renders SIMSConnectedLauncher when hasConnectedLauncher is true and not loading", () => {
        mockUseSimsConnectedBanner.mockReturnValue([true, false]);
        render(
            <NewHomePageBanner
                showClassViewNotification={true}
                setShowClassViewNotification={setShowClassViewNotification}
            />
        );
        expect(screen.getByTestId("sims-launcher")).toBeInTheDocument();
        expect(screen.getByTestId("mock-sims-launcher")).toBeInTheDocument();
        expect(screen.queryByTestId("whats-new-banner")).toBeNull();
    });

    it("renders WhatsNewBanner when hasConnectedLauncher is false, showClassViewNotification is true, and not loading", () => {
        mockUseSimsConnectedBanner.mockReturnValue([false, false]);
        render(
            <NewHomePageBanner
                showClassViewNotification={true}
                setShowClassViewNotification={setShowClassViewNotification}
            />
        );
        expect(screen.getByTestId("whats-new-banner")).toBeInTheDocument();
        expect(screen.getByTestId("mock-whats-new-banner")).toBeInTheDocument();
        expect(screen.queryByTestId("sims-launcher")).toBeNull();
    });

    it("renders nothing when hasConnectedLauncher is false, showClassViewNotification is false, and not loading", () => {
        mockUseSimsConnectedBanner.mockReturnValue([false, false]);
        render(
            <NewHomePageBanner
                showClassViewNotification={false}
                setShowClassViewNotification={setShowClassViewNotification}
            />
        );
        expect(screen.queryByTestId("whats-new-banner")).toBeNull();
        expect(screen.queryByTestId("sims-launcher")).toBeNull();
    });

    it("calls setShowClassViewNotification(false) after loading completes", () => {
        mockUseSimsConnectedBanner.mockReturnValue([false, false]);
        render(
            <NewHomePageBanner
                showClassViewNotification={true}
                setShowClassViewNotification={setShowClassViewNotification}
            />
        );
        expect(setShowClassViewNotification).toHaveBeenCalledWith(false);
    });
});