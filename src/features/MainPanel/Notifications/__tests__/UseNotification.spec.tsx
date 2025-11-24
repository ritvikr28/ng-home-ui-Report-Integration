import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";

describe("useNotification", () => {
  it("should initialize filterBtnClicked as false", () => {
    const { result } = renderHook(() => useNotification());
    expect(result.current.filterBtnClicked).toBe(false);
  });

  it("should set filterBtnClicked to true", () => {
    const { result } = renderHook(() => useNotification());
    act(() => {
      result.current.setFilterBtnClicked(true);
    });
    expect(result.current.filterBtnClicked).toBe(true);
  });

  it("should set filterBtnClicked back to false", () => {
    const { result } = renderHook(() => useNotification());
    act(() => {
      result.current.setFilterBtnClicked(true);
    });
    act(() => {
      result.current.setFilterBtnClicked(false);
    });
    expect(result.current.filterBtnClicked).toBe(false);
  });
});