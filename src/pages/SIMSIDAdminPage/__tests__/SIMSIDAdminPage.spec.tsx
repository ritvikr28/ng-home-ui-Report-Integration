import { render, screen, within } from "@testing-library/react";
import SIMSIDAdminPageView from "../SIMSIDAdminPage.view";
import { authService } from "@essnextgen/auth-ui";

describe("SIMSIDAdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders welcome message and sims id admin page if authorised, with notification enabled", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
      .spyOn(authService, "getUsername")
      .mockImplementation(() => "John");

    const { getByTestId } = render(<SIMSIDAdminPageView />);

    const containerWelcomeMessage = screen.getByTestId('subparent-element');

    const strongElement = within(containerWelcomeMessage).getByText('John', { selector: 'strong' });
    const welcomeMessage = 'Hi John, welcome back!';

    expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
    expect(getByTestId('notification-test-id')).toBeInTheDocument();
    expect(strongElement).toBeInTheDocument();
    expect(containerWelcomeMessage).toHaveTextContent(welcomeMessage);
  });

  test("renders welcome message and sims id admin page if authorised, with notification disabled", () => {
    const sessionStorageMock = {
        getItem: jest.fn((key) => {
          if (key === 'IS_NOTIFICATION_ENABLED') {
            return 'false';
          }
          return null;
        }),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn(),
      };
      
      Object.defineProperty(window, 'sessionStorage', {
        value: sessionStorageMock,
        writable: true,
      });
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
      .spyOn(authService, "getUsername")
      .mockImplementation(() => "John");

    const { getByTestId } = render(<SIMSIDAdminPageView />);

    const containerWelcomeMessage = screen.getByTestId('subparent-element');

    const strongElement = within(containerWelcomeMessage).getByText('John', { selector: 'strong' });
    const welcomeMessage = 'Hi John, welcome back!';

    const containerNotificationSection = screen.queryByTestId('notification-test-id');

    expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
    expect(containerNotificationSection).not.toBeInTheDocument();
    expect(strongElement).toBeInTheDocument();
    expect(containerWelcomeMessage).toHaveTextContent(welcomeMessage);
  });
});
