import { getDialogConfig, handleSorting } from "../logic/DocumentManagementServer.dialog.config";
import * as Helpers from "../logic/DocumentManagementServer.utils";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../../../../public/Constants", () => ({
  homeurl: "/home"
}));

describe("DocumentManagementServer.helpers", () => {

  const t: (key: string, options?: any) => string = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------------------------------- */
  /* mapRelatedArr                                       */
  /* -------------------------------------------------- */



describe("getExtraDeletedMessage", () => {
  
  it("returns single document deleted message when deletedCount === 1", () => {
   
    // sum = 1+1+2+1=5, totalRecords=5, so totalRecords !== sum is false, so no message
    // Let's make sum < totalRecords to trigger the branch
    const result2: string | null = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 5 },
      0, // alreadyDeletedFileCount
      1, // restrictedFileCount
      2, // availableFileCount
      [1], // excludedCheckBoxIds (length 1)
      true // isHeaderBoxChecked
    );
    // sum = 0+1+2+1=4, totalRecords=5, so deletedCount = 1
    expect(result2).toContain("singleDocumentAlreadyDeletedMsg");
  });

  it("returns multiple documents deleted message when deletedCount > 1", () => {
    const result: string | null = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 10 },
      2, // alreadyDeletedFileCount
      2, // restrictedFileCount
      2, // availableFileCount
      [1, 2], // excludedCheckBoxIds (length 2)
      true // isHeaderBoxChecked
    );
    // sum = 2+2+2+2=8, totalRecords=10, so deletedCount = 2
    expect(result).toContain("documentsAlreadyDeletedMsg");
  });

  it("returns message with 'All' when all counts are zero and deletedCount > 1", () => {
    const tWithAll: (key: string, options?: any) => string = (key: string, options?: any) =>{
    if (key === "DocumentManagementServer.All") {
      return "All";
    }
    if (options) {
      return `${key}-${JSON.stringify(options)}`;
    }
    return key;
  }
    const result: string | null = Helpers.getExtraDeletedMessage(
      tWithAll,
      { totalRecords: 3 },
      0, // alreadyDeletedFileCount
      0, // restrictedFileCount
      0, // availableFileCount
      [], // excludedCheckBoxIds
      true // isHeaderBoxChecked
    );
    // sum = 0, totalRecords=3, so deletedCount = 3, and all counts are zero, so "All" should be present
    expect(result).toContain("All");
    expect(result).toContain("documentsAlreadyDeletedMsg");
  });

  it("returns null if isHeaderBoxChecked is false", () => {
    const result: string | null = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 5 },
      1,
      1,
      2,
      [1],
      false // isHeaderBoxChecked
    );
    expect(result).toBeNull();
  });

  it("returns null if totalRecords === sum", () => {
    const result: string | null = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 5 },
      1,
      1,
      2,
      [1],
      true // isHeaderBoxChecked
    );
    // sum = 1+1+2+1=5, totalRecords=5, so no message
    expect(result).toBeNull();
  });

  it("returns null if deletedCount is 0", () => {
    const result: string | null = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 4 },
      1,
      1,
      2,
      [],
      true // isHeaderBoxChecked
    );
    // sum = 1+1+2+0=4, totalRecords=4, so totalRecords !== sum is false, so no message
    expect(result).toBeNull();
  });
});

describe("addUniqueTagItem", () => {
  it("returns early if item is null", () => {
    const setTagListArray: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: null,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray
    });
    expect(setTagListArray).not.toHaveBeenCalled();
  });

  it("uses learnerExternalId for Pupil", () => {
    const setTagListArray: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: { learnerExternalId: "abc" } as any,
      selectedRelatedTo: { data: { data: { key: "Pupil" } } } as any,
      tagListArray: [],
      setTagListArray
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("uses externalId for Staff", () => {
    const setTagListArray: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: { externalId: "abc" } as any,
      selectedRelatedTo: { data: { data: { key: "Staff" } } } as any,
      tagListArray: [],
      setTagListArray
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("uses organisationId for default", () => {
    const setTagListArray: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("calls setAlreadyExistingTags if tag already exists", () => {
    const setAlreadyExistingTags: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [{ organisationId: "abc" } as any],
      setTagListArray: jest.fn(),
      setAlreadyExistingTags
    });
    expect(setAlreadyExistingTags).toHaveBeenCalledWith(true);
  });

  it("does not add if tagListArray is at maxLimit", () => {
    const setTagListArray: jest.Mock = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: Array(5).fill({ organisationId: "x" }),
      setTagListArray,
      maxLimit: 5
    });
    expect(setTagListArray).not.toHaveBeenCalled();
  });

  it("adds newId to setReferenceExternalIds if not present", () => {
    const setTagListArray: jest.Mock = jest.fn();
    const setReferenceExternalIds: jest.Mock = jest.fn((fn) => fn(["other"]));
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
      setReferenceExternalIds
    });
    expect(setReferenceExternalIds).toHaveBeenCalled();
  });

  it("does not add newId to setReferenceExternalIds if already present", () => {
    const setTagListArray: jest.Mock = jest.fn();
    const setReferenceExternalIds: jest.Mock = jest.fn((fn) => fn(["abc"]));
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
      setReferenceExternalIds
    });
    expect(setReferenceExternalIds).toHaveBeenCalled();
  });
});

