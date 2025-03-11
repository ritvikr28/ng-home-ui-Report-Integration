import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import AdminConsole from "../AdminConsole.view";
import BreadcrumbWrapper from "../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";


jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
}));

interface LocalisedMenuProps {
  onCloseSideNavigationPanel: () => void;
  isOpenSideNavigation: boolean;
}

jest.mock("@essnextgen/ui-application-kit", () => ({
  LocalisedMenu: ({
    onCloseSideNavigationPanel,
    isOpenSideNavigation,
  }: LocalisedMenuProps) => (
    <button type="button" data-testid="menu-toggle" onClick={onCloseSideNavigationPanel}>
      {isOpenSideNavigation ? "Close Menu" : "Open Menu"}
    </button>
  ),
}));

describe("AdminConsole component", () => {
 
  test("toggles side panel on button click", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); 
    render(<AdminConsole />);

    const toggleButton = screen.getByTestId("btn-collapse");
    fireEvent.click(toggleButton); 
    expect(screen.getByTestId("menu-toggle")).toHaveTextContent("Close Menu");
    
  });

  test("renders component correctly", () => {
    const {getByText} = render(<AdminConsole />);
    expect(getByText("breadcrumbshome")).toBeInTheDocument();
    expect(getByText("breadcrumbsadminconsole")).toBeInTheDocument();
  });

  test("closes the side panel when the menu close button is clicked", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); 
    render(<AdminConsole />);

    const closeButton = screen.getByTestId("menu-toggle");
    fireEvent.click(closeButton);

    expect(closeButton).toHaveTextContent("Open Menu");
  });

  test("calls onCloseSideNavigationPanel when Admin Console breadcrumb is clicked", () => {
    const handleClick = jest.fn();
    render(<BreadcrumbWrapper />);
    const adminConsoleBreadcrumb = screen.getByText("Home");
    fireEvent.click(adminConsoleBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
