import { renderHook } from "@testing-library/react-hooks";
import { useIsEllipsed } from "../hooks/useIsEllipsed";

describe("useIsEllipsed — default parameter branches", () => {
  it("covers `= {}` default — calling with no argument at all", () => {
    // Covers the `= {}` default: the whole argument defaults to {}
    const { result } = renderHook(() => useIsEllipsed());
    expect(result.current.ref).toBeDefined();
    expect(result.current.isEllipsed).toBe(false);
  });

  it("covers `deps = []` default — calling with {} (no deps property)", () => {
    // Covers the `deps = []` default: argument is provided but deps is omitted
    const { result } = renderHook(() => useIsEllipsed({}));
    expect(result.current.ref).toBeDefined();
    expect(result.current.isEllipsed).toBe(false);
  });
});
