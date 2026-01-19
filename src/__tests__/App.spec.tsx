// Language: typescript
import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import * as AuthUi from "@essnextgen/auth-ui";
import * as IntlKit from "@essnextgen/ui-intl-kit";
import * as Flagr from "@essnextgen/ui-flagr";
import App, { hasNewHomePagePermission } from "../App";
import ErrorBoundaryModule from "../shared/components/ErrorBoundary/Index"
import * as Analytics from "../shared/utils/analytics";
import * as Utils from "../shared/utils";
import * as VideoHook from "../shared/hook/useVideoPlayStatus";
import * as reduxStore from "../redux/store";
import * as actualLayout from "../Layout";

jest.mock("@essnextgen/ui-intl-kit");
jest.mock("@essnextgen/auth-ui");
jest.mock("@essnextgen/ui-flagr");
jest.mock("../shared/utils/analytics");
jest.mock("../shared/utils");
jest.mock("../shared/hook/useVideoPlayStatus");
jest.mock("../redux/store");
jest.mock("../shared/components/AppInsights");

jest.mock("../shared/components/ErrorBoundary/Index");
jest.mock("../Layout");

const mockStore = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
};
(reduxStore.default as jest.Mock).mockReturnValue(mockStore);

const mockLayout = jest.fn(() => <div data-testid="layout" />);
(actualLayout.Layout as jest.Mock).mockImplementation(mockLayout);

const mockErrorBoundary = ({ children }: any) => <div data-testid="error-boundary">{children}</div>;
(ErrorBoundaryModule as jest.Mock).mockImplementation(mockErrorBoundary);

const mockIntlInit = jest.fn().mockResolvedValue({ init: jest.fn().mockResolvedValue(undefined) });
(IntlKit.IntlProvider.init as jest.Mock).mockImplementation(mockIntlInit);

const mockFeatureFlagsProvider = ({ children }: any) => <div data-testid="feature-flags">{children}</div>;
(Flagr.default as jest.Mock).mockImplementation(mockFeatureFlagsProvider);

const mockPushLogInEvent = jest.fn();
const mockShowVideoEvent = jest.fn();
(Analytics.default.pushLogInEvent as jest.Mock).mockImplementation(mockPushLogInEvent);
(Analytics.default.showVideoEvent as jest.Mock).mockImplementation(mockShowVideoEvent);

const mockServiceGet = jest.fn().mockResolvedValue({ features: [] });
(Utils.service.get as jest.Mock).mockImplementation(mockServiceGet);

const mockUseVideoPlayStatus = VideoHook.useVideoPlayStatus as jest.Mock;

const defaultProps = {
    isStandaloneApp: true,
    baseRouteName: "home"
};

