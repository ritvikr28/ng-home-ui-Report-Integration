import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import RagStatus from "../../RagStatus.view";

const mockUseMediaQuery = useMediaQuery as jest.Mock;

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
}));

describe("RagStatus Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the LocalisedMenu component", () => {
    render(<RagStatus />);

    const adminConsoleLinks = screen.getAllByText("Admin console");
    expect(adminConsoleLinks.length).toBeGreaterThan(0);

    const menuHeading = adminConsoleLinks[0];
    expect(menuHeading).toBeInTheDocument();
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
