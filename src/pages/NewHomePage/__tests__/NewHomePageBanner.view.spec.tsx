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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders SIMSConnectedLauncher when hasConnectedLauncher is true", () => {
        mockUseSimsConnectedBanner.mockReturnValue([true]);
        render(<NewHomePageBanner />);
        expect(screen.getByTestId("sims-launcher")).toBeInTheDocument();
        expect(screen.getByTestId("mock-sims-launcher")).toBeInTheDocument();
        expect(screen.queryByTestId("whats-new-banner")).toBeNull();
    });

    it("renders WhatsNewBanner when hasConnectedLauncher is false", () => {
        mockUseSimsConnectedBanner.mockReturnValue([false]);
        render(<NewHomePageBanner />);
        expect(screen.getByTestId("whats-new-banner")).toBeInTheDocument();
        expect(screen.getByTestId("mock-whats-new-banner")).toBeInTheDocument();
        expect(screen.queryByTestId("sims-launcher")).toBeNull();
    });
});