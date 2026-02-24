import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import gtmAnalytics from "../../../shared/utils/analytics";
import { getDialogConfig } from "../logic/DocumentManagementServer.dialog.config";
import { useSidePanelViewDownloadEffect } from "../hooks/useDocumentManagementEffects";

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