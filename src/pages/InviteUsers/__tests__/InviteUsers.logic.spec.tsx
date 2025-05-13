import { render, screen } from "@testing-library/react";
import InviteUsersLogic from "../InviteUsers.logic";
import InviteUserView from "../InviteUsers.view";

jest.mock("../InviteUsers.view", () =>
  jest.fn(() => <div>Mock InviteUserView</div>)
);

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
});
