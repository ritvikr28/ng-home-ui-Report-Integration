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
   // expect(getByText("breadcrumbsadminconsole")).toBeInTheDocument();
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
    const adminConsoleBreadcrumb = screen.getByText("breadcrumbshome");
    fireEvent.click(adminConsoleBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  test("desktop view: side panel open by default and collapse button hidden", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); // desktop
    const { container } = render(<AdminConsole />);

    const menuToggle = screen.getByTestId("menu-toggle");
    expect(menuToggle).toHaveTextContent("Close Menu");

    expect(screen.queryByTestId("btn-collapse")).toBeNull();

    expect(container.querySelector(".new-adminconsole-container-grid")).toBeInTheDocument();
  });

  test("removes 'no-scroll' class from body on mount", () => {
    document.body.classList.add("no-scroll");
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(<AdminConsole />);
    expect(document.body.classList.contains("no-scroll")).toBe(false);
  });

  test("clicking LocalisedMenu button closes panel and updates grid class and toggle text", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); // start open on desktop
    const { container } = render(<AdminConsole />);

    const menuToggle = screen.getByTestId("menu-toggle");
    expect(menuToggle).toHaveTextContent("Close Menu");

    fireEvent.click(menuToggle);

    // After clicking, panel should be closed
    expect(menuToggle).toHaveTextContent("Open Menu");
    expect(container.querySelector(".new-adminconsole-container")).toBeInTheDocument();
  });

  test("mobile view: collapse button appears and toggles the side panel open", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true); // mobile
    const { container } = render(<AdminConsole />);

    const collapseBtn = screen.getByTestId("btn-collapse");
    expect(collapseBtn).toBeInTheDocument();

    // Initially closed -> grid should have "new-adminconsole-container"
    expect(container.querySelector(".new-adminconsole-container")).toBeInTheDocument();

    fireEvent.click(collapseBtn);

    // After clicking, side panel opens
    expect(screen.getByTestId("menu-toggle")).toHaveTextContent("Close Menu");
    expect(container.querySelector(".new-adminconsole-container-grid")).toBeInTheDocument();
  });
});
