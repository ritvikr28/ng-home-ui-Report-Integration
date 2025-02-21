import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminConsole from "../../../features/AdminConsole/AdminConsole.view";
import BreadcrumbWrapper from "../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

interface LocalisedMenuProps {
    onCloseSideNavigationPanel: () => void;
    isOpenSideNavigation: boolean;
  }

  jest.mock("@essnextgen/ui-application-kit", () => ({
    LocalisedMenu: ({
      onCloseSideNavigationPanel,
      isOpenSideNavigation,
    }: LocalisedMenuProps) => (
      <button type="button" onClick={onCloseSideNavigationPanel}>
        {isOpenSideNavigation ? "Close Menu" : "Open Menu"}
      </button>
    ),
  }));

 
  
describe("InviteUserView", () => {
    
test("calls setIsOpen with false when menu is closed", () => {
    const setIsOpen = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [true, setIsOpen]);

    render(<AdminConsole />);

    const closeButton = screen.getByText("Close Menu");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("calls onCloseSideNavigationPanel when Admin Console breadcrumb is clicked", () => {
    const handleClick = jest.fn();
    render(<BreadcrumbWrapper />);
    const adminConsoleBreadcrumb = screen.getByText("Home");
    fireEvent.click(adminConsoleBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
  
});
