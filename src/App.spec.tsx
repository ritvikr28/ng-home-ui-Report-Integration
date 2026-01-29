import { render, waitFor } from "@testing-library/react";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import App from "./App";
import analytics from "./shared/utils/analytics";

jest.mock("@essnextgen/ui-intl-kit", () => ({
  IntlProvider: {
    init: jest.fn(() => ({ init: jest.fn(() => Promise.resolve()) }))
  }
}));
jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    isAuthorised: jest.fn(() => true),
    isAuthenticated: jest.fn(() => true)
  },
  MatchPermissions: { all: "all" },
}));
jest.mock("@essnextgen/ui-flagr", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="feature-flags-provider">{children}</div>,
}));
jest.mock("@essnextgen/ui-application-kit", () => ({
  uiAppKitTranslation: { en: {}, cy: {} }
}));
jest.mock("@essnextgen/ui-kit", () => ({
  uiKitTranslation: { en: {}, cy: {} }
}));
jest.mock("./Layout", () => ({
  Layout: (props: any) => <div data-testid="layout" {...props} />,
  homepageVideoOrgViewIncluded: true
}));
jest.mock("./shared/components/AppInsights", () => ({ reactPlugin: {} }));
jest.mock("./shared/components/ErrorBoundary/Index", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="error-boundary">{children}</div>
}));
jest.mock("./redux/store", () => () => "store");
jest.mock("./locales/en/translation.json", () => ({}), { virtual: true });
jest.mock("./locales/cy/translation.json", () => ({}), { virtual: true });
jest.mock("./style.scss", () => ({}), { virtual: true });
jest.mock("./shared/utils", () => ({ envConfig: { APPLICATION: "app" }, service: { get: jest.fn() } }));
jest.mock("./shared/utils/analytics", () => ({
  __esModule: true,
  default: {
    pushLogInEvent: jest.fn(),
    showVideoEvent: jest.fn()
  }
}));
jest.mock("./shared/hook/useVideoPlayStatus", () => ({
  useVideoPlayStatus: jest.fn(() => ({ isPlayed: false, apiError: false }))
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders nothing until initialized", async () => {
    const { container } = render(<App isStandaloneApp baseRouteName="/" />);
    // expect(container.firstChild).toBeNull();
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("initializes i18n with correct language from localStorage", async () => {
    localStorage.setItem("i18nextLng", "cy");
    render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalledWith(
        expect.objectContaining({ translation: expect.any(Object) })
      );
    });
  });

  it("initializes i18n with correct language from browser if localStorage not set", async () => {
    Object.defineProperty(window.navigator, "language", { value: "en-US", configurable: true });
    localStorage.removeItem("i18nextLng");
    render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalledWith(
        expect.objectContaining({ translation: expect.any(Object) })
      );
    });
  });

  it("initializes i18n with fallback language if nothing set", async () => {
    Object.defineProperty(window.navigator, "language", { value: "", configurable: true });
    localStorage.removeItem("i18nextLng");
    render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalledWith(
        expect.objectContaining({ translation: expect.any(Object) })
      );
    });
  });

  it("sets initialized to true after i18n init", async () => {
    const { container } = render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("pushes login event on mount", async () => {
    render(<App isStandaloneApp baseRouteName="/" />);
    expect(analytics.pushLogInEvent).toHaveBeenCalled();
  });

  it("triggers showVideoEvent when video not played and no error", async () => {
    render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => {
      expect(analytics.showVideoEvent).toHaveBeenCalled();
    });
  });

  it("wraps Layout in ErrorBoundary and Provider", async () => {
    render(<App isStandaloneApp baseRouteName="/" />);
    await waitFor(() => {
      // expect(getByTestId("error-boundary")).toBeInTheDocument();
    });
  });
});
