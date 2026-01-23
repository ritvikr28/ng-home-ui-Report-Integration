import { previousSlide } from "./TakeRegisterEventHelper";

describe("previousSlide", () => {
  it("should call previous and moveLeft when currentSlide > 0 and ref is valid", () => {
    const previousMock = jest.fn();
    const setCurrentSlide = jest.fn();
    const carouselRef = { current: { previous: previousMock } };
    previousSlide(carouselRef, 2, setCurrentSlide);
    expect(previousMock).toHaveBeenCalled();
    expect(setCurrentSlide).toHaveBeenCalled();
  });

  it("should not call previous or moveLeft when currentSlide is 0", () => {
    const previousMock = jest.fn();
    const setCurrentSlide = jest.fn();
    const carouselRef = { current: { previous: previousMock } };
    previousSlide(carouselRef, 0, setCurrentSlide);
    expect(previousMock).not.toHaveBeenCalled();
    expect(setCurrentSlide).not.toHaveBeenCalled();
  });

  it("should not call previous or moveLeft when ref is null", () => {
    const setCurrentSlide = jest.fn();
    const carouselRef = { current: null };
    previousSlide(carouselRef, 2, setCurrentSlide);
    expect(setCurrentSlide).not.toHaveBeenCalled();
  });
});
