import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SidePanel from "../SidePanel.view";

describe("SidePanel Component", () => {
  // test("renders correctly when open", () => {
  //   const { getByTestId } = render(
  //     <SidePanel isOpen togglePanel={() => {}} closePanel={() => {}} showMainPanelView={undefined}/>
  //   );

  //   expect(getByTestId("undefined-btn")).toBeInTheDocument();
  // });

  it("renders correctly when closed", () => {
    const { getByTestId } = render(
      <SidePanel
        isOpen={false}
        togglePanel={() => {}}
        closePanel={() => {}}
        showMainPanelView={undefined}
        setQuickLinkData={jest.fn()}
      />
    );

    expect(getByTestId("btn-collapse")).toBeInTheDocument();
  });

  // test("calls closePanel when close button is clicked", () => {
  //   const closePanelMock = jest.fn();
  //   const { getByTestId } = render(
  //     <SidePanel
  //       isOpen
  //       togglePanel={() => {}}
  //       closePanel={closePanelMock}
  //       showMainPanelView={undefined}
  //     />
  //   );

  //   fireEvent.click(getByTestId("unde"));

  //   expect(closePanelMock).toHaveBeenCalled();
  // });

  test("calls togglePanel when save button is clicked", () => {
    const togglePanelMock = jest.fn();
    const { getByTestId } = render(
      <SidePanel
        isOpen={false}
        togglePanel={togglePanelMock}
        closePanel={() => {}}
        showMainPanelView={undefined}
        setQuickLinkData={jest.fn()}
      />
    );
    expect(getByTestId("close-panel")).toBeInTheDocument();
    fireEvent.click(getByTestId("btn-collapse"));

    expect(togglePanelMock).toHaveBeenCalled();
    expect(togglePanelMock).toBeCalledTimes(1);
  });
});
