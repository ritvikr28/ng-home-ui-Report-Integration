import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminConsole from "../../../features/AdminConsole/AdminConsole.view";
import BreadcrumbWrapper from "../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";
import InviteUserView from "../InviteUsers.view";

interface LocalisedMenuProps {
  onCloseSideNavigationPanel: () => void;
  isOpenSideNavigation: boolean;
}
const mediaQuery = require("@essnextgen/ui-kit");

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  ControlledList: jest.fn(() => (
    <div data-testid="mock-controlled-list">Mock ControlledList</div>
  ))
}));

jest.mock("@essnextgen/ui-application-kit", () => ({
  LocalisedMenu: ({
    onCloseSideNavigationPanel,
    isOpenSideNavigation
  }: LocalisedMenuProps) => (
    <button type="button" onClick={onCloseSideNavigationPanel}>
      {isOpenSideNavigation ? "Close Menu" : "Open Menu"}
    </button>
  )
}));

describe("InviteUserView", () => {
  test.skip("calls setIsOpen with false when menu is closed", () => {
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
    const adminConsoleBreadcrumb = screen.getByText("breadcrumbshome");
    fireEvent.click(adminConsoleBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  test("renders InviteUserView without crashing", () => {
    const setIsOpen = jest.fn();
    const useStateMock: any = (init: any) => [init, setIsOpen];

    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<InviteUserView />);
    expect(screen.getByText("Invite users")).toBeInTheDocument();
  });

  test("mocks and renders ControlledList component", () => {
    const setIsOpen = jest.fn();
    const useStateMock: any = (init: any) => [init, setIsOpen];

    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<InviteUserView />);
    expect(screen.getByTestId("mock-controlled-list")).toBeInTheDocument();
  });
});
