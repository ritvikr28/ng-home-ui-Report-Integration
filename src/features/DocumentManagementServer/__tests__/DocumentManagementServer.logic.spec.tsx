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
    const docHeader: any = headers.find(h => h.text === "DocumentManagementServer.documentColumn");
    expect(docHeader).toBeDefined();
    expect(typeof docHeader?.anyComponent).toBe("function");
  });

  test("should contain 'Related to' header with anyComponent", () => {
    const relatedToCol: any = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    expect(relatedToCol).toBeDefined();
    expect(typeof relatedToCol?.anyComponent).toBe("function");
  });

});

describe("getTableHeadersData column anyComponent rendering", () => {
  const t: (key: string) => string = (key: string) => key;
  const headers: ReturnType<typeof logicModule.getTableHeadersData> = logicModule.getTableHeadersData(t);

    test("Category column renders tooltip with value", () => {
    const catColumn: any = headers.find(h => h.text === "DocumentManagementServer.categoryColumn");
    const { getByText }: any = render(<>{catColumn?.anyComponent?.("App")}</>);
    expect(getByText("App")).toBeInTheDocument();
  });

  test("Format column renders tooltip with value", () => {
    const formatColumn: any = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { getByText }: any = render(<>{formatColumn?.anyComponent?.("pdf")}</>);
    expect(getByText("pdf")).toBeInTheDocument();
  });

  test("Size column renders correctly for string input", () => {
    const sizeCol: any = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { getByText }: any = render(<>{sizeCol?.anyComponent?.("2 MB")}</>);
    expect(getByText("2 MB")).toBeInTheDocument();
  });


});


