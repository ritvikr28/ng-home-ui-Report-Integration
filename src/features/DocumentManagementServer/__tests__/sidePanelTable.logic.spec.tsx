import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSidePanelTableSelection, getPaginatedData, createHandlePageChange, createHandleSorting } from "../components/DMSSidePanel/sidePanelTable.logic";

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

describe("getPaginatedData", () => {
  const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("returns items for the first page", () => {
    expect(getPaginatedData(data, 1, 3)).toEqual([1, 2, 3]);
  });

  it("returns items for a middle page", () => {
    expect(getPaginatedData(data, 2, 3)).toEqual([4, 5, 6]);
  });

  it("returns items for the last page (partial)", () => {
    expect(getPaginatedData(data, 4, 3)).toEqual([10]);
  });

  it("returns empty array when page is beyond available data", () => {
    expect(getPaginatedData(data, 5, 3)).toEqual([]);
  });

  it("returns all items when itemsPerPage exceeds data length", () => {
    expect(getPaginatedData(data, 1, 20)).toEqual(data);
  });

  it("returns empty array for empty input", () => {
    expect(getPaginatedData([], 1, 5)).toEqual([]);
  });
});

describe("createHandlePageChange", () => {
  it("calls setCurrentPage with the provided page number", () => {
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandlePageChange(setCurrentPage);
    handler({} as React.ChangeEvent<unknown>, 3);
    expect(setCurrentPage).toHaveBeenCalledWith(3);
  });

  it("calls setCurrentPage with page 1", () => {
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandlePageChange(setCurrentPage);
    handler({} as React.ChangeEvent<unknown>, 1);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("is called exactly once per invocation", () => {
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandlePageChange(setCurrentPage);
    handler({} as React.ChangeEvent<unknown>, 7);
    expect(setCurrentPage).toHaveBeenCalledTimes(1);
  });
});

describe("createHandleSorting", () => {
  it("calls setIsInitialLoad(true), onSortChange with columnName, and setCurrentPage(1)", () => {
    const setIsInitialLoad: jest.Mock = jest.fn();
    const onSortChange: jest.Mock = jest.fn();
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandleSorting(setIsInitialLoad, onSortChange, setCurrentPage);

    handler({} as React.ChangeEvent<unknown>, "FileName");

    expect(setIsInitialLoad).toHaveBeenCalledWith(true);
    expect(onSortChange).toHaveBeenCalledWith("FileName");
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("resets page to 1 regardless of the column sorted", () => {
    const setIsInitialLoad: jest.Mock = jest.fn();
    const onSortChange: jest.Mock = jest.fn();
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandleSorting(setIsInitialLoad, onSortChange, setCurrentPage);

    handler({} as React.ChangeEvent<unknown>, "DateAdded");

    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("calls each setter exactly once per invocation", () => {
    const setIsInitialLoad: jest.Mock = jest.fn();
    const onSortChange: jest.Mock = jest.fn();
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandleSorting(setIsInitialLoad, onSortChange, setCurrentPage);

    handler({} as React.ChangeEvent<unknown>, "FileSize");

    expect(setIsInitialLoad).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(setCurrentPage).toHaveBeenCalledTimes(1);
  });

  it("passes the correct column name to onSortChange", () => {
    const setIsInitialLoad: jest.Mock = jest.fn();
    const onSortChange: jest.Mock = jest.fn();
    const setCurrentPage: jest.Mock = jest.fn();
    const handler = createHandleSorting(setIsInitialLoad, onSortChange, setCurrentPage);

    handler({} as React.ChangeEvent<unknown>, "DocumentType");

    expect(onSortChange).toHaveBeenCalledWith("DocumentType");
  });
});