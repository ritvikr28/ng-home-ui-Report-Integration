import { render, screen, fireEvent } from "@testing-library/react";
import InviteUsersDialog from "../InviteUsersDialog";

describe("InviteUsersDialog", () => {
  it("renders dialog with correct title and content", () => {
    const setShowDialog = jest.fn();
    render(<InviteUsersDialog setShowDialog={setShowDialog} />);
    expect(screen.getByText("No items selected")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please select at least one item from the search results to perform the action."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /okay/i })).toBeInTheDocument();
  });

  it("calls setShowDialog(false) when Okay button is clicked", () => {
    const setShowDialog = jest.fn();
    render(<InviteUsersDialog setShowDialog={setShowDialog} />);
    fireEvent.click(screen.getByRole("button", { name: /okay/i }));
    expect(setShowDialog).toHaveBeenCalledWith(false);
  });

  it("calls setShowDialog(false) when close button is clicked", () => {
    const setShowDialog = jest.fn();
    render(<InviteUsersDialog setShowDialog={setShowDialog} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(setShowDialog).toHaveBeenCalledWith(false);
  });
});
