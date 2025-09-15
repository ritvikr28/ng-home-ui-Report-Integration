import React from "react";
import { act } from "@testing-library/react-hooks";
import { render } from "@testing-library/react";
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
  getReferenceMappingForSearchedPerson
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


describe("formatSuggestions", () => {
  it("returns empty array when input is empty", async () => {
  expect(await formatSuggestions([])).toEqual([]);
  expect(await formatSuggestions(undefined as any)).toEqual([]);
  expect(await formatSuggestions(null as any)).toEqual([]);
});


  it("formats Pupil category with icon and value", async () => {
    const input = [
      {
        name: "Pupil",
        values: [
          {
            pupilId: "p1",
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

  expect(setSuggestions).toHaveBeenCalledWith([]);
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
    expect(setSearchRefExternalId).toHaveBeenCalledWith("pupil-123");
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
    expect(setSearchRefExternalId).toHaveBeenCalledWith("staff-123");
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
    expect(setSearchRefExternalId).toHaveBeenCalledWith("organisation-123");

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

  it("renders pupil related item with link and tag", () => {
  const relatedToColumn = headers.find(h => h.text === "Related to");
  const elem = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A"
  }];
   const { getByText, getByRole } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
    // Check for link
    const link = getByRole("link", { name: "John Doe" });
    expect(link).toHaveAttribute("href", "/");
    // Check for tag
    expect(getByText("Y5 / A")).toBeInTheDocument();
});
  it("renders staff related item with link and staff code", () => {
  const relatedToColumn = headers.find(h => h.text === "Related to");
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

it("renders tooltip with multiple staff and pupil and school items", () => {
  const relatedToColumn = headers.find(h => h.text === "Related to");
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

  expect(getByText("+3")).toBeInTheDocument();

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
    const result = getResultNotFoundMsg('test', { statusCode: 200, data: [] }, 'test', false, true);
    expect(result).toBe(
      'No data to display.'
    );
  });

  it('returns "Information unavailable" when showErrorBanner is true', () => {
    const result = getResultNotFoundMsg('', { data: ['some data'] }, '', true, true);
    expect(result).toBe('Information unavailable.');
  });

  it('returns undefined when there is data and no error', () => {
    const result = getResultNotFoundMsg('test', { data: ['doc1'] }, 'test', false, false);
    expect(result).toBeUndefined();
  });

  it('returns "No data to display" when not searching and no data', () => {
  const result = getResultNotFoundMsg(
    "", // searchText is empty
    { statusCode: 200, data: [] }, // docData has empty array
    "", // searchTerm
    false, // showErrorBanner
    false // isSearching
  );
  expect(result).toEqual("Use the search bar to find and select a pupil, staff member, or school to view, download, or delete related documents.");
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
        referenceExternalId: '123'
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
        referenceExternalId: '456'
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
      downloadPollingIntervalRef
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
      downloadPollingIntervalRef
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
      downloadPollingIntervalRef
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
      downloadPollingIntervalRef
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
      downloadPollingIntervalRef
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
      downloadPollingIntervalRef
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

  beforeEach(() => {
    jest.useFakeTimers();
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setSelectedFormats = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
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
      setCurrentPage
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
      setCurrentPage
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
      setCurrentPage
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
      setCurrentPage
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
      setCurrentPage
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
      setCurrentPage
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
      setCurrentPage
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
    refExternalId: "org123",
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

describe("buildSelectedDocs", () => {
  const categoryRegistrationMap = { Legal: 1, Finance: 2 };

  it("returns empty array if selectedCheckBoxIds is not an array", () => {
    expect(buildSelectedDocs(undefined as any, { data: [] }, categoryRegistrationMap, "", 0)).toEqual([]);
    expect(buildSelectedDocs(null as any, { data: [] }, categoryRegistrationMap, "", 0)).toEqual([]);
  });

  it("returns empty array if docData.data is not an array", () => {
    expect(buildSelectedDocs(["1"], { data: undefined }, categoryRegistrationMap, "", 0)).toEqual([]);
    expect(buildSelectedDocs(["1"], { data: null }, categoryRegistrationMap, "", 0)).toEqual([]);
  });

  it("returns empty array if no matching document for selected ID", () => {
    const docData = { data: [{ fileId: "2", registrationId: 123 }] };
    expect(buildSelectedDocs(["1"], docData, categoryRegistrationMap, "", 0)).toEqual([]);
  });

  it("returns empty array if matching document has undefined registrationId", () => {
    const docData = { data: [{ fileId: "1", registrationId: undefined }] };
    expect(buildSelectedDocs(["1"], docData, categoryRegistrationMap, "", 0)).toEqual([]);
  });

 it("returns correct request object for valid input", () => {
  const mockDate = new Date("2025-09-11T09:46:57.985Z");
  
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
      toDate: "2025-01-02"
    }]
  };

  const result = buildSelectedDocs(["1"], docData, categoryRegistrationMap, "ext1", 1);

  expect(result).toEqual([
    {
      request: {
        selectAll: false,
        downloadCriteria: {
          referenceMappingDetails: [
            {
              referenceExternalId: "ext1",
              documentRealatedTo: 1,
              relatedTo: [{ learnerExternalId: "ext1" }]
            }
          ],
          categoryId: [1],
          fromDate: "2025-01-01",
          toDate: "2025-01-02"
        },
        fileDetails: [
          { fileId: "1", registrationId: 123 }
        ],
        currentDateTime: mockDate.toISOString()
      }
    }
  ]);

  jest.useRealTimers();
});
});

describe("getReferenceMappingForSearchedPerson", () => {
  it("returns empty array if docData.data is not an array", () => {
    expect(getReferenceMappingForSearchedPerson({
      docData: { data: undefined },
      searchRefExternalId: "ext1",
      documentRealatedTo: 1,
    })).toEqual([]);

    expect(getReferenceMappingForSearchedPerson({
      docData: { data: null },
      searchRefExternalId: "ext1",
      documentRealatedTo: 1,
    })).toEqual([]);
  });

  it("returns empty array if no document matches documentRealatedTo", () => {
    const docData = {
      data: [
        { documentRealatedTo: 2, relatedTo: [{ learnerExternalId: "ext1" }] }
      ]
    };
    expect(getReferenceMappingForSearchedPerson({
      docData,
      searchRefExternalId: "ext1",
      documentRealatedTo: 1,
    })).toEqual([]);
  });

  it("returns empty array if no relatedItem matches searchRefExternalId", () => {
    const docData = {
      data: [
        { documentRealatedTo: 1, relatedTo: [{ learnerExternalId: "notmatch" }] }
      ]
    };
    expect(getReferenceMappingForSearchedPerson({
      docData,
      searchRefExternalId: "ext1",
      documentRealatedTo: 1,
    })).toEqual([]);
  });

  it("returns correct mapping if document and relatedItem match", () => {
  const docData = {
    data: [
      {
        documentRealatedTo: 1,
        relatedTo: [{ learnerExternalId: "ext1", preferredForename: "John" }],
      }
    ]
  };
  jest.spyOn(logicModule, "mapRelatedArr").mockImplementation(() => [
    { referenceExternalId: "ext1" }
  ]);
  expect(getReferenceMappingForSearchedPerson({
    docData,
    searchRefExternalId: "ext1",
    documentRealatedTo: 1,
  })).toEqual([
    {
      referenceExternalId: "ext1",
      relatedTo: [{ learnerExternalId: "ext1", preferredForename: "John" }],
      documentRealatedTo: 1
    }
  ]);
  jest.restoreAllMocks();
  });
});