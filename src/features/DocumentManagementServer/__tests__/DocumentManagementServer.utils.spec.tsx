import * as Helpers from "../logic/DocumentManagementServer.utils";
import gtmAnalytics from "../../../shared/utils/analytics";

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
});
