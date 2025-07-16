import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import RagStatus from "../SystemStatus.view";

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
}));

jest.mock("../SystemStatusAlerts/SystemStatusAlerts.view", () => () => (
  <div data-testid="system-status-alerts">System Status Alerts</div>
));

// Mock gtmAnalytics.pushPageViewEvent as a jest.fn()
jest.mock("../../../shared/utils/analytics", () => ({
  __esModule: true,
  default: {
    pushPageViewEvent: jest.fn(),
  },
}));

describe("RagStatus Component", () => {
  const mockUseMediaQuery = useMediaQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the skip link", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    const skipLink = screen.getByText("Skip to main content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("should render the SystemStatusAlerts component", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    const systemStatusAlerts = screen.getByTestId("system-status-alerts");
    expect(systemStatusAlerts).toBeInTheDocument();
  });

  it("should toggle the side navigation panel when handleButtonClick is called", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<RagStatus />);
    const collapseButton = screen.getByTestId("btn-collapse");
    expect(collapseButton).toBeInTheDocument();
    fireEvent.click(collapseButton);
    const updatedCollapseButton = screen.queryByTestId("btn-collapse");
    expect(updatedCollapseButton).not.toBeInTheDocument();
  });

  it("should render the collapse button only in mobile view when side navigation is closed", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<RagStatus />);
    const collapseButton = screen.getByTestId("btn-collapse");
    expect(collapseButton).toBeInTheDocument();
  });

  it("should not render the collapse button in desktop view", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    const collapseButton = screen.queryByTestId("btn-collapse");
    expect(collapseButton).not.toBeInTheDocument();
  });

  it("toggles isOpen state when handleButtonClick is called", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    // isOpen starts as true (not mobile view)
    // Simulate mobile view and closed panel
    mockUseMediaQuery.mockReturnValue(true);
    render(<RagStatus />);
    const collapseButton = screen.getByTestId("btn-collapse");
    fireEvent.click(collapseButton);
    // After click, the button should disappear (panel open)
    expect(screen.queryByTestId("btn-collapse")).not.toBeInTheDocument();
  });

  // Additional tests

  it("should open side navigation when collapse button is clicked in mobile view", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<RagStatus />);
    const collapseButton = screen.getByTestId("btn-collapse");
    fireEvent.click(collapseButton);
    // After clicking, the button should disappear (panel open)
    expect(screen.queryByTestId("btn-collapse")).not.toBeInTheDocument();
  });

  it("should keep side navigation open in desktop view", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    // Collapse button should not be present
    expect(screen.queryByTestId("btn-collapse")).not.toBeInTheDocument();
  });

  it("should render LocalisedMenu with correct defaultSelectedMenu", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    // The LocalisedMenu is not mocked, but we can check for the menu heading text
    expect(screen.getByText("Admin console")).toBeInTheDocument();
  });

  it("should apply correct class when isOpen is true", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<RagStatus />);
    // The class should be adminConsole-sidepanelopen
    expect(document.querySelector(".adminConsole-sidepanelopen")).toBeInTheDocument();
  });

  it("should apply correct class when isOpen is false", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<RagStatus />);
    // The class should be adminconsole-breadcrumb
    expect(document.querySelector(".adminconsole-breadcrumb")).toBeInTheDocument();
  });
});