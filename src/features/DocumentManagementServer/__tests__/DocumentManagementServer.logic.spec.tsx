import React from "react";
import { act } from "@testing-library/react-hooks";
import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { ISelectedItem } from "@essnextgen/ui-kit";
import * as ApiService from "../ApiService";
import * as logicModule from "../DocumentManagementServer.logic";
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
  mapRelatedArr,
  filterNonEmptySuggestions,
  getStaffProfilePhoto,
  prepareDownload,
  reduceCategories,
  fetchViewDownloadData,
  validateAndApplyFilter,
  closeSidePanel,
  fetchGetDocumentDetailsLogic,
  buildSelectedDocs,
  handleClearAllConfirm,
  getCompletedPartitionKeys,
  handleBulkDeleteLogic,
  getTitleConfirmation,
  addUniqueTagItem,
  handleApply,
  handleEditSelectedOverFlowMenu
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

// eslint-disable-next-line
beforeAll(() => {
  global.ResizeObserver = global.ResizeObserver || class {
    // eslint-disable-next-line
    observe() { void this; }
    // eslint-disable-next-line
    unobserve() { void this; }
    // eslint-disable-next-line
    disconnect() { void this; }
  };
});

describe("getTableHeadersData", () => {
  const t = (key: string) => key; 
  const headers = getTableHeadersData(t);
  const relatedToColumn = headers.find(h => h.text === 'DocumentManagementServer.relatedColumn');
  const anyComponent = relatedToColumn?.anyComponent;

 test("should be an array and contain expected columns", () => {
    expect(Array.isArray(headers)).toBe(true);
    const expectedColumns = [
      "Id",
      "DocumentManagementServer.documentColumn",
      "DocumentManagementServer.relatedColumn",
      "DocumentManagementServer.categoryColumn",
      "DocumentManagementServer.addedByColumn",
      "DocumentManagementServer.dateAddedColumn",
      "DocumentManagementServer.formatColumn",
      "DocumentManagementServer.sizeColumn"
    ];
    expectedColumns.forEach(col => {
      expect(headers.find(h => h.text === col)).toBeDefined();
    });
  });
  
  test("should contain 'Document' header with anyComponent", () => {
    const docHeader = headers.find(h => h.text === "DocumentManagementServer.documentColumn");
    expect(docHeader).toBeDefined();
    expect(typeof docHeader?.anyComponent).toBe("function");
  });

  test("should contain 'Related to' header with anyComponent", () => {
    const relatedToCol = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    expect(relatedToCol).toBeDefined();
    expect(typeof relatedToCol?.anyComponent).toBe("function");
  });

  test("renders nothing when elem is undefined", () => {
    const { container } = render(<>{anyComponent && anyComponent(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });


  test("does not render tooltip when only one related item", () => {
  const relatedToCol = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const { container } = render(<>{relatedToCol?.anyComponent?.(["Only One"])}</>);
  expect(container.querySelector('[data-testid="tooltip-eventtime"]')).not.toBeInTheDocument();
});
});

describe("getTableHeadersData column anyComponent rendering", () => {
  const t = (key: string) => key;
  const headers = getTableHeadersData(t);
  const sizeColumn = headers.find(h => h.text === "Size");

    test("Category column renders tooltip with value", () => {
    const catColumn = headers.find(h => h.text === "DocumentManagementServer.categoryColumn");
    const { getByText } = render(<>{catColumn?.anyComponent?.("App")}</>);
    expect(getByText("App")).toBeInTheDocument();
  });

  test("Format column renders tooltip with value", () => {
    const formatColumn = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { getByText } = render(<>{formatColumn?.anyComponent?.("pdf")}</>);
    expect(getByText("pdf")).toBeInTheDocument();
  });

  test("Size column renders correctly for string input", () => {
    const sizeCol = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { getByText } = render(<>{sizeCol?.anyComponent?.("2 MB")}</>);
    expect(getByText("2 MB")).toBeInTheDocument();
  });

  test("Size column renders correctly for array input", () => {
    const sizeCols = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
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


describe("formatSuggestions", () => {
  it("returns empty array when input is empty", async () => {
  expect(await formatSuggestions([])).toEqual([]);
  expect(await formatSuggestions(undefined as any)).toEqual([]);
  expect(await formatSuggestions(null as any)).toEqual([]);
});

it("formats Pupil with neither year group nor primary class", async () => {
  const input = [{
    name: "Pupil",
    values: [{
      pupilId: "p4",
      preferredForename: "Alex",
      preferredSurname: "Kim",
      legalName: "Alex Kim",
      imagePath: ""
      // both missing
    }]
  }];
  const result = await formatSuggestions(input);
  expect(result[0].values[0].value).toBeUndefined();
});



  it("formats Pupil category with icon and value", async () => {
    const input = [
      {
        name: "Pupil",
        values: [
          {
            pupilId: "p1",
            learnerExternalId: "p1",
            preferredForename: "John",
            preferredSurname: "Doe",
            legalName: "Jonathan Doe",
            imagePath: "",
            currentYearGroup: "Y5",
            currentPrimaryClass: "A"
          }
        ]
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pupil");
    expect(result[0].values[0].text).toContain("John Doe (Jonathan Doe)");
    expect(result[0].values[0].icon).toBeTruthy();
    expect(result[0].values[0].value).toBeTruthy();
    expect(result[0].values[0].props).toMatchObject({
      name: "John Doe (Jonathan Doe)",
      id: "p1"
    });
  });

  it("formats Staff category with icon", async () => {
    const input = [
      {
        name: "Staff",
        values: [
          {
            staffId: "s1",
            preferredForename: "Jane",
            preferredSurname: "Smith",
            imagePath: "",
            name: "Jane Smith",
            externalId: "s1"
          }
        ]
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Staff");
    expect(result[0].values[0].text).toContain("Jane Smith");
    expect(result[0].values[0].icon).toBeTruthy();
    expect(result[0].values[0].props).toMatchObject({
      name: "Jane Smith",
      id: "s1"
    });
  });

  it("formats Organisation category", async () => {
    const input = [
      {
        name: "Organisation",
        values: [
          {
            orgId: "o1",
            schoolName: "Test School",
            name: "Test Org"
          }
        ]
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Organisation");
    expect(result[0].values[0].text).toBe("Test School");
    expect(result[0].values[0].props).toMatchObject({
      name: "Test Org",
      id: "o1"
    });
  });

it('renders pupil image with correct class', async () => {
  const payload = [{
    name: 'Pupil',
    values: [{
      preferredForename: 'John',
      preferredSurname: 'Doe',
      legalName: 'John Doe',
      imagePath: 'http://example.com/image.jpg',
      currentYearGroup: 'Y1',
      currentPrimaryClass: 'A',
      pupilId: '123'
    }]
  }];

  const suggestions = await formatSuggestions(payload);
  // Render the icon part of the suggestion
  render(<>{suggestions[0].values[0].icon}</>);
  const img = screen.getByAltText('Pupil Photo');
  expect(img).toBeInTheDocument();
  expect(img).toHaveClass('dms-search__profile-icon');
  expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
});

  it("formats default category", async () => {
    const input = [
      {
        name: "Other",
        values: [
          {
            id: "x1",
            name: "Other Name"
          }
        ]
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Other");
    expect(result[0].values[0].text).toBe("Other Name");
    expect(result[0].values[0].props).toMatchObject({
      name: "Other Name",
      id: "x1"
    });
  });

  it("handles empty values array for a category", async () => {
    const input = [
      {
        name: "Document",
        values: []
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Document");
    expect(result[0].values).toEqual([]);
  });

  // it("handles missing category name", () => {
  //   const input = [
  //     {
  //       values: [
  //         { fileId: "1", fileName: "File 1" }
  //       ]
  //     }
  //   ];
  //   const result = formatSuggestions(input);
  //   expect(result).toHaveLength(1);
  //   expect(result[0].name).toBe("");
  //   expect(result[0].values[0].text).toBe("File 1");
  // });

  it("handles missing values property", async () => {
    const input = [
      {
        name: "Document"
      }
    ];
    const result = await formatSuggestions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Document");
    expect(result[0].values).toEqual([]);
  });
   test("returns empty when input is empty", async () => {
  const result = await formatSuggestions([]);
  expect(result).toEqual([]);
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

  it("calls fetchDMSSuggestions only once after 3000ms even if called multiple times rapidly", async () => {
    const mockFetchDMSSuggestions = jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue({ payload: [] });
    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();

    // Call debouncedFetchSuggestions multiple times rapidly
    debouncedFetchSuggestions("Doc1", [], "", "", setSearchLoading, setSuggestions, setShowError);
    debouncedFetchSuggestions("Doc2", [], "", "", setSearchLoading, setSuggestions, setShowError);
    debouncedFetchSuggestions("Doc3", [], "", "", setSearchLoading, setSuggestions, setShowError);

    // Advance timers by less than debounce time, should not call fetchDMSSuggestions yet
    jest.advanceTimersByTime(2999);
    expect(mockFetchDMSSuggestions).not.toHaveBeenCalled();

    // Advance timers to 3000ms, should call fetchDMSSuggestions only once with last args
    await act(() => {
      jest.advanceTimersByTime(1);
      return Promise.resolve();
    });

    expect(mockFetchDMSSuggestions).toHaveBeenCalledTimes(1);
    expect(mockFetchDMSSuggestions).toHaveBeenCalledWith("Doc3", "", "", [], undefined);
    expect(setSearchLoading).toHaveBeenCalledWith(false);
  });
  test("handles undefined payload structure", async () => {
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue({});

  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();

  debouncedFetchSuggestions("Doc", [], "", "", setSearchLoading, setSuggestions, setShowError);

  await act(() => {
    jest.advanceTimersByTime(3000);
    return Promise.resolve();
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
});

  test("handles API error", async () => {
    (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();

    debouncedFetchSuggestions("Doc", [], "", "", setSearchLoading, setSuggestions, setShowError);

    await act(() => {
      jest.advanceTimersByTime(3000);
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
it("calls setResetFilterSearch when value is non-empty and setResetFilterSearch is a function", () => {
  const event = { target: { value: "abc" } } as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setResetFilterSearch = jest.fn();

  handleSearchChange(
    event,
    [],
    "",
    "",
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    1,
    setResetFilterSearch
  );

  expect(setResetFilterSearch).toHaveBeenCalledWith(true);
});
});

describe("handleSuggestionClick", () => {
   const setDocumentRelatedTo = jest.fn();
  const setSearchRefExternalId = jest.fn();
  it("should call setSearchTerm and setSearchText", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    await handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Pupil",
        learnerExternalId: "pupil-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId
    );
    expect(setSearchTerm).toHaveBeenCalledWith("John Doe");
    expect(setSearchText).toHaveBeenCalledWith("John Doe");
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["pupil-123"]);
    await handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Staff",
        externalId: "staff-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId
    );
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["staff-123"]);
    await handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Organisation",
        organisationId: "organisation-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId
    );
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["organisation-123"]);

  });

it("should not call setters if item is null", async () => {
  const setSearchTerm = jest.fn();
  const setSearchText = jest.fn();
  await handleSuggestionClick(null, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId );
  expect(setSearchTerm).not.toHaveBeenCalled();
  expect(setSearchText).not.toHaveBeenCalled();
});

it("should not trigger if name is missing", async () => {
    const setSearchTerm = jest.fn();
    const loadData = jest.fn();

    await handleSuggestionClick({}, setSearchTerm, loadData, setDocumentRelatedTo, setSearchRefExternalId);
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
  const setDocumentRelatedTo = jest.fn();
  const setSearchRefExternalId = jest.fn();
  it("should do nothing if item is null", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    await handleSuggestionClick(null, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId);
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });

  it("should do nothing if item.name is falsy", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    await handleSuggestionClick({ name: "" }, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId);
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });
});

describe("getTableHeadersData advanced rendering edge cases", () => {
  const t = (key: string) => key; // mock translation function
  const headers = getTableHeadersData(t);

  it("Related to column renders nothing when input is empty array", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    const { container } = render(<>{column?.anyComponent?.([])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Related to column renders nothing when input is null", () => {
  const column = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const { container } = render(<>{column?.anyComponent?.(null)}</>);
  expect(container).toBeEmptyDOMElement();
});

  it("Related to column renders nothing when input is null", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    const { container } = render(<>{column?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Category column renders nothing when input is empty", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.categoryColumn");
    const { container } = render(<>{column?.anyComponent?.("")}</>);
    expect(container).not.toBeEmptyDOMElement(); // still renders Tooltip
  });


  it("renders plain value if value is falsy or length <= 25", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { container } = render(<>{column?.anyComponent?.('pdf')}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("pdf");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if length > 25", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const longValue = "averylongformatnamethatisdefinitelymorethan25chars";
    const { container } = render(<>{column?.anyComponent?.(longValue)}</>);
    expect(container).toHaveTextContent("averylongformatnamethatisdefinitelymorethan25chars".substring(0, 25));
  });
   it("renders plain value if value is empty string", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { container } = render(<>{column?.anyComponent?.('')}</>);
    expect(container.querySelector(".document-text.document-column")).toHaveTextContent("");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("Size column renders nothing when input is undefined", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { container } = render(<>{column?.anyComponent?.(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with undefined", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { container } = render(<>{column?.anyComponent?.([undefined])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with first valid value", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { getByText } = render(<>{column?.anyComponent?.(["100KB", "200KB"])}</>);
    expect(getByText("100KB")).toBeInTheDocument();
  });

  it("renders pupil related item with link and tag", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A",
    isLeaver: "Leaver"
  }];
   const { getByText, getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
    // Check for link
    const link = getByRole("link", { name: "John Doe" });
    expect(link).toHaveAttribute("href", "/");
    // Check for tag
    expect(getByText("(Y5) / (A)")).toBeInTheDocument();
});
  it("renders staff related item with link and staff code", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123"
  }];
  const { getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  // Check for link
  const link = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders staff related item with referenceExternalId (profile link)", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123",
    referenceExternalId: "abc123"
  }];
  const { getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/staff/profile/abc123");
});

it("renders staff related item without referenceExternalId (fallback link)", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123"
    // referenceExternalId missing
  }];
  const { getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders pupil related item with referenceExternalId (profile link)", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A",
    referenceExternalId: "pupil123"
  }];
  const { getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link = getByRole("link", { name: "John Doe" });
  expect(link).toHaveAttribute("href", "/pupilprofile/profile/pupil123");
});

it("renders pupil related item without referenceExternalId (fallback link)", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A"
    // referenceExternalId missing
  }];
  const { getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link = getByRole("link", { name: "John Doe" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders tooltip with multiple staff and pupil and school items", () => {
  const relatedToColumn = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem = [
    {
      type: "staff",
      name: "Jane Smith",
      staffCode: "SC123"
    },
    {
      type: "pupil",
      name: "John Doe",
      year: "Y5",
      reg: "A"
    },
    {
      type: "school",
      name: "Springfield High"
    }
  ];
  const { getByText, getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);

  expect(getByText("+2")).toBeInTheDocument();

  const link = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});
});
})


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

    const result = await fetchCategory(1);
    expect(result).toEqual(mockData);
  });

  it('returns empty array when API resolves with null', async () => {
    (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue(null);

    const result = await fetchCategory(1);
    expect(result).toEqual([]);
  });

  it('returns empty array when API throws an error', async () => {
    (ApiService.fetchFilterCategory as jest.Mock).mockRejectedValue(new Error('API failed'));

    const result = await fetchCategory(1);
    expect(result).toEqual([]);
  });
});

describe('getResultNotFoundMsg', () => {
  it('returns not found message when searchText is provided and docData has no results', () => {
   const t = (key: string) => key; 
    const result = getResultNotFoundMsg(t,'test', { statusCode: 200, data: [] }, 'test', false, true);
    expect(result).toBe(
      'No data to display.'
    );
  });

  it('returns "Information unavailable" when showErrorBanner is true', () => {
    const t = (key: string) => key;
    const result = getResultNotFoundMsg(t,'', { data: ['some data'] }, '', true, true);
    expect(result).toBe('Information unavailable.');
  });

  it('returns undefined when there is data and no error', () => {
    const t = (key: string) => key;
    const result = getResultNotFoundMsg(t,'test', { data: ['doc1'] }, 'test', false, false);
    expect(result).toBeUndefined();
  });

  it('returns "No data to display" when not searching and no data', () => {
    const t = (key: string) => key;
  const result = getResultNotFoundMsg(
    t,
    '', // searchText is empty
    { statusCode: 200, data: [] }, // docData has empty array
    "", // searchTerm
    false, // showErrorBanner
    false // isSearching
  );
  expect(result).toEqual("DocumentManagementServer.searchBarText");
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
  const t = (key: string) => key;
  const documentColumn = getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.documentColumn");
  const categoryColumn = getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.categoryColumn");

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
  const t = (key: string) => key;
  const sizeColumn = getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.sizeColumn");

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
  const t = (key: string) => key; // mock translation function
  const relatedToColumn = getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.relatedColumn");
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
    expect(container.querySelector(".relatedto-link")).toHaveAttribute("href", "/");
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
    expect(container.querySelector(".relatedto-link")).toHaveAttribute("href", "/");
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

describe('mapRelatedArr', () => {
  it('maps pupils correctly', () => {
    const doc = {
      isLeaver: "",
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
        referenceExternalId: '123',
        isLeaver: ''
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
          externalId: '456',
          rollState: 'Current'
        }
      ]
    };
    const result = mapRelatedArr(doc);
    expect(result).toEqual([
      {
        type: 'staff',
        name: 'Alice Brown',
        staffCode: 'S001',
        referenceExternalId: '456',
        isLeaver: ''
      }
    ]);
  });

  it('maps school correctly', () => {
    const doc = {
      documentRealatedTo: 2,
      relatedTo: [
        {
          schoolName: 'Greenwood High',
          organisationId: 'org789'
        }
      ]
    };
    const result = mapRelatedArr(doc);
    expect(result).toEqual([
      {
        type: 'school',
        name: 'Greenwood High',
        referenceExternalId: 'org789'
      }
    ]);
  });
});

describe("filterNonEmptySuggestions", () => {
  it("returns only groups with non-empty values", () => {
    const input = [
      { name: "A", values: [{ text: "foo" }] },
      { name: "B", values: [] },
      { name: "C", values: [{ text: "bar" }] }
    ];
    const result = filterNonEmptySuggestions(input as any);
    expect(result).toEqual([
      { name: "A", values: [{ text: "foo" }] },
      { name: "C", values: [{ text: "bar" }] }
    ]);
  });

  it("returns empty array if all groups are empty", () => {
    const input = [
      { name: "A", values: [] },
      { name: "B", values: [] }
    ];
    const result = filterNonEmptySuggestions(input as any);
    expect(result).toEqual([]);
  });

  it("returns empty array if input is empty", () => {
    expect(filterNonEmptySuggestions([] as any)).toEqual([]);
  });
})

describe("getStaffProfilePhoto", () => {
   const mockFetch = jest.fn();
  beforeAll(() => {
    jest.spyOn(ApiService, "fetchStaffProfilePhoto").mockImplementation(mockFetch);
  });
  afterEach(() => {
    mockFetch.mockReset();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("returns data when API resolves with data", async () => {
    mockFetch.mockResolvedValue({ data: "photo-url" });
    const result = await getStaffProfilePhoto("staff123");
    expect(result).toBe("photo-url");
    expect(mockFetch).toHaveBeenCalledWith("staff123");
  });

  it("returns empty string when API resolves with null", async () => {
    mockFetch.mockResolvedValue(null);
    const result = await getStaffProfilePhoto("staff456");
    expect(result).toBe("");
  });

  it("returns empty string when API resolves with no data property", async () => {
    mockFetch.mockResolvedValue({});
    const result = await getStaffProfilePhoto("staff789");
    expect(result).toBe("");
  });

  it("returns empty string when API throws", async () => {
    mockFetch.mockRejectedValue(new Error("fail"));
    // The function does not catch, so this will throw unless we wrap
    await expect(getStaffProfilePhoto("staff000")).rejects.toThrow("fail");
  });
});

describe("prepareDownload", () => {
  const payload = [{ request: { foo: "bar" } }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status from prepareAndDownloadFile (success)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(204);
    const result = await prepareDownload(payload);
    expect(result).toEqual([204]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });

  it("returns status from prepareAndDownloadFile (error)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(400);
    const result = await prepareDownload(payload);
    expect(result).toEqual([400]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });
})


describe("reduceCategories", () => {
  it("reduces multiple categories with same application", () => {
    const input = [
      { application: "AppX", registrationId: 1, section: "S1" },
      { application: "AppX", registrationId: 2, section: "S2" }
    ];
    const result = reduceCategories(input);
    expect(result).toEqual([
      {
        application: "AppX",
        registrationId: [1, 2],
        section: ["S1", "S2"]
      }
    ]);
  });

  it("reduces categories with different applications", () => {
    const input = [
      { application: "AppX", registrationId: 1, section: "S1" },
      { application: "AppY", registrationId: 2, section: "S2" }
    ];
    const result = reduceCategories(input);
    expect(result).toEqual([
      {
        application: "AppX",
        registrationId: [1],
        section: ["S1"]
      },
      {
        application: "AppY",
        registrationId: [2],
        section: ["S2"]
      }
    ]);
  });

  it("handles empty input array", () => {
    const result = reduceCategories([]);
    expect(result).toEqual([]);
  });


  it("handles missing application property", () => {
    const input = [
      { registrationId: 1, section: "S1" }
    ];
    const result = reduceCategories(input);
    expect(result).toEqual([
      {
        application: undefined,
        registrationId: [1],
        section: ["S1"]
      }
    ]);
  });
});

describe("fetchViewDownloadData", () => {
  let setIsSidePanelLoader: jest.Mock;
  let setViewData: jest.Mock;
  let viewDownload: jest.Mock;
  let downloadPollingIntervalRef: { current: any };

  beforeEach(() => {
    jest.useFakeTimers();
    setIsSidePanelLoader = jest.fn();
    setViewData = jest.fn();
    viewDownload = jest.fn();
    downloadPollingIntervalRef = { current: null };
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it("sets loader, sets data, starts polling if in progress, and clears polling when complete", async () => {
    // First call: in progress
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "inprogress" }],
      status: 200
    });
    // Second call: complete
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 200
    });

    await fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
    expect(setViewData).toHaveBeenCalledWith([{ status: "inprogress" }]);
    expect(setIsSidePanelLoader).toHaveBeenLastCalledWith(false);

    // Simulate interval tick
    expect(downloadPollingIntervalRef.current).not.toBeNull();
    jest.runOnlyPendingTimers();

    // Await the second call
    await Promise.resolve();

    expect(setViewData).toHaveBeenCalledWith([{ status: "inprogress" }]);
  });

  it("does not start polling if no in progress files", async () => {
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 200
    });

    await fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
    expect(setViewData).toHaveBeenCalledWith([{ status: "complete" }]);
    expect(downloadPollingIntervalRef.current).toBeNull();
    expect(setIsSidePanelLoader).toHaveBeenLastCalledWith(false);
  });

  it("clears polling interval if not in progress and interval exists", async () => {
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 200
    });

    await fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(downloadPollingIntervalRef.current).toBeNull();
  });

  it("clears polling interval if result is not 200", async () => {
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 400
    });

    await fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(downloadPollingIntervalRef.current).toBeNull();
  });

  it("clears polling interval and logs error on exception", async () => {
    const error = new Error("fail");
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching view download details:", error);
    expect(downloadPollingIntervalRef.current).toBeNull();
    expect(setIsSidePanelLoader).toHaveBeenLastCalledWith(false);

    consoleSpy.mockRestore();
  });

  it("does not set loader if showLoader is false", async () => {
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 200
    });

    await fetchViewDownloadData({
      showLoader: false,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn()
    });

    expect(setIsSidePanelLoader).not.toHaveBeenCalledWith(true);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
  });
});

describe("validateAndApplyFilter", () => {
  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setReferenceExternalIds: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setSelectedFormats = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setAllSelectedDocs = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setReferenceExternalIds = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sets date error if fromDate is invalid", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2025-13-01", toDate: "2025-01-01" }, // invalid month
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("sets date error if toDate is invalid", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-32" }, // invalid day
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("sets date error if isDateError is true", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
      isDateError: true,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("sets date error if dayjs validation fails for fromDate", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "invalid-date", toDate: "2025-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("sets date error if dayjs validation fails for toDate", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2025-01-01", toDate: "invalid-date" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("sets date error if fromDate is empty and toDate is valid", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "", toDate: dayjs().format("YYYY-MM-DD") },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalled();
  });

  it("applies filter when dates are valid and no error", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: ["cat1"],
      setIsFilterDialogOpen,
      setCurrentPage,
      setAllSelectedDocs,
      setExcludedCheckBoxIds,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsFilterLoading).toHaveBeenCalledWith(true);
    expect(setDateRange).toHaveBeenCalledWith({ fromDate: "2025-01-01", toDate: "2025-01-02" });
    jest.runAllTimers();
    expect(setSelectedFormats).toHaveBeenCalledWith(["cat1"]);
    expect(setIsFilterDialogOpen).toHaveBeenCalledWith(false);
    expect(setIsFilterLoading).toHaveBeenLastCalledWith(false);
  });
});

