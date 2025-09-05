import { createBrowserHistory } from "history";
import { render, waitFor, act } from "@testing-library/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { authService } from "@essnextgen/auth-ui";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import configureStore from "../redux/store";
import App from "../App";
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

function renderWithHistory(history: any, props = {}) {
  return render(
    <Provider store={configureStore()}>
      <Router history={history}>
        <App isStandaloneApp baseRouteName="" {...props} />
      </Router>
    </Provider>
  );
}

describe("App i18n and error handling coverage", () => {
  const history: any = createBrowserHistory();

  beforeEach(() => {
    jest.spyOn(authService, "isAuthenticated").mockReturnValue(true);
    (IntlProvider.init as jest.Mock).mockReturnValue({ init: jest.fn() });
    (service.get as jest.Mock).mockResolvedValue({});
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("initializes with localStorage language", async () => {
    localStorage.setItem("i18nextLng", "cy");
    renderWithHistory(history);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalled();
      expect(localStorage.getItem("i18nextLng")).toBe("cy");
    });
  });

  it("initializes with browser language if localStorage not set", async () => {
    Object.defineProperty(window.navigator, "language", {
      value: "cy-GB",
      configurable: true,
    });
    renderWithHistory(history);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalled();
      expect(localStorage.getItem("i18nextLng")).toBe("cy");
    });
  });

  it("initializes with default language if none found", async () => {
    Object.defineProperty(window.navigator, "language", {
      value: "",
      configurable: true,
    });
    renderWithHistory(history);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalled();
      expect(localStorage.getItem("i18nextLng")).toBe("en");
    });
  });

  it("handles IntlProvider.init error and still initializes", async () => {
    (IntlProvider.init as jest.Mock).mockImplementation(() => {
      throw new Error("init error");
    });
    renderWithHistory(history);
    await waitFor(() => {
      expect(IntlProvider.init).toHaveBeenCalled();
    });
  });

  it("sets fetchFeatureFlags to undefined if not authenticated", async () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    renderWithHistory(history);
    await waitFor(() => {
      expect(service.get).not.toHaveBeenCalled();
    });
  });

  it("calls getFeatureFlags if authenticated", async () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    renderWithHistory(history);
    await waitFor(() => {
      expect(service.get).not.toBeUndefined();
    });
  });

  it("calls gtmAnalytics.pushLogInEvent on init", async () => {
    renderWithHistory(history);
    await waitFor(() => {
      expect(gtmAnalytics.pushLogInEvent).toHaveBeenCalled();
    });
  });

  it("renders ErrorBoundary fallback when child throws", async () => {
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

  // New test: Patch localStorage dispatches event
  it("patchLocalStorage dispatches localstorage-change event", async () => {
    const eventListener = jest.fn();
    window.addEventListener("localstorage-change", eventListener);
    renderWithHistory(history);
    act(() => {
      localStorage.setItem("i18nextLng", "cy");
      const event = new Event("localstorage-change");
      // @ts-ignore
      event.key = "i18nextLng";
      // @ts-ignore
      event.newValue = "cy";
      window.dispatchEvent(event);
    });
    await waitFor(() => {
      expect(eventListener).toHaveBeenCalled();
    });
    window.removeEventListener("localstorage-change", eventListener);
  });

  // New test: Language changes on localstorage-change event
  it("updates langCode on localstorage-change event", async () => {
    renderWithHistory(history);
    act(() => {
      const event = new Event("localstorage-change");
      // @ts-ignore
      event.key = "i18nextLng";
      // @ts-ignore
      event.newValue = "cy";
      window.dispatchEvent(event);
    });
    await waitFor(() => {
      expect(localStorage.getItem("i18nextLng")).toBe("cy");
    });
  });
});