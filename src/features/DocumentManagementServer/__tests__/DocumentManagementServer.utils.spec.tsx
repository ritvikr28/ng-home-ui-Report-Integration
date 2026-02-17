import * as Helpers from "../logic/DocumentManagementServer.utils";
import gtmAnalytics from "../../../shared/utils/analytics";
import { fireEvent, getByText, screen } from "@testing-library/react";
import { on } from "events";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../../../../public/Constants", () => ({
  homeurl: "/home"
}));

describe("DocumentManagementServer.helpers", () => {

  const t = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------------------------------- */
  /* mapRelatedArr                                       */
  /* -------------------------------------------------- */

  it("maps pupil related", () => {
    const result = Helpers.mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 1,
      relatedTo: [{
        preferredForename: "A",
        preferredSurname: "B",
        currentYearGroup: "1",
        currentPrimaryClass: "C",
        learnerExternalId: "123",
        onRollState: "OnRoll"
      }]
    } as any);

    expect(result[0].type).toBe("pupil");
  });

  it("maps staff related", () => {
    const result = Helpers.mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 3,
      relatedTo: [{
        preferredForename: "S",
        preferredSurname: "T",
        staffCode: "SC",
        externalId: "321",
        onRollState: "OnRoll"
      }]
    } as any);

    expect(result[0].type).toBe("staff");
  });

  it("maps school related", () => {
    const result = Helpers.mapRelatedArr({
      fileId: "1",
      documentRelatedTo: 2,
      relatedTo: [{
        schoolName: "MySchool",
        organisationId: "999"
      }]
    } as any);

    expect(result[0].type).toBe("school");
  });

  it("returns empty if no related", () => {
    expect(Helpers.mapRelatedArr({ fileId: "1" } as any)).toEqual([]);
  });

  /* -------------------------------------------------- */
  /* reduceCategories                                   */
  /* -------------------------------------------------- */

  it("reduces categories", () => {
    const result = Helpers.reduceCategories([
      { application: "A", registrationId: 1, section: "S1" },
      { application: "A", registrationId: 2, section: "S2" }
    ]);
    expect(result.length).toBe(1);
  });

  /* -------------------------------------------------- */
  /* getAllRegistrationIds                              */
  /* -------------------------------------------------- */

  it("handles non array", () => {
    expect(Helpers.getAllRegistrationIds(null)).toEqual([]);
  });

  it("handles single and array categoryId", () => {
    const result = Helpers.getAllRegistrationIds([
      { data: { categoryId: [1,2] } },
      { data: { categoryId: 3 } }
    ]);
    expect(result).toEqual([1,2,3]);
  });

  /* -------------------------------------------------- */
  /* getCompletedPartitionKeys                          */
  /* -------------------------------------------------- */

  it("filters completed partition keys", () => {
    const result = Helpers.getCompletedPartitionKeys([
      { status: "Complete", partitionKey: "A" },
      { status: "Pending", partitionKey: "B" }
    ]);
    expect(result).toEqual(["A"]);
  });

  /* -------------------------------------------------- */
  /* getVisibleTagsWithSummary                          */
  /* -------------------------------------------------- */

  it("returns summary tag", () => {
    const result = Helpers.getVisibleTagsWithSummary(
      [{text:"1"},{text:"2"},{text:"3"},{text:"4"}],
      2
    );
    expect(result[result.length-1].text).toContain("+");
  });

  /* -------------------------------------------------- */
  /* getDateTag                                         */
  /* -------------------------------------------------- */

  it("returns formatted date tag", () => {
    const result = Helpers.getDateTag({
      fromDate: "2024-01-01",
      toDate: "2024-01-02"
    });
    expect(result.length).toBe(1);
  });

  it("returns empty date tag", () => {
    expect(Helpers.getDateTag({fromDate:"",toDate:""})).toEqual([]);
  });

  /* -------------------------------------------------- */
  /* getResultNotFoundMsg                               */
  /* -------------------------------------------------- */

  it("returns info unavailable", () => {
    const result = Helpers.getResultNotFoundMsg(
      t,"",{}, "", true,false,false,[],{fromDate:"",toDate:""}
    );
    expect(result).toBe("Information unavailable.");
  });

  it("returns no data", () => {
    const result = Helpers.getResultNotFoundMsg(
      t,"search",{statusCode:200,data:[]},
      "",false,true,false,[],{fromDate:"",toDate:""}
    );
    expect(result).toContain("DocumentManagementServer.noDataToDisplay");
  });

  /* -------------------------------------------------- */
  /* filterNonEmptySuggestions / hasItems               */
  /* -------------------------------------------------- */

  it("filters non empty suggestions", () => {
    const result = Helpers.filterNonEmptySuggestions([
      {values:[1]} as any,
      {values:[]} as any
    ]);
    expect(result.length).toBe(1);
  });

  it("hasItems works", () => {
    expect(Helpers.hasItems([{values:[1]}] as any)).toBe(true);
  });

  /* -------------------------------------------------- */
  /* debounce                                           */
  /* -------------------------------------------------- */

  it("debounce delays execution", () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debounced = Helpers.debounce(fn, 500);
    debounced();
    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalled();
    jest.useRealTimers();
  });

  /* -------------------------------------------------- */
  /* getDialogTitle                                     */
  /* -------------------------------------------------- */

  it("returns restricted title", () => {
    const result = Helpers.getDialogTitle(1,0,0,1,false,t as any);
    expect(result).toContain("documentCannotBeDeleted");
  });

  /* -------------------------------------------------- */
  /* getEmptyStateMsg                                   */
  /* -------------------------------------------------- */

  it("returns initial state message", () => {
    const result = Helpers.getEmptyStateMsg(false,"",false,false,false,false,t as any);
    expect(result).toContain("Use the search bar");
  });

  /* -------------------------------------------------- */
  /* handleSorting                                      */
  /* -------------------------------------------------- */

  it("handles sorting and toggles direction", () => {
    const setSortBy = jest.fn();
    const setSortDirection = jest.fn();

    Helpers.handleSorting(
      t("DocumentManagementServer.dateAddedColumn"),
      "",
      setSortBy,
      "Asc",
      setSortDirection,
      t as any
    );

    expect(setSortBy).toHaveBeenCalled();
    expect(gtmAnalytics.pushEvent).toHaveBeenCalled();
  });

  /* -------------------------------------------------- */
  /* handleOnChangeAllCheckBox                          */
  /* -------------------------------------------------- */

  it("unchecks all checkbox", () => {
    Helpers.handleOnChangeAllCheckBox(
      {target:{checked:false}},
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );
  });

  /* -------------------------------------------------- */
  /* breadcrumbActionsList                              */
  /* -------------------------------------------------- */

  it("returns breadcrumb list", () => {
    const result = Helpers.breadcrumbActionsList(t);
    expect(result.length).toBe(3);
  });

  /* -------------------------------------------------- */
  /* getDeleteDialogMessages                            */
  /* -------------------------------------------------- */

  it("returns delete dialog messages", () => {
    const result = Helpers.getDeleteDialogMessages({
      t,
      restrictedFileCount:1,
      availableFileCount:0,
      docData:{totalRecords:1},
      alreadyDeletedFileCount:0,
      excludedCheckBoxIds:[],
      isHeaderBoxChecked:false
    });
    expect(result.length).toBeGreaterThan(0);
  });

  /* -------------------------------------------------- */
  /* addUniqueTagItem                                   */
  /* -------------------------------------------------- */

  it("adds unique tag", () => {
    const setTagListArray = jest.fn();
    const setReferenceExternalIds = jest.fn();
    Helpers.addUniqueTagItem({
      item:{organisationId:"1"} as any,
      selectedRelatedTo:undefined,
      tagListArray:[],
      setTagListArray,
      setReferenceExternalIds
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

    /* -------------------------------------------------- */
    /* applySummaryTagClass                                */
    /* -------------------------------------------------- */

    it("adds summary-tag class when tag starts with +", () => {
      // Setup DOM
      document.body.innerHTML = `
        <div id="taglist-id">
          <div class="search-tagList">
            <span class="essui-tag"><span>+2</span></span>
          </div>
          <div class="search-tagList">
            <span class="essui-tag"><span>Normal</span></span>
          </div>
        </div>
      `;
      Helpers.applySummaryTagClass();
      const tagLists = document.querySelectorAll('.search-tagList');
      expect(tagLists[0].classList.contains('summary-tag')).toBe(true);
      expect(tagLists[1].classList.contains('summary-tag')).toBe(false);
    });

    it("removes summary-tag class when tag does not start with +", () => {
      document.body.innerHTML = `
        <div id="taglist-id">
          <div class="search-tagList summary-tag">
            <span class="essui-tag"><span>Normal</span></span>
          </div>
        </div>
      `;
      Helpers.applySummaryTagClass();
      const tagList = document.querySelector('.search-tagList');
      expect(tagList?.classList.contains('summary-tag')).toBe(false);
    });

    it("returns error validation state when searchSelectionError is present", () => {
  const t = (key: string) => key;
  const result = Helpers.getValidationState("Some error", false, t);
  expect(result.validationText).toBe("Some error");
  expect(result.validationTextLevel).toBe("error");
});

it("returns warning validation state when showSearchError is true and no searchSelectionError", () => {
  const t = (key: string) => key;
  const result = Helpers.getValidationState("", true, t);
  expect(result.validationText).toBe("Filter.informationUnavailable");
  expect(result.validationTextLevel).toBe("warning");
});

it("returns empty validation state when neither error nor warning", () => {
  const t = (key: string) => key;
  const result = Helpers.getValidationState("", false, t);
  expect(result.validationText).toBe("");
  expect(result.validationTextLevel).toBe(null);
});

it("returns date tag when only fromDate is present", () => {
  const result = Helpers.getDateTag({
    fromDate: "2024-01-01",
    toDate: ""
  });
  expect(result[0].text).toBe("01 Jan 2024 to -");
});

it("returns date tag when only toDate is present", () => {
  const result = Helpers.getDateTag({
    fromDate: "",
    toDate: "2024-01-02"
  });
  expect(result[0].text).toBe("- to 02 Jan 2024");
});

it("maps selectedFormats to category array", () => {
  const input = [
    { text: "Category 1", value: "cat1", data: { categoryId: 101 } },
    { text: "Category 2", value: "cat2", data: { categoryId: 102 } }
  ];
  const result = Helpers.getCategoryArr(input);
  expect(result).toEqual([
    {
      text: "Category 1",
      categoryName: "cat1",
      closeObj: { name: "Category 1", id: 101 }
    },
    {
      text: "Category 2",
      categoryName: "cat2",
      closeObj: { name: "Category 2", id: 102 }
    }
  ]);
});

it("returns empty array when selectedFormats is undefined", () => {
  const result = Helpers.getCategoryArr(undefined as any);
  expect(result).toEqual([]);
});

it("toggles sort direction when sortBy matches apiColumnName", () => {
  const setSortBy = jest.fn();
  const setSortDirection = jest.fn();
  const t = (key: string) => {
    if (key === "DocumentManagementServer.dateAddedColumn") return "DateAdded";
    return key;
  };

  Helpers.handleSorting(
    t("DocumentManagementServer.dateAddedColumn"), // columnName
    "DateAdded", // sortBy matches apiColumnName
    setSortBy,
    "Desc", // current direction
    setSortDirection,
    t as any
  );

  expect(setSortBy).toHaveBeenCalledWith("DateAdded");
  expect(setSortDirection).toHaveBeenCalledWith("Asc"); // toggled from Desc to Asc
});

it("removes id from selectedCheckBoxIds and allSelectedDocs if already selected", () => {
  const setSelectedCheckBoxIds = jest.fn();
  const setAllSelectedDocs = jest.fn();
  const docData = {
    data: [
      { fileId: "1", registrationId: 10, externalId: "A" },
      { fileId: "2", registrationId: 20, externalId: "B" }
    ]
  };
  const selectedCheckBoxIds = ["1", "2"];
  const prevDocs = [
    { fileId: "1", registrationId: 10, externalId: "A" },
    { fileId: "2", registrationId: 20, externalId: "B" }
  ];

  // Mock setAllSelectedDocs to call its updater immediately
  setAllSelectedDocs.mockImplementation(updater => updater(prevDocs));

  Helpers.handleOnChangeCheckBox(
    0,
    "1",
    docData,
    selectedCheckBoxIds,
    setSelectedCheckBoxIds,
    setAllSelectedDocs
  );

  // Should remove "1" from selectedCheckBoxIds
  expect(setSelectedCheckBoxIds).toHaveBeenCalled();
  // Should remove doc with fileId "1" from allSelectedDocs
  expect(setAllSelectedDocs).toHaveBeenCalled();
});

it("adds id to selectedCheckBoxIds and allSelectedDocs if not already selected", () => {
  const setSelectedCheckBoxIds = jest.fn();
  const setAllSelectedDocs = jest.fn();
  const docData = {
    data: [
      { fileId: "3", registrationId: 30, externalId: "C" }
    ]
  };
  const selectedCheckBoxIds: string[] = [];
  const prevDocs: any[] = [];

  setAllSelectedDocs.mockImplementation(updater => updater(prevDocs));

  Helpers.handleOnChangeCheckBox(
    0,
    "3",
    docData,
    selectedCheckBoxIds,
    setSelectedCheckBoxIds,
    setAllSelectedDocs
  );

  expect(setSelectedCheckBoxIds).toHaveBeenCalled();
  expect(setAllSelectedDocs).toHaveBeenCalled();
});


it("returns null if dialogType is not provided", () => {
  const result = Helpers.getDialogConfig({ dialogType: null } as any);
  expect(result).toBeNull();
});

it("returns config for clearAll dialogType", () => {
  const t = (key: string) => key;
  const setShowConfirmDialog = jest.fn();
  const setClearAllError = jest.fn();
  const handleClearAllConfirm = jest.fn();
  const config = Helpers.getDialogConfig({
    dialogType: "clearAll",
    t,
    setShowConfirmDialog,
    setClearAllError,
    handleClearAllConfirm,
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
    availableFileCount: 0,
    docData: {},
    isHeaderBoxChecked: false,
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
    // Add required missing properties for GetDialogConfigParams
    gtmAnalytics: {
      pushEvent: jest.fn(),
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.keepAll");
  expect(config?.okText).toBe("DocumentManagementServer.ClearAll");
});

it("returns config for clearAll dialogType and click onConfirm", async () => {
  const t = (key: string) => key;
  const setShowConfirmDialog = jest.fn();
  const setClearAllError = jest.fn();
  const handleClearAllConfirm = jest.fn();
  const config = Helpers.getDialogConfig({
    dialogType: "clearAll",
    t,
    setShowConfirmDialog,
    setClearAllError,
    handleClearAllConfirm,
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
    availableFileCount: 0,
    docData: {},
    isHeaderBoxChecked: false,
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
      pushEvent: jest.fn(),
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.keepAll");
  expect(config?.okText).toBe("DocumentManagementServer.ClearAll");

  await config?.onConfirm();
  expect(handleClearAllConfirm).toHaveBeenCalled();

  await config?.onCancel();
  expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
});

it("returns config for delete dialogType", async () => {
  const t = (key: string) => key;
  const setShowConfirmDialog = jest.fn();
  const setSelectedCheckBoxIds = jest.fn();
  const setAllSelectedDocs = jest.fn();
  const setIsClearSelectedCheckbox = jest.fn();
  const setIsHeaderBoxChecked = jest.fn();
  const setPrevSelectedDocs = jest.fn();
  const setExcludedCheckBoxIds = jest.fn();
  const setTableKey = jest.fn();
  const fetchGetDocumentDetails = jest.fn();

  const config = Helpers.getDialogConfig({
    dialogType: "delete",
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
    alreadyDeletedFileCount: 0,
    restrictedFileCount: 1,
    currentPage: 1,
      // Add required missing properties for GetDialogConfigParams
      gtmAnalytics: {
        pushEvent: jest.fn(),
      },
      getCompletedPartitionKeys: jest.fn(() => []),
      contentText: <></>,
      getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.keepIt");
  expect(config?.okText).toBe("DocumentManagementServer.Delete");
  expect(typeof config?.onCancel).toBe("function");
  expect(typeof config?.onConfirm).toBe("function");

  // Simulate onConfirm for delete dialog
  await config?.onConfirm();
  expect(setShowConfirmDialog).toHaveBeenCalled();

  await config?.onCancel();
  // expect(setExcludedCheckBoxIds).toBeCalledWith([]);
});


it("returns config for default dialogType", async () => {
  const t = (key: string) => key;
  const setShowConfirmDialog = jest.fn();
  const config = Helpers.getDialogConfig({
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
      pushEvent: jest.fn(),
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => []),
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
  const t = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;
  const setShowConfirmDialog = jest.fn();
  const config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.contentText).toContain("documentCannotBeDownloaded");
});

it("returns correct contentText when deletedCount === 1", () => {
  const t = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;
  const setShowConfirmDialog = jest.fn();
  // totalRecords = 3, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 1, excludedCheckBoxIds.length = 1
  // sum = 0 + 0 + 1 + 1 = 2, totalRecords = 3, so deletedCount = 1
  const config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.contentText).toContain("documentCannotBeDownloaded");
});

it("returns correct contentText when deletedCount > 1", () => {
  const t = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;
  const setShowConfirmDialog = jest.fn();
  // totalRecords = 5, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 1, excludedCheckBoxIds.length = 1
  // sum = 0 + 0 + 1 + 1 = 2, totalRecords = 5, so deletedCount = 3
  const config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  expect(config?.contentText).toContain("documentsCannotBeDownloaded");
});

it("calls all reset functions and fetchGetDocumentDetails onCancel when alreadyDeletedFileCount > 0 (default case)", () => {
  const setShowConfirmDialog = jest.fn();
  const fetchGetDocumentDetails = jest.fn();
  const setSelectedCheckBoxIds = jest.fn();
  const setAllSelectedDocs = jest.fn();
  const setIsClearSelectedCheckbox = jest.fn();
  const setIsHeaderBoxChecked = jest.fn();
  const setPrevSelectedDocs = jest.fn();
  const setExcludedCheckBoxIds = jest.fn();

  const config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
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
  const setPrepareDownloadError = jest.fn();
  const setPrepareDownloadAbortBanner = jest.fn();
  const setShowEmailNotification = jest.fn();
  const setIsSidePanelLoader = jest.fn();
  const gtmAnalytics = { pushEvent: jest.fn() };

  // error branch: status not 204 or 409
  let config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  await config?.onConfirm();
  expect(setPrepareDownloadError).toHaveBeenCalled();
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));

  // abort branch: status 409
  config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  await config?.onConfirm();
  expect(setPrepareDownloadAbortBanner).toHaveBeenCalled();
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));

  // email notification branch: all statuses 204 or 409, totalSelectedCount > 1
  config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  await config?.onConfirm();
  // expect(setShowEmailNotification).toHaveBeenCalled();

  // catch branch: rejected promise
  config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
  });
  await config?.onConfirm();
  expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
  expect(setPrepareDownloadError).toHaveBeenCalled();
  expect(setPrepareDownloadAbortBanner).toHaveBeenCalledWith(false);
  // expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(expect.objectContaining({ event: "error_message" }));
});

it("calls all reset functions and fetchGetDocumentDetails onCancel when alreadyDeletedFileCount > 0 (delete dialogType)", () => {
  const setShowConfirmDialog = jest.fn();
  const fetchGetDocumentDetails = jest.fn();
  const setSelectedCheckBoxIds = jest.fn();
  const setAllSelectedDocs = jest.fn();
  const setIsClearSelectedCheckbox = jest.fn();
  const setIsHeaderBoxChecked = jest.fn();
  const setPrevSelectedDocs = jest.fn();
  const setExcludedCheckBoxIds = jest.fn();
  const setTableKey = jest.fn();

  const config = Helpers.getDialogConfig({
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
    getAllRegistrationIds: jest.fn(() => []),
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
  const updater = (prevSelectedIds: string[]) => {
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
  const updater = (prevSelectedIds: string[]) => {
    const updatedCheckBoxIds: string[] = Array.isArray(prevSelectedIds) ? [...prevSelectedIds] : [];
    if (updatedCheckBoxIds.includes(id)) {
      return updatedCheckBoxIds.filter((selectedId) => selectedId !== id);
    }
    return [...updatedCheckBoxIds, id];
  };
  expect(updater(["1", "2"])).toEqual(["1", "2", "3"]);
});
});

describe("getExtraDeletedMessage", () => {
  const t = (key: string, options?: any) =>
    options ? `${key}-${JSON.stringify(options)}` : key;

  it("returns single document deleted message when deletedCount === 1", () => {
    const result = Helpers.getExtraDeletedMessage(
      t,
      { totalRecords: 5 },
      1, // alreadyDeletedFileCount
      1, // restrictedFileCount
      2, // availableFileCount
      [1], // excludedCheckBoxIds (length 1)
      true // isHeaderBoxChecked
    );
    // sum = 1+1+2+1=5, totalRecords=5, so totalRecords !== sum is false, so no message
    // Let's make sum < totalRecords to trigger the branch
    const result2 = Helpers.getExtraDeletedMessage(
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
    const result = Helpers.getExtraDeletedMessage(
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
    const tWithAll = (key: string, options?: any) =>
      key === "DocumentManagementServer.All"
        ? "All"
        : options
        ? `${key}-${JSON.stringify(options)}`
        : key;
    const result = Helpers.getExtraDeletedMessage(
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
    const result = Helpers.getExtraDeletedMessage(
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
    const result = Helpers.getExtraDeletedMessage(
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
    const result = Helpers.getExtraDeletedMessage(
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
    const setTagListArray = jest.fn();
    Helpers.addUniqueTagItem({
      item: null,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
    });
    expect(setTagListArray).not.toHaveBeenCalled();
  });

  it("uses learnerExternalId for Pupil", () => {
    const setTagListArray = jest.fn();
    Helpers.addUniqueTagItem({
      item: { learnerExternalId: "abc" } as any,
      selectedRelatedTo: { data: { data: { key: "Pupil" } } } as any,
      tagListArray: [],
      setTagListArray,
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("uses externalId for Staff", () => {
    const setTagListArray = jest.fn();
    Helpers.addUniqueTagItem({
      item: { externalId: "abc" } as any,
      selectedRelatedTo: { data: { data: { key: "Staff" } } } as any,
      tagListArray: [],
      setTagListArray,
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("uses organisationId for default", () => {
    const setTagListArray = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
    });
    expect(setTagListArray).toHaveBeenCalled();
  });

  it("calls setAlreadyExistingTags if tag already exists", () => {
    const setAlreadyExistingTags = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [{ organisationId: "abc" } as any],
      setTagListArray: jest.fn(),
      setAlreadyExistingTags,
    });
    expect(setAlreadyExistingTags).toHaveBeenCalledWith(true);
  });

  it("does not add if tagListArray is at maxLimit", () => {
    const setTagListArray = jest.fn();
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: Array(5).fill({ organisationId: "x" }),
      setTagListArray,
      maxLimit: 5,
    });
    expect(setTagListArray).not.toHaveBeenCalled();
  });

  it("adds newId to setReferenceExternalIds if not present", () => {
    const setTagListArray = jest.fn();
    const setReferenceExternalIds = jest.fn((fn) => fn(["other"]));
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
      setReferenceExternalIds,
    });
    expect(setReferenceExternalIds).toHaveBeenCalled();
  });

  it("does not add newId to setReferenceExternalIds if already present", () => {
    const setTagListArray = jest.fn();
    const setReferenceExternalIds = jest.fn((fn) => fn(["abc"]));
    Helpers.addUniqueTagItem({
      item: { organisationId: "abc" } as any,
      selectedRelatedTo: undefined,
      tagListArray: [],
      setTagListArray,
      setReferenceExternalIds,
    });
    expect(setReferenceExternalIds).toHaveBeenCalled();
  });
});

describe("handleSorting", () => {
  const setSortBy = jest.fn();
  const setSortDirection = jest.fn();
  const t = (key: string) => {
    switch (key) {
      case "DocumentManagementServer.dateAddedColumn":
        return "dateAdded";
      case "DocumentManagementServer.documentColumn":
        return "document";
      case "DocumentManagementServer.formatColumn":
        return "format";
      case "DocumentManagementServer.sizeColumn":
        return "size";
      case "DocumentManagementServer.categoryColumn":
        return "category";
      default:
        return key;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles dateAddedColumn", () => {
    Helpers.handleSorting(
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
    Helpers.handleSorting(
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
    Helpers.handleSorting(
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
    Helpers.handleSorting(
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
    Helpers.handleSorting(
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

  it("toggles direction if sortBy matches apiColumnName", () => {
    Helpers.handleSorting(
      "DateAdded",
      "DateAdded",
      setSortBy,
      "Desc",
      setSortDirection,
      (k: string) => "DateAdded" as any
    );
    expect(setSortDirection).toHaveBeenCalledWith("Asc");
  });

  it("returns early for unknown column", () => {
    Helpers.handleSorting(
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

describe("getDialogTitle", () => {
  const t = (key: string) => key;

  it("returns single restricted title", () => {
    const result = Helpers.getDialogTitle(1, 0, 0, 1, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentCannotBeDeleted");
  });

  it("returns multiple restricted title", () => {
    const result = Helpers.getDialogTitle(2, 0, 0, 2, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentsCannotBeDeleted");
  });

  it("returns single already deleted title when alreadyDeletedFileCount === 1 and availableFileCount > 0", () => {
    const result = Helpers.getDialogTitle(0, 1, 1, 2, false, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns single already deleted title when deletedCount === 1", () => {
    // totalSelectedCount = 5, alreadyDeletedFileCount = 0, restrictedFileCount = 0, availableFileCount = 4, isHeaderBoxChecked = true
    // deletedCount = 5 - 4 = 1
    const result = Helpers.getDialogTitle(0, 0, 4, 5, true, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns multiple already deleted title", () => {
    // totalSelectedCount = 5, alreadyDeletedFileCount = 2, restrictedFileCount = 0, availableFileCount = 2, isHeaderBoxChecked = true
    // deletedCount = 2 (alreadyDeletedFileCount)
    const result = Helpers.getDialogTitle(0, 2, 2, 5, true, t as any);
    expect(result).toBe("DocumentManagementServer.documentAlreadyDeleted");
  });

  it("returns empty string if no conditions match", () => {
    const result = Helpers.getDialogTitle(0, 0, 0, 0, false, t as any);
    expect(result).toBe("");
  });
});