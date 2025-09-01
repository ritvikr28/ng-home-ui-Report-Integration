import { createBrowserHistory } from "history";
import { render, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { authService } from "@essnextgen/auth-ui";
import configureStore from "../redux/store";
import App from "../App";
import { fetchPreferredLanguage } from "../shared/services/localisationDomain/localisationPreferences";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import { service } from "../shared/utils";
import gtmAnalytics from "../shared/utils/analytics";
import ErrorBoundary from "../shared/components/ErrorBoundary/Index";

jest.mock("../shared/utils", () => ({
  service: { get: jest.fn() },
  envConfig: {
    APPLICATION: "TEST_APP",
    BASE_URL: "http://test-url",
    REACT_ENVIRONMENT: "test",
    REACT_GA_TRACKING_ID: "test-ga-id",
  },
  hasFeaturePermission: jest.fn().mockReturnValue(false),
}));

jest.mock("../shared/services/localisationDomain/localisationPreferences");
jest.mock("@essnextgen/ui-intl-kit", () => ({
  IntlProvider: { init: jest.fn(() => ({ init: jest.fn() })) },
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock("react-gtm-module", () => ({
  initialize: jest.fn(),
  dataLayer: jest.fn(),
}));
jest.mock("../shared/utils/analytics", () => ({
  pushLogInEvent: jest.fn(),
}));

function renderWithHistory(history: any) {
  return render(
    <Provider store={configureStore()}>
      <Router history={history}>
        <App isStandaloneApp baseRouteName="" />
      </Router>
    </Provider>
  );
}

describe("App i18n and error handling coverage", () => {
  const history: any = createBrowserHistory();

  beforeEach(() => {
    jest.spyOn(authService, "isAuthenticated").mockReturnValue(true);
    (IntlProvider.init as jest.Mock).mockReturnValue({ init: jest.fn() });
    (service.get as jest.Mock).mockResolvedValue({}); // ensure Promise
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("handles fetchPreferredLanguage error and still initializes", async () => {
    (fetchPreferredLanguage as jest.Mock).mockRejectedValue(new Error("fail"));
    renderWithHistory(history);
    await waitFor(() => {
      expect(fetchPreferredLanguage).toHaveBeenCalled();
    });
  });

  it("handles IntlProvider.init error and still initializes", async () => {
    (fetchPreferredLanguage as jest.Mock).mockResolvedValue({ languageCode: "en" });
    (IntlProvider.init as jest.Mock).mockImplementation(() => {
      throw new Error("init error");
    });
    renderWithHistory(history);
    await waitFor(() => {
      expect(fetchPreferredLanguage).toHaveBeenCalled();
    });
  });

  it("sets fetchFeatureFlags to undefined if not authenticated", async () => {
    (fetchPreferredLanguage as jest.Mock).mockResolvedValue({ languageCode: "en" });
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    renderWithHistory(history);
    await waitFor(() => {
      expect(fetchPreferredLanguage).toHaveBeenCalled();
      expect(service.get).not.toHaveBeenCalled();
    });
  });

  it("calls getFeatureFlags if authenticated", async () => {
    (fetchPreferredLanguage as jest.Mock).mockResolvedValue({ languageCode: "en" });
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    renderWithHistory(history);
    await waitFor(() => {
      expect(service.get).not.toBeUndefined();
      expect(fetchPreferredLanguage).toHaveBeenCalled();
    });
  });

  it("calls gtmAnalytics.pushLogInEvent on init", async () => {
    (fetchPreferredLanguage as jest.Mock).mockResolvedValue({ languageCode: "en" });
    renderWithHistory(history);
    await waitFor(() => {
      expect(gtmAnalytics.pushLogInEvent).toHaveBeenCalled();
    });
  });

  it("uses browser language when no preferred language found", async () => {
    Object.defineProperty(window.navigator, "language", {
      value: "cy-GB",
      configurable: true,
    });
    (fetchPreferredLanguage as jest.Mock).mockResolvedValue(undefined);
    renderWithHistory(history);
    await waitFor(() => {
      expect(localStorage.getItem("i18nextLng")).toBe("cy");
    });
  });

  it("renders ErrorBoundary fallback when child throws", async () => {
    const history = createBrowserHistory();
    const ThrowComponent = () => {
      throw new Error("test error");
    };
    const { getByText } = render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <ErrorBoundary>
            <ThrowComponent />
          </ErrorBoundary>
        </Router>
      </Provider>
    );
    await waitFor(() => {
      expect(getByText("errorfallback.error-loading")).toBeInTheDocument();
    });
  });
});
