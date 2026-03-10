import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSidePanelTableSelection } from "../components/DMSSidePanel/sidePanelTable.logic";

const mockData: any[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" }
];

function createCheckboxChangeEvent(checked: boolean): React.ChangeEvent<HTMLInputElement> {
  const input: HTMLInputElement = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  const eventObj: Partial<React.ChangeEvent<HTMLInputElement>> = {
    target: input,
    currentTarget: input,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    nativeEvent: new Event("change"),
    preventDefault: () => {},
    stopPropagation: () => {},
    persist: () => {},
    type: "change",
    timeStamp: Date.now()
  };
  return eventObj as unknown as React.ChangeEvent<HTMLInputElement>;
}

describe("useSidePanelTableSelection", () => {
  it("initializes selection states", () => {
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.prevSelectedDocs).toEqual([]);
    expect(result.current.excludedCheckBoxIds).toEqual([]);
  });

  it("handles row checkbox selection and deselection", () => {
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
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
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
    const event: React.ChangeEvent<HTMLInputElement> = createCheckboxChangeEvent(true);
    act(() => {
      result.current.handleOnChangeAllCheckBox(event);
    });
    expect(result.current.selectedIds).toEqual(["1", "2", "3"]);
    const event2: React.ChangeEvent<HTMLInputElement> = createCheckboxChangeEvent(false);
    act(() => {
      result.current.handleOnChangeAllCheckBox(event2);
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handles previous selected docs", () => {
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
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
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.setExcludedCheckBoxIds(["2"]);
    });
    expect(result.current.excludedCheckBoxIds).toEqual(["2"]);
  });

  it("sets selected ids directly", () => {
    const { result }: { result: { current: ReturnType<typeof useSidePanelTableSelection> } } = renderHook(() => useSidePanelTableSelection(mockData));
    act(() => {
      result.current.setSelectedIds(["1", "3"]);
    });
    expect(result.current.selectedIds).toEqual(["1", "3"]);
  });
});