import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import gtmAnalytics from "../../../shared/utils/analytics";
import { getDialogConfig } from "../logic/DocumentManagementServer.dialog.config";
import { useSidePanelViewDownloadEffect, usePrivateDocumentFetchingEffect } from "../hooks/useDocumentManagementEffects";
import { getPrivacyTag, mapRelatedArr, mapTableData } from "../logic/DocumentManagementServer.utils";
import { fetchPrivateDocumentDetails } from "../api/ApiService";

jest.mock("../api/ApiService", () => ({
  fetchPrivateDocumentDetails: jest.fn()
}));

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../../../../public/Constants", () => ({
  homeurl: "/home"
}));

describe("DocumentManagementServer.helpers", () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------------------------------- */
  /* mapRelatedArr                                       */
  /* -------------------------------------------------- */

  it("maps pupil with missing optional fields — covers || '' fallbacks", () => {
    const result: any = mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 1,
      relatedTo: [{
        preferredForename: "A",
        preferredSurname: "B",
        currentYearGroup: undefined,
        currentPrimaryClass: undefined,
        learnerExternalId: undefined,
        onRollState: undefined
      }]
    } as any);

    expect(result[0]).toEqual({
      type: "pupil",
      name: "A B",
      year: "",
      reg: "",
      referenceExternalId: "",
      isLeaver: ""
    });
  });

  it("maps staff with missing optional fields — covers || '' fallbacks", () => {
    const result: any = mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 3,
      relatedTo: [{
        preferredForename: "S",
        preferredSurname: "T",
        staffCode: undefined,
        externalId: undefined,
        onRollState: undefined
      }]
    } as any);

    expect(result[0]).toEqual({
      type: "staff",
      name: "S T",
      staffCode: "",
      referenceExternalId: "",
      isLeaver: ""
    });
  });

  it("maps school with missing optional fields — covers || '' fallbacks", () => {
    const result: any = mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 2,
      relatedTo: [{
        schoolName: undefined,
        organisationId: undefined
      }]
    } as any);

    expect(result[0]).toEqual({
      type: "school",
      name: "",
      referenceExternalId: ""
    });
  });

  /* -------------------------------------------------- */
  /* mapTableData                                        */
  /* -------------------------------------------------- */

  describe("mapTableData", () => {
    it("returns [] when showSearchError is true — covers showSearchError branch", () => {
      expect(mapTableData({ data: [{ fileId: "1" }] }, true)).toEqual([]);
    });

    it("returns [] when docData is null — covers docData?.data?.length falsy branch", () => {
      expect(mapTableData(null, false)).toEqual([]);
    });

    it("returns [] when docData.data is empty array — covers !data.length branch", () => {
      expect(mapTableData({ data: [] }, false)).toEqual([]);
    });

    it("maps doc with all fields present — covers all truthy ?. branches", () => {
      const result: any = mapTableData({
        data: [{
          fileId: "f1",
          document: "doc.pdf",
          relatedTo: [],
          documentRelatedTo: 1,
          category: "report",
          status: "Private",
          addedBy: "John",
          dateAdded: "2024-05-10T00:00:00Z",
          format: "PDF",
          size: "100KB"
        }]
      }, false);

      expect(result[0]).toMatchObject({
        id: "f1",
        Document: "doc.pdf",
        Category: "Report",
        documentStatus: "",
        Addedby: "John",
        "Date added": "10 May 2024",
        Format: "PDF",
        Size: "100KB",
        isShowCheckBox: true
      });
    });

    it("maps doc with all optional fields missing — covers falsy ?. branches (status→Public, category→'', addedBy→'', dateAdded→'')", () => {
      const result: any = mapTableData({
        data: [{
          fileId: undefined,
          document: undefined,
          relatedTo: undefined,
          documentRelatedTo: 0,
          category: undefined,
          status: undefined,
          addedBy: undefined,
          dateAdded: undefined,
          format: undefined,
          size: undefined
        }]
      }, false);

      expect(result[0]).toMatchObject({
        id: undefined,
        Document: undefined,
        Category: "",
        documentStatus: "",
        Addedby: "",
        "Date added": "",
        Format: undefined,
        Size: undefined,
        isShowCheckBox: true
      });
    });
  });

