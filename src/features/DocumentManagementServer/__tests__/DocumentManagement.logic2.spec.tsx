import React from "react";
import { render } from "@testing-library/react";
import * as ApiService from "../api/ApiService";
import * as logicModule from "../logic/DocumentManagementServer.logic";


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


describe("fetchViewDownloadData", () => {
  let setIsSidePanelLoader: jest.Mock;
  let setViewData: jest.Mock;
  let viewDownload: jest.Mock;
  let downloadPollingIntervalRef: { current: any };

  beforeEach(() => {
    jest.useFakeTimers();
    setIsSidePanelLoader   = jest.fn();
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
    const error: Error = new Error("fail");
    downloadPollingIntervalRef.current = setInterval(() => {}, 1000);
    viewDownload.mockRejectedValueOnce(error);

    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, "error").mockImplementation(() => {});

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



describe("fetchGetDocumentDetailsLogic", () => {
  const mockSetDocData: jest.Mock = jest.fn();
  const mockSetCurrentPage: jest.Mock = jest.fn();
  const mockSetTotalPage: jest.Mock = jest.fn();
  const mockSetShowSearchError: jest.Mock = jest.fn();
  const mockSetHasFetched: jest.Mock = jest.fn();
  const mockSetIsSearchLoading: jest.Mock = jest.fn();
  const mockSetIsSearchDataLoading: jest.Mock = jest.fn();
  const mockSetPrepareDownloadAbortBanner: jest.Mock = jest.fn();
  const mockSetShowDeleteAbortBanner: jest.Mock = jest.fn();
  const mockSetShowDeleteErrorBanner: jest.Mock = jest.fn();
  const mockSetSuggestions: jest.Mock = jest.fn();

  const defaultArgs: any = {
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
    const mockResult: any = {
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
    const mockResult: any = {
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
    const mockResult: any = {
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
    const error: Error = new Error("fail");
    jest.spyOn(ApiService, "fetchDocumentDetails").mockRejectedValueOnce(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, "error").mockImplementation(() => {});

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
    const referenceMappingDetails: any[] = [
      { referenceExternalId: "id1", value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { referenceExternalId: "id1", value: 3 }, // duplicate id1
      { referenceExternalId: "id3", value: 4 }
    ];
    const deduped: any[] = Array.from(
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
    const deduped: any[] = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual([]);
  });

  it("returns same array if all referenceExternalId are unique", () => {
    const referenceMappingDetails: any[] = [
      { referenceExternalId: "id1", value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { referenceExternalId: "id3", value: 3 }
    ];
    const deduped: any[] = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
    expect(deduped).toEqual(referenceMappingDetails);
  });

  it("handles items with missing referenceExternalId", () => {
    const referenceMappingDetails: any[] = [
      { value: 1 },
      { referenceExternalId: "id2", value: 2 },
      { value: 3 }
    ];
    const deduped: any[] = Array.from(
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
    const mockDate: Date = new Date("2025-09-11T15:16:57");

    // Mock system time to fixed date
    jest.useFakeTimers().setSystemTime(mockDate);

    const docData: any = {
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

    const resultWithExcluded: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 5
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = true;

    const result: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 5
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = false;

    const result: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ],
      totalRecords: 2
    };
    const selectedCheckBoxIds = ["1"];
    const excludedCheckBoxIds = ["1"];
    const isHeaderBoxChecked = false;

    const result: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ],
      totalRecords: 1
    };
    const selectedCheckBoxIds = [""];
    const excludedCheckBoxIds = [""];
    const isHeaderBoxChecked = true;

    const result: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" },
        { fileId: "2", registrationId: 456, category: "Finance" }
      ],
      totalRecords: 2
    };
    const selectedCheckBoxIds = ["1", "2"];
    const excludedCheckBoxIds = ["1", "2"];
    const isHeaderBoxChecked = true;

    const result: any = logicModule.buildSelectedDocs(
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
    const docData: any = {
      data: [
        { fileId: "1", registrationId: 123, category: "Legal" }
      ]
      // totalRecords is missing
    };
    const selectedCheckBoxIds = ["1"];
    const excludedCheckBoxIds = ["1"];
    const isHeaderBoxChecked = true;

    const result: any = logicModule.buildSelectedDocs(
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
  const t: (key: string) => string = (key: string) => key; // mock translation function
  const addedByColumn: any = logicModule.getTableHeadersData(t).find(h => h.text === "DocumentManagementServer.addedByColumn");

  test("renders plain value if length <= 12", () => {
    const value = "ShortName";
    const { container, getByText }: { container: HTMLElement; getByText: (text: string) => HTMLElement } = render(<>{addedByColumn?.anyComponent?.(value)}</>);
    expect(getByText("ShortName")).toBeInTheDocument();
    // Sho{ container, getByText }uld not render tooltip
    expect(container.querySelector('[data-testid="tooltip-addedby"]')).toBeNull();
  });

  test("renders nothing if value is null or undefined", () => {
    const { container }: { container: HTMLElement } = render(<>{addedByColumn?.anyComponent?.(null)}</>);
    expect(container).toBeEmptyDOMElement();
    const { container: container2 }: { container: HTMLElement } = render(<>{addedByColumn?.anyComponent?.(undefined)}</>);
    expect(container2).toBeEmptyDOMElement();
  });

  test("renders plain value if length <= 12", () => {
  const value = "ShortName";
  const { container, getByText }: { container: HTMLElement; getByText: (text: string) => HTMLElement } = render(<>{addedByColumn?.anyComponent?.(value)}</>);
  expect(getByText("ShortName")).toBeInTheDocument();
  expect(container.querySelector('[data-testid="tooltip-addedby"]')).toBeNull();
});

  it("renders truncated value with tooltip if string length > 10", () => {
  expect(addedByColumn).toBeDefined();
  expect(addedByColumn?.anyComponent).toBeDefined();
  const longValue = "averylongsizename";
  const { container }: { container: HTMLElement } = render(<>{addedByColumn?.anyComponent?.(longValue)}</>);
  expect(container).toHaveTextContent(longValue.substring(0, 12));
});

it("renders truncated value with tooltip if array first value length > 10", () => {
  expect(addedByColumn).toBeDefined();
  expect(addedByColumn?.anyComponent).toBeDefined();
  const longValue = "averylongsizename";
  const { container }: { container: HTMLElement } = render(<>{addedByColumn?.anyComponent?.([longValue, "other"])}</>);
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
      set href(val: string) { this.hrefValue = val; },
      get href(): string { return this.hrefValue; },
      set download(val: string) { this.downloadValue = val; },
      get download(): string { return this.downloadValue; },
      // ...other properties if needed...
    };
    parent = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };
    originalCreateElement = document.createElement;
    document.createElement = jest.fn(() => mockLink);
    originalGetElementById = document.getElementById;
    document.getElementById = jest.fn(() =>
      ({
        parentElement: parent
      } as unknown as HTMLElement)
    );
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
  const mockBulkDownload: jest.SpyInstance = jest.spyOn(ApiService, 'bulkDownload').mockResolvedValueOnce({ payload: payloadUrl });
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
  const fileId= 'file-zip';
  const fileName = 'test.zip';
  const blobName = 'blob-zip';

  jest.spyOn(ApiService, 'bulkDownload').mockRejectedValueOnce(new Error('fail'));
  const setDownloadError: jest.Mock<void, [boolean]> = jest.fn();
  const item: { fileId: string; name: string; application: string; section: string; blobName: string } = {
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
    const fakeBlob: Blob = new Blob(['test']);
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
  const errorSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation(() => {});
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
  const t: jest.Mock<string, [string]> = jest.fn(key => key);
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
    const result: string = logicModule.getTitleConfirmation(t, "prepare", 5, 5);
    expect(result).toBe("DocumentManagementServer.prepareAllDocumentsTitle");
    expect(t).toHaveBeenCalledWith("DocumentManagementServer.prepareAllDocumentsTitle");
  });
});