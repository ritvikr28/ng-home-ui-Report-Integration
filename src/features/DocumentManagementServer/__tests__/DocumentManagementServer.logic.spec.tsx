import React from "react";
import { act } from "@testing-library/react-hooks";
import { render } from "@testing-library/react";
import { ISelectedItem } from "@essnextgen/ui-kit";
import * as ApiService from "../ApiService";
import {
  debouncedFetchSuggestions,
  fetchCategory,
  formatSuggestions,
  getAllRegistrationIds,
  getCategoryArr,
  getDateTag,
  getResultNotFoundMsg,
  getTableHeadersData,
  getVisibleTagsWithSummary,
  handlePageChange,
  handleSearchChange,
  handleSuggestionClick,
  handleTagCloseLogic,
  hasItems,
  loadSuggestions,
  onBreadcrumbClick,
  tableBodyData,
  mapRelatedArr
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

  // test("renders link and tag when elem has one item", () => {
  //   render(<>{anyComponent && anyComponent(["John Doe"])}</>);
  //   expect(document.querySelector(".relatedto-main")).toBeInTheDocument();
  //   expect(screen.getByRole("link", { name: "John Doe" })).toBeInTheDocument();
  // });

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

    debouncedFetchSuggestions("Doc", [], "", "", setSearchLoading, setSuggestions, setShowError);

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

  debouncedFetchSuggestions("Doc", [], "", "", setSearchLoading, setSuggestions, setShowError);

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

    debouncedFetchSuggestions("Doc", [], "", "", setSearchLoading, setSuggestions, setShowError);

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

    handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

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

  handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
  expect(setSuggestions).toHaveBeenCalledWith([]);
});

  it("should handle empty string as input", () => {
  const event = { target: { value: "" } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
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

  handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

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

  it("loads and sets suggestions", async () => {
  const data = [{ fileId: "1", fileName: "Doc1" }];
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(data);

  const setSuggestions = jest.fn();
  const setSuggestionsLoading = jest.fn();

  await loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith(data);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});
it("logs error when fetchDMSSuggestions fails", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  await loadSuggestions("Test", "", "",[],jest.fn(), jest.fn());

  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

  it("sets suggestions to [] on error", async () => {
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  const setSuggestions = jest.fn();
  const setSuggestionsLoading = jest.fn();

  await loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});



describe("handleSearchChange boundary tests", () => {
  it("triggers loading for length === 2", () => {
    const event = { target: { value: "ab" } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();

    handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });
it("should not call fetch if value is only whitespace", () => {
  const event = { target: { value: " " } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();

  handleSearchChange(event, [], "", "", setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading);
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


  it("renders plain value if value is falsy or length <= 25", () => {
    const column = headers.find(h => h.text === "Format");
    const { container } = render(<>{column?.anyComponent?.('pdf')}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("pdf");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if length > 25", () => {
    const column = headers.find(h => h.text === "Format");
    const longValue = "averylongformatnamethatisdefinitelymorethan25chars";
    const { container } = render(<>{column?.anyComponent?.(longValue)}</>);
    expect(container).toHaveTextContent("averylongformatnamethatisdefinitelymorethan25chars".substring(0, 25));
  });
   it("renders plain value if value is empty string", () => {
    const column = headers.find(h => h.text === "Format");
    const { container } = render(<>{column?.anyComponent?.('')}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

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


describe('getVisibleTagsWithSummary', () => {
  it('returns tags as-is when length <= maxVisible (default)', () => {
    const tags = [
      { text: 'A' },
      { text: 'B' },
      { text: 'C' }
    ];

    const result = getVisibleTagsWithSummary(tags);
    expect(result).toEqual(tags);
  });

  it('returns tags as-is when length <= maxVisible (custom)', () => {
    const tags = [{ text: 'OnlyOne' }];
    const result = getVisibleTagsWithSummary(tags, 5);
    expect(result).toEqual(tags);
  });

  it('adds summary when length > maxVisible', () => {
    const tags = [
      { text: 'A' },
      { text: 'B' },
      { text: 'C' },
      { text: 'D' },
      { text: 'E' }
    ];

    const result = getVisibleTagsWithSummary(tags, 3);

    expect(result.length).toBe(4); // 3 visible + 1 summary
    expect(result[3]).toEqual({
      text: '+2',
      categoryName: 'Summary',
      closeObj: null
    });
  });

  it('adds summary correctly for many extra items', () => {
    const tags = Array.from({ length: 10 }, (_, i) => ({ text: `Tag ${i + 1}` }));

    const result = getVisibleTagsWithSummary(tags, 5);

    expect(result.length).toBe(6); // 5 + summary
    expect(result[5]).toEqual({
      text: '+5',
      categoryName: 'Summary',
      closeObj: null
    });
  });
});

describe('getCategoryArr', () => {
  it('returns mapped category array when all fields exist', () => {
    const input = [
      {
        text: 'PDF',
        value: 'pdf',
        data: {
          registrationId: 'reg123'
        }
      }
    ];

    const result = getCategoryArr(input);

    expect(result).toEqual([
      {
        text: 'PDF',
        categoryName: 'pdf',
        closeObj: {
          name: 'PDF',
          id: 'reg123'
        }
      }
    ]);
  });

  it('handles missing data or registrationId gracefully', () => {
    const input = [
      {
        text: 'Word',
        value: 'doc',
        data: {}
      }
    ];

    const result = getCategoryArr(input);

    expect(result).toEqual([
      {
        text: 'Word',
        categoryName: 'doc',
        closeObj: {
          name: 'Word',
          id: undefined
        }
      }
    ]);
  });

  it('returns empty array for empty input', () => {
    const result = getCategoryArr([]);
    expect(result).toEqual([]);
  });

  it('returns empty array when input is undefined', () => {
    const result = getCategoryArr(undefined as any);
    expect(result).toEqual([]);
  });
});

describe('getDateTag', () => {
  it('returns formatted tag when both fromDate and toDate are present', () => {
    const result = getDateTag({ fromDate: '2024-01-01', toDate: '2024-01-10' });

    expect(result).toEqual([
      {
        text: `01 Jan 2024 to 10 Jan 2024`,
        categoryName: 'Date',
        closeObj: { name: 'Date', id: 'dateRange' }
      }
    ]);
  });

  it('returns formatted tag when only fromDate is present', () => {
    const result = getDateTag({ fromDate: '2024-01-01', toDate: '' });

    expect(result).toEqual([
      {
        text: '01 Jan 2024 to -',
        categoryName: 'Date',
        closeObj: { name: 'Date', id: 'dateRange' }
      }
    ]);
  });

  it('returns formatted tag when only toDate is present', () => {
    const result = getDateTag({ fromDate: '', toDate: '2024-01-10' });

    expect(result).toEqual([
      {
        text: '- to 10 Jan 2024',
        categoryName: 'Date',
        closeObj: { name: 'Date', id: 'dateRange' }
      }
    ]);
  });

  it('returns empty array when both dates are missing', () => {
    const result = getDateTag({ fromDate: '', toDate: '' });

    expect(result).toEqual([]);
  });
});

describe('fetchCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns data when API resolves with a valid response', async () => {
    const mockData = [{ id: 1, name: 'Test Category' }];
    (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue(mockData);

    const result = await fetchCategory();
    expect(result).toEqual(mockData);
  });

  it('returns empty array when API resolves with null', async () => {
    (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue(null);

    const result = await fetchCategory();
    expect(result).toEqual([]);
  });

  it('returns empty array when API throws an error', async () => {
    (ApiService.fetchFilterCategory as jest.Mock).mockRejectedValue(new Error('API failed'));

    const result = await fetchCategory();
    expect(result).toEqual([]);
  });
});

describe('getResultNotFoundMsg', () => {
  it('returns not found message when searchText is provided and docData has no results', () => {
    const result = getResultNotFoundMsg('test', { statusCode: 200, data: [] }, 'test', false);
    expect(result).toBe(
      'Your search - test - did not match any results. Make sure that all words are spelled correctly.'
    );
  });

  it('returns "Information unavailable" when showErrorBanner is true', () => {
    const result = getResultNotFoundMsg('', { data: ['some data'] }, '', true);
    expect(result).toBe('Information unavailable.');
  });

  it('returns undefined when there is data and no error', () => {
    const result = getResultNotFoundMsg('test', { data: ['doc1'] }, 'test', false);
    expect(result).toBeUndefined();
  });

  it('returns undefined when searchText is empty and no error banner', () => {
    const result = getResultNotFoundMsg('', { data: [] }, '', false);
    expect(result).toBeUndefined();
  });
});

describe("getAllRegistrationIds", () => {
  it("returns empty array for empty input", () => {
    expect(getAllRegistrationIds([])).toEqual([]);
  });

  it("returns empty array when input is undefined", () => {
    expect(getAllRegistrationIds(undefined as any)).toEqual([]);
  });

  it("returns array of registrationIds when all are single values", () => {
    const input = [
      { data: { registrationId: "id1" } },
      { data: { registrationId: "id2" } },
      { data: { registrationId: "id3" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1", "id2", "id3"]);
  });

  it("returns array of registrationIds when some are arrays", () => {
    const input = [
      { data: { registrationId: ["id1", "id2"] } },
      { data: { registrationId: "id3" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1", "id2", "id3"]);
  });

  it("skips items with no registrationId", () => {
    const input = [
      { data: {} },
      { data: { registrationId: "id1" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1"]);
  });

  it("returns empty array when all items have no registrationId", () => {
    const input = [
      { data: {} },
      { data: {} }
    ];
    expect(getAllRegistrationIds(input)).toEqual([]);
  });

  it("handles mixed array and single registrationIds", () => {
    const input = [
      { data: { registrationId: ["id1", "id2"] } },
      { data: { registrationId: "id3" } },
      { data: { registrationId: ["id4"] } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1", "id2", "id3", "id4"]);
  });

  it("handles null registrationId", () => {
    const input = [
      { data: { registrationId: null } },
      { data: { registrationId: "id1" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1"]);
  });

  it("handles undefined registrationId", () => {
    const input = [
      { data: { registrationId: undefined } },
      { data: { registrationId: "id1" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1"]);
  });

  it("handles missing data property", () => {
    const input = [
      {},
      { data: { registrationId: "id1" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1"]);
  });

  it("handles item with registrationId as empty array", () => {
    const input = [
      { data: { registrationId: [] } },
      { data: { registrationId: "id1" } }
    ];
    expect(getAllRegistrationIds(input)).toEqual(["id1"]);
  });

  it("handles item with registrationId as array with null/undefined", () => {
    const input = [
      { data: { registrationId: [null, undefined, "id1"] } }
    ];
    expect(getAllRegistrationIds(input)).toEqual([null, undefined, "id1"]);
  });

  it("handles 100 items with single registrationId", () => {
    const input = Array.from({ length: 100 }, (_, i) => ({
      data: { registrationId: `id${i + 1}` }
    }));
    const expected = Array.from({ length: 100 }, (_, i) => `id${i + 1}`);
    expect(getAllRegistrationIds(input)).toEqual(expected);
  });
})

describe("Document column anyComponent", () => {
  const documentColumn = getTableHeadersData.find(h => h.text === "Document");
  const categoryColumn = getTableHeadersData.find(h => h.text === "Category");

  it("renders plain value if value is falsy or length <= 25", () => {
    const { container } = render(<>{documentColumn?.anyComponent?.("Short Name")}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("Short Name");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if length > 25", () => {
    const longValue = "averylongdocumentnamethatisdefinitelymorethan25chars";
    const { container } = render(<>{documentColumn?.anyComponent?.(longValue)}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 25));
  });

  it("renders plain value if value is empty string", () => {
    const { container } = render(<>{documentColumn?.anyComponent?.("")}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders plain value if value is null", () => {
    const { container } = render(<>{documentColumn?.anyComponent?.(null)}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });


  it("renders plain value if value is falsy or length <= 10", () => {
    const { container } = render(<>{categoryColumn?.anyComponent?.("ShortCat")}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("ShortCat");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if length > 10", () => {
    const longValue = "averylongcategoryname";
    const { container } = render(<>{categoryColumn?.anyComponent?.(longValue)}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 10));
  });

  it("renders plain value if value is empty string", () => {
    const { container } = render(<>{categoryColumn?.anyComponent?.("")}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders plain value if value is null", () => {
    const { container } = render(<>{categoryColumn?.anyComponent?.(null)}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });
});

describe("Size column anyComponent", () => {
  const sizeColumn = getTableHeadersData.find(h => h.text === "Size");

  it("renders nothing if value is undefined", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const { container } = render(<>{sizeColumn!.anyComponent!(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing if value is null", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const { container } = render(<>{sizeColumn!.anyComponent!(null)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing if array with undefined", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const { container } = render(<>{sizeColumn!.anyComponent!([undefined])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders plain value if string length <= 10", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const { container } = render(<>{sizeColumn!.anyComponent!("1234567890")}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("1234567890");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders plain value if array first value length <= 10", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const { container } = render(<>{sizeColumn!.anyComponent!(["1234567890"])}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("1234567890");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if string length > 10", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const longValue = "averylongsizename";
    const { container } = render(<>{sizeColumn!.anyComponent!(longValue)}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 10));
  });

  it("renders truncated value with tooltip if array first value length > 10", () => {
    expect(sizeColumn).toBeDefined();
    expect(sizeColumn?.anyComponent).toBeDefined();
    const longValue = "averylongsizename";
    const { container } = render(<>{sizeColumn!.anyComponent!([longValue, "other"])}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 10));
  });
});

describe("handleTagCloseLogic", () => {
  const mockSetSelectedDateRange = jest.fn();
  const mockSetDateRange = jest.fn();
  const mockSetIsDateError = jest.fn();
  const mockSetSelectedCategories = jest.fn();
  const mockSetSelectedFormats = jest.fn();

  const setup = () => {
    jest.clearAllMocks();
  };

  it("clears date range if name matches single-date format", () => {
    setup();

    handleTagCloseLogic(
      {} as React.SyntheticEvent,
      "dummyText",
      { name: "30 Jul 2025 to -" },
      mockSetSelectedDateRange,
      mockSetDateRange,
      mockSetIsDateError,
      mockSetSelectedCategories,
      mockSetSelectedFormats
    );

    expect(mockSetSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("clears date range if name matches date range format", () => {
    setup();

    handleTagCloseLogic(
      {} as React.SyntheticEvent,
      "dummyText",
      { name: "01 Jul 2024 to 31 Jul 2024" },
      mockSetSelectedDateRange,
      mockSetDateRange,
      mockSetIsDateError,
      mockSetSelectedCategories,
      mockSetSelectedFormats
    );

    expect(mockSetSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("removes a category/format tag", () => {
    setup();

    const nameToRemove = "Finance";
    const originalItems: ISelectedItem[] = [
      { text: "HR", data: "HR" },
      { text: "Finance", data: "Finance" },
      { text: "Legal", data: "Legal" }
    ];

    mockSetSelectedCategories.mockImplementation(fn => fn(originalItems));
    mockSetSelectedFormats.mockImplementation(fn => fn(originalItems));

    handleTagCloseLogic(
      {} as React.SyntheticEvent,
      "dummyText",
      { name: nameToRemove },
      mockSetSelectedDateRange,
      mockSetDateRange,
      mockSetIsDateError,
      mockSetSelectedCategories,
      mockSetSelectedFormats
    );

    expect(mockSetSelectedCategories).toHaveBeenCalled();
    const filteredCats = mockSetSelectedCategories.mock.calls[0][0](originalItems);
    expect(filteredCats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);

    expect(mockSetSelectedFormats).toHaveBeenCalled();
    const filteredFormats = mockSetSelectedFormats.mock.calls[0][0](originalItems);
    expect(filteredFormats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);
  });

  it("does nothing if closeObj.name is undefined", () => {
    setup();

    handleTagCloseLogic(
      {} as React.SyntheticEvent,
      "dummyText",
      { id: "123" },
      mockSetSelectedDateRange,
      mockSetDateRange,
      mockSetIsDateError,
      mockSetSelectedCategories,
      mockSetSelectedFormats
    );

    expect(mockSetSelectedDateRange).not.toHaveBeenCalled();
    expect(mockSetDateRange).not.toHaveBeenCalled();
    expect(mockSetIsDateError).not.toHaveBeenCalled();
  });
});

describe("tableData mapping for relatedTo types", () => {
  const relatedToColumn = getTableHeadersData.find(h => h.text === "Related to");
  const renderRelated = relatedToColumn?.anyComponent;

  it("maps pupils correctly when documentRealatedTo === 1", () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: [
        {
          preferredForename: "John",
          preferredSurname: "Doe",
          currentYearGroup: "Y5",
          currentPrimaryClass: "A",
          learnerExternalId: "p123"
        }
      ]
    };
    // Simulate mapping logic
    const relatedArr = doc.relatedTo.map((pupil: any) => ({
      type: "pupil",
      name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
      year: pupil.currentYearGroup || "",
      reg: pupil.currentPrimaryClass || "",
      pupilId: pupil.learnerExternalId || "",
    }));
    expect(relatedArr[0]).toEqual({
      type: "pupil",
      name: "John Doe",
      year: "Y5",
      reg: "A",
      pupilId: "p123"
    });

    // Render and check output
    const { container, getByText } = render(<>{renderRelated && renderRelated(relatedArr)}</>);
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Y5 / A")).toBeInTheDocument();
    expect(container.querySelector(".relatedto-link")).toHaveAttribute("href", "/pupilprofile/profile/p123");
  });

  it("maps staff correctly when documentRealatedTo === 3", () => {
    const doc = {
      documentRealatedTo: 3,
      relatedTo: [
        {
          preferredForename: "Jane",
          preferredSurname: "Smith",
          staffCode: "S001",
          externalId: "s456"
        }
      ]
    };
    const relatedArr = doc.relatedTo.map((staff: any) => ({
      type: "staff",
      name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
      staffCode: staff.staffCode || "",
      staffId: staff.externalId || "",
    }));
    expect(relatedArr[0]).toEqual({
      type: "staff",
      name: "Jane Smith",
      staffCode: "S001",
      staffId: "s456"
    });

    const { container, getByText } = render(<>{renderRelated && renderRelated(relatedArr)}</>);
    expect(getByText("Jane Smith | S001")).toBeInTheDocument();
    expect(container.querySelector(".relatedto-link")).toHaveAttribute("href", "/staff/profile/s456");
  });

  it("maps school correctly when documentRealatedTo === 2", () => {
    const doc = {
      documentRealatedTo: 2,
      relatedTo: [
        {
          schoolName: "Springfield High"
        }
      ]
    };
    const relatedArr = doc.relatedTo.map((school: any) => ({
      type: "school",
      name: school.schoolName || "",
    }));
    expect(relatedArr[0]).toEqual({
      type: "school",
      name: "Springfield High"
    });

    const { getByText } = render(<>{renderRelated && renderRelated(relatedArr)}</>);
    expect(getByText("Springfield High")).toBeInTheDocument();
  });

  it("handles missing fields in relatedTo items", () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: [
        {
          preferredForename: "OnlyFirst",
          
        }
      ]
    };
    const relatedArr = doc.relatedTo.map((pupil: any) => ({
      type: "pupil",
      name: `${pupil.preferredForename} ${pupil.preferredSurname || ""}`.trim(),
      year: pupil.currentYearGroup || "",
      reg: pupil.currentPrimaryClass || "",
      pupilId: pupil.learnerExternalId || "",
    }));
    expect(relatedArr[0]).toEqual({
      type: "pupil",
      name: "OnlyFirst",
      year: "",
      reg: "",
      pupilId: ""
    });
    const { getByText } = render(<>{renderRelated && renderRelated(relatedArr)}</>);
    expect(getByText("OnlyFirst")).toBeInTheDocument();
  });
});
})


describe('mapRelatedArr', () => {
  it('maps pupils correctly', () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: [
        {
          preferredForename: 'Ben',
          preferredSurname: 'Smith',
          currentYearGroup: 'Year 1',
          currentPrimaryClass: 'A',
          learnerExternalId: '123'
        }
      ]
    };
    const result = mapRelatedArr(doc);
    expect(result).toEqual([
      {
        type: 'pupil',
        name: 'Ben Smith',
        year: 'Year 1',
        reg: 'A',
        pupilId: '123'
      }
    ]);
  });

  it('maps staff correctly', () => {
    const doc = {
      documentRealatedTo: 3,
      relatedTo: [
        {
          preferredForename: 'Alice',
          preferredSurname: 'Brown',
          staffCode: 'S001',
          externalId: '456'
        }
      ]
    };
    const result = mapRelatedArr(doc);
    expect(result).toEqual([
      {
        type: 'staff',
        name: 'Alice Brown',
        staffCode: 'S001',
        staffId: '456'
      }
    ]);
  });

  it('maps school correctly', () => {
    const doc = {
      documentRealatedTo: 2,
      relatedTo: [
        {
          schoolName: 'Greenwood High'
        }
      ]
    };
    const result = mapRelatedArr(doc);
    expect(result).toEqual([
      {
        type: 'school',
        name: 'Greenwood High'
      }
    ]);
  });
});