import { render } from "@testing-library/react";
import WistiaPlayerSection from "./WistiaPlayerSection";

jest.mock("@wistia/wistia-player-react", () => ({
  WistiaPlayer: ({ onPlay, onEnded, onPause }: any) => (
    <div>
      <button data-testid="play" onClick={onPlay} type="button">Play</button>
      <button data-testid="ended" onClick={onEnded} type="button">Ended</button>
      <button data-testid="pause" onClick={onPause} type="button">Pause</button>
    </div>
  )
}));

describe("WistiaPlayerSection", () => {
  it("renders the wistia player section div", () => {
    const { container } = render(
      <WistiaPlayerSection handlePlay={() => {}} handleOnEnded={() => {}} handleOnPause={() => {}} />
    );
    expect(container.querySelector(".wistia-palyer-video-class")).toBeInTheDocument();
  });

  it("calls handlePlay when play button is clicked", () => {
    const handlePlay = jest.fn();
    const { getByTestId } = render(
      <WistiaPlayerSection handlePlay={handlePlay} handleOnEnded={() => {}} handleOnPause={() => {}} />
    );
    getByTestId("play").click();
    expect(handlePlay).toHaveBeenCalled();
  });

  it("calls handleOnEnded when ended button is clicked", () => {
    const handleOnEnded = jest.fn();
    const { getByTestId } = render(
      <WistiaPlayerSection handlePlay={() => {}} handleOnEnded={handleOnEnded} handleOnPause={() => {}} />
    );
    getByTestId("ended").click();
    expect(handleOnEnded).toHaveBeenCalled();
  });

  it("calls handleOnPause when pause button is clicked", () => {
    const handleOnPause = jest.fn();
    const { getByTestId } = render(
      <WistiaPlayerSection handlePlay={() => {}} handleOnEnded={() => {}} handleOnPause={handleOnPause} />
    );
    getByTestId("pause").click();
    expect(handleOnPause).toHaveBeenCalled();
  });
});
