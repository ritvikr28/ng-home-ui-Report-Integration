import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ValidationTextLevel } from "@essnextgen/ui-kit";
import InviteUsersLogic from "../InviteUsers.logic";
import { getTableHeadersData } from "../InviteUsersProps";

jest.mock("../InviteUsers.view", () => ({
  InviteUserView: ({ handlePageChange, currentPage }: any) => (
    <div>
      <p>InviteUserView Rendered</p>
      <p data-testid="current-page">{currentPage}</p>
      <button type="button" onClick={() => handlePageChange({}, currentPage + 1)}>
        Next Page
      </button>
    </div>
  )
}));

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  ValidationText: ({ text, ...rest }: any) => (
    <div data-testid="mock-validation-text" {...rest}>
      {text}
    </div>
  )
}));
describe("InviteUsersLogic", () => {
  test("should render InviteUserView", () => {
    render(<InviteUsersLogic />);
    expect(screen.getByText("InviteUserView Rendered")).toBeInTheDocument();
  });

  test("should update current page when Next Page button is clicked", () => {
    render(<InviteUsersLogic />);
    const pageValue = screen.getByTestId("current-page");
    expect(pageValue.textContent).toBe("1");

    fireEvent.click(screen.getByText("Next Page"));

    expect(screen.getByTestId("current-page").textContent).toBe("2");
  });

  test("should hide invitation conflict banner on page change", () => {
    const setBannerSpy = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [1, jest.fn()]) // currentPage
      .mockImplementationOnce(() => [0, jest.fn()]) // totalPage
      .mockImplementationOnce(() => [false, jest.fn()]) // isLoader
      .mockImplementationOnce(() => [false, jest.fn()]) // isSearchLoader
      .mockImplementationOnce(() => [[], jest.fn()]) // usersTableData
      .mockImplementationOnce(() => [true, setBannerSpy]); // showInvitationConflictBanner

    render(<InviteUsersLogic />);
    // Click the button to change page
    fireEvent.click(screen.getByText("Next Page"));

    expect(setBannerSpy).toHaveBeenCalledWith(false);
  });
  it("should be an array with expected length and structure", () => {
    expect(Array.isArray(getTableHeadersData)).toBe(true);
    expect(getTableHeadersData.length).toBeGreaterThan(0);
    const header = getTableHeadersData.find(
      (h) => h.text === "Invitation status"
    );
    expect(header).toBeDefined();
    expect(typeof header?.anyComponent).toBe("function");
  });

  it("anyComponent renders ValidationText for 'Invitation conflict'", () => {
    const header = getTableHeadersData.find(
      (h) => h.text === "Invitation status"
    );
    const result = header?.anyComponent("Invitation conflict");
    const { getByTestId } = render(<>{result}</>);
    const validationText = getByTestId("mock-validation-text");
    expect(validationText).toBeInTheDocument();
    expect(validationText).toHaveTextContent("Invitation conflict");
    expect(validationText).toHaveClass("invite-user-status");
    expect(validationText.getAttribute("textLevel")).toBe(
      ValidationTextLevel.Warning
    );
  });

  it("anyComponent returns the input for non-conflict values", () => {
    const header = getTableHeadersData.find(
      (h) => h.text === "Invitation status"
    );
    const result = header?.anyComponent("Invited");
    expect(result).toBe("Invited");
  });
});
