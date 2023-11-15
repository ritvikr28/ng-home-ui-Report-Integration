import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SidePanel from "../SidePanel.view";

describe("SidePanel Component", () => {
  it("renders correctly when open", () => {
    const { getByTestId } = render(
      <SidePanel isOpen togglePanel={() => {}} closePanel={() => {}} />
    );

    expect(getByTestId("btn-90")).toBeInTheDocument();
  });

  it("renders correctly when closed", () => {
    const { getByTestId } = render(
      <SidePanel isOpen={false} togglePanel={() => {}} closePanel={() => {}} />
    );

    expect(getByTestId("btn-save")).toBeInTheDocument();
  });

  test("calls closePanel when close button is clicked", () => {
    const closePanelMock = jest.fn();
    const { getByTestId } = render(
      <SidePanel
        isOpen
        togglePanel={() => {}}
        closePanel={closePanelMock}
      />
    );

    fireEvent.click(getByTestId("btn-90"));

    expect(closePanelMock).toHaveBeenCalled();
  });

  test("calls togglePanel when save button is clicked", () => {
    const togglePanelMock = jest.fn();
    const { getByTestId } = render(
      <SidePanel
        isOpen={false}
        togglePanel={togglePanelMock}
        closePanel={() => {}}
      />
    );

    fireEvent.click(getByTestId("btn-save"));

    expect(togglePanelMock).toHaveBeenCalled();
  });
});
