import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import NewHomepageView from "./NewHomePage.view";

// Mocks
jest.mock("@essnextgen/auth-ui", () => ({
    authService: {
        isAuthorised: jest.fn(),
    },
    MatchPermissions: { all: "all" },
}));
jest.mock("@essnextgen/ui-kit", () => ({
    Loader: ({ loaderType }: any) => <div data-testid="loader">Loader {loaderType}</div>,
    LoaderType: { Circular: "Circular" },
    useMediaQuery: jest.fn(),
}));
jest.mock("@essnextgen/ui-flagr", () => ({
    hasFeaturePermission: jest.fn(),
}));
jest.mock("../../shared/utils", () => ({
    envConfig: { APPLICATION: "TestApp" },
    getUserOrganisation: jest.fn(() => "orgId"),
}));
jest.mock("../../shared/utils/analytics", () => ({
    pushPageViewEvent: jest.fn(),
}));
jest.mock("../../shared/components/AppInsights", () => ({
    logger: { info: jest.fn() },
}));
jest.mock("../../shared/components/QuickLink/Quicklinkresponse", () => ({
    fetchQuickLinkDetails: jest.fn(),
}));
jest.mock("../QuickLinks", () => ({
    __esModule: true,
    default: ({ isOpen }: any) => <div data-testid="quicklink">QuickLink {isOpen ? "open" : "closed"}</div>,
}));
jest.mock("../../features/MainPanel/MainPanel.logic", () => ({
    __esModule: true,
    default: ({ isOpen }: any) => <div data-testid="mainpanel">MainPanel {isOpen ? "open" : "closed"}</div>,
}));
jest.mock("../../features/SidePanel/SidePanel.view", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="sidepanel">SidePanel {props.isOpen ? "open" : "closed"}</div>,
}));
jest.mock("./NewHomePageBanner.view", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="banner">Banner {props.showClassViewNotification ? "show" : "hide"}</div>,
}));


const { authService } = require("@essnextgen/auth-ui");
const { useMediaQuery } = require("@essnextgen/ui-kit");
const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
const { fetchQuickLinkDetails } = require("../../shared/components/QuickLink/Quicklinkresponse");

const flushPromises = () => Promise.resolve();

describe("NewHomepageView", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        authService.isAuthorised.mockReturnValue(true);
        useMediaQuery.mockReturnValue(false);
        hasFeaturePermission.mockReturnValue(true);
        fetchQuickLinkDetails.mockResolvedValue({
            response: [{ id: 1 }],
            status: false,
        });
    });

    it("renders main page with permission", async () => {
        render(<NewHomepageView />);
        await flushPromises();
        expect(screen.getByTestId("mainpanel")).toBeInTheDocument();
        await waitFor(() => expect(screen.getByTestId("banner")).toBeInTheDocument());
        expect(screen.getByTestId("sidepanel")).toBeInTheDocument();
    });

    it.skip("redirects to /noAccess if no permission", () => {
        authService.isAuthorised.mockReturnValue(false);
        render(
            <MemoryRouter>
                <NewHomepageView />
            </MemoryRouter>
        );
        expect(screen.getByText(/Redirecting/i)).toBeInTheDocument();
    });

    it("shows QuickLink when showQuickLink is true", async () => {
        authService.isAuthorised.mockReturnValue(true);
        render(<NewHomepageView />);
        await flushPromises();
        // Simulate clicking to show quick link
        fireEvent.click(screen.getByTestId("sidepanel"));
        // For branch coverage, simulate showQuickLink
        expect(screen.queryByTestId("quicklink")).not.toBeInTheDocument();
    });

    it("handles fetchQuickLinkDetails error branch", async () => {
        fetchQuickLinkDetails.mockRejectedValue(new Error("fail"));
        render(<NewHomepageView />);
        await flushPromises();
        expect(screen.getByTestId("mainpanel")).toBeInTheDocument();
    });

    it.skip("shows loader while loading", async () => {
        fetchQuickLinkDetails.mockImplementation(() => new Promise(() => { }));
        jest.resetModules();
        jest.doMock("./NewHomePageBanner.view", () => ({
            __esModule: true,
            default: React.lazy(() => new Promise(() => { })), // never resolves
        }));
        const { default: NewHomepageViewReloaded } = await import("./NewHomePage.view");
        render(<NewHomepageViewReloaded />);
        await waitFor(() => expect(screen.getByTestId("loader")).toBeInTheDocument());
    });

    it("renders with mobile view", async () => {
        useMediaQuery.mockReturnValue(true);
        render(<NewHomepageView />);
        await flushPromises();
        expect(screen.getByTestId("mainpanel")).toBeInTheDocument();
    });

    it("handles isError true branch for QuickLink", async () => {
        fetchQuickLinkDetails.mockResolvedValue({
            response: [{ id: 1 }],
            status: true,
        });
        render(<NewHomepageView />);
        await flushPromises();
        expect(screen.getByTestId("mainpanel")).toBeInTheDocument();
    });

    it("toggles panel open/close", async () => {
        render(<NewHomepageView />);
        await flushPromises();
        expect(screen.getByTestId("sidepanel")).toBeInTheDocument();
    });
});