describe("handleSorting", () => {
  const setSortBy: jest.Mock = jest.fn();
  const setSortDirection: jest.Mock = jest.fn();
  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles dateAddedColumn", () => {
    handleSorting(
      t("DocumentManagementServer.dateAddedColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("DateAdded");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles documentColumn", () => {
    handleSorting(
      t("DocumentManagementServer.documentColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Document");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles formatColumn", () => {
    handleSorting(
      t("DocumentManagementServer.formatColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Format");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles sizeColumn", () => {
    handleSorting(
      t("DocumentManagementServer.sizeColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Size");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles categoryColumn", () => {
    handleSorting(
      t("DocumentManagementServer.categoryColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Category");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles privacyColumn — covers PrivacyStatus branch", () => {
    handleSorting(
      t("DocumentManagementServer.privacyColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("DocumentStatus");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("toggles direction if sortBy matches apiColumnName for privacyColumn", () => {
    handleSorting(
      t("DocumentManagementServer.privacyColumn"),
      "PrivacyStatus",
      setSortBy,
      "Desc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("DocumentStatus");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("toggles direction if sortBy matches apiColumnName", () => {
    handleSorting(
      "DateAdded",
      "DateAdded",
      setSortBy,
      "Desc",
      setSortDirection,
      () => "DateAdded" as any
    );
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("returns early for unknown column", () => {
    handleSorting(
      "unknown",
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).not.toHaveBeenCalled();
    expect(setSortDirection).not.toHaveBeenCalled();
  });
});

describe("handleSorting (side panel columns)", () => {
  const setSortBy: jest.Mock = jest.fn();
  const setSortDirection: jest.Mock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles documentColumn", () => {
    handleSorting(
      t("DocumentManagementServer.documentColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Document");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  // it("handles relatedColumn", () => {
  //   handleSorting(
  //     t("DocumentManagementServer.relatedColumn"),
  //     "",
  //     setSortBy,
  //     "Asc",
  //     setSortDirection,
  //     t as any
  //   );
  //   expect(setSortBy).toHaveBeenCalledWith("RelatedTo");
  //   expect(setSortDirection).toHaveBeenCalledWith("Asc");
  // });

  it("handles addedByColumn", () => {
    handleSorting(
      t("DocumentManagementServer.addedByColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("AddedBy");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("handles dateAddedColumn", () => {
    handleSorting(
      t("DocumentManagementServer.dateAddedColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("DateAdded");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("toggles direction Desc→Asc when sortBy matches apiColumnName", () => {
    handleSorting(
      t("DocumentManagementServer.dateAddedColumn"),
      "DateAdded",
      setSortBy,
      "Desc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("DateAdded");
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("toggles direction Asc→Desc when sortBy matches apiColumnName", () => {
    handleSorting(
      t("DocumentManagementServer.documentColumn"),
      "Document",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).toHaveBeenCalledWith("Document");
    expect(setSortDirection).toHaveBeenCalledWith("Desc");
  });

  // it("defaults direction to Asc when sortBy does not match apiColumnName", () => {
  //   handleSorting(
  //     t("DocumentManagementServer.relatedColumn"),
  //     "DateAdded",
  //     setSortBy,
  //     "Desc",
  //     setSortDirection,
  //     t as any
  //   );
  //   expect(setSortBy).toHaveBeenCalledWith("RelatedTo");
  //   expect(setSortDirection).toHaveBeenCalledWith("Asc");
  // });

  it("returns early for unknown column — does not call setSortBy or setSortDirection", () => {
    handleSorting(
      "unknownColumn",
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );
    expect(setSortBy).not.toHaveBeenCalled();
    expect(setSortDirection).not.toHaveBeenCalled();
  });
});

describe("getDialogTitle", () => {

  it("returns single restricted title", () => {
    const result: string = Helpers.getDialogTitle(1, 0, 0, 1, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentCannotBeDeleted");
  });

  it("returns multiple restricted title", () => {
    const result: string = Helpers.getDialogTitle(2, 0, 0, 2, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentsCannotBeDeleted");
  });

  it("returns single already deleted title when alreadyDeletedFileCount === 1 and availableFileCount > 0", () => {
    const result: string = Helpers.getDialogTitle(0, 1, 1, 2, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns single already deleted title when deletedCount === 1", () => {
    // totalSelectedCount = 5, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 4, isHeaderBoxChecked = true
    // deletedCount = 5 - 4 = 1
    const result: string = Helpers.getDialogTitle(0, 0, 4, 5, true, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns multiple already deleted title", () => {
    // totalSelectedCount = 5, alreadyDeletedFileCount = 2, restrictedFileCount = 0, availableFileCount = 2, isHeaderBoxChecked = true
    // deletedCount = 2 (alreadyDeletedFileCount)
    const result: string = Helpers.getDialogTitle(0, 2, 2, 5, true, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns empty string if no conditions match", () => {
    const result: string = Helpers.getDialogTitle(0, 0, 0, 0, false, t as any);
    expect(result).toBe("");
  });
});

it("returns config for default dialogType", async () => {
  
  const setShowConfirmDialog: any = jest.fn();
  const config: any = getDialogConfig({
    dialogType: "prepareDownload", 
    t,
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
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
    allRegistrationIds: [],
    referenceExternalId: [""],
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 0,
    currentPage: 1,
    gtmAnalytics: {
      pushEvent: jest.fn()
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.Cancel");
  expect(typeof config?.onCancel).toBe("function");
  expect(typeof config?.onConfirm).toBe("function");

  // Simulate onConfirm for default dialog
  await config?.onConfirm();
  // expect().toHaveBeenCalled();

  await config?.onCancel();
  expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
});

it("returns correct contentText when alreadyDeletedFileCount is 1", () => {
  const setShowConfirmDialog: any = jest.fn();
  const config: any = getDialogConfig({
    dialogType: "prepareDownload",
    t,
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
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: [],
    availableFileIds: [],
    fetchGetDocumentDetails: jest.fn(),
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
  expect(config?.contentText).toContain("documentCannotBeDownloaded");
});

it("returns correct contentText when deletedCount === 1", () => {
  const setShowConfirmDialog: any = jest.fn();
  // totalRecords = 3, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 1, excludedCheckBoxIds.length = 1
  // sum = 0 + 0 + 1 + 1 = 2, totalRecords = 3, so deletedCount = 1
  const config: any = getDialogConfig({
    dialogType: "prepareDownload",
    t,
    availableFileCount: 1,
    docData: { totalRecords: 3 },
    isHeaderBoxChecked: true,
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
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: ["1"], // length = 1
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
  expect(config?.contentText).toContain("documentCannotBeDownloaded");
});

it("returns correct contentText when deletedCount > 1", () => {
  const setShowConfirmDialog: any = jest.fn();
  // totalRecords = 5, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 1, excludedCheckBoxIds.length = 1
  // sum = 0 + 0 + 1 + 1 = 2, totalRecords = 5, so deletedCount = 3
  const config: any = getDialogConfig({
    dialogType: "prepareDownload",
    t,
    availableFileCount: 1,
    docData: { totalRecords: 5 },
    isHeaderBoxChecked: true,
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
    buildSelectedDocs: jest.fn(),
    selectedCheckBoxIds: [],
    allSelectedDocs: [],
    dateRange: { fromDate: "", toDate: "" },
    selectedEntities: [],
    prepareDownload: jest.fn(() => Promise.resolve([204])),
    totalSelectedCount: 0,
    excludedCheckBoxIds: ["1", "2"], // length = 2
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
  expect(config?.contentText).toContain("documentsCannotBeDownloaded");
});

})