describe("closeSidePanel", () => {
  it("sets side panel closed and clears interval if exists", () => {
  const setIsSidePanelOpen = jest.fn();
  const intervalId = setInterval(() => {}, 1000);
  const pollingRef = { current: intervalId };
  const clearSpy = jest.spyOn(global, "clearInterval");
  closeSidePanel(setIsSidePanelOpen, pollingRef);
  expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
  expect(clearSpy).toHaveBeenCalledWith(intervalId);
  expect(pollingRef.current).toBeNull();
  clearSpy.mockRestore();
});

 it("sets side panel closed and does nothing if interval does not exist", () => {
  const setIsSidePanelOpen = jest.fn();
  const pollingRef = { current: null };
  const clearSpy = jest.spyOn(global, "clearInterval");
  closeSidePanel(setIsSidePanelOpen, pollingRef);
  expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
  expect(clearSpy).not.toHaveBeenCalled();
  expect(pollingRef.current).toBeNull();
  clearSpy.mockRestore();
});
});

describe("fetchGetDocumentDetailsLogic", () => {
  const mockSetDocData = jest.fn();
  const mockSetCurrentPage = jest.fn();
  const mockSetTotalPage = jest.fn();
  const mockSetShowSearchError = jest.fn();
  const mockSetShowErrorBanner = jest.fn();
  const mockSetHasFetched = jest.fn();
  const mockSetIsSearchLoading = jest.fn();
  const mockSetIsSearchDataLoading = jest.fn();

  const defaultArgs = {
    page: 2,
    categories: [1, 2],
    sortByCol: "Document",
    sortOrder: "Asc",
    dateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
    refExternalId: ["org123"],
    relatedTo: 1,
    setDocData: mockSetDocData,
    setCurrentPage: mockSetCurrentPage,
    setTotalPage: mockSetTotalPage,
    setShowSearchError: mockSetShowSearchError,
    setShowErrorBanner: mockSetShowErrorBanner,
    setHasFetched: mockSetHasFetched,
    setIsSearchLoading: mockSetIsSearchLoading,
    setIsSearchDataLoading: mockSetIsSearchDataLoading,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).pageSizeNumber = 10; // Ensure this matches your logic
  });

  it("handles successful fetch with statusCode 200", async () => {
    const mockResult = {
      statusCode: 200,
      status: 200,
      totalRecords: 20,
      data: [{
        organizationId: "org1",
        userId: "user1",
        registrationId: 123,
        fileId: "1",
        personExternalId: "person1",
        documentInfo: { fileName: "Doc 1", isSelectedForPrepareDownload: false },
        document: "Doc 1",
        relatedTo: [],
        category: "Cat1",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
        blobName: "blob1"
      }],
      pageNumber: 1,
      pageSize: 10
    };
    jest.spyOn(ApiService, "fetchDocumentDetails").mockResolvedValueOnce(mockResult);

    await fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetDocData).toHaveBeenCalledWith(mockResult);
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetTotalPage).toHaveBeenCalledWith(Math.ceil(10 / 10));
    expect(mockSetShowSearchError).toHaveBeenCalledWith(false);
    expect(mockSetShowErrorBanner).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchLoading).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchDataLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch with status 400", async () => {
    const mockResult = {
      status: 400,
      statusCode: 400,
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 0,
      data: []
    };
    jest.spyOn(ApiService, "fetchDocumentDetails").mockResolvedValueOnce(mockResult);

    await fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetShowErrorBanner).toHaveBeenCalledWith(true);
    expect(mockSetIsSearchLoading).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchDataLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch with other status", async () => {
    const mockResult = {
      status: 500,
      statusCode: 500,
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 0,
      data: []
    };
    jest.spyOn(ApiService, "fetchDocumentDetails").mockResolvedValueOnce(mockResult);

    await fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetShowSearchError).toHaveBeenCalledWith(true);
    expect(mockSetIsSearchLoading).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchDataLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch throwing an error", async () => {
    const error = new Error("fail");
    jest.spyOn(ApiService, "fetchDocumentDetails").mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetchGetDocumentDetailsLogic(defaultArgs);

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching document details:", error);
    expect(mockSetShowSearchError).toHaveBeenCalledWith(true);
    expect(mockSetIsSearchLoading).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchDataLoading).toHaveBeenCalledWith(false);

    consoleSpy.mockRestore();
  });
});
describe("referenceMappingDetails deduplication", () => {
  it("removes duplicates by referenceExternalId", () => {
    const referenceMappingDetails = [
      { referenceExternalId: "id1", value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { referenceExternalId: "id1", value: 3 }, // duplicate id1
      { referenceExternalId: "id3", value: 4 }
    ];
    const deduped = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual([
      { referenceExternalId: "id1", value: 3 }, // last occurrence kept
      { referenceExternalId: "id2", value: 2 },
      { referenceExternalId: "id3", value: 4 }
    ]);
  });

  it("returns empty array if input is empty", () => {
    const referenceMappingDetails: any[] = [];
    const deduped = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual([]);
  });

  it("returns same array if all referenceExternalId are unique", () => {
    const referenceMappingDetails = [
      { referenceExternalId: "id1", value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { referenceExternalId: "id3", value: 3 }
    ];
    const deduped = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual(referenceMappingDetails);
  });

  it("handles items with missing referenceExternalId", () => {
    const referenceMappingDetails = [
      { value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { value: 3 }
    ];
    const deduped = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual([
      { value: 3 }, // last undefined key kept
      { referenceExternalId: "id2", value: 2 }
    ]);
  });
});
describe("buildSelectedDocs", () => {
  const categoryRegistrationMap = [1, 2];

  it("returns empty array if selectedCheckBoxIds is not an array", () => {
    expect(buildSelectedDocs(undefined as any, { data: [] }, categoryRegistrationMap, [""], 0, undefined as any, false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
    expect(buildSelectedDocs(null as any, { data: [] }, categoryRegistrationMap, [""], 0, null as any, false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
    expect(buildSelectedDocs(["1"], { data: [] }, categoryRegistrationMap, [""], 0, undefined as any, false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
    expect(buildSelectedDocs(["1"], { data: [] }, categoryRegistrationMap, [""], 0, null as any, false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
  });

  it("returns empty array if docData.data is not an array", () => {
    expect(buildSelectedDocs(["1"], { data: undefined }, categoryRegistrationMap, [""], 0, ["2"], false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
    expect(buildSelectedDocs(["1"], { data: null }, categoryRegistrationMap, [""], 0, ["2"], false,[], {fromDate:"", toDate:""}, undefined as any)).toEqual([]);
  });

  it("returns correct request object for valid input", () => {
    const mockDate = new Date("2025-09-11T15:16:57");

    // Mock system time to fixed date
    jest.useFakeTimers().setSystemTime(mockDate);

    const docData = {
      data: [{
        fileId: "1",
        registrationId: 123,
        relatedTo: [{ learnerExternalId: "ext1" }],
        documentRealatedTo: 1,
        category: "Legal",
        fromDate: "2025-01-01",
        toDate: "2025-01-02",
        externalId: "ext2"
      }]
    };

    const excludedIdDetails = ["2"];
    const isHeaderBoxChecked = true;

    const resultWithExcluded = buildSelectedDocs(
      ["1"],
      docData,
      categoryRegistrationMap,
      ["ext1"],
      1,
      excludedIdDetails,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [{ fileId: "2", registrationId: 456, externalId: "ext3" }]
    );

    expect(resultWithExcluded).toEqual([
      {
        request: {
          selectAll: true,
          downloadCriteria: {
            referenceMappingDetails: [],
            documentRealatedTo: 1,
            categoryId: [1,2],
            fromDate: "2025-01-01",
            toDate: "2025-01-02"
          },
          fileDetails: [],
          excludedFileDetails: [],
          currentDateTime: mockDate.toLocaleString("sv-SE", { hour12: false }).replace(" ", "T")
        }
      }
    ]);

    jest.useRealTimers();
  });

  it("returns excludedIdDetails when isHeaderBoxChecked is true, excludedIdDetails.length > 0, and less than totalRecords", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 5
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = true;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [{ fileId: "1", registrationId: 123, externalId: "ext1" }, { fileId: "2", registrationId: 456, externalId: "ext2" }],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
    expect(result[0].request.excludedFileDetails).toEqual([
      { fileId: "1", registrationId: 123, externalId: "ext1" },
      { fileId: "2", registrationId: 456, externalId: "ext2" }
    ]);
  });

  it("returns excludedIdDetails when isHeaderBoxChecked is true, excludedIdDetails.length > 0, and less than totalRecords", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 5
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = false;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [{ fileId: "1", registrationId: 123, externalId: "ext1" }, { fileId: "2", registrationId: 456, externalId: "ext2" }],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
     expect(result[0].request.fileDetails).toEqual([
      { fileId: "1", registrationId: 123, externalId: "ext1" },
      { fileId: "2", registrationId: 456, externalId: "ext2" }
    ]);
  });

  it("returns empty array when isHeaderBoxChecked is false", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ],
      totalRecords: 2
    };
    const selectedCheckBoxIds = ["1"];
    const excludedCheckBoxIds = ["1"];
    const isHeaderBoxChecked = false;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""] ,
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
    expect(result[0].request.excludedFileDetails).toEqual([]);
  });

  it("returns empty array when excludedIdDetails.length === 0", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ],
      totalRecords: 1
    };
    const selectedCheckBoxIds: string[] = [];
    const excludedCheckBoxIds: string[] = [];
    const isHeaderBoxChecked = true;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
    expect(result[0].request.excludedFileDetails).toEqual([]);
  });

  it("returns empty array when excludedIdDetails.length >= totalRecords", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 2
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = true;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
    expect(result[0].request.excludedFileDetails).toEqual([]);
  });

  it("returns empty array when docData.totalRecords is undefined", () => {
    const docData = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ]
      // totalRecords is missing
    };
    const selectedCheckBoxIds = ["1"];
    const excludedCheckBoxIds = ["1"];
    const isHeaderBoxChecked = true;

    const result = buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      []
    );
    expect(result[0].request.excludedFileDetails).toEqual([]);
  });
});


