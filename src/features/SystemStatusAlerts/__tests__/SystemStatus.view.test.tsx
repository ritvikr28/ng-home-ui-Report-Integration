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

});