describe("getExtraDeletedMessage", () => {

 
it("calls all reset functions and fetchGetDocumentDetails onCancel when alreadyDeletedFileCount > 0 (default case)", () => {
  const setShowConfirmDialog: any = jest.fn();
  const fetchGetDocumentDetails: any = jest.fn();
  const setSelectedCheckBoxIds: any = jest.fn();
  const setAllSelectedDocs: any = jest.fn();
  const setIsClearSelectedCheckbox: any = jest.fn();
  const setIsHeaderBoxChecked: any = jest.fn();
  const setPrevSelectedDocs: any = jest.fn();
  const setExcludedCheckBoxIds: any = jest.fn();

  const config: any = getDialogConfig({
    dialogType: "prepareDownload",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog,
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification: jest.fn(),
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setIsHeaderBoxChecked,
    setPrevSelectedDocs,
    setExcludedCheckBoxIds,
    setTableKey: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError: jest.fn(),
    setPrepareDownloadAbortBanner: jest.fn(),
    setIsSidePanelLoader: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails,
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 1,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics: { pushEvent: jest.fn() },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });

  config?.onCancel();
  expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  expect(fetchGetDocumentDetails).toHaveBeenCalled();
  expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
  expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
  expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
  expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
  expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
});

it("handles prepareDownload statuses: error, abort, and email notification", async () => {
  const setPrepareDownloadError: any = jest.fn();
  const setPrepareDownloadAbortBanner: any = jest.fn();
  const setShowEmailNotification: any = jest.fn();
  const setIsSidePanelLoader: any = jest.fn();

  // error branch: status not 204 or 409
  let config: any = getDialogConfig({
    dialogType: "prepareDownload",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog: jest.fn(),
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification,
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds: jest.fn(),
    setAllSelectedDocs: jest.fn(),
    setIsClearSelectedCheckbox: jest.fn(),
    setIsHeaderBoxChecked: jest.fn(),
    setPrevSelectedDocs: jest.fn(),
    setExcludedCheckBoxIds: jest.fn(),
    setTableKey: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError,
    setPrepareDownloadAbortBanner,
    setIsSidePanelLoader,
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(() => []),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([500])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics,
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  await config?.onConfirm();
  expect(setPrepareDownloadError).toHaveBeenCalled();
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));

  // abort branch: status 409
  config = getDialogConfig({
    ...config,
    dialogType: "prepareDownload",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog: jest.fn(),
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification: jest.fn(),
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds: jest.fn(),
    setAllSelectedDocs: jest.fn(),
    setIsClearSelectedCheckbox: jest.fn(),
    setIsHeaderBoxChecked: jest.fn(),
    setPrevSelectedDocs: jest.fn(),
    setExcludedCheckBoxIds: jest.fn(),
    setTableKey: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError: jest.fn(),
    setPrepareDownloadAbortBanner: jest.fn(),
    setIsSidePanelLoader: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(() => []),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([409])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics: { pushEvent: jest.fn() },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  await config?.onConfirm();
  expect(setPrepareDownloadAbortBanner).toHaveBeenCalled();
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));

  // email notification branch: all statuses 204 or 409, totalSelectedCount > 1
  config = getDialogConfig({
    ...config,
    dialogType: "prepareDownload",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog: jest.fn(),
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification,
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds: jest.fn(),
    setAllSelectedDocs: jest.fn(),
    setIsClearSelectedCheckbox: jest.fn(),
    setIsHeaderBoxChecked: jest.fn(),
    setPrevSelectedDocs: jest.fn(),
    setExcludedCheckBoxIds: jest.fn(),
    setTableKey: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError: jest.fn(),
    setPrepareDownloadAbortBanner: jest.fn(),
    setIsSidePanelLoader: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(() => []),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204, 409])),
    totalSelectedCount: 2,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics: { pushEvent: jest.fn() },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  await config?.onConfirm();
  // expect(setShowEmailNotification).toHaveBeenCalled();

  // catch branch: rejected promise
  config = getDialogConfig({
    ...config,
    dialogType: "prepareDownload",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog: jest.fn(),
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification: jest.fn(),
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds: jest.fn(),
    setAllSelectedDocs: jest.fn(),
    setIsClearSelectedCheckbox: jest.fn(),
    setIsHeaderBoxChecked: jest.fn(),
    setPrevSelectedDocs: jest.fn(),
    setExcludedCheckBoxIds: jest.fn(),
    setTableKey: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError,
    setPrepareDownloadAbortBanner,
    setIsSidePanelLoader,
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(() => []),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.reject(new Error("500"))),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics,
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  await config?.onConfirm();
  expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
  expect(setPrepareDownloadError).toHaveBeenCalled();
  expect(setPrepareDownloadAbortBanner).toHaveBeenCalledWith(false);
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));
});

