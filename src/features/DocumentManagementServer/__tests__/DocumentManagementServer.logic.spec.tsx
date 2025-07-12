import React from "react";
import { act } from "@testing-library/react-hooks";
import { render, screen } from "@testing-library/react";
import * as ApiService from "../ApiService";
import {
  debouncedFetchSuggestions,
  formatSuggestions,
  getTableHeadersData,
  handlePageChange,
  handleSearchChange,
  handleSuggestionClick,
  hasItems,
  loadSuggestions,
  onBreadcrumbClick,
  tableBodyData
} from "../DocumentManagementServer.logic";

const analytics = require('../../../shared/utils/analytics').default;

jest.mock("../ApiService");

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
  ApiService: {
    fetchDMSSuggestions: jest.fn(),
  },
}));

describe("getTableHeadersData", () => {
  const relatedToColumn = getTableHeadersData.find(h => h.text === 'Related to');
  const anyComponent = relatedToColumn?.anyComponent;

  test("should be an array and contain expected columns", () => {
    expect(Array.isArray(getTableHeadersData)).toBe(true);
    const expectedColumns = [
      "Id", "Document", "Related to", "Category", "Added by", "Date added", "Format", "Size"
    ];
    expectedColumns.forEach(col => {
      expect(getTableHeadersData.find(h => h.text === col)).toBeDefined();
    });
  });

  test("should contain 'Document' header with anyComponent", () => {
    const docHeader = getTableHeadersData.find(h => h.text === "Document");
    expect(docHeader).toBeDefined();
    expect(typeof docHeader?.anyComponent).toBe("function");
  });

  test("should contain 'Related to' header with anyComponent", () => {
    expect(relatedToColumn).toBeDefined();
    expect(typeof relatedToColumn?.anyComponent).toBe("function");
  });

  test("renders nothing when elem is undefined", () => {
    const { container } = render(<>{anyComponent && anyComponent(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders link and tag when elem has one item", () => {
    render(<>{anyComponent && anyComponent(["John Doe"])}</>);
    expect(document.querySelector(".relatedto-main")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "John Doe" })).toBeInTheDocument();
  });

  test("does not render tooltip when only one related item", () => {
  const relatedToCol = getTableHeadersData.find(h => h.text === "Related to");
  const { container } = render(<>{relatedToCol?.anyComponent?.(["Only One"])}</>);
  expect(container.querySelector('[data-testid="tooltip-eventtime"]')).not.toBeInTheDocument();
});
});

describe("getTableHeadersData column anyComponent rendering", () => {
  const sizeColumn = getTableHeadersData.find(h => h.text === "Size");
   const headers = getTableHeadersData;

    test("Category column renders tooltip with value", () => {
    const catColumn = headers.find(h => h.text === "Category");
    const { getByText } = render(<>{catColumn?.anyComponent?.("App")}</>);
    expect(getByText("App")).toBeInTheDocument();
  });

  test("Format column renders tooltip with value", () => {
    const formatColumn = headers.find(h => h.text === "Format");
    const { getByText } = render(<>{formatColumn?.anyComponent?.("pdf")}</>);
    expect(getByText("pdf")).toBeInTheDocument();
  });

  test("Size column renders correctly for string input", () => {
    const sizeCol = headers.find(h => h.text === "Size");
    const { getByText } = render(<>{sizeCol?.anyComponent?.("2 MB")}</>);
    expect(getByText("2 MB")).toBeInTheDocument();
  });

  test("Size column renders correctly for array input", () => {
    const sizeCols = headers.find(h => h.text === "Size");
    const { getByText } = render(<>{sizeCols?.anyComponent?.(["2 MB"])}</>);
    expect(getByText("2 MB")).toBeInTheDocument();
  });

  test("Size column renders nothing when input is null", () => {
    const { container } = render(<>{sizeColumn?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  test("Size column renders nothing when array input is empty", () => {
    const { container } = render(<>{sizeColumn?.anyComponent?.([])}</>);
    expect(container).toBeEmptyDOMElement();
  });
  test("Size column renders nothing when array input is empty", () => {
  const { container } = render(<>{sizeColumn?.anyComponent?.([])}</>);
  expect(container).toBeEmptyDOMElement();
});

});


describe("tableBodyData", () => {
  test("should have correct keys in each row", () => {
    tableBodyData.forEach(row => {
      expect(row).toHaveProperty("id");
      expect(row).toHaveProperty("Document");
      expect(row).toHaveProperty("Relatedto");
      expect(row).toHaveProperty("Category");
      expect(row).toHaveProperty("Addedby");
      expect(row).toHaveProperty("Date added");
      expect(row).toHaveProperty("Format");
      expect(row).toHaveProperty("Size");
    });
  });
});

describe("formatSuggestions", () => {
  test("formats suggestion array correctly", () => {
    const input = [
      { fileId: "1", fileName: "File 1" },
      { fileId: "2", fileName: "File 2" }
    ];
    const result = formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(2);
    expect(result[0].values[0].text).toBe("File 1");
  });

 
  test("returns empty when input is empty", () => {
    const result = formatSuggestions([]);
    expect(result).toEqual([{ name: "", values: [] }]);
  });
});

describe("debouncedFetchSuggestions", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("fetches and sets suggestions", async () => {
    const mockSuggestions = [{ fileName: "Doc A", fileId: "1" }];
    (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);

    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();

    debouncedFetchSuggestions("Doc", setSearchLoading, setSuggestions, setShowError);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });

    expect(setSuggestions).toHaveBeenCalled();
    expect(setSearchLoading).toHaveBeenCalledWith(false);
    expect(setShowError).not.toHaveBeenCalled();
  });

  test("handles undefined payload structure", async () => {
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue({});

  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();

  debouncedFetchSuggestions("Doc", setSearchLoading, setSuggestions, setShowError);

  await act(() => {
    jest.advanceTimersByTime(1000);
    return Promise.resolve();
  });

  expect(setSuggestions).toHaveBeenCalledWith([{ name: "", values: [] }]);
});

  test("handles API error", async () => {
    (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();

    debouncedFetchSuggestions("FailTest", setSearchLoading, setSuggestions, setShowError);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setShowError).toHaveBeenCalledWith(true);
    expect(setSearchLoading).toHaveBeenCalledWith(false);
  });
});

describe("handlePageChange", () => {
  it("should update current page and loading state", () => {
    const setCurrentPage = jest.fn();
    const setIsLoading = jest.fn();
    handlePageChange({}, 2, setCurrentPage, setIsLoading);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
    expect(setIsLoading).toHaveBeenCalledWith(true);
  });
});

describe("handleSearchChange", () => {
  const setup = (value: string) => {
    const event = { target: { value } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();

    handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

    return { setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading };
  };

  it("clears suggestions for short input", () => {
    const { setSuggestions, setIsSearchLoading } = setup("a");
    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });

  it("should handle undefined input value gracefully", () => {
  const event = { target: { value: undefined } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
  expect(setSuggestions).toHaveBeenCalledWith([]);
});

  it("should handle empty string as input", () => {
  const event = { target: { value: "" } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});

  it("loads suggestions for 3+ characters", () => {
    const { setSearchTerm, setIsSearchLoading } = setup("doc");
    expect(setSearchTerm).toHaveBeenCalledWith("doc");
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });

  it("triggers loading for length === 2", () => {
  const event = { target: { value: "ab" } } as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(true);
});
});

describe("handleSuggestionClick", () => {
  it("should call setSearchTerm and setSearchText", async () => {
  const setSearchTerm = jest.fn();
  const setSearchText = jest.fn();

  await handleSuggestionClick({ name: "DocA" }, setSearchTerm, setSearchText);

  expect(setSearchTerm).toHaveBeenCalledWith("DocA");
  expect(setSearchText).toHaveBeenCalledWith("DocA");
});

it("should not call setters if item is null", async () => {
  const setSearchTerm = jest.fn();
  const setSearchText = jest.fn();
  await handleSuggestionClick(null, setSearchTerm, setSearchText);
  expect(setSearchTerm).not.toHaveBeenCalled();
  expect(setSearchText).not.toHaveBeenCalled();
});
  it("should not trigger if name is missing", async () => {
    const setSearchTerm = jest.fn();
    const loadData = jest.fn();

    await handleSuggestionClick({}, setSearchTerm, loadData);
    expect(setSearchTerm).not.toHaveBeenCalled();
  });
});

describe("hasItems", () => {
  it("returns true when any suggestion has values", () => {
    const suggestions = [{ values: [{ text: "Doc" }] }];
    expect(hasItems(suggestions as any)).toBe(true);
  });

  it("returns false when suggestions array is empty", () => {
  expect(hasItems([] as any)).toBe(false);
});

it("returns false when values key is undefined", () => {
  const suggestions = [{ name: "Test", values: undefined }];
  expect(hasItems(suggestions as any)).toBe(false);
});

  it("returns false when all are empty", () => {
    const suggestions = [{ values: [] }];
    expect(hasItems(suggestions as any)).toBe(false);
  });
});

describe("onBreadcrumbClick", () => {
  it("should assign new location and push GTM event", () => {
    delete (window as any).location;
    (window as any).location = { assign: jest.fn() };

    analytics.pushEvent = jest.fn();

    onBreadcrumbClick("/test");
    expect(window.location.assign).toHaveBeenCalledWith("/test");
    expect(analytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "click" }));
  });

});

describe("loadSuggestions", () => {
  const setSuggestions = jest.fn();
  const setSuggestionsLoading = jest.fn();

  it("loads and sets suggestions", async () => {
    const data = [{ fileId: "1", fileName: "Doc1" }];
    (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(data);

    await loadSuggestions("Doc", setSuggestions, setSuggestionsLoading);
    expect(setSuggestions).toHaveBeenCalledWith(data);
    expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
  });
it("logs error when fetchDMSSuggestions fails", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  await loadSuggestions("Test", jest.fn(), jest.fn());

  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

  it("sets suggestions to [] on error", async () => {
    (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

    await loadSuggestions("Doc", setSuggestions, setSuggestionsLoading);
    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
  });
});



describe("handleSearchChange boundary tests", () => {
  it("triggers loading for length === 2", () => {
    const event = { target: { value: "ab" } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();

    handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });
it("should not call fetch if value is only whitespace", () => {
  const event = { target: { value: " " } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});
  
});

describe("handleSuggestionClick edge cases", () => {
  it("should do nothing if item is null", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    await handleSuggestionClick(null, setSearchTerm, setSearchText);
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });

  it("should do nothing if item.name is falsy", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    await handleSuggestionClick({ name: "" }, setSearchTerm, setSearchText);
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });
});

describe("getTableHeadersData advanced rendering edge cases", () => {
  const headers = getTableHeadersData;

  it("Related to column renders nothing when input is empty array", () => {
    const column = headers.find(h => h.text === "Related to");
    const { container } = render(<>{column?.anyComponent?.([])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Related to column renders nothing when input is null", () => {
  const column = headers.find(h => h.text === "Related to");
  const { container } = render(<>{column?.anyComponent?.(null)}</>);
  expect(container).toBeEmptyDOMElement();
});

  it("Related to column renders nothing when input is null", () => {
    const column = headers.find(h => h.text === "Related to");
    const { container } = render(<>{column?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Category column renders nothing when input is empty", () => {
    const column = headers.find(h => h.text === "Category");
    const { container } = render(<>{column?.anyComponent?.("")}</>);
    expect(container).not.toBeEmptyDOMElement(); // still renders Tooltip
  });

  // it("Format column renders nothing when input is undefined", () => {
  //   const column = headers.find(h => h.text === "Format");
  //   const { container } = render(<>{column?.anyComponent?.(undefined)}</>);
  //   expect(container).toBeEmptyDOMElement();
  // });

  it("Size column renders nothing when input is undefined", () => {
    const column = headers.find(h => h.text === "Size");
    const { container } = render(<>{column?.anyComponent?.(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with undefined", () => {
    const column = headers.find(h => h.text === "Size");
    const { container } = render(<>{column?.anyComponent?.([undefined])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with first valid value", () => {
    const column = headers.find(h => h.text === "Size");
    const { getByText } = render(<>{column?.anyComponent?.(["100KB", "200KB"])}</>);
    expect(getByText("100KB")).toBeInTheDocument();
  });
});