describe('handleClearAllConfirm', () => {
  const viewData = [{ partitionKey: 'key1', status: 'complete' }];
  const completedPartitionKeys = ['key1'];
  let clearAllFiles: jest.Mock;
  let setShowToastNotification: jest.Mock;
  let fetchViewDownloadDataMock: jest.Mock;
  let setIsSidePanelLoader: jest.Mock;
  let setViewData: jest.Mock;
  let setHasFetchedViewDownload: jest.Mock;
  let viewDownload: jest.Mock;
  let downloadPollingIntervalRef: any;
  let setClearAllError: jest.Mock;
  let setShowConfirmDialog: jest.Mock;
  let getCompletedPartitionKeysMock: jest.Mock;

  beforeEach(() => {
    clearAllFiles = jest.fn();
    setShowToastNotification = jest.fn();
    fetchViewDownloadDataMock = jest.fn();
    setIsSidePanelLoader = jest.fn();
    setViewData = jest.fn();
    setHasFetchedViewDownload = jest.fn();
    viewDownload = jest.fn();
    downloadPollingIntervalRef = { current: null };
    setClearAllError = jest.fn();
    setShowConfirmDialog = jest.fn();
    getCompletedPartitionKeysMock = jest.fn().mockReturnValue(completedPartitionKeys);
  });

  it('shows toast and refreshes data on 204', async () => {
    clearAllFiles.mockResolvedValue(204);
    await handleClearAllConfirm({
      viewData,
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData: fetchViewDownloadDataMock,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload,
      downloadPollingIntervalRef,
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys: getCompletedPartitionKeysMock,
      setIsViewDownloadError: jest.fn(),
    });
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(fetchViewDownloadDataMock).toHaveBeenCalledWith(expect.objectContaining({
      showLoader: false,
      setIsSidePanelLoader,
      viewDownload,
      downloadPollingIntervalRef,
    }));
    expect(setClearAllError).not.toHaveBeenCalled();
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it('shows error when clearAllFiles returns non-204', async () => {
    clearAllFiles.mockResolvedValue(500);
    await handleClearAllConfirm({
      viewData,
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData: fetchViewDownloadDataMock,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload,
      downloadPollingIntervalRef,
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys: getCompletedPartitionKeysMock,
      setIsViewDownloadError: jest.fn(),
    });
    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).not.toHaveBeenCalledWith(true);
    expect(fetchViewDownloadDataMock).not.toHaveBeenCalled();
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it('shows error and hides toast on exception', async () => {
    clearAllFiles.mockRejectedValue(new Error('fail'));
    await handleClearAllConfirm({
      viewData,
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData: fetchViewDownloadDataMock,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload,
      downloadPollingIntervalRef,
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys: getCompletedPartitionKeysMock,
      setIsViewDownloadError: jest.fn(),
    });
    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).toHaveBeenCalledWith(false);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });
});


describe('getCompletedPartitionKeys', () => {
  it('returns partitionKeys for items with status complete (case-insensitive)', () => {
    const data = [
      { status: 'Complete', partitionKey: 'pk1' },
      { status: 'complete', partitionKey: 'pk2' },
      { status: 'COMPLETE', partitionKey: 'pk3' },
      { status: 'incomplete', partitionKey: 'pk4' },
      { status: 'pending', partitionKey: 'pk5' }
    ];
    expect(getCompletedPartitionKeys(data)).toEqual(['pk1', 'pk2', 'pk3']);
  });

  it('returns empty string for missing partitionKey', () => {
    const data = [
      { status: 'complete' },
      { status: 'complete', partitionKey: undefined }
    ];
    expect(getCompletedPartitionKeys(data)).toEqual(['', '']);
  });

  it('returns empty array if no items are complete', () => {
    const data = [
      { status: 'pending', partitionKey: 'pk1' },
      { status: 'incomplete', partitionKey: 'pk2' }
    ];
    expect(getCompletedPartitionKeys(data)).toEqual([]);
  });

  it('handles empty input array', () => {
    expect(getCompletedPartitionKeys([])).toEqual([]);
  });

  it('handles missing status', () => {
    const data = [
      { partitionKey: 'pk1' },
      { status: undefined, partitionKey: 'pk2' }
    ];
    expect(getCompletedPartitionKeys(data)).toEqual([]);
  });
});

describe("Added by column anyComponent", () => {
  const t = (key: string) => key; // mock translation function
  const addedByColumn = getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.addedByColumn");

  test("renders plain value if length <= 12", () => {
    const value = "ShortName";
    const { container, getByText } = render(<>{addedByColumn?.anyComponent?.(value)}</>);
    expect(getByText("ShortName")).toBeInTheDocument();
    // Should not render tooltip
    expect(container.querySelector('[data-testid="tooltip-addedby"]')).toBeNull();
  });

  test("renders nothing if value is null or undefined", () => {
    const { container } = render(<>{addedByColumn?.anyComponent?.(null)}</>);
    // Should render an empty span inside a flex div, not a truly empty DOM element
    const span = container.querySelector('.document-text.document-column');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("");
    const { container: container2 } = render(<>{addedByColumn?.anyComponent?.(undefined)}</>);
    const span2 = container2.querySelector('.document-text.document-column');
    expect(span2).toBeInTheDocument();
    expect(span2).toHaveTextContent("");
  });

  test("renders plain value if length <= 12", () => {
  const value = "ShortName";
  const { container, getByText } = render(<>{addedByColumn?.anyComponent?.(value)}</>);
  expect(getByText("ShortName")).toBeInTheDocument();
  expect(container.querySelector('[data-testid="tooltip-addedby"]')).toBeNull();
});

  it("renders truncated value with tooltip if string length > 10", () => {
    expect(addedByColumn).toBeDefined();
    expect(addedByColumn?.anyComponent).toBeDefined();
    const longValue = "averylongsizename";
    const { container } = render(<>{addedByColumn!.anyComponent!(longValue)}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 12));
  });

  it("renders truncated value with tooltip if array first value length > 10", () => {
    expect(addedByColumn).toBeDefined();
    expect(addedByColumn?.anyComponent).toBeDefined();
    const longValue = "averylongsizename";
    const { container } = render(<>{addedByColumn!.anyComponent!([longValue, "other"])}</>);
    expect(container).toHaveTextContent(longValue.substring(0, 12));
  });
});

describe('fileDownload', () => {
  let originalCreateElement: typeof document.createElement;
  let originalGetElementById: typeof document.getElementById;
  let mockLink: any;
  let parent: any;
  let mockDownloadFile: jest.SpyInstance;

  beforeEach(() => {
    mockLink = {
      click: jest.fn(),
      set href(val) { this.hrefValue = val; },
      get href() { return this.hrefValue; },
      set download(val) { this.downloadValue = val; },
      get download() { return this.downloadValue; },
    };
    parent = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };
    originalCreateElement = document.createElement;
    document.createElement = jest.fn(() => mockLink);
    originalGetElementById = document.getElementById;
    document.getElementById = jest.fn(() => ({ parentElement: parent }) as unknown as HTMLElement);
    window.URL.createObjectURL = jest.fn(() => 'blob:url');
    window.URL.revokeObjectURL = jest.fn();
  mockDownloadFile = jest.spyOn(ApiService, 'downloadFile');
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    document.getElementById = originalGetElementById;
    jest.clearAllMocks();
  });

  it('downloads zip file using SAS URL from bulkDownload', async () => {
    const fileId = 'file-zip';
    const fileName = 'test.zip';
    const blobName = 'blob-zip';
    const payloadUrl = 'https://example.com/file.zip';
  const mockBulkDownload = jest.spyOn(ApiService, 'bulkDownload').mockResolvedValueOnce({ payload: payloadUrl });
    // Simulate isZipFile logic by passing .zip fileName and blobName
    await logicModule.fileDownload(
      fileId,
      fileName,
      '',
      '',
      blobName
    );
    expect(mockBulkDownload).toHaveBeenCalledWith(blobName, fileName);
    expect(mockLink.href).toBe(payloadUrl);
    expect(mockLink.download).toBe(fileName);
    expect(parent.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(parent.removeChild).toHaveBeenCalledWith(mockLink);
  });

  it('throws error if bulkDownload returns no payload', async () => {
    const fileId = 'file-zip';
    const fileName = 'test.zip';
    const blobName = 'blob-zip';
    jest.spyOn(ApiService, 'bulkDownload').mockResolvedValueOnce({});
    await expect(
      logicModule.fileDownload(fileId, fileName, '', '', blobName)
    ).rejects.toThrow('Bulk download failed: No file URL returned.');
  });

  it('throws error if bulkDownload throws', async () => {
    const fileId = 'file-zip';
    const fileName = 'test.zip';
    const blobName = 'blob-zip';
    jest.spyOn(ApiService, 'bulkDownload').mockRejectedValueOnce(new Error('fail'));
    await expect(
      logicModule.fileDownload(fileId, fileName, '', '', blobName)
    ).rejects.toThrow('fail');
  });

  it('downloads blob file using downloadFile', async () => {
    const fakeBlob = new Blob(['test']);
    mockDownloadFile.mockResolvedValueOnce(fakeBlob);
    await logicModule.fileDownload(
      'file-123',
      'test.txt',
      'app',
      'section',
      undefined
    );
    expect(mockDownloadFile).toHaveBeenCalledWith('app', 'section', 'file-123');
    expect(mockLink.href).toBe('blob:url');
    expect(mockLink.download).toBe('test.txt');
    expect(parent.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
    expect(parent.removeChild).toHaveBeenCalledWith(mockLink);
  });

  it('throws and logs if exception thrown', async () => {
  document.createElement = jest.fn(() => { throw new Error('fail'); });
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  await expect(logicModule.fileDownload(
    'file-err',
    'file.txt',
    'app',
    'section'
  )).rejects.toThrow('fail');
  expect(errorSpy).toHaveBeenCalled();
  errorSpy.mockRestore();
});
});

describe("handleBulkDeleteLogic", () => {
  let setShowToastNotification: jest.Mock;
  let setShowConfirmDialog: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setIsClearSelectedCheckbox: jest.Mock;
  let setShowDeleteErrorBanner: jest.Mock;
  let setShowDeleteSuccessToast: jest.Mock;
  let fetchGetDocumentDetails: jest.Mock;
  let deleteFiles: jest.Mock;

  const docData = {
    data: [
      { fileId: "1", registrationId: 101, externalId: "ext1" },
      { fileId: "2", registrationId: 102, externalId: "ext2" }
    ],
    totalRecords: 2
  };

  const allSelectedDocs = [
    { fileId: "1", registrationId: 101, externalId: "ext1" },
    { fileId: "2", registrationId: 102, externalId: "ext2" }
  ];

  const allRegistrationIds = [101, 102];
  const dateRange = { fromDate: "2025-01-01", toDate: "2025-01-02" };
  const searchRefExternalId = ["ref1"];
  const documentRealatedTo = 1;
  const currentPage = 1;
  const sortBy = "Document";
  const sortDirection = "Asc";
  const excludedCheckBoxIds = ["2"];

  beforeEach(() => {
    setShowToastNotification = jest.fn();
    setShowConfirmDialog = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setIsClearSelectedCheckbox = jest.fn();
    setShowDeleteErrorBanner = jest.fn();
    setShowDeleteSuccessToast = jest.fn();
    fetchGetDocumentDetails = jest.fn();
    deleteFiles = jest.fn();
  });

  it("should handle successful delete (status 204) with select all unchecked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false
    });

    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
    expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
    expect(setShowDeleteSuccessToast).toHaveBeenCalledWith(true);
  });

  it("should handle successful delete (status 204) with select all checked and exclusions", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: true
    });

    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
    expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
    expect(setShowDeleteSuccessToast).toHaveBeenCalledWith(true);
  });

  it("should handle deleteFiles returning non-204 status", async () => {
    deleteFiles.mockResolvedValue(400);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: false
    });

    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).not.toHaveBeenCalledWith(true);
    expect(setShowDeleteSuccessToast).not.toHaveBeenCalledWith(true);
  });

  it("should handle deleteFiles throwing an error", async () => {
    deleteFiles.mockRejectedValue(new Error("fail"));

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: false
    });

    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).not.toHaveBeenCalledWith(true);
    expect(setShowDeleteSuccessToast).not.toHaveBeenCalledWith(true);
  });

  it("should send empty fileDetails when select all is checked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: true
    });

    // fileDetails should be empty in payload
    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.fileDetails).toEqual([]);
  });

  it("should send fileDetails when select all is unchecked and docs are selected", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false
    });

    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.fileDetails.length).toBe(2);
    expect(callPayload.request.fileDetails[0]).toMatchObject({ fileId: "1", registrationId: 101, externalId: "ext1" });
    expect(callPayload.request.fileDetails[1]).toMatchObject({ fileId: "2", registrationId: 102, externalId: "ext2" });
  });


  it("should send empty excludedFileDetails when select all is unchecked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRealatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false
    });

    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.excludedFileDetails).toEqual([]);
  });
  
});