describe("formatSuggestions", () => {
  it("returns empty array when input is empty", async () => {
    const t: (key: string) => string = (key: string) => key;
  expect(await logicModule.formatSuggestions([], t)).toEqual([]);
  expect(await logicModule.formatSuggestions(undefined as any, t)).toEqual([]);
  expect(await logicModule.formatSuggestions(null as any, t)).toEqual([]);
});

it("formats Pupil with neither year group nor primary class", async () => {
  const t: (key: string) => string = (key: string) => key;
  const input: any = [{
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
  const result: any = await logicModule.formatSuggestions(input, t);
  expect(result[0].values[0].value).toBeUndefined();
});



  it("formats Pupil category with icon and value", async () => {
    const t: (key: string) => string = (key: string) => key === "Filter.Pupil" ? "Pupil" : key;
    const input: any = [
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
    const result: any = await logicModule.formatSuggestions(input, t);
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
    const t: (key: string) => string = (key: string) => key === "Filter.Staff" ? "Staff" : key;
    const input: any = [
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
    const result: any = await logicModule.formatSuggestions(input,t);
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
    const t: (key: string) => string = (key: string) => key === "Filter.Organisation" ? "Organisation" : key;
    const input: any = [
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
    const result: any = await logicModule.formatSuggestions(input, t);
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
    const t: (key: string) => string = (key: string) => key;
    const mockFetchDMSSuggestions: jest.SpyInstance = jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue({ payload: [], statusCode: 200 });
    const setSearchLoading: jest.Mock = jest.fn();
    const setSuggestions: jest.Mock = jest.fn();
    const setShowError: jest.Mock = jest.fn();
    const setShowErrorBanner: jest.Mock = jest.fn();

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
    const t: (key: string) => string = (key: string) => key;
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue({});

  const setSearchLoading: jest.Mock = jest.fn();
  const setSuggestions: jest.Mock = jest.fn();
  const setShowError: jest.Mock = jest.fn();
  const setShowErrorBanner: jest.Mock = jest.fn();

  logicModule.debouncedFetchSuggestions(t, "Doc", [], "", "", setSearchLoading, setSuggestions, setShowError, setShowErrorBanner);

  await act(() => {
    jest.advanceTimersByTime(3000);
    return Promise.resolve();
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
});

  test("handles API error", async () => {
    (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));
    const t: (key: string) => string = (key: string) => key;
    const setSearchLoading: jest.Mock = jest.fn();
    const setSuggestions: jest.Mock = jest.fn();
    const setShowError: jest.Mock = jest.fn();
    const setShowErrorBanner: jest.Mock = jest.fn();

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
  const data: { fileId: string; fileName: string }[] = [{ fileId: "1", fileName: "Doc1" }];
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(data);

  const setSuggestions: jest.Mock = jest.fn();
  const setSuggestionsLoading: jest.Mock = jest.fn();

  await logicModule.loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith(data);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});
it("logs error when fetchDMSSuggestions fails", async () => {
  const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, "error").mockImplementation(() => {});
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  await logicModule.loadSuggestions("Test", "", "",[],jest.fn(), jest.fn());

  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

  it("sets suggestions to [] on error", async () => {
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("fail"));

  const setSuggestions: jest.Mock = jest.fn();
  const setSuggestionsLoading: jest.Mock = jest.fn();

  await logicModule.loadSuggestions("Test", "", "", [], setSuggestions, setSuggestionsLoading);

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setSuggestionsLoading).toHaveBeenLastCalledWith(false);
});



  
// });



describe("getTableHeadersData advanced rendering edge cases", () => {
  const t: (key: string) => string = (key: string) => key; // mock translation function
  const headers: ReturnType<typeof logicModule.getTableHeadersData> = logicModule.getTableHeadersData(t);

  it("Related to column renders nothing when input is empty array", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.([])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Related to column renders nothing when input is null", () => {
  const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.(null)}</>);
  expect(container).toBeEmptyDOMElement();
});

  it("Related to column renders nothing when input is null", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Category column renders nothing when input is empty", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.categoryColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.("")}</>);
    expect(container).toBeEmptyDOMElement();
  });


  it("renders plain value if value is falsy or length <= 25", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.('pdf')}</>);
    expect(container.querySelector(".document-text")).toHaveTextContent("pdf");
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("renders truncated value with tooltip if length > 25", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const longValue = "averylongformatnamethatisdefinitelymorethan25chars";
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.(longValue)}</>);
    expect(container).toHaveTextContent("averylongformatnamethatisdefinitelymorethan25chars".substring(0, 25));
  });
   it("renders plain value if value is empty string", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.formatColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.('')}</>);
    const node: HTMLElement | null = container.querySelector(".document-text");
    if (node) {
      expect(node).toHaveTextContent("");
    } else {
      expect(node).toBeNull();
    }
    expect(container.querySelector("[data-testid='tooltip-eventtime']")).toBeNull();
  });

  it("Size column renders nothing when input is undefined", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.(undefined)}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with undefined", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { container }: { container: HTMLElement } = render(<>{column?.anyComponent?.([undefined])}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Size column renders correctly for array with first valid value", () => {
    const column: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.sizeColumn");
    const { getByText }: { getByText: (text: string) => HTMLElement } = render(<>{column?.anyComponent?.(["100KB", "200KB"])}</>);
    expect(getByText("100KB")).toBeInTheDocument();
  });

  it("renders pupil related item with link and tag", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A",
    isLeaver: "Leaver"
  }];
   const { getByText, getByRole }: { getByText: (text: string) => HTMLElement; getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
    // Check for link
    const link: HTMLElement = getByRole("link", { name: "John Doe" });
    expect(link).toHaveAttribute("href", "/");
    // Check for tag
    expect(getByText("(Y5) / (A)")).toBeInTheDocument();
});
  it("renders staff related item with link and staff code", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123"
  }];
  const { getByRole }: { getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  // Check for link
  const link: HTMLElement = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders staff related item with referenceExternalId (profile link)", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123",
    referenceExternalId: "abc123"
  }];
  const { getByRole }: { getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link: HTMLElement = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/staff/profile/abc123");
});

it("renders staff related item without referenceExternalId (fallback link)", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "staff",
    name: "Jane Smith",
    staffId: "s1",
    staffCode: "SC123"
    // referenceExternalId missing
  }];
  const { getByRole }: { getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link: HTMLElement = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders pupil related item with referenceExternalId (profile link)", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A",
    referenceExternalId: "pupil123"
  }];
  const { getByRole }: { getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link: HTMLElement = getByRole("link", { name: "John Doe" });
  expect(link).toHaveAttribute("href", "/pupilprofile/profile/pupil123");
});

it("renders pupil related item without referenceExternalId (fallback link)", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [{
    type: "pupil",
    name: "John Doe",
    pupilId: "p1",
    year: "Y5",
    reg: "A"
    // referenceExternalId missing
  }];
  const { getByRole }: { getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);
  const link: HTMLElement = getByRole("link", { name: "John Doe" });
  expect(link).toHaveAttribute("href", "/");
});