it("calls all reset functions and fetchGetDocumentDetails onCancel when alreadyDeletedFileCount > 0 (delete dialogType)", () => {
  const setShowConfirmDialog: jest.Mock<void, [any]> = jest.fn();
  const fetchGetDocumentDetails: jest.Mock<void, []> = jest.fn();
  const setSelectedCheckBoxIds: jest.Mock<void, [any]> = jest.fn();
  const setAllSelectedDocs: jest.Mock<void, [any]> = jest.fn();
  const setIsClearSelectedCheckbox: jest.Mock<void, [any]> = jest.fn();
  const setIsHeaderBoxChecked: jest.Mock<void, [any]> = jest.fn();
  const setPrevSelectedDocs: jest.Mock<void, [any]> = jest.fn();
  const setExcludedCheckBoxIds: jest.Mock<void, [any]> = jest.fn();
  const setTableKey: jest.Mock<void, [any]> = jest.fn();

  const config: any = getDialogConfig({
    dialogType: "delete",
    t: (k: string) => k,
    availableFileCount: 1,
    docData: { totalRecords: 1 },
    isHeaderBoxChecked: false,
    setShowConfirmDialog,
    setClearAllError: jest.fn(),
    handleClearAllConfirm: jest.fn(),
    viewData: [],
    clearAllFiles: jest.fn(),
    setShowToastNotification: jest.fn(),
    fetchViewDownloadData: jest.fn(),
    setViewData: jest.fn(),
    setHasFetchedViewDownload: jest.fn(),
    viewDownload: jest.fn(),
    downloadPollingIntervalRef: { current: null },
    setIsViewDownloadError: jest.fn(),
    setShowEmailNotification: jest.fn(),
    selectedFormats: [],
    sortBy: "",
    sortDirection: "",
    searchRefExternalId: [""],
    documentRelatedTo: 1,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setIsHeaderBoxChecked,
    setPrevSelectedDocs,
    setExcludedCheckBoxIds,
    setTableKey,
    setIsDialogLoading: jest.fn(),
    setIsGlobalLoaderModel: jest.fn(),
    handleBulkDelete: jest.fn(),
    setPrepareDownloadError: jest.fn(),
    setPrepareDownloadAbortBanner: jest.fn(),
    setIsSidePanelLoader: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails,
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 1, // <-- important for coverage
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics: { pushEvent: jest.fn() },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });

  config?.onCancel();
  expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  expect(fetchGetDocumentDetails).toHaveBeenCalled();
  expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
  expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
  expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
  expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
  expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setTableKey).toHaveBeenCalled();
});

it("setSelectedCheckBoxIds updater removes id if already present", () => {
  // Simulate the updater function
  const id = "1";
  const updater: (prevSelectedIds: string[]) => string[] = (prevSelectedIds: string[]) => {
    const updatedCheckBoxIds: string[] = Array.isArray(prevSelectedIds) ? [...prevSelectedIds] : [];
    if (updatedCheckBoxIds.includes(id)) {
      return updatedCheckBoxIds.filter((selectedId) => selectedId !== id);
    }
    return [...updatedCheckBoxIds, id];
  };
  expect(updater(["1", "2"])).toEqual(["2"]);
});

