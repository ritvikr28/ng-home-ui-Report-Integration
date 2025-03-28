import { render, screen, within } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import { useMediaQuery } from "@essnextgen/ui-kit";
import SIMSIDAdminPageView from "../SIMSIDAdminPage.view";

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn()
}));

describe("SIMSIDAdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders welcome message and sims id admin page if authorised, with notification enabled, in desktop view", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest.spyOn(authService, "getUsername").mockImplementation(() => "John");

    const { getByTestId } = render(<SIMSIDAdminPageView />);

    const containerWelcomeMessage = screen.getByTestId("subparent-element");

    const strongElement = within(containerWelcomeMessage).getByText("John", {
      selector: "span"
    });
    const welcomeMessage = "welcomePage.himsg John, welcomePage.welcomemsg";

    expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
    expect(getByTestId("notification-test-id")).toBeInTheDocument();
    expect(strongElement).toBeInTheDocument();
    expect(containerWelcomeMessage).toHaveTextContent(welcomeMessage);
  });

  test("renders sims id admin page if authorised, with notification enabled, in mobile view", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest.spyOn(authService, "getUsername").mockImplementation(() => "John");

    const { getByTestId } = render(<SIMSIDAdminPageView />);
    expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
    expect(getByTestId("notification-test-id")).toBeInTheDocument();
  });

  test("renders welcome message and sims id admin page if authorised, with notification disabled, in desktop view", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    const sessionStorageMock = {
      getItem: jest.fn((key) => {
        if (key === "IS_NOTIFICATION_ENABLED") {
          return "false";
        }
        return null;
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn()
    };

    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      writable: true
    });
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest.spyOn(authService, "getUsername").mockImplementation(() => "John");

    const { getByTestId } = render(<SIMSIDAdminPageView />);

    const containerWelcomeMessage = screen.getByTestId("subparent-element");

    const strongElement = within(containerWelcomeMessage).getByText("John", {
      selector: "span"
    });
    const welcomeMessage = "welcomePage.himsg John, welcomePage.welcomemsg";

    const containerNotificationSection = screen.queryByTestId(
      "notification-test-id"
    );

    expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
    expect(containerNotificationSection).not.toBeInTheDocument();
    expect(strongElement).toBeInTheDocument();
    expect(containerWelcomeMessage).toHaveTextContent(welcomeMessage);
  });
});
