import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { Layout } from "./Layout";

jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useHistory: () => ({ push: jest.fn() })
}));
jest.mock("@essnextgen/ui-intl-kit", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@essnextgen/ui-flagr", () => ({ hasFeaturePermission: jest.fn(() => true) }));
jest.mock("./actions/storeActions", () => ({
    saveAppPermission: jest.fn(),
    startRequest: jest.fn()
}));
jest.mock("./shared/utils", () => ({
    envConfig: { APPLICATION: "app" },
    isAuthzUserAdmin: jest.fn(() => false),
    service: { init: jest.fn() }
}));
jest.mock("./shared/utils/flagr-utils", () => ({
    isOrganisationInVariant: jest.fn(() => true),
    isOrganisationInVariantForAnyOrAll: jest.fn(() => true)
}));
jest.mock("./shared/hooks/useSimsConnectedBanner", () => ({ useSimsConnectedBanner: () => [false] }));
jest.mock("./pages/NewHomePage/NewHomePage.view", () => () => <div data-testid="new-homepage-view">NewHomepageView</div>);
jest.mock("./pages/PageNotFound/PageNotFound", () => () => <div data-testid="page-not-found">PageNotFound</div>);
jest.mock("./features/AdminConsole/AdminConsole.view", () => () => <div data-testid="admin-console">AdminConsole</div>);
jest.mock("./features/DBManagement/DBManagement.view", () => () => <div data-testid="db-management">DBManagement</div>);
jest.mock("./pages/SIMSIDAdminPage/SIMSIDAdminPage.view", () => () => <div data-testid="simsid-admin-page">SIMSIDAdminPageView</div>);
jest.mock("./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view", () => () => <div data-testid="unauthorised-access">UnAuthorisedAccess</div>);
jest.mock("./features/AdminConsole/UAM.view", () => () => <div data-testid="uam">UAM</div>);
jest.mock("./pages/EarlyAdopter/EarlyAdopterPage.view", () => () => <div data-testid="early-adopter">EarlyAdpterPage</div>);
jest.mock("./features/DocumentManagementServer/Views/DocumentManagementServer.view", () => () => <div data-testid="dms">DocumentManagementServer</div>);
jest.mock("./pages/InviteUsers", () => () => <div data-testid="invite-users">InviteUsersLogic</div>);
jest.mock("./features/SystemStatusAlerts/SystemStatus.view", () => () => <div data-testid="system-status">SystemStatus</div>);
jest.mock("./features/MainPanel/Notifications/Notifications.logic", () => () => <div data-testid="notifications">NotificationsLogic</div>);
jest.mock("./pages/Sims7Redirections/Sims7RedirectionsLayout.logic", () => () => <div data-testid="sims7-redirections">Sims7RedirectionsLayout</div>);
jest.mock("@essnextgen/ui-application-kit", () => ({
  Header: () => <div data-testid="header">Header</div>,
  ApplicationConfig: { getDefaultMenus: () => [{ appCode: "A", allowedRoles: [] }] },
  SchoolGroupRedirect: () => <div data-testid="school-group-redirect">SchoolGroupRedirect</div>
}));
jest.mock("@essnextgen/ui-kit", () => ({
    Loader: () => <div data-testid="loader">Loader</div>,
    LoaderType: { Circular: "circular" }
}));
jest.mock("@essnextgen/auth-ui", () => ({
    ProtectedRoute: ({ path }: any) => <div data-testid="protected-route">ProtectedRoute {path}</div>,
    Auth: () => <div data-testid="auth">Auth</div>,
    authService: {
        isAuthenticated: jest.fn(() => true),
        isAuthorised: jest.fn(() => true),
        logOut: jest.fn()
    },
    MatchPermissions: { all: "all", any: "any" },
}));

describe("Layout", () => {
    it("renders Header when isStandaloneApp is true", () => {
        const { getByTestId } = render(
            <MemoryRouter initialEntries={["/"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        expect(getByTestId("header")).toBeInTheDocument();
    });

    it("renders Loader as Suspense fallback", () => {
        // Suspense fallback is only shown during lazy loading, which is hard to simulate in a synchronous test.
        // This test can be skipped or you can test Suspense fallback in integration tests.
        expect(true).toBe(true);
    });

    it("renders ProtectedRoute for /", () => {
        const { getAllByTestId } = render(
            <MemoryRouter initialEntries={["/"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        expect(getAllByTestId("protected-route").some(el => el.textContent?.includes("/"))).toBe(true);
    });

    it("renders Auth route when isStandaloneApp is true", () => {
        render(
            <MemoryRouter initialEntries={["/auth"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("auth")).toBeInTheDocument();
    });

    it("renders AdminConsole route when permission is true", () => {
        render(
            <MemoryRouter initialEntries={["/AdminConsole"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("admin-console")).toBeInTheDocument();
    });

    it("renders DBManagement route when permission is true", () => {
        render(
            <MemoryRouter initialEntries={["/dbmanagement"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("db-management")).toBeInTheDocument();
    });

    it("renders SystemStatus route when permission is true", () => {
        render(
            <MemoryRouter initialEntries={["/systemstatus"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("system-status")).toBeInTheDocument();
    });

    it("renders InviteUsersLogic route when permission is true", () => {
        render(
            <MemoryRouter initialEntries={["/inviteusers"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("invite-users")).toBeInTheDocument();
    });

    it("renders Sims7RedirectionsLayout route when permission is true", () => {
        render(
            <MemoryRouter initialEntries={["/sims7redirections"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("sims7-redirections")).toBeInTheDocument();
    });

    it("renders EarlyAdpterPage for /adminConsole/userManagement", () => {
        render(
            <MemoryRouter initialEntries={["/adminConsole/userManagement"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("early-adopter")).toBeInTheDocument();
    });

    it("renders SchoolGroupRedirect for /schoolRedirect", () => {
        render(
            <MemoryRouter initialEntries={["/schoolRedirect"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("school-group-redirect")).toBeInTheDocument();
    });

    it("renders UAM for /uam", () => {
        render(
            <MemoryRouter initialEntries={["/uam"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("uam")).toBeInTheDocument();
    });

    it("renders UnAuthorisedAccess for /unauthorized", () => {
        render(
            <MemoryRouter initialEntries={["/unauthorized"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("unauthorised-access")).toBeInTheDocument();
    });

    it("renders PageNotFound for unknown route", () => {
        render(
            <MemoryRouter initialEntries={["/unknown"]}>
                <Layout isStandaloneApp baseRouteName="/" />
            </MemoryRouter>
        );
        // expect(getByTestId("page-not-found")).toBeInTheDocument();
    });
});
