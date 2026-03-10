import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSidePanelTableSelection } from "../components/DMSSidePanel/sidePanelTable.logic";

const mockData = [
  { id: "1" },
  { id: "2" },
  { id: "3" }
];

describe("useSidePanelTableSelection", () => {
  it("initializes selection states", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.prevSelectedDocs).toEqual([]);
    expect(result.current.excludedCheckBoxIds).toEqual([]);
  });

  it("handles row checkbox selection and deselection", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.handleRowCheckboxChange(0, "1");
    });
    expect(result.current.selectedIds).toEqual(["1"]);
    act(() => {
      result.current.handleRowCheckboxChange(1, "2");
    });
    expect(result.current.selectedIds).toEqual(["1", "2"]);
    act(() => {
      result.current.handleRowCheckboxChange(0, "1");
    });
    expect(result.current.selectedIds).toEqual(["2"]);
  });

  it("handles select all and deselect all", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    const event = { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>;
    act(() => {
      result.current.handleOnChangeAllCheckBox(event);
    });
    expect(result.current.selectedIds).toEqual(["1", "2", "3"]);
    const event2 = { target: { checked: false } } as React.ChangeEvent<HTMLInputElement>;
    act(() => {
      result.current.handleOnChangeAllCheckBox(event2);
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handles previous selected docs", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.handlePrevSelectedDocs(["1", "2"]);
    });
    expect(result.current.prevSelectedDocs).toEqual(["1", "2"]);
    act(() => {
      result.current.handlePrevSelectedDocs(["2", "3"]);
    });
    expect(result.current.prevSelectedDocs).toEqual(["1", "2", "3"]);
  });

  it("sets excluded checkbox ids", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.setExcludedCheckBoxIds(["2"]);
    });
    expect(result.current.excludedCheckBoxIds).toEqual(["2"]);
  });

  it("sets selected ids directly", () => {
    const { result } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.setSelectedIds(["1", "3"]);
    });
    expect(result.current.selectedIds).toEqual(["1", "3"]);
  });
});