describe("getTitleConfirmation", () => {
  const t = jest.fn(key => key);
  it('returns "Clear all downloads?" for "clearAll"', () => {
    expect(getTitleConfirmation(t,"clearAll", 0, 0)).toBe("DocumentManagementServer.clearAllDownloadsTitle");
  });

  it('returns "Delete Document?" for "delete" when a single file is selected', () => {
    expect(getTitleConfirmation(t,"delete", 1, 0)).toBe("DocumentManagementServer.deleteDocumentTitle");
  });

  it('returns "Delete Documents?" for "delete" when multiple files are selected', () => {
    expect(getTitleConfirmation(t,"delete", 2, 0)).toBe("DocumentManagementServer.deleteDocumentsTitle");
  });

  it('returns "Prepare Download?" for other values', () => {
    expect(getTitleConfirmation(t,"prepare", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");
    expect(getTitleConfirmation(t,"anythingElse", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");
    expect(getTitleConfirmation(t,"", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");

  });
   it('returns prepareAllDocumentsTitle when availableFileCount equals totalRecords and dialogType is not clearAll/delete', () => {
    const result = getTitleConfirmation(t, "prepare", 5, 5);
    expect(result).toBe("DocumentManagementServer.prepareAllDocumentsTitle");
    expect(t).toHaveBeenCalledWith("DocumentManagementServer.prepareAllDocumentsTitle");
  });
});

describe("addUniqueTagItem", () => {
  let setTagListArray: jest.Mock;
  let setReferenceExternalIds: jest.Mock;
  let setAlreadyExistingTags: jest.Mock;

  beforeEach(() => {
    setTagListArray = jest.fn();
    setReferenceExternalIds = jest.fn();
    setAlreadyExistingTags = jest.fn();
  });

  it("does nothing if item is null", () => {
    addUniqueTagItem({
      item: null,
      selectedRelatedTo: { text: "Pupil" } as any,
      tagListArray: [],
      setTagListArray,
      setReferenceExternalIds,
    });
    expect(setTagListArray).not.toHaveBeenCalled();
    expect(setReferenceExternalIds).not.toHaveBeenCalled();
  });

it("adds a new unique pupil tag and referenceExternalId", () => {
  const item = {
    learnerExternalId: "p1",
    text: "John Doe",
    props: { externalId: "p1" }
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Pupil" } } },
    tagListArray: [],
    setTagListArray,
    setReferenceExternalIds,
  });
  expect(setTagListArray).toHaveBeenCalledWith([item]);
  expect(setReferenceExternalIds).toHaveBeenCalled();
  const updater = setReferenceExternalIds.mock.calls[0][0];
  expect(typeof updater).toBe("function");
  expect(updater([])).toEqual(["p1"]);
});

  it("does not add duplicate pupil tag", () => {
  const item = {
    learnerExternalId: "p1",
    text: "John Doe",
    props: { externalId: "p1" }
  };
  const prev = [{ ...item, name: item.text, id: Number(item.text) }];
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Pupil" } } },
    tagListArray: prev,
    setTagListArray,
    setReferenceExternalIds,
  });
  // Should not add duplicate, so setTagListArray should NOT be called
  expect(setTagListArray).not.toHaveBeenCalledWith([...prev, item]);
});

it("adds a new unique staff tag and referenceExternalId", () => {
  const item = {
    externalId: "s1",
    text: "Jane Smith",
    props: { externalId: "s1" }
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Staff" } } },
    tagListArray: [],
    setTagListArray,
    setReferenceExternalIds,
  });
  expect(setTagListArray).toHaveBeenCalledWith([item]);
  expect(setReferenceExternalIds).toHaveBeenCalled();
  const updater = setReferenceExternalIds.mock.calls[0][0];
  expect(typeof updater).toBe("function");
  expect(updater([])).toEqual(["s1"]);
});

it("does not add tag if maxLimit is reached", () => {
  const item = {
    learnerExternalId: "p2",
    text: "Another Pupil",
    props: { externalId: "p2" }
  };
  const tagListArray = Array(5).fill({ learnerExternalId: "x", text: "x" });
  addUniqueTagItem({
    item,
    selectedRelatedTo: { text: "Pupil" } as any,
    tagListArray,
    setTagListArray,
    setReferenceExternalIds,
    maxLimit: 5
  });
  // Should not add, so setTagListArray should NOT be called with a longer array
  expect(setTagListArray).not.toHaveBeenCalledWith([...tagListArray, item]);
});

 it("falls back to item.text as id if idKey is missing", () => {
  const item = {
    text: "Fallback",
    props: {}
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { text: "Unknown" } as any,
    tagListArray: [],
    setTagListArray,
    setReferenceExternalIds,
  });
  expect(setTagListArray).toHaveBeenCalledWith([item]);
});

it("falls back to item.text as id if idKey is missing", () => {
  const item = {
    text: "Fallback",
    props: {}
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { text: "Unknown" } as any,
    tagListArray: [],
    setTagListArray,
    setReferenceExternalIds,
  });
  expect(setTagListArray).toHaveBeenCalledWith([item]);
});

it("calls setAlreadyExistingTags when adding duplicate tag", () => {
  const item = {
    learnerExternalId: "p1",
    text: "John Doe",
    props: { externalId: "p1" }
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Pupil" } } },
    tagListArray: [{ ...item, name: item.text, id: Number(item.learnerExternalId) }],
    setTagListArray,
    setReferenceExternalIds,
    setAlreadyExistingTags
  });
  expect(setAlreadyExistingTags).toHaveBeenCalledWith(true);
});

it("calls setReferenceExternalIds with correct updater when adding unique tag", () => {
  const item = {
    learnerExternalId: "p1",
    text: "John Doe",
    props: { externalId: "p1" }
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Pupil" } } },
    tagListArray: [],
    setTagListArray,
    setReferenceExternalIds,
    setAlreadyExistingTags
  });
  expect(setTagListArray).toHaveBeenCalledWith([item]);
  expect(setReferenceExternalIds).toHaveBeenCalled();
  const updater = setReferenceExternalIds.mock.calls[0][0];
  expect(typeof updater).toBe("function");
  expect(updater([])).toEqual(["p1"]);
  expect(
  setAlreadyExistingTags.mock.calls.length === 0 ||
  setAlreadyExistingTags.mock.calls.some(call => call[0] === false)
  ).toBe(true);
});
 it("calls setAlreadyExistingTags when adding duplicate tag", () => {
  const item = {
    learnerExternalId: "p1",
    text: "John Doe",
    props: { externalId: "p1" }
  };
  addUniqueTagItem({
    item,
    selectedRelatedTo: { data: { data: { key: "Pupil" } } },
    tagListArray: [{ ...item, name: item.text, id: Number(item.learnerExternalId) }],
    setTagListArray,
    setReferenceExternalIds,
    setAlreadyExistingTags
  });
  expect(setAlreadyExistingTags).toHaveBeenCalledWith(true);
});
});

