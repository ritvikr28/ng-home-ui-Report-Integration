import { render, screen, fireEvent } from "@testing-library/react";
import MainPanelView from "../MainPanel.view";

describe("MainPanelView", () => {
  it("shows 'Video is closed.' and reopens video when button is clicked", () => {
    render(
      <MainPanelView
        schoolName="Test School"
        isError={false}
        isSchoolPrimary={false}
        isOpen={true}
        setIsOpen={() => { }}
      />
    );

    const closeBtn = screen.getByText("Close Video");
    fireEvent.click(closeBtn);

    expect(screen.getByText("Video is closed.")).toBeInTheDocument();
    const openBtn = screen.getByText("Open Video");
    expect(openBtn).toBeInTheDocument();
    
    fireEvent.click(openBtn);
    expect(screen.getByText("Close Video")).toBeInTheDocument();
  });
});

describe("MainPanelView - handlers", () => {
  it("calls setIsOpen when togglePanel is triggered", () => {
    const setIsOpen = jest.fn();
    render(
      <MainPanelView
        schoolName="Test School"
        isError={false}
        isSchoolPrimary={false}
        isOpen={false}
        setIsOpen={setIsOpen}
      />
    );
    const toggleBtn = screen.getByLabelText("toggle-button");
    fireEvent.click(toggleBtn);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it("calls handlePlay, handleOnEnded, handleOnPause when WistiaPlayer events fire", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => { });
    render(
      <MainPanelView
        schoolName="Test School"
        isError={false}
        isSchoolPrimary={false}
        isOpen={true}
        setIsOpen={() => { }}
      />
    );
    const videoElement = screen.getByTestId("wistia-player");
    fireEvent.play(videoElement);
    fireEvent.ended(videoElement);
    fireEvent.pause(videoElement);

    expect(logSpy).toHaveBeenCalledWith("The video was just played!");
    expect(logSpy).toHaveBeenCalledWith("The video has ended!");
    expect(logSpy).toHaveBeenCalledWith("the video has paused.");
    logSpy.mockRestore();
  });
});
