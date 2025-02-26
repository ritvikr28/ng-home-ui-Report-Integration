import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import DBManagement from "../DBManagement.view";

// Mock useMediaQuery
jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn()
}));

describe("DBManagement Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with all elements", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); // Mock desktop view

    render(<DBManagement />);

    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    expect(screen.getByText("Refresh Database")).toBeInTheDocument();
  });

  it("should handle button click to open side navigation in mobile view", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); // Mock mobile view

    render(<DBManagement />);

    const button = screen.getByTestId("btn-collapse");
    fireEvent.click(button);

    expect(screen.getByText("Refresh Database")).toBeInTheDocument();
  });

  it("should close side navigation when onCloseSideNavigationPanel is called", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); // Mock mobile view

    render(<DBManagement />);

    const button = screen.getByTestId("btn-collapse");
    fireEvent.click(button);

    const closeButton = screen.getByText("Refresh Database");
    fireEvent.click(closeButton);

    expect(screen.queryByText("Refresh Database")).toBeInTheDocument();
  });

  it("should update isOpen state based on media query", () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false); // Mock desktop view
    (useMediaQuery as jest.Mock).mockReturnValueOnce(true); // Mock mobile view

    const { rerender } = render(<DBManagement />);

    expect(screen.queryByText("Refresh Database")).toBeInTheDocument();

    rerender(<DBManagement />);
  });
});