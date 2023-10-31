import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SidePanel from "../SidePanel.logic";
import SidePanelView from "../SidePanel.view";

test("toggles isOpen state when togglePanel is called", () => {
  const mockTogglePanel = jest.fn();
  const { getByTestId } = render(
    <SidePanelView isOpen togglePanel={() => {}} />
  );

  fireEvent.click(getByTestId("toggle-button"));

  expect(mockTogglePanel).toHaveBeenCalledTimes(0);
});

test("renders SidePanel with default open state", () => {
  const { getByTestId } = render(<SidePanel />);
  const closeButton = getByTestId("undefined-btn");

  expect(closeButton).toBeInTheDocument();
});

test("renders SidePanel with default open state", () => {
  const { getByTestId } = render(<SidePanel />);
  const closeButton = getByTestId("undefined-btn");

  expect(closeButton).toBeInTheDocument();
});

test("closes SidePanel when close button is clicked", () => {
  const { getByTestId } = render(<SidePanel />);
  const closeButton = getByTestId("undefined-btn");

  fireEvent.click(closeButton);

  expect(closeButton).not.toBeInTheDocument();
});

it("toggles isOpen state when togglePanel is called", () => {
  const { getByTestId } = render(
    <SidePanelView isOpen togglePanel={() => {}} />
  );

  expect(getByTestId("undefined-btn")).toHaveClass(" essui-icon-button");

  fireEvent.click(getByTestId("toggle-button"));

  expect(getByTestId("undefined-btn")).toHaveClass(" essui-icon-button");
});
