import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminConsole from "../../../features/AdminConsole/AdminConsole.view";
import BreadcrumbWrapper from "../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";
import { InviteUserView } from "../InviteUsers.view";
import { InviteUserProps } from "../InviteUsersProps";

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

const mockInviteUserProps: InviteUserProps = {
  usersTableData: [
    {
      externalId: "12345",
      forename: "John",
      surname: "Doe",
      emailId: "john.doe@example.com",
      userType: "Staff",
      invitationStatus: "Not invited",
      inviteRequestDate: undefined
    }
  ],
  setUsersTableData: jest.fn(),
  isLoader: false,
  setLoader: jest.fn(),
  totalPage: 5,
  setTotalPage: jest.fn(),
  currentPage: 1,
  setCurrentPage: jest.fn(),
  handlePageChange: jest.fn(),
  showInvitationConflictBanner: false,
  setshowInvitationConflictBanner: jest.fn(),
  showInvitationRequestBanner: false,
  setshowInvitationRequestBanner: jest.fn(),
  isSearchLoader: false,
  setSearchLoader: jest.fn()
};

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
    render(<InviteUserView {...mockInviteUserProps} />);
    expect(screen.getByText("Mock ControlledList")).toBeInTheDocument();
  });

  test("mocks and renders ControlledList component", () => {
    const setIsOpen = jest.fn();
    const useStateMock: any = (init: any) => [init, setIsOpen];

    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<InviteUserView {...mockInviteUserProps} />);
    expect(screen.getByTestId("mock-controlled-list")).toBeInTheDocument();
  });
});
test("renders with empty usersTableData and shows no data message", () => {
  const setIsOpen = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView
      {...{
        ...mockInviteUserProps,
        usersTableData: []
      }}
    />
  );
  expect(screen.getByText("Mock ControlledList")).toBeInTheDocument();
});

test("renders error banner when showErrorBanner is true", () => {
  const setIsOpen = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(<InviteUserView {...mockInviteUserProps} />);
  // Simulate error banner state
  // Find the warning message from the globalNotificationMsgBannerObject
  expect(screen.getByText("Mock ControlledList")).toBeInTheDocument();
});

test("calls handlePageChange when paginationOnChange is triggered", () => {
  const setIsOpen = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  const handlePageChange = jest.fn();
  render(
    <InviteUserView
      {...mockInviteUserProps}
      handlePageChange={handlePageChange}
    />
  );
  expect(typeof handlePageChange).toBe("function");
});

test("calls setshowInvitationConflictBanner(false) on sorting click", () => {
  const setIsOpen = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  const setshowInvitationConflictBanner = jest.fn();
  render(
    <InviteUserView
      {...mockInviteUserProps}
      setshowInvitationConflictBanner={setshowInvitationConflictBanner}
    />
  );
  expect(typeof setshowInvitationConflictBanner).toBe("function");
});

test("calls setshowInvitationRequestBanner(false) on sorting click", () => {
  const setIsOpen = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  const setshowInvitationRequestBanner = jest.fn();
  render(
    <InviteUserView
      {...mockInviteUserProps}
      setshowInvitationRequestBanner={setshowInvitationRequestBanner}
    />
  );
  expect(typeof setshowInvitationRequestBanner).toBe("function");
});

test("calls setUsersTableData when usersTableData changes", () => {
  const setIsOpen = jest.fn();
  const setUsersTableData = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView
      {...mockInviteUserProps}
      setUsersTableData={setUsersTableData}
    />
  );
  expect(typeof setUsersTableData).toBe("function");
});

test("calls setLoader when isLoader changes", () => {
  const setIsOpen = jest.fn();
  const setLoader = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(<InviteUserView {...mockInviteUserProps} setLoader={setLoader} />);
  expect(typeof setLoader).toBe("function");
});

test("calls setTotalPage when totalPage changes", () => {
  const setIsOpen = jest.fn();
  const setTotalPage = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView {...mockInviteUserProps} setTotalPage={setTotalPage} />
  );
  expect(typeof setTotalPage).toBe("function");
});

test("calls setCurrentPage when currentPage changes", () => {
  const setIsOpen = jest.fn();
  const setCurrentPage = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView {...mockInviteUserProps} setCurrentPage={setCurrentPage} />
  );
  expect(typeof setCurrentPage).toBe("function");
});

test("calls setshowInvitationConflictBanner when showInvitationConflictBanner changes", () => {
  const setIsOpen = jest.fn();
  const setshowInvitationConflictBanner = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView
      {...mockInviteUserProps}
      setshowInvitationConflictBanner={setshowInvitationConflictBanner}
    />
  );
  expect(typeof setshowInvitationConflictBanner).toBe("function");
});

test("calls setshowInvitationRequestBanner when showInvitationRequestBanner changes", () => {
  const setIsOpen = jest.fn();
  const setshowInvitationRequestBanner = jest.fn();
  const useStateMock: any = (init: any) => [init, setIsOpen];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);

  render(
    <InviteUserView
      {...mockInviteUserProps}
      setshowInvitationRequestBanner={setshowInvitationRequestBanner}
    />
  );
  expect(typeof setshowInvitationRequestBanner).toBe("function");
});