beforeEach(() => {
    jest.clearAllMocks();
    (AuthUi.authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (AuthUi.authService.isAuthorised as jest.Mock).mockReturnValue(true);
    mockUseVideoPlayStatus.mockReturnValue({ isPlayed: false, apiError: false });
    Object.defineProperty(window, "localStorage", {
        value: (() => {
            let store: Record<string, string> = {};
            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value; },
                clear: () => { store = {}; }
            };
        })(),
        writable: true
    });
    Object.defineProperty(window.navigator, "language", {
        value: "en-GB",
        configurable: true
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("App component", () => {

    // const mockStore = {
    //     getState: jest.fn(() => ({})),
    //     dispatch: jest.fn(),
    //     subscribe: jest.fn(),
    // };
    // (reduxStore.default as jest.Mock).mockReturnValue(mockStore);

    test("handles missing translation gracefully", async () => {
        mockIntlInit.mockImplementationOnce(() => ({
            init: () => Promise.resolve()
        }));
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(window.localStorage.getItem("i18nextLng")).toBe("en");
    });

    test.skip("renders nothing until initialized", async () => {
        mockIntlInit.mockImplementationOnce(() => ({
            init: () => new Promise(resolve => setTimeout(resolve, 50))
        }));
        const { container } = render(<App {...defaultProps} />);
        expect(container.firstChild).toBeNull();
        await act(() => {
            waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        });
    });

    test("initializes i18n and sets language in localStorage", () => {
        render(<App {...defaultProps} />);
        waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(window.localStorage.getItem("i18nextLng")).toBe("en");
        expect(mockIntlInit).toHaveBeenCalledWith(expect.objectContaining({
            translation: expect.objectContaining({
                en: expect.any(Object),
                cy: expect.any(Object)
            })
        }));
    });

    test("handles i18n initialization error gracefully", async () => {
        mockIntlInit.mockImplementationOnce(() => ({
            init: () => Promise.reject(new Error("i18n error"))
        }));
        const { container } = render(<App {...defaultProps} />);
        await waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(container.querySelector("[data-testid='feature-flags']")).toBeTruthy();
    });

    test("calls gtmAnalytics.pushLogInEvent on mount", async () => {
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockPushLogInEvent).toHaveBeenCalled());
    });

    test.skip("calls gtmAnalytics.showVideoEvent when video not played and no error", async () => {
        mockUseVideoPlayStatus.mockReturnValue({ isPlayed: false, apiError: false });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockShowVideoEvent).toHaveBeenCalled());
    });

    test("does not call gtmAnalytics.showVideoEvent if video played", async () => {
        mockUseVideoPlayStatus.mockReturnValue({ isPlayed: true, apiError: false });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockShowVideoEvent).not.toHaveBeenCalled());
    });

    test("does not call gtmAnalytics.showVideoEvent if apiError is true", async () => {
        mockUseVideoPlayStatus.mockReturnValue({ isPlayed: false, apiError: true });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockShowVideoEvent).not.toHaveBeenCalled());
    });

    test("does not call gtmAnalytics.showVideoEvent if hasNewHomePagePermission is false", async () => {
        (AuthUi.authService.isAuthorised as jest.Mock).mockReturnValue(false);
        mockUseVideoPlayStatus.mockReturnValue({ isPlayed: false, apiError: false });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockShowVideoEvent).not.toHaveBeenCalled());
    });

    test("does not call gtmAnalytics.showVideoEvent if homepageVideoOrgViewIncluded is false", async () => {
        // Patch homepageVideoOrgViewIncluded to false
        jest.doMock("../Layout", () => ({
            // ...jest.requireActual("../Layout"),
            ...actualLayout,
            homepageVideoOrgViewIncluded: false,
            Layout: mockLayout
        }));
        mockUseVideoPlayStatus.mockReturnValue({ isPlayed: false, apiError: false });
        // Re-import App to get patched value
        // const { default: PatchedApp } = require("../App");
        const AppModule = await import("../App");
        const PatchedApp = AppModule.default;
        render(<PatchedApp {...defaultProps} />);
        await waitFor(() => expect(mockShowVideoEvent).not.toHaveBeenCalled());
        jest.dontMock("../Layout");
    });

    test.skip("sets fetchFeatureFlags only if authenticated", async () => {
        (AuthUi.authService.isAuthenticated as jest.Mock).mockReturnValue(true);
        jest.resetModules();
        // const { default: AppAuthenticated } = require("../App");
        const AppModule = await import("../App");
        const AppAuthenticated = AppModule.default;
        render(<AppAuthenticated {...defaultProps} />);
        await waitFor(() => expect(mockServiceGet).toHaveBeenCalledWith("v1/features"));

        mockServiceGet.mockClear();
        (AuthUi.authService.isAuthenticated as jest.Mock).mockReturnValue(false);
        jest.resetModules();
        // const { default: AppUnauthenticated } = require("../App");
        const AppUnauthenticated = AppModule.default;
        render(<AppUnauthenticated {...defaultProps} />);
        await waitFor(() => expect(mockServiceGet).not.toHaveBeenCalled());
    });

    test("renders FeatureFlagsProvider, Provider, ErrorBoundary, and Layout with correct props", async () => {
        const { getByTestId } = render(<App {...defaultProps} />);
        await waitFor(() => {
            expect(getByTestId("feature-flags")).toBeInTheDocument();
            expect(getByTestId("error-boundary")).toBeInTheDocument();
            expect(getByTestId("layout")).toBeInTheDocument();
        });
        expect(mockLayout).toHaveBeenCalledWith(
            expect.objectContaining({
                isStandaloneApp: true,
                baseRouteName: "home"
            }),
            expect.anything()
        );
    });

    test.skip("hasNewHomePagePermission is set correctly", async () => {
        (AuthUi.authService.isAuthorised as jest.Mock).mockReturnValue(true);
        expect(hasNewHomePagePermission).toBe(true);
        (AuthUi.authService.isAuthorised as jest.Mock).mockReturnValue(false);
        jest.resetModules();
        // const { hasNewHomePagePermission: newPermission } = require("../App");
        const AppModule = await import("../App");
        const newPermission = AppModule.hasNewHomePagePermission;
        expect(newPermission).toBe(false);
    });

    test("handles missing translation gracefully", async () => {
        mockIntlInit.mockImplementationOnce(() => ({
            init: () => Promise.resolve()
        }));
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(window.localStorage.getItem("i18nextLng")).toBe("en");
    });

    test.skip("passes correct applicationName to FeatureFlagsProvider", async () => {
        (Utils.envConfig.APPLICATION as string) = "TestApp";
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockFeatureFlagsProvider).toHaveBeenCalledWith(
            expect.objectContaining({ applicationName: "TestApp" }),
            expect.anything()
        ));
    });

    test("uses browser language if localStorage is empty", async () => {
        window.localStorage.clear();
        Object.defineProperty(window.navigator, "language", {
            value: "cy-GB",
            configurable: true
        });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(window.localStorage.getItem("i18nextLng")).toBe("cy");
    });

    test("falls back to 'en' if no localStorage and browser language", async () => {
        window.localStorage.clear();
        Object.defineProperty(window.navigator, "language", {
            value: "",
            configurable: true
        });
        render(<App {...defaultProps} />);
        await waitFor(() => expect(mockIntlInit).toHaveBeenCalled());
        expect(window.localStorage.getItem("i18nextLng")).toBe("en");
    });


});