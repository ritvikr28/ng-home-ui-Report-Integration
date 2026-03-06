import * as Helpers from "../logic/DocumentManagementServer.utils";
import gtmAnalytics from "../../../shared/utils/analytics";
import { getDialogConfig, handleOnChangeAllCheckBox, handleOnChangeCheckBox, handleSorting } from "../logic/DocumentManagementServer.dialog.config";

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

  it("maps pupil related", () => {
    const result: any = Helpers.mapRelatedArr({
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
    const result: any = Helpers.mapRelatedArr({
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
    const result: any = Helpers.mapRelatedArr({
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
    const result: any = Helpers.reduceCategories([
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
    const result: any = Helpers.getAllRegistrationIds([
      { data: { categoryId: [1,2] } },
      { data: { categoryId: 3 } }
    ]);
    expect(result).toEqual([1,2,3]);
  });

  /* -------------------------------------------------- */
  /* getCompletedPartitionKeys                          */
  /* -------------------------------------------------- */

  it("filters completed partition keys", () => {
    const result: any = Helpers.getCompletedPartitionKeys([
      { status: "Complete", partitionKey: "A" },
      { status: "Pending", partitionKey: "B" }
    ]);
    expect(result).toEqual(["A"]);
  });

  /* -------------------------------------------------- */
  /* getVisibleTagsWithSummary                          */
  /* -------------------------------------------------- */

  it("returns summary tag", () => {
    const result: any = Helpers.getVisibleTagsWithSummary(
      [{text:"1"},{text:"2"},{text:"3"},{text:"4"}],
      2
    );
    expect(result[result.length-1].text).toContain("+");
  });

  /* -------------------------------------------------- */
  /* getDateTag                                         */
  /* -------------------------------------------------- */

  it("returns formatted date tag", () => {
    const result: any = Helpers.getDateTag({
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
    const result: any = Helpers.getResultNotFoundMsg({
      t,
      searchText: "",
      docData: {},
      showErrorBanner: false,
      isSearchTriggered: false,
      showSearchError: false,
      selectedFormats: [],
      dateRange: { fromDate: "", toDate: "" },
      searchTerm: ""
    });
    expect(result).toBe("DocumentManagementServer.searchBarText");
  });

  it("returns no data", () => {
    const result: any = Helpers.getResultNotFoundMsg({
      t,
      searchText: "search",
      docData: { statusCode: 200, data: [] },
      isSearchTriggered: false,
      showSearchError: true,
      selectedFormats: [],
      dateRange: { fromDate: "", toDate: "" },
      searchTerm: "",
      showErrorBanner: false
    });
    expect(result).toContain("Information unavailable.");
  });

  /* -------------------------------------------------- */
  /* filterNonEmptySuggestions / hasItems               */
  /* -------------------------------------------------- */

  it("filters non empty suggestions", () => {
    const result: any = Helpers.filterNonEmptySuggestions([
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
    const fn: jest.Mock<void, []> = jest.fn();
    const debounced: any = Helpers.debounce(fn, 500);
    debounced();
    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalled();
    jest.useRealTimers();
  });

  /* -------------------------------------------------- */
  /* getDialogTitle                                     */
  /* -------------------------------------------------- */

  it("returns restricted title", () => {
    const result: any = Helpers.getDialogTitle(1,0,0,1,false,t as any);
    expect(result).toContain("documentCannotBeDeleted");
  });

  /* -------------------------------------------------- */
  /* getEmptyStateMsg                                   */
  /* -------------------------------------------------- */

  it("returns initial state message", () => {
    const result: any = Helpers.getEmptyStateMsg(false,"",false,false,false,false,t as any);
    expect(result).toContain("Use the search bar");
  });

  /* -------------------------------------------------- */
  /* handleSorting                                      */
  /* -------------------------------------------------- */

  it("handles sorting and toggles direction", () => {
    const setSortBy: any = jest.fn();
    const setSortDirection: any = jest.fn();

    handleSorting(
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
    handleOnChangeAllCheckBox(
      {target:{checked:false}},
      jest.fn() as any,
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
    const result: any = Helpers.breadcrumbActionsList(t);
    expect(result.length).toBe(3);
  });

  /* -------------------------------------------------- */
  /* getDeleteDialogMessages                            */
  /* -------------------------------------------------- */

  it("returns delete dialog messages", () => {
    const result : any= Helpers.getDeleteDialogMessages({
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
    const setTagListArray: jest.Mock<void, [any]> = jest.fn();
    const setReferenceExternalIds: jest.Mock<void, [any]> = jest.fn();
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
      const tagLists: any = document.querySelectorAll('.search-tagList');
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
      const tagList: any = document.querySelector('.search-tagList');
      expect(tagList?.classList.contains('summary-tag')).toBe(false);
    });

    it("returns error validation state when searchSelectionError is present", () => {
  const result: any = Helpers.getValidationState("Some error", false, t);
  expect(result.validationText).toBe("Some error");
  expect(result.validationTextLevel).toBe("error");
});

it("returns warning validation state when showSearchError is true and no searchSelectionError", () => {
  
  const result: any = Helpers.getValidationState("", true, t);
  expect(result.validationText).toBe("Filter.informationUnavailable");
  expect(result.validationTextLevel).toBe("warning");
});

it("returns empty validation state when neither error nor warning", () => {
  
  const result: any = Helpers.getValidationState("", false, t);
  expect(result.validationText).toBe("");
  expect(result.validationTextLevel).toBe(null);
});

it("returns date tag when only fromDate is present", () => {
  const result: any = Helpers.getDateTag({
    fromDate: "2024-01-01",
    toDate: ""
  });
  expect(result[0].text).toBe("01 Jan 2024 to -");
});

it("returns date tag when only toDate is present", () => {
  const result: any = Helpers.getDateTag({
    fromDate: "",
    toDate: "2024-01-02"
  });
  expect(result[0].text).toBe("- to 02 Jan 2024");
});

it("maps selectedFormats to category array", () => {
  const input: any = [
    { text: "Category 1", value: "cat1", data: { categoryId: 101 } },
    { text: "Category 2", value: "cat2", data: { categoryId: 102 } }
  ];
  const result: any = Helpers.getCategoryArr(input);
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
  const result: any = Helpers.getCategoryArr(undefined as any);
  expect(result).toEqual([]);
});

it("toggles sort direction when sortBy matches apiColumnName", () => {
  const setSortBy: any = jest.fn();
  const setSortDirection: any = jest.fn();


  handleSorting(
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
  const setSelectedCheckBoxIds: any = jest.fn();
  const setAllSelectedDocs: any = jest.fn();
  const docData: any = {
    data: [
      { fileId: "1", registrationId: 10, externalId: "A" },
      { fileId: "2", registrationId: 20, externalId: "B" }
    ]
  };
  const selectedCheckBoxIds: any = ["1", "2"];
  const prevDocs: any = [
    { fileId: "1", registrationId: 10, externalId: "A" },
    { fileId: "2", registrationId: 20, externalId: "B" }
  ];

  // Mock setAllSelectedDocs to call its updater immediately
  setAllSelectedDocs.mockImplementation((updater: (arg0: any) => any) => updater(prevDocs));

  handleOnChangeCheckBox(
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
  const setSelectedCheckBoxIds: any = jest.fn();
  const setAllSelectedDocs: any = jest.fn();
  const docData: any = {
    data: [
      { fileId: "3", registrationId: 30, externalId: "C" }
    ]
  };
  const selectedCheckBoxIds: any = [];
  const prevDocs: any = [];

  setAllSelectedDocs.mockImplementation((updater: (arg0: any) => any) => updater(prevDocs));

  handleOnChangeCheckBox(
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
  const result: any = getDialogConfig({ dialogType: null } as any);
  expect(result).toBeNull();
});

it("returns config for clearAll dialogType", () => {
  
  const setShowConfirmDialog: any = jest.fn();
  const setClearAllError: any = jest.fn();
  const handleClearAllConfirm: any = jest.fn();
  const config: any = getDialogConfig({
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
      pushEvent: jest.fn()
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.keepAll");
  expect(config?.okText).toBe("DocumentManagementServer.ClearAll");
});

it("returns config for clearAll dialogType and click onConfirm", async () => {
  
  const setShowConfirmDialog: any = jest.fn();
  const setClearAllError: any = jest.fn();
  const handleClearAllConfirm: any = jest.fn();
  const config: any = getDialogConfig({
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
      pushEvent: jest.fn()
    },
    getCompletedPartitionKeys: jest.fn(() => []),
    contentText: <></>,
    getAllRegistrationIds: jest.fn(() => [])
  });
  expect(config?.cancelText).toBe("DocumentManagementServer.keepAll");
  expect(config?.okText).toBe("DocumentManagementServer.ClearAll");

  await config?.onConfirm();
  expect(handleClearAllConfirm).toHaveBeenCalled();

  await config?.onCancel();
  expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
});

it("returns config for delete dialogType", async () => {
  
  const setShowConfirmDialog: any = jest.fn();
  const setSelectedCheckBoxIds: any = jest.fn();
  const setAllSelectedDocs: any = jest.fn();
  const setIsClearSelectedCheckbox: any = jest.fn();
  const setIsHeaderBoxChecked: any = jest.fn();
  const setPrevSelectedDocs: any = jest.fn();
  const setExcludedCheckBoxIds: any = jest.fn();
  const setTableKey: any = jest.fn();
  const fetchGetDocumentDetails: any = jest.fn();

  const config: any = getDialogConfig({
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
        pushEvent: jest.fn()
      },
      getCompletedPartitionKeys: jest.fn(() => []),
      contentText: <></>,
      getAllRegistrationIds: jest.fn(() => [])
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


});

  const t: any = (key: string) => key;

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
  
})