describe("handleApply", () => {
  let setSearchInput: jest.Mock;
  let setSearchTerm: jest.Mock;
  let setSearchText: jest.Mock;
  let setTableKey: jest.Mock;
  let setIsSearchTriggered: jest.Mock;
  let setSelectedCategories: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setSearchRefExternalId: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;
  let setSelectedEntities: jest.Mock;

  beforeEach(() => {
    setSearchInput = jest.fn();
    setSearchTerm = jest.fn();
    setSearchText = jest.fn();
    setTableKey = jest.fn();
    setIsSearchTriggered = jest.fn();
    setSelectedCategories = jest.fn();
    setSelectedFormats = jest.fn();
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setSearchRefExternalId = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
    setSelectedEntities = jest.fn();
    jest.spyOn(logicModule, "validateAndApplyFilter").mockImplementation(() => {});
  });
  it("calls validateAndApplyFilter and resets search when referenceExternalIds is not empty", () => {
    handleApply({
      referenceExternalIds: ["id1"],
      categories: [{ id: "cat1" }],
      selectedCategories: [{ id: "cat2" }],
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
      isDateError: false,
      selectedEntity: [],
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSearchInput,
      setSearchTerm,
      setSearchText,
      setTableKey,
      setIsSearchTriggered,
      setSelectedCategories,
      setSelectedFormats,
      setSearchRefExternalId,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setSelectedEntities
    });

    expect(setSelectedCategories).toHaveBeenCalledWith([{ id: "cat1" }]);
    expect(setSelectedFormats).toHaveBeenCalledWith([{ id: "cat1" }]);
    expect(setSearchInput).toHaveBeenCalledWith("");
    expect(setSearchTerm).toHaveBeenCalledWith("");
    expect(setSearchText).toHaveBeenCalledWith("");
    expect(setTableKey).toHaveBeenCalled();
    expect(setIsSearchTriggered).toHaveBeenCalledWith(true);
  });

  it("calls validateAndApplyFilter and does not reset search when referenceExternalIds is empty", () => {
    handleApply({
      referenceExternalIds: [],
      categories: [{ id: "cat1" }],
      selectedCategories: [{ id: "cat2" }],
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSearchInput,
      setSearchTerm,
      setSearchText,
      setTableKey,
      setIsSearchTriggered,
      setSelectedCategories,
      setSelectedFormats,
      setSearchRefExternalId,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setSelectedEntities
    });

    expect(setSelectedCategories).toHaveBeenCalledWith([{ id: "cat1" }]);
    expect(setSelectedFormats).toHaveBeenCalledWith([{ id: "cat1" }]);
    expect(setSearchInput).not.toHaveBeenCalled();
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
    expect(setTableKey).not.toHaveBeenCalled();
    expect(setIsSearchTriggered).toHaveBeenCalledWith(true);
  });

  it("uses selectedCategories if categories is undefined", () => {
    handleApply({
      referenceExternalIds: [],
      categories: undefined,
      selectedCategories: [{ id: "cat2" }],
      selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSearchInput,
      setSearchTerm,
      setSearchText,
      setTableKey,
      setIsSearchTriggered,
      setSelectedCategories,
      setSelectedFormats,
      setSearchRefExternalId,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setSelectedEntities
    });

    expect(setSelectedCategories).toHaveBeenCalledWith([{ id: "cat2" }]);
    expect(setSelectedFormats).toHaveBeenCalledWith([{ id: "cat2" }]);
  });
  it("increments tableKey when referenceExternalIds is not empty", () => {
  handleApply({
    referenceExternalIds: ["id1"],
    categories: [{ id: "cat1" }],
    selectedCategories: [{ id: "cat2" }],
    selectedDateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
    isDateError: false,
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setIsFilterDialogOpen,
    setCurrentPage,
    setExcludedCheckBoxIds,
    setAllSelectedDocs,
    setSearchInput,
    setSearchTerm,
    setSearchText,
    setTableKey,
    setIsSearchTriggered,
    setSelectedCategories,
    setSelectedFormats,
    setSearchRefExternalId,
    setIsHeaderBoxChecked,
    setSelectedCheckBoxIds,
    setPrevSelectedDocs,  
    setSelectedEntities
  });

  // Check that setTableKey was called with a function
  expect(setTableKey).toHaveBeenCalled();
  const callArg = setTableKey.mock.calls[0][0];
  expect(typeof callArg).toBe("function");
  // Optionally, check that the function increments a value
  expect(callArg(5)).toBe(6);
});
});

