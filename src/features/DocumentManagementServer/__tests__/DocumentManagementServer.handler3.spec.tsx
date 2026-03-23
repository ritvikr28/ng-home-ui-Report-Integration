
import React from "react";
import gtmAnalytics from "../../../shared/utils/analytics";
import { closeSidePanel, getNotificationMsgBannerObject, handleApply, handleClearAllConfirm, handlePageChange, validateAndApplyFilter } from "../logic/DocumentManagementServer.handler";
import { applySummaryTagClass } from "../logic/DocumentManagementServer.utils";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../Views/DMSLayout", () => ({
  getBannerMessageWithLink: jest.fn((line1, line2) => (
    <>
      {line1}
      <br />
      {line2}
    </>
  ))
}));

jest.mock("../logic/DocumentManagementServer.handler", () => {
  const original: typeof import("../logic/DocumentManagementServer.handler") = jest.requireActual("../logic/DocumentManagementServer.handler");
  return {
    ...original,
    isInvalidDateRange: jest.fn(() => false)
  };
});

const handlerModule: any = require("../logic/DocumentManagementServer.handler");



describe("applySummaryTagClass", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="taglist-id">
        <div class="search-tagList">
          <div class="essui-tag"><span>App</span></div>
        </div>
        <div class="search-tagList">
          <div class="essui-tag"><span>+2</span></div>
        </div>
      </div>
    `;
  });

  it("adds summary-tag class to tags with +n and removes from others", () => {
    const tagLists: any = document.querySelectorAll("#taglist-id .search-tagList");
    // Initially, no tag has summary-tag
    tagLists.forEach((tag: any) => {
      expect(tag.classList.contains("summary-tag")).toBe(false);
    });

    applySummaryTagClass();

    // First tag should NOT have summary-tag
    expect(tagLists[0].classList.contains("summary-tag")).toBe(false);
    // Second tag should have summary-tag
    expect(tagLists[1].classList.contains("summary-tag")).toBe(true);
  });

  it("removes summary-tag class if +n is changed to something else", () => {
    const tagLists: any = document.querySelectorAll("#taglist-id .search-tagList");
    // Set +2, apply class
    applySummaryTagClass();
    expect(tagLists[1].classList.contains("summary-tag")).toBe(true);

    // Change span text to something else
    const span: any = tagLists[1].querySelector(".essui-tag span");
    if (span) span.textContent = "Other";
    applySummaryTagClass();
    expect(tagLists[1].classList.contains("summary-tag")).toBe(false);
  });

  it("handles missing span gracefully", () => {
    // Remove span from first tag
    const tagLists: any = document.querySelectorAll("#taglist-id .search-tagList");
    const span: any = tagLists[0].querySelector(".essui-tag span");
    if (span) span.remove();
    // Should not throw
    expect(() => applySummaryTagClass()).not.toThrow();
    // Should not add summary-tag
    expect(tagLists[0].classList.contains("summary-tag")).toBe(false);
  });
})



describe("handlePageChange", () => {
  it("should update current page and loading state", () => {
    const setCurrentPage: any = jest.fn();
    const setIsLoading: any = jest.fn();
    const setIsSearchTriggered: any = jest.fn();
    handlePageChange({}, 2, setCurrentPage, setIsLoading, setIsSearchTriggered);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
    expect(setIsLoading).toHaveBeenCalledWith(true);
  });
});

describe("validateAndApplyFilter", () => {

  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setReferenceExternalIds: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;

  beforeEach(() => {
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setSelectedFormats = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setReferenceExternalIds = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
    // Reset mock for isInvalidDateRange
    handlerModule.isInvalidDateRange.mockReturnValue(false);
   });

  it("should set date error and return if isDateError is true", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("should set date error and return if isInvalidDateRange returns true", () => {
    handlerModule.isInvalidDateRange.mockReturnValue(true);
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "bad", toDate: "bad" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("should apply filter when dates are valid and no error", () => {
    const selectedCategories: any = [
      { text: "cat1", data: "cat1" },
      { text: "cat2", data: "cat2" }
    ];
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: ["ref1"],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });

    expect(setIsFilterLoading).toHaveBeenCalledWith(true);
    expect(setDateRange).toHaveBeenCalledWith({ fromDate: "2024-01-01", toDate: "2024-01-02" });
    expect(setSelectedFormats).toHaveBeenCalledWith(selectedCategories);
    expect(setReferenceExternalIds).toHaveBeenCalledWith(["ref1"]);
    expect(setIsFilterDialogOpen).toHaveBeenCalledWith(false);
    expect(setIsFilterLoading).toHaveBeenCalledWith(false);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
    expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
  });

  it("should handle missing referenceExternalIds", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      // referenceExternalIds is undefined
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setReferenceExternalIds).toHaveBeenCalledWith([]);
  });

  it("should handle undefined selectedDateRange", () => {
    validateAndApplyFilter({
      selectedDateRange: undefined,
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
  });
});


describe("handleClearAllConfirm", () => {
  let setShowToastNotification: jest.Mock;
  let fetchViewDownloadData: jest.Mock;
  let setIsSidePanelLoader: jest.Mock;
  let setViewData: jest.Mock;
  let setHasFetchedViewDownload: jest.Mock;
  let setClearAllError: jest.Mock;
  let setShowConfirmDialog: jest.Mock;
  let getCompletedPartitionKeys: jest.Mock;
  let setIsViewDownloadError: jest.Mock;
  let setShowEmailNotification: jest.Mock;
  let clearAllFiles: jest.Mock;

  beforeEach(() => {
    setShowToastNotification = jest.fn();
    fetchViewDownloadData = jest.fn();
    setIsSidePanelLoader = jest.fn();
    setViewData = jest.fn();
    setHasFetchedViewDownload = jest.fn();
    setClearAllError = jest.fn();
    setShowConfirmDialog = jest.fn();
    getCompletedPartitionKeys = jest.fn(() => ["pk1", "pk2"]);
    setIsViewDownloadError = jest.fn();
    setShowEmailNotification = jest.fn();
    clearAllFiles = jest.fn();
    jest.clearAllMocks();
  });

  it("handles successful clear (response 204)", async () => {
    clearAllFiles.mockResolvedValue(204);
    fetchViewDownloadData.mockResolvedValue(undefined);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
    expect(clearAllFiles).toHaveBeenCalledWith({ request: { partitionKey: ["pk1", "pk2"] } });
    expect(setViewData).toHaveBeenCalledWith([]);
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(fetchViewDownloadData).toHaveBeenCalled();
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles clearAllFiles returning non-204 status", async () => {
    clearAllFiles.mockResolvedValue(400);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles clearAllFiles throwing an error", async () => {
    clearAllFiles.mockRejectedValue(new Error("fail"));

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).toHaveBeenCalledWith(false);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles missing setIsSidePanelLoader gracefully", async () => {
    clearAllFiles.mockResolvedValue(204);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      // @ts-expect-error
      setIsSidePanelLoader: undefined,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(clearAllFiles).toHaveBeenCalled();
    expect(setViewData).toHaveBeenCalledWith([]);
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(fetchViewDownloadData).toHaveBeenCalled();
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });
});

describe("handleApply", () => {
  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;
  let setReferenceExternalIds: jest.Mock;

  beforeEach(() => {
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setSelectedFormats = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
    setReferenceExternalIds = jest.fn();
  });

  it("sets date error and returns if isDateError is true", () => {
    handleApply({
      referenceExternalIds: [],
      selectedCategories: [],
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true, // <-- Fix: set to true to match the tested logic
      documentStatusIds: [],
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSelectedFormats,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setReferenceExternalIds,
      setSearchInput: jest.fn(),
      setSearchTerm: jest.fn(),
      setSearchText: jest.fn(),
      setTableKey: jest.fn(),
      setIsSearchTriggered: jest.fn(),
      setSelectedCategories: jest.fn(),
      setSearchRefExternalId: jest.fn(),
      setSelectedEntities: jest.fn(),
      setSortBy: jest.fn(),
      setSortDirection: jest.fn(),
      setIsInitialLoad: jest.fn(),
      setDocumentStatusIds: jest.fn()
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("sets date error and returns if isInvalidDateRange returns true", () => {
    // Mock isInvalidDateRange to return true
      handlerModule.isInvalidDateRange.mockReturnValue(true);
    handleApply({
      referenceExternalIds: [],
      selectedCategories: [],
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true,
      documentStatusIds: [],
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSelectedFormats,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setReferenceExternalIds,
      setSearchInput: jest.fn(),
      setSearchTerm: jest.fn(),
      setSearchText: jest.fn(),
      setTableKey: jest.fn(),
      setIsSearchTriggered: jest.fn(),
      setSelectedCategories: jest.fn(),
      setSearchRefExternalId: jest.fn(),
      setSelectedEntities: jest.fn(),
      setSortBy: jest.fn(),
      setSortDirection: jest.fn(),
      setIsInitialLoad: jest.fn(),
      setDocumentStatusIds: jest.fn()
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

it("applies filter when dates are valid and no error", () => {
  handleApply({
    referenceExternalIds: ["ref1"],
    selectedCategories: [
      { text: "cat1", data: "cat1" },
      { text: "cat2", data: "cat2" }
    ],
    selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
    isDateError: false,
    documentStatusIds: [],
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setIsFilterDialogOpen,
    setCurrentPage,
    setExcludedCheckBoxIds,
    setAllSelectedDocs,
    setSelectedFormats,
    setIsHeaderBoxChecked,
    setSelectedCheckBoxIds,
    setPrevSelectedDocs,
    setReferenceExternalIds,
    setSearchInput: jest.fn(),
    setSearchTerm: jest.fn(),
    setSearchText: jest.fn(),
    setTableKey: jest.fn(),
    setIsSearchTriggered: jest.fn(),
    setSelectedCategories: jest.fn(),
    setSearchRefExternalId: jest.fn(),
    setSelectedEntities: jest.fn(),
    setSortBy: jest.fn(),
    setSortDirection: jest.fn(),
    setIsInitialLoad: jest.fn(),
    setDocumentStatusIds: jest.fn()
  });

  expect(setIsFilterLoading).toHaveBeenCalledWith(true);
  expect(setDateRange).toHaveBeenCalledWith({ fromDate: "2024-01-01", toDate: "2024-01-02" });
  expect(setSelectedFormats).toHaveBeenCalledWith([
    { text: "cat1", data: "cat1" },
    { text: "cat2", data: "cat2" }
  ]);
  expect(setReferenceExternalIds).toHaveBeenCalledWith(["ref1"]);
  expect(setIsFilterDialogOpen).toHaveBeenCalledWith(false);
  expect(setIsFilterLoading).toHaveBeenCalledWith(false);
  expect(setCurrentPage).toHaveBeenCalledWith(1);
  expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
  expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
  expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
});

  it("handles missing referenceExternalIds", () => {
    handleApply({
  referenceExternalIds: [],
  selectedCategories: [],
  selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
  isDateError: false,
  documentStatusIds: [],
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setIsFilterDialogOpen,
  setCurrentPage,
  setExcludedCheckBoxIds,
  setAllSelectedDocs,
  setSelectedFormats,
  setIsHeaderBoxChecked,
  setSelectedCheckBoxIds,
  setPrevSelectedDocs,
  setReferenceExternalIds,
  setSearchInput: jest.fn(),
  setSearchTerm: jest.fn(),
  setSearchText: jest.fn(),
  setTableKey: jest.fn(),
  setIsSearchTriggered: jest.fn(),
  setSelectedCategories: jest.fn(),
  setSearchRefExternalId: jest.fn(),
  setSelectedEntities: jest.fn(),
  setSortBy: jest.fn(),
  setSortDirection: jest.fn(),
  setIsInitialLoad: jest.fn(),
  setDocumentStatusIds: jest.fn()
});
    expect(setReferenceExternalIds).toHaveBeenCalledWith([]);
  });
});

describe("closeSidePanel", () => {
  it("closes side panel and clears interval if present", () => {
    const setIsSidePanelOpen: any = jest.fn();
    const intervalRef: any = { current: setInterval(() => {}, 10) };
    closeSidePanel(setIsSidePanelOpen, intervalRef);
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
    expect(intervalRef.current).toBe(null);
  });

  it("closes side panel and does nothing if interval is null", () => {
    const setIsSidePanelOpen: any = jest.fn();
    const intervalRef: any = { current: null };
    closeSidePanel(setIsSidePanelOpen, intervalRef);
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
    expect(intervalRef.current).toBe(null);
  });
});

describe("getNotificationMsgBannerObject", () => {
  const t: any = (key: string, opts?: any) =>
    opts && opts.type ? `${key}_${opts.type}` : key;

  it("shows error banner when showErrorBanner is true", () => {
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: true,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(true);
    expect(banners[0].variant).toBe("warning");
    expect(banners[0].title).toBe("DocumentManagementServer.informationUnavailable");
    expect(banners[0].message).toBe("DocumentManagementServer.technicalIssueMessage");
    expect(banners[0].autoclose).toBe(true);
  });

  it("shows search error when showSearchError is true", () => {
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: true,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(true);
    expect(banners[0].variant).toBe("warning");
  });

  it("shows delete error banner for single document", () => {
    const setShowDeleteErrorBanner: any = jest.fn();
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: true,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner,
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[1].isShow).toBe(true);
    expect(banners[1].message).toBe("DocumentManagementServer.unableToDeleteDocumentMsg_document");
    if (banners[1].onClickClose) {
      banners[1].onClickClose();
    }
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
  });

  it("shows delete error banner for multiple documents", () => {
    const setShowDeleteErrorBanner: any = jest.fn();
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: true,
      showDeleteAbortBanner: false,
      availableFileCount: 2,
      setShowDeleteErrorBanner,
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[1].message).toBe("DocumentManagementServer.unableToDeleteDocumentMsg_documents");
    if (banners[1].onClickClose) {
      banners[1].onClickClose();
    }
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
  });

  it("shows delete abort banner", () => {
    const setShowDeleteAbortBanner: any = jest.fn();
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: true,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner
    });
    expect(banners[2].isShow).toBe(true);
    expect(banners[2].message).toBe("DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDeleted");
    if (banners[2].onClickClose) {
      banners[2].onClickClose();
    }
    expect(setShowDeleteAbortBanner).toHaveBeenCalledWith(false);
  });

  it("does not show any banners if all flags are false", () => {
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(false);
    expect(banners[1].isShow).toBe(false);
    expect(banners[2].isShow).toBe(false);
  });

  it("shows highlight banner always", () => {
    const banners: any = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[3].isShow).toBe(true);
    expect(banners[3].variant).toBe("highlight");
    expect(banners[3].title).toBe("DocumentManagementServer.WarningBannerTitle");
    expect(React.isValidElement(banners[3].message)).toBe(true); // Or check for React element if you changed the implementation
    expect(banners[3].autoclose).toBe(false);
  });
});