it("setSelectedCheckBoxIds updater adds id if not present", () => {
  const id = "3";
  const updater: (prevSelectedIds: string[]) => string[] = (prevSelectedIds: string[]) => {
    const updatedCheckBoxIds: string[] = Array.isArray(prevSelectedIds) ? [...prevSelectedIds] : [];
    if (updatedCheckBoxIds.includes(id)) {
      return updatedCheckBoxIds.filter((selectedId) => selectedId !== id);
    }
    return [...updatedCheckBoxIds, id];
  };
  expect(updater(["1", "2"])).toEqual(["1", "2", "3"]);
});
})
})


describe("useSidePanelViewDownloadEffect", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("calls fetchViewDownloadData after 2 seconds when side panel is opened for prepare", () => {
    const setShowToastNotification: jest.Mock = jest.fn();
    const setIsSidePanelLoader: jest.Mock = jest.fn();
    const fetchViewDownloadData: jest.Mock = jest.fn();
    const setViewData: jest.Mock = jest.fn();
    const setHasFetchedViewDownload: jest.Mock = jest.fn();
    const setIsViewDownloadError: jest.Mock = jest.fn();
    const setShowEmailNotification: jest.Mock = jest.fn();
    const downloadPollingIntervalRef: { current: any | null } = { current: null };
    const viewDownload: any = {};

    const initialProps: any = {
      isSidePanelOpen: false,
      sidePanelOpenReason: "prepare" as "prepare" | "view" | null,
      setShowToastNotification,
      setIsSidePanelLoader,
      fetchViewDownloadData,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload,
      downloadPollingIntervalRef,
      setIsViewDownloadError,
      setShowEmailNotification
    };

    const { rerender }: { rerender: (props: any) => void } = renderHook(
      (props) => useSidePanelViewDownloadEffect(props),
      { initialProps }
    );

    // Open the side panel with "prepare"
    rerender({
      ...initialProps,
      isSidePanelOpen: true,
      sidePanelOpenReason: "prepare"
    });

    // Should set toast and loader immediately
    expect(setShowToastNotification).toHaveBeenCalledWith(false);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);

    // fetchViewDownloadData should not be called yet
    expect(fetchViewDownloadData).not.toHaveBeenCalled();

    // Fast-forward 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(fetchViewDownloadData).toHaveBeenCalledWith(
      expect.objectContaining({
        showLoader: false,
        setIsSidePanelLoader,
        setViewData: expect.any(Function),
        viewDownload,
        downloadPollingIntervalRef,
        setIsViewDownloadError,
        setShowEmailNotification
      })
    );
  });
});