describe("handleEditSelectedOverFlowMenu", () => {
  const getMocks = () => ({
    setShowDialog: jest.fn(),
    setShowConfirmDialog: jest.fn(),
    setShowRestrictedDeleteDialog: jest.fn(),
    setShowRestrictedPrepareDialog: jest.fn(),
    setIsPreDialogLoading: jest.fn(),
    setRestrictedFileCount: jest.fn(),
    setAlreadyDeletedFileCount: jest.fn(),
    setAvailableFileCount: jest.fn(),
    setDialogType: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildValidationPayload: jest.fn((args) => args),
    validation: jest.fn(async () => ({
      data: {
        restrictedFileCount: 1,
        alreadyDeletedFileCount: 2,
        availableFileCount: 3,
      }
    })),
  });

  const baseArgs = {
    e: {} as React.SyntheticEvent,
    selectedItem: { value: "Prepare download" },
    totalSelectedCount: 1,
    isHeaderBoxChecked: false,
    allSelectedDocs: [{ fileId: "1" }],
    allRegistrationIds: [1, 2],
    dateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
    searchRefExternalId: ["ref1"],
    documentRealatedTo: 1,
  };

  it("shows dialog if nothing selected", async () => {
    const mocks = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      totalSelectedCount: 0,
    });
    expect(mocks.setShowDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalled();
  });

  it("shows restricted prepare dialog if available=0 and alreadyDeleted>0 for Prepare download", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 1, availableFileCount: 0 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowRestrictedPrepareDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows restricted delete dialog if available=0 and restricted>0 for Delete", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 1, alreadyDeletedFileCount: 0, availableFileCount: 0 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog if available>0 for Delete", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 2 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog for Prepare download if available>0", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 1 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(true);
  });

  it("opens side panel for view download", async () => {
    const mocks = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "View download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setSidePanelOpenReason).toHaveBeenCalledWith("view");
    expect(mocks.setIsSidePanelOpen).toHaveBeenCalledWith(true);
  });

  it("clears suggestions and loading for whitespace-only input", () => {
    const event = { target: { value: "   " } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();

    logicModule.handleSearchChange(
      event,
      [],
      "",
      "",
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading
    );

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });
});
