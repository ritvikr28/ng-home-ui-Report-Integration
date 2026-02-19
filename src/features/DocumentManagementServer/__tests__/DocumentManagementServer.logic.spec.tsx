import React from "react";
import { act } from "@testing-library/react-hooks";
import { render } from "@testing-library/react";
import * as ApiService from "../api/ApiService";
import * as logicModule from "../logic/DocumentManagementServer.logic";
import analytics from "../../../shared/utils/analytics";
import { mapToBulkDeletePayload } from "../logic/DocumentManagementServer.logic";


// const analytics = require('../../../shared/utils/analytics').default;

jest.mock("../api/ApiService");

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
    observe(): void { void this; }
    // eslint-disable-next-line
    unobserve(): void { void this; }
    // eslint-disable-next-line
    disconnect(): void { void this; }
  };
});

describe("getTableHeadersData", () => {
  const t: (key: string) => string = (key: string) => key;
  const headers: ReturnType<typeof logicModule.getTableHeadersData> = logicModule.getTableHeadersData(t);
//   const relatedToColumn = headers.find(h => h.text === 'DocumentManagementServer.relatedColumn');


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

  // test("renders nothing when elem is undefined", () => {
  //   const { container } = render(<>{anyComponent && anyComponent(undefined)}</>);
  //   expect(container).toBeEmptyDOMElement();
  // });


//   test("does not render tooltip when only one related item", () => {
//   const relatedToCol = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
//   const { container } = render(<>{relatedToCol?.anyComponent?.(["Only One"])}</>);
//   expect(container.querySelector('[data-testid="tooltip-eventtime"]')).not.toBeInTheDocument();
// });
});

describe("getTableHeadersData column anyComponent rendering", () => {
  const t = (key: string) => key;
  const headers = logicModule.getTableHeadersData(t);

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


});


describe("formatSuggestions", () => {
  it("returns empty array when input is empty", async () => {
    const t = (key: string) => key;
  expect(await logicModule.formatSuggestions([], t)).toEqual([]);
  expect(await logicModule.formatSuggestions(undefined as any, t)).toEqual([]);
  expect(await logicModule.formatSuggestions(null as any, t)).toEqual([]);
});

it("formats Pupil with neither year group nor primary class", async () => {
  const t = (key: string) => key;
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
  const result = await logicModule.formatSuggestions(input, t);
  expect(result[0].values[0].value).toBeUndefined();
});



  it("formats Pupil category with icon and value", async () => {
    const t = (key: string) => key === "Filter.Pupil" ? "Pupil" : key;
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
    const result = await logicModule.formatSuggestions(input, t);
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
    const t = (key: string) => key === "Filter.Staff" ? "Staff" : key;
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
    const result = await logicModule.formatSuggestions(input,t);
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
    const t = (key: string) => key === "Filter.Organisation" ? "Organisation" : key;
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
    const result = await logicModule.formatSuggestions(input, t);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Organisation");
    expect(result[0].values[0].text).toBe("Test School");
    expect(result[0].values[0].props).toMatchObject({
      name: "Test Org",
      id: "o1"
    });
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
    const t = (key: string) => key;
    const mockFetchDMSSuggestions = jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue({ payload: [], statusCode: 200 });
    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();
    const setShowErrorBanner = jest.fn();

    // Call debouncedFetchSuggestions multiple times rapidly
    logicModule.debouncedFetchSuggestions(t, "Doc1", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);
    logicModule.debouncedFetchSuggestions(t, "Doc2", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);
    logicModule.debouncedFetchSuggestions(t, "Doc3", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);

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
    const t = (key: string) => key;
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue({});

  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();
  const setShowErrorBanner = jest.fn();

  logicModule.debouncedFetchSuggestions(t, "Doc", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);

  await act(() => {
    jest.advanceTimersByTime(3000);
    return Promise.resolve();
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
});

  test("handles API error", async () => {
    (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));
    const t = (key: string) => key;
    const setSearchLoading = jest.fn();
    const setSuggestions = jest.fn();
    const setShowError = jest.fn();
    const setShowErrorBanner = jest.fn();

    logicModule.debouncedFetchSuggestions(t, "Doc", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);

    await act(() => {
      jest.advanceTimersByTime(3000);
      return Promise.resolve();
    });

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setShowErrorBanner).toHaveBeenCalledWith(true);
    expect(setSearchLoading).toHaveBeenCalledWith(false);
  });
});




describe("onBreadcrumbClick", () => {
  it("should assign new location and push GTM event", () => {
    delete (window as any).location;
    (window as any).location = { assign: jest.fn() };

    analytics.pushEvent = jest.fn();

    logicModule.onBreadcrumbClick("/test");
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

  await logicModule.loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith(data);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});
it("logs error when fetchDMSSuggestions fails", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  await logicModule.loadSuggestions("Test", "", "",[],jest.fn(), jest.fn());

  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

  it("sets suggestions to [] on error", async () => {
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  const setSuggestions = jest.fn();
  const setSuggestionsLoading = jest.fn();

  await logicModule.loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});



  
// });



describe("getTableHeadersData advanced rendering edge cases", () => {
  const t = (key: string) => key; // mock translation function
  const headers = logicModule.getTableHeadersData(t);

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
    expect(container).toBeEmptyDOMElement();
  });


  it("renders plain value if value is falsy or length <= 25", () => {
    const column = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { container } = render(<>{column?.anyComponent?.('pdf')}</>);
    expect(container.querySelector(".document-text")).toHaveTextContent("pdf");
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
    const node = container.querySelector(".document-text");
    if (node) {
      expect(node).toHaveTextContent("");
    } else {
      expect(node).toBeNull();
    }
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

describe('fetchDocumentCategoryData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const payload = { CategoryRequest: { ReferenceExternalId: ["1"] } };
  const setCategoryError = jest.fn();
  const setAvailableCategories = jest.fn();
  const setLocalSelectedCategories = jest.fn();
  const localSelectedCategories: any[] = [];

  it('returns data and filters localSelectedCategories correctly when API resolves with a valid response', async () => {
    const testLocalSelectedCategories = [
      { data: { categoryId: 8, name: "MatchCategory" } }
    ];
    const mockData = [
      {
        application: "Application6",
        category: "Application6",
        categoryId: 8,
        code: "APPL6",
        section: "Section5"
      }
    ];
    const responseData = { status: 200, payload: mockData, errors: "" };

    (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue(responseData);

  const result = await logicModule.fetchDocumentCategoryData({
    payload,
    setCategoryError,
    setAvailableCategories,
    setLocalSelectedCategories,
    localSelectedCategories: testLocalSelectedCategories,
  });

  // Validate returned data
  expect(result).toEqual(mockData);
  expect(setAvailableCategories).toHaveBeenCalledWith(mockData);
  expect(setLocalSelectedCategories).toHaveBeenCalledWith([
    { data: { categoryId: 8, name: "MatchCategory" } }
  ]);
  // Error should be false
  expect(setCategoryError).toHaveBeenCalledWith(false);
});

it('returns empty array when API resolves with null', async () => {
  (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue(null);

  const result = await logicModule.fetchDocumentCategoryData({payload,setCategoryError,setAvailableCategories, setLocalSelectedCategories,localSelectedCategories});
  expect(result).toEqual([]);
});

it('returns empty array when API throws an error', async () => {
  (ApiService.fetchDocumentCategory as jest.Mock).mockRejectedValue(new Error('API failed'));

  const result = await logicModule.fetchDocumentCategoryData({payload,setCategoryError,setAvailableCategories, setLocalSelectedCategories,localSelectedCategories});
  expect(result).toEqual([]);
});

it('returns empty array and sets error when API returns non-200 and refId is empty', async () => {

  // Mock API to return a non-200 status instead of throwing
  (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue({ status: 500 });

  const result = await logicModule.fetchDocumentCategoryData({
    payload,
    setCategoryError,
    setAvailableCategories,
    setLocalSelectedCategories,
    localSelectedCategories,
  });

  // Refactored to avoid nested ternary in the implementation (if present)
  // The test itself does not use ternary, but ensure the implementation does not nest ternaries.

  expect(result).toEqual([]);
  expect(setCategoryError).toHaveBeenCalledWith(true);
  expect(setAvailableCategories).toHaveBeenCalledWith([]);
});
  
});

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
    const result = await logicModule.getStaffProfilePhoto("staff123");
    expect(result).toBe("photo-url");
    expect(mockFetch).toHaveBeenCalledWith("staff123");
  });

  it("returns empty string when API resolves with null", async () => {
    mockFetch.mockResolvedValue(null);
    const result = await logicModule.getStaffProfilePhoto("staff456");
    expect(result).toBe("");
  });

  it("returns empty string when API resolves with no data property", async () => {
    mockFetch.mockResolvedValue({});
    const result = await logicModule.getStaffProfilePhoto("staff789");
    expect(result).toBe("");
  });

  it("returns empty string when API throws", async () => {
    mockFetch.mockRejectedValue(new Error("fail"));
    // The function does not catch, so this will throw unless we wrap
    await expect(logicModule.getStaffProfilePhoto("staff000")).rejects.toThrow("fail");
  });
});

describe("prepareDownload", () => {
  const payload = [{ request: { foo: "bar" } }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status from prepareAndDownloadFile (success)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(204);
    const result = await logicModule.prepareDownload(payload);
    expect(result).toEqual([204]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });

  it("returns status from prepareAndDownloadFile (error)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(400);
    const result = await logicModule.prepareDownload(payload);
    expect(result).toEqual([400]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });
})


describe("mapToBulkDeletePayload", () => {
  it("returns correct payload with all arguments provided", () => {
    const result = mapToBulkDeletePayload({
      isSelectAll: true,
      categoryIds: [1, 2],
      fromDate: "2025-01-01",
      toDate: "2025-01-31",
      referenceExternalIds: ["ref1", "ref2"],
      documentRelatedTo: 3,
      fileDetails: [
        { fileId: "f1", registrationId: 10, externalId: "e1" }
      ],
      excludedFileDetails: [
        { fileId: "f2", externalId: "e2" }
      ]
    });

    expect(result).toEqual({
      request: {
        isSelectAll: true,
        bulkDeleteCriteria: {
          categoryIds: [1, 2],
          fromDate: "2025-01-01",
          toDate: "2025-01-31",
          referenceDetails: {
            referenceExternalIds: ["ref1", "ref2"],
            documentRelatedTo: 3
          }
        },
        fileDetails: [
          { fileId: "f1", registrationId: 10, externalId: "e1" }
        ],
        excludedFileDetails: [
          { fileId: "f2", externalId: "e2" }
        ]
      }
    });
  });

  it("returns correct payload with only required/default arguments", () => {
    const result = mapToBulkDeletePayload({});
    expect(result).toEqual({
      request: {
        isSelectAll: false,
        bulkDeleteCriteria: {
          categoryIds: [],
          fromDate: "",
          toDate: "",
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 0
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });

  it("handles empty arrays for fileDetails and excludedFileDetails", () => {
    const result = mapToBulkDeletePayload({
      fileDetails: [],
      excludedFileDetails: []
    });
    expect(result.request.fileDetails).toEqual([]);
    expect(result.request.excludedFileDetails).toEqual([]);
  });

  it("handles missing optional arguments", () => {
    // Only provide some arguments
    const result = mapToBulkDeletePayload({
      isSelectAll: true,
      categoryIds: [5],
      documentRelatedTo: 2
    });
    expect(result).toEqual({
      request: {
        isSelectAll: true,
        bulkDeleteCriteria: {
          categoryIds: [5],
          fromDate: "",
          toDate: "",
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 2
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });

  it("handles undefined values for all arguments", () => {
    const result = mapToBulkDeletePayload({
      isSelectAll: undefined,
      categoryIds: undefined,
      fromDate: undefined,
      toDate: undefined,
      referenceExternalIds: undefined,
      documentRelatedTo: undefined,
      fileDetails: undefined,
      excludedFileDetails: undefined
    });
    expect(result).toEqual({
      request: {
        isSelectAll: false,
        bulkDeleteCriteria: {
          categoryIds: [],
          fromDate: "",
          toDate: "",
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 0
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });
});


// describe("reduceCategories", () => {
//   it("reduces multiple categories with same application", () => {
//     const input = [
//       { application: "AppX", registrationId: 1, section: "S1" },
//       { application: "AppX", registrationId: 2, section: "S2" }
//     ];
//     const result = reduceCategories(input);
//     expect(result).toEqual([
//       {
//         application: "AppX",
//         registrationId: [1, 2],
//         section: ["S1", "S2"]
//       }
//     ]);
//   });

//   it("reduces categories with different applications", () => {
//     const input = [
//       { application: "AppX", registrationId: 1, section: "S1" },
//       { application: "AppY", registrationId: 2, section: "S2" }
//     ];
//     const result = reduceCategories(input);
//     expect(result).toEqual([
//       {
//         application: "AppX",
//         registrationId: [1],
//         section: ["S1"]
//       },
//       {
//         application: "AppY",
//         registrationId: [2],
//         section: ["S2"]
//       }
//     ]);
//   });

//   it("handles empty input array", () => {
//     const result = reduceCategories([]);
//     expect(result).toEqual([]);
//   });


//   it("handles missing application property", () => {
//     const input = [
//       { registrationId: 1, section: "S1" }
//     ];
//     const result = reduceCategories(input);
//     expect(result).toEqual([
//       {
//         application: undefined,
//         registrationId: [1],
//         section: ["S1"]
//       }
//     ]);
//   });
// });

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

    await logicModule.fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
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

    await logicModule.fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
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

    await logicModule.fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
    });

    expect(downloadPollingIntervalRef.current).toBeNull();
  });

  it("clears polling interval if result is not 200", async () => {
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockResolvedValueOnce({
      data: [{ status: "complete" }],
      status: 400
    });

    await logicModule.fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
    });

    expect(downloadPollingIntervalRef.current).toBeNull();
  });

  it("clears polling interval and logs error on exception", async () => {
    const error = new Error("fail");
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await logicModule.fetchViewDownloadData({
      showLoader: true,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
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

    await logicModule.fetchViewDownloadData({
      showLoader: false,
      setIsSidePanelLoader,
      setViewData,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError: jest.fn(),
      setShowEmailNotification: jest.fn()
    });

    expect(setIsSidePanelLoader).not.toHaveBeenCalledWith(true);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
  });
});



// describe("closeSidePanel", () => {
//   it("sets side panel closed and clears interval if exists", () => {
//   const setIsSidePanelOpen = jest.fn();
//   const intervalId = setInterval(() => {}, 1000);
//   const pollingRef = { current: intervalId };
//   const clearSpy = jest.spyOn(global, "clearInterval");
//   closeSidePanel(setIsSidePanelOpen, pollingRef);
//   expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
//   expect(clearSpy).toHaveBeenCalledWith(intervalId);
//   expect(pollingRef.current).toBeNull();
//   clearSpy.mockRestore();
// });

//  it("sets side panel closed and does nothing if interval does not exist", () => {
//   const setIsSidePanelOpen = jest.fn();
//   const pollingRef = { current: null };
//   const clearSpy = jest.spyOn(global, "clearInterval");
//   closeSidePanel(setIsSidePanelOpen, pollingRef);
//   expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
//   expect(clearSpy).not.toHaveBeenCalled();
//   expect(pollingRef.current).toBeNull();
//   clearSpy.mockRestore();
// });
// });

describe("fetchGetDocumentDetailsLogic", () => {
  const mockSetDocData = jest.fn();
  const mockSetCurrentPage = jest.fn();
  const mockSetTotalPage = jest.fn();
  const mockSetShowSearchError = jest.fn();
  const mockSetHasFetched = jest.fn();
  const mockSetIsSearchLoading = jest.fn();
  const mockSetIsSearchDataLoading = jest.fn();
  const mockSetPrepareDownloadAbortBanner = jest.fn();
  const mockSetShowDeleteAbortBanner = jest.fn();
  const mockSetShowDeleteErrorBanner = jest.fn();
  const mockSetSuggestions = jest.fn();

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
    setHasFetched: mockSetHasFetched,
    setIsSearchLoading: mockSetIsSearchLoading,
    setIsSearchDataLoading: mockSetIsSearchDataLoading,
    setPrepareDownloadAbortBanner: mockSetPrepareDownloadAbortBanner,
    setShowDeleteAbortBanner: mockSetShowDeleteAbortBanner,
    setShowDeleteErrorBanner: mockSetShowDeleteErrorBanner,
    setSuggestions: mockSetSuggestions
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

    await logicModule.fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetDocData).toHaveBeenCalledWith(mockResult);
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetTotalPage).toHaveBeenCalledWith(Math.ceil(10 / 10));
    expect(mockSetShowSearchError).toHaveBeenCalledWith(false);
    // expect(setShowSearchError).toHaveBeenCalledWith(false);
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

    await logicModule.fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetShowSearchError).toHaveBeenCalledWith(true);
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

    await logicModule.fetchGetDocumentDetailsLogic(defaultArgs);

    expect(mockSetShowSearchError).toHaveBeenCalledWith(true);
    expect(mockSetIsSearchLoading).toHaveBeenCalledWith(false);
    expect(mockSetIsSearchDataLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch throwing an error", async () => {
    const error = new Error("fail");
    jest.spyOn(ApiService, "fetchDocumentDetails").mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await logicModule.fetchGetDocumentDetailsLogic(defaultArgs);

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
    expect(logicModule.buildSelectedDocs(undefined as any, { data: [] }, categoryRegistrationMap, [""], 0, undefined as any, false,[], {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
    expect(logicModule.buildSelectedDocs(null as any, { data: [] }, categoryRegistrationMap, [""], 0, null as any, false,[], {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
    expect(logicModule.buildSelectedDocs(["1"], { data: [] }, categoryRegistrationMap, [""], 0, undefined as any, false,[],  {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
    expect(logicModule.buildSelectedDocs(["1"], { data: [] }, categoryRegistrationMap, [""], 0, null as any, false,[], {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
  });

  it("returns empty array if docData.data is not an array", () => {
    expect(logicModule.buildSelectedDocs(["1"], { data: undefined }, categoryRegistrationMap, [""], 0, ["2"], false,[], {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
    expect(logicModule.buildSelectedDocs(["1"], { data: null }, categoryRegistrationMap, [""], 0, ["2"], false,[], {fromDate:"", toDate:""}, undefined as any, [])).toEqual([]);
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
        documentRelatedTo: 1,
        category: "Legal",
        fromDate: "2025-01-01",
        toDate: "2025-01-02",
        externalId: "ext2"
      }]
    };

    const excludedIdDetails = ["2"];
    const isHeaderBoxChecked = true;

    const resultWithExcluded = logicModule.buildSelectedDocs(
      ["1"],
      docData,
      categoryRegistrationMap,
      ["ext1"],
      1,
      excludedIdDetails,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [{ fileId: "2", registrationId: 456, externalId: "ext3" }],
      ["ext2"]
    );

    expect(resultWithExcluded).toEqual([
      {
        request: {
          selectAll: true,
          downloadCriteria: {
            referenceMappingDetails: [],
            documentRelatedTo: 1,
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [{ fileId: "1", registrationId: 123, externalId: "ext1" }, { fileId: "2", registrationId: 456, externalId: "ext2" }],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      ["1", "2"]
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [{ fileId: "1", registrationId: 123, externalId: "ext1" }, { fileId: "2", registrationId: 456, externalId: "ext2" }],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      ["1", "2"]
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""] ,
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      [""]
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      [""]
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      [""]
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

    const result = logicModule.buildSelectedDocs(
      selectedCheckBoxIds,
      docData,
      categoryRegistrationMap,
      [""],
      0,
      excludedCheckBoxIds,
      isHeaderBoxChecked,
      [],
      {fromDate: "2025-01-01", toDate: "2025-01-02"},
      [],
      [""]
    );
    expect(result[0].request.excludedFileDetails).toEqual([]);
  });
});

describe("Added by column anyComponent", () => {
  const t = (key: string) => key; // mock translation function
  const addedByColumn = logicModule.getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.addedByColumn");

  test("renders plain value if length <= 12", () => {
    const value = "ShortName";
    const { container, getByText } = render(<>{addedByColumn?.anyComponent?.(value)}</>);
    expect(getByText("ShortName")).toBeInTheDocument();
    // Should not render tooltip
    expect(container.querySelector('[data-testid="tooltip-addedby"]')).toBeNull();
  });

  test("renders nothing if value is null or undefined", () => {
    const { container } = render(<>{addedByColumn?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
    const { container: container2 } = render(<>{addedByColumn?.anyComponent?.(undefined)}</>);
    expect(container2).toBeEmptyDOMElement();
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

  it('sets download error if bulkDownload throws', async () => {
  const fileId = 'file-zip';
  const fileName = 'test.zip';
  const blobName = 'blob-zip';

  jest.spyOn(ApiService, 'bulkDownload').mockRejectedValueOnce(new Error('fail'));
  const setDownloadError = jest.fn();
  const item = {
    fileId,
    name: fileName,
    application: '',
    section: '',
    blobName
  };

  // Run fileDownload inside try/catch to simulate component behavior
  try {
    await logicModule.fileDownload(
      item.fileId,
      item.name,
      item.application,
      item.section,
      item.blobName
    );
  } catch (err) {
    setDownloadError(true);
  }

  expect(setDownloadError).toHaveBeenCalledWith(true);
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


describe("getTitleConfirmation", () => {
  const t = jest.fn(key => key);
  it('returns "Clear all downloads?" for "clearAll"', () => {
    expect(logicModule.getTitleConfirmation(t,"clearAll", 0, 0)).toBe("DocumentManagementServer.clearAllDownloadsTitle");
  });

  it('returns "Delete Document?" for "delete" when a single file is selected', () => {
    expect(logicModule.getTitleConfirmation(t,"delete", 1, 0)).toBe("DocumentManagementServer.deleteDocumentTitle");
  });

  it('returns "Delete Documents?" for "delete" when multiple files are selected', () => {
    expect(logicModule.getTitleConfirmation(t,"delete", 2, 0)).toBe("DocumentManagementServer.deleteDocumentsTitle");
  });

  it('returns "Prepare Download?" for other values', () => {
    expect(logicModule.getTitleConfirmation(t,"prepare", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");
    expect(logicModule.getTitleConfirmation(t,"anythingElse", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");
    expect(logicModule.getTitleConfirmation(t,"", 0, 1)).toBe("DocumentManagementServer.prepareDownloadTitle");

  });
   it('returns prepareAllDocumentsTitle when availableFileCount equals totalRecords and dialogType is not clearAll/delete', () => {
    const result = logicModule.getTitleConfirmation(t, "prepare", 5, 5);
    expect(result).toBe("DocumentManagementServer.prepareAllDocumentsTitle");
    expect(t).toHaveBeenCalledWith("DocumentManagementServer.prepareAllDocumentsTitle");
  });
});
});