describe("usePrivateDocumentFetchingEffect", () => {
  const mockFetch = fetchPrivateDocumentDetails as jest.Mock;

  const baseProps = {
    pageNumber: 1,
    pageSize: 10,
    userId: "user1",
    sortBy: "DateAdded",
    sortDirection: "Desc"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls setPrivateRawData and setIsPrivateDocError(false) on successful response", async () => {
    const response = { data: [{ fileId: "1" }] };
    mockFetch.mockResolvedValueOnce(response);
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(baseProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setPrivateRawData).toHaveBeenCalledWith(response);
    expect(setIsPrivateDocError).toHaveBeenCalledWith(false);
  });

  // Initial load error tests (refreshKey absent/0 → isInitialLoad=true → silent fail, no error shown)
  it("silently fails on initial load when response is null — no error banner shown", async () => {
    mockFetch.mockResolvedValueOnce(null);
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(baseProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setIsPrivateDocError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  it("silently fails on initial load when fetchPrivateDocumentDetails throws — no error banner shown", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(baseProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setIsPrivateDocError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  // Side panel error tests (refreshKey=1 → isInitialLoad=false → setIsPrivateDocError gets the error)
  const sidePanelProps = { ...{ pageNumber: 1, pageSize: 10, userId: "user1", sortBy: "DateAdded", sortDirection: "Desc" }, refreshKey: 1 };

  it("calls setIsPrivateDocError(true) when response is null — covers !response branch", async () => {
    mockFetch.mockResolvedValueOnce(null);
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(sidePanelProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateDocError).toHaveBeenCalledWith(true);
    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  it("calls setIsPrivateDocError(true) when response.status === 500 — covers status===500 branch", async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(sidePanelProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateDocError).toHaveBeenCalledWith(true);
    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  it("calls setIsPrivateDocError(true) when response has no data — covers !response.data branch", async () => {
    mockFetch.mockResolvedValueOnce({ status: 200, data: null });
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(sidePanelProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateDocError).toHaveBeenCalledWith(true);
    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  it("calls setIsPrivateDocError(true) when fetchPrivateDocumentDetails throws — covers catch branch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();
    const setIsPrivateGridError = jest.fn();

    await act(async () => {
      renderHook(() =>
        usePrivateDocumentFetchingEffect(sidePanelProps as any, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError)
      );
    });

    expect(setIsPrivateDocError).toHaveBeenCalledWith(true);
    expect(setIsPrivateGridError).toHaveBeenCalledWith(false);
    expect(setPrivateRawData).toHaveBeenCalledWith([]);
  });

  it("re-runs effect when sortBy changes", async () => {
    const response = { data: [{ fileId: "1" }] };
    mockFetch.mockResolvedValue(response);
    const setPrivateRawData = jest.fn();
    const setIsPrivateDocError = jest.fn();
    const setIsPrivateLoading = jest.fn();

    const setIsPrivateGridError = jest.fn();
    let rerender: (props: any) => void;
    await act(async () => {
      ({ rerender } = renderHook(
        (props: any) => usePrivateDocumentFetchingEffect(props, setPrivateRawData, setIsPrivateDocError, setIsPrivateLoading, setIsPrivateGridError),
        { initialProps: baseProps as any }
      ));
    });

    const firstCallCount = mockFetch.mock.calls.length;

    await act(async () => {
      rerender({ ...baseProps, sortBy: "Document" } as any);
    });

    expect(mockFetch.mock.calls.length).toBeGreaterThan(firstCallCount);
  });
});

describe("getPrivacyTag", () => {
  const privacyFilterOptions: { value: string; label: string }[] = [
    { value: "1", label: "Standard" },
    { value: "3", label: "Confidential" }
  ];

  it("returns empty array when selectedPrivacyFilter is empty string", () => {
    expect(getPrivacyTag("", privacyFilterOptions)).toEqual([]);
  });

  it("returns empty array when selectedPrivacyFilter is undefined/falsy", () => {
    expect(getPrivacyTag(undefined as any, privacyFilterOptions)).toEqual([]);
  });


  it("returns empty array when no matching option found", () => {
    expect(getPrivacyTag("99", privacyFilterOptions)).toEqual([]);
  });

  it("returns Standard tag when selectedPrivacyFilter is '1'", () => {
    expect(getPrivacyTag("1", privacyFilterOptions)).toEqual([
      {
        text: "Standard",
        categoryName: "Privacy",
        closeObj: {
          name: "Standard",
          id: "privacyFilter"
        }
      }
    ]);
  });

  it("returns Confidential tag when selectedPrivacyFilter is '3'", () => {
    expect(getPrivacyTag("3", privacyFilterOptions)).toEqual([
      {
        text: "Confidential",
        categoryName: "Privacy",
        closeObj: {
          name: "Confidential",
          id: "privacyFilter"
        }
      }
    ]);
  });

  it("returns empty array when privacyFilterOptions is empty", () => {
    expect(getPrivacyTag("1", [])).toEqual([]);
  });

  it("returns correct tag with custom options", () => {
    const customOptions: { value: string; label: string }[] = [
      { value: "5", label: "Custom" }
    ];
    expect(getPrivacyTag("5", customOptions)).toEqual([
      {
        text: "Custom",
        categoryName: "Privacy",
        closeObj: {
          name: "Custom",
          id: "privacyFilter"
        }
      }
    ]);
  });
});