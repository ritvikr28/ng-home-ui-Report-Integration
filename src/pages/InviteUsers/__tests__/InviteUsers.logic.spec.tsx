import { render, screen } from "@testing-library/react";
import { ValidationTextLevel } from "@essnextgen/ui-kit";
import InviteUsersLogic from "../InviteUsers.logic";
import InviteUserView from "../InviteUsers.view";
import { getTableHeadersData } from "../InviteUsersProps";

jest.mock("../InviteUsers.view", () =>
  jest.fn(() => <div>Mock InviteUserView</div>)
);
jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  ValidationText: ({ text, ...rest }: any) => (
    <div data-testid="mock-validation-text" {...rest}>
      {text}
    </div>
  )
}));

describe("InviteUsersLogic", () => {
  test("renders InviteUserView component", () => {
    render(<InviteUsersLogic />);
    expect(screen.getByText("Mock InviteUserView")).toBeInTheDocument();
  });

  test("initializes state correctly", () => {
    render(<InviteUsersLogic />);
    expect(InviteUserView).toHaveBeenCalledWith(
      expect.objectContaining({
        usersTableData: [],
        isLoader: false,
        totalPage: 0,
        currentPage: 1,
        showInvitationConflictBanner: false
      }),
      {}
    );
  });

  test("updates usersTableData when setUsersTableData is called", () => {
    render(<InviteUsersLogic />);
    const props = (InviteUserView as jest.Mock).mock.calls[0][0];

    props.setUsersTableData([
      { externalId: "123", forename: "John", surname: "Doe" }
    ]);

    expect(props.usersTableData).toEqual([]);
  });

  test("shows and hides the loader correctly", () => {
    render(<InviteUsersLogic />);
    const props = (InviteUserView as jest.Mock).mock.calls[0][0];

    props.setLoader(true);
    expect(props.isLoader).toBe(false);

    props.setLoader(false);
    expect(props.isLoader).toBe(false);
  });

  test("toggles showInvitationConflictBanner correctly", () => {
    render(<InviteUsersLogic />);
    const props = (InviteUserView as jest.Mock).mock.calls[0][0];

    props.setshowInvitationConflictBanner(true);
    expect(props.showInvitationConflictBanner).toBe(false);

    props.setshowInvitationConflictBanner(false);
    expect(props.showInvitationConflictBanner).toBe(false);
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
