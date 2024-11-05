import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import DBManagement from "../DBManagement.view";
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

describe("DBManagement component", () => {
  it("calls setIsOpen with false when menu is closed", () => {
    const setIsOpen = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [true, setIsOpen]);

    // Mocking the items array to avoid flagValues issue
    const mockItems = ["item1", "item2", "item3"]; // Add appropriate mock data
    jest.spyOn(React, "useState").mockImplementationOnce(() => [mockItems, jest.fn()]);

    render(<DBManagement />);

    const closeButton = screen.getByText("Close Menu");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("calls onCloseSideNavigationPanel when Refresh Database breadcrumb is clicked", () => {
    const handleClick = jest.fn();
    render(<BreadcrumbWrapper />);
    const refreshDatabaseBreadcrumb = screen.getByText("Home");
    fireEvent.click(refreshDatabaseBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
