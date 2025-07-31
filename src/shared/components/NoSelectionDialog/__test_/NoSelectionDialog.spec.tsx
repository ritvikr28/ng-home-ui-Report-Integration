import { render, screen, fireEvent } from "@testing-library/react";
import NoSelectionDialog from "../NoSelectionDialog";

describe("NoSelectionDialog", () => {

  it("calls setShowDialog(false) when Okay button is clicked", () => {
    const setShowDialog = jest.fn();
    render(<NoSelectionDialog setShowDialog={setShowDialog} />);
    fireEvent.click(screen.getByRole("button", { name: /okay/i }));
    expect(setShowDialog).toHaveBeenCalledWith(false);
  });

  it("calls setShowDialog(false) when close button is clicked", () => {
    const setShowDialog = jest.fn();
    render(<NoSelectionDialog setShowDialog={setShowDialog} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(setShowDialog).toHaveBeenCalledWith(false);
  });
});