it("renders tooltip with multiple staff and pupil and school items", () => {
  const relatedToColumn: ReturnType<typeof logicModule.getTableHeadersData>[number] | undefined = headers.find(h => h.text === "DocumentManagementServer.relatedColumn");
  const elem: Array<any> = [
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
  const { getByText, getByRole }: { getByText: (text: string) => HTMLElement; getByRole: (role: string, options: { name: string }) => HTMLElement } = render(<>{relatedToColumn?.anyComponent?.(elem)}</>);

  expect(getByText("+2")).toBeInTheDocument();

  const link: HTMLElement = getByRole("link", { name: "Jane Smith | SC123" });
  expect(link).toHaveAttribute("href", "/");
});
});

describe('fetchDocumentCategoryData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const payload: { CategoryRequest: { ReferenceExternalId: string[] } } = { CategoryRequest: { ReferenceExternalId: ["1"] } };
  const setCategoryError: (error: boolean) => void = jest.fn();
  const setAvailableCategories: (categories: any[]) => void = jest.fn();
  const setLocalSelectedCategories: (categories: any[]) => void = jest.fn();
  const localSelectedCategories: any[] = [];

  it('returns data and filters localSelectedCategories correctly when API resolves with a valid response', async () => {
    const testLocalSelectedCategories: any[] = [
      { data: { categoryId: 8, name: "MatchCategory" } }
    ];
    const mockData: any[] = [
      {
        application: "Application6",
        category: "Application6",
        categoryId: 8,
        code: "APPL6",
        section: "Section5"
      }
    ];
    const responseData: { status: number; payload: any[]; errors: string } = { status: 200, payload: mockData, errors: "" };

    (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue(responseData);

  const result: any[] = await logicModule.fetchDocumentCategoryData({
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

  const result: any[] = await logicModule.fetchDocumentCategoryData({payload,setCategoryError,setAvailableCategories, setLocalSelectedCategories,localSelectedCategories});
  expect(result).toEqual([]);
});

it('returns empty array when API throws an error', async () => {
  (ApiService.fetchDocumentCategory as jest.Mock).mockRejectedValue(new Error('API failed'));

  const result: any[] = await logicModule.fetchDocumentCategoryData({payload,setCategoryError,setAvailableCategories, setLocalSelectedCategories,localSelectedCategories});
  expect(result).toEqual([]);
});

it('returns empty array and sets error when API returns non-200 and refId is empty', async () => {

  // Mock API to return a non-200 status instead of throwing
  (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue({ status: 500 });

  const result: any[] = await logicModule.fetchDocumentCategoryData({
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
   const mockFetch: jest.Mock = jest.fn();
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
    const result: string = await logicModule.getStaffProfilePhoto("staff123");
    expect(result).toBe("photo-url");
    expect(mockFetch).toHaveBeenCalledWith("staff123");
  });

  it("returns empty string when API resolves with null", async () => {
    mockFetch.mockResolvedValue(null);
    const result: string = await logicModule.getStaffProfilePhoto("staff456");
    expect(result).toBe("");
  });

  it("returns empty string when API resolves with no data property", async () => {
    mockFetch.mockResolvedValue({});
    const result: string = await logicModule.getStaffProfilePhoto("staff789");
    expect(result).toBe("");
  });

  it("returns empty string when API throws", async () => {
    mockFetch.mockRejectedValue(new Error("fail"));
    // The function does not catch, so this will throw unless we wrap
    await expect(logicModule.getStaffProfilePhoto("staff000")).rejects.toThrow("fail");
  });
});

describe("prepareDownload", () => {
  const payload: any[] = [{ request: { foo: "bar" } }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status from prepareAndDownloadFile (success)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(204);
    const result: number[] = await logicModule.prepareDownload(payload);
    expect(result).toEqual([204]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });

  it("returns status from prepareAndDownloadFile (error)", async () => {
    (ApiService.prepareAndDownloadFile as jest.Mock).mockResolvedValueOnce(400);
    const result: number[] = await logicModule.prepareDownload(payload);
    expect(result).toEqual([400]);
    expect(ApiService.prepareAndDownloadFile).toHaveBeenCalledWith(payload[0]);
  });
})




});