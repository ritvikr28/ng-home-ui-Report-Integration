import { render, screen } from "@testing-library/react";
// Adjust path if needed
import { useMediaQuery } from "@essnextgen/ui-kit";
import EarlyAdpterPage from "../EarlyAdopterPage.view";

// Mock dependencies
jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn()
}));

jest.mock("@essnextgen/ui-application-kit", () => ({
  LocalisedMenu: jest.fn(({ isOpenSideNavigation }) =>
    isOpenSideNavigation ? <div data-testid="localised-menu">Menu</div> : null
  )
}));

jest.mock("../EarlyAdopter.view", () =>
  jest.fn(() => <div data-testid="early-adopter">Early Adopter</div>)
);

describe("EarlyAdopterPage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in desktop view (sidebar open by default)", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); // Simulate Desktop View

    render(<EarlyAdpterPage />);

    // Debugging
    screen.debug();

    // Check sidebar is open
    expect(screen.getByTestId("localised-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("btn-collapse")).not.toBeInTheDocument();
  });

  it("renders correctly in mobile view (sidebar closed by default)", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); // Simulate Mobile View

    render(<EarlyAdpterPage />);

    // Debugging
    screen.debug();

    // Check sidebar is closed (menu should NOT be in the document)
    expect(screen.queryByTestId("localised-menu")).not.toBeInTheDocument();

    // Ensure the collapse button is present
    expect(screen.getByTestId("btn-collapse")).toBeInTheDocument();
  });

  it("renders breadcrumbs correctly", () => {
    render(<EarlyAdpterPage />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Admin console")).toBeInTheDocument();
    expect(screen.getByText("User management")).toBeInTheDocument();
  });

  it("renders EarlyAdopter component", () => {
    render(<EarlyAdpterPage />);
    expect(screen.getByTestId("early-adopter")).toBeInTheDocument();
  });
});
