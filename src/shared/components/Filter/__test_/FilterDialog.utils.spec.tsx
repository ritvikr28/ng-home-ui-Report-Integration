import dayjs from "dayjs";
import * as utils from "../FilterDialog.utils";
import { ValidationTextLevel } from "@essnextgen/ui-kit";
import { validateDate } from "../FilterDialog.utils";

describe("FilterDialog.utils", () => {
  describe("getDateString", () => {
    it("returns formatted date string", () => {
      expect(utils.getDateString({ day: "2", month: "3", year: "2020" })).toBe("2020-03-02");
    });
    it("returns empty string if any part is missing", () => {
      expect(utils.getDateString({ day: "", month: "3", year: "2020" })).toBe("");
      expect(utils.getDateString({ day: "2", month: "", year: "2020" })).toBe("");
      expect(utils.getDateString({ day: "2", month: "3", year: "" })).toBe("");
    });
  });

  describe("resetDateState", () => {
    it("resets date state", () => {
      const setDate: jest.Mock = jest.fn();
      utils.resetDateState(setDate);
      expect(setDate).toHaveBeenCalledWith({ day: "", month: "", year: "" });
    });
  });

  describe("isValidDate", () => {
    it("returns false for empty string", () => {
      expect(utils.isValidDate("")).toBe(false);
    });
    it("returns false for invalid date", () => {
      expect(utils.isValidDate("2020-13-01")).toBe(false);
    });
    it("returns false for date before minDate", () => {
      expect(utils.isValidDate("1899-12-31")).toBe(false);
    });
    it("returns false for date after today", () => {
      const tomorrow: string = dayjs().add(1, "day").format("YYYY-MM-DD");
      expect(utils.isValidDate(tomorrow)).toBe(false);
    });
    it("returns true for valid date", () => {
      expect(utils.isValidDate("2020-03-02")).toBe(true);
    });
    it("respects custom minDate", () => {
      expect(utils.isValidDate("2000-01-01", "2001-01-01")).toBe(false);
      expect(utils.isValidDate("2002-01-01", "2001-01-01")).toBe(true);
    });
  });

  describe("handleDateChange", () => {
    const t: (key: string) => string = (key: string) => key;
    let setDate: jest.Mock, setError: jest.Mock, setIsDateError: jest.Mock, setSelectedDateRange: jest.Mock, setFromDateError: jest.Mock, setToDateError: jest.Mock;
    beforeEach(() => {
      setDate = jest.fn();
      setError = jest.fn();
      setIsDateError = jest.fn();
      setSelectedDateRange = jest.fn();
      setFromDateError = jest.fn();
      setToDateError = jest.fn();
    });

    it("sets error for To Date when From Date is empty", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "1",
        year: "2020",
        otherDate: { day: "", month: "", year: "" },
        isFrom: false,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setFromDateError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
      expect(setToDateError).toHaveBeenCalledWith("");
    });

    it("clears error for empty From Date", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "",
        month: "",
        year: "",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setFromDateError).toHaveBeenCalledWith("");
    });

    it("sets error for zero date", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "0",
        month: "1",
        year: "2020",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for year incomplete", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "1",
        year: "20",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for partial date", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "",
        year: "2020",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for invalid format", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "32",
        month: "1",
        year: "2020",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for future date", () => {
      const future: dayjs.Dayjs = dayjs().add(1, "day");
      utils.handleDateChange({
        setDate,
        setError,
        day: future.date().toString(),
        month: (future.month() + 1).toString(),
        year: future.year().toString(),
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for before min date", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "1",
        year: "1899",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for From > To", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "2",
        month: "1",
        year: "2021",
        otherDate: { day: "1", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setToDateError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets error for To < From", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "1",
        year: "2020",
        otherDate: { day: "2", month: "1", year: "2021" },
        isFrom: false,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalled();
      expect(setIsDateError).toHaveBeenCalledWith(true);
    });

    it("sets success state for valid date", () => {
      utils.handleDateChange({
        setDate,
        setError,
        day: "1",
        month: "1",
        year: "2020",
        otherDate: { day: "2", month: "1", year: "2020" },
        isFrom: true,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
      expect(setError).toHaveBeenCalledWith("");
      expect(setFromDateError).toHaveBeenCalledWith("");
      expect(setToDateError).toHaveBeenCalledWith("");
      expect(setIsDateError).toHaveBeenCalledWith(false);
      expect(setSelectedDateRange).toHaveBeenCalled();
    });
  });

  describe("handleApplyWrapper", () => {
    const t: (key: string) => string = (key: string) => key;
    let params: any;
    beforeEach(() => {
      params = {
        localSelectedRelatedTo: { value: "1" },
        setRelatedToError: jest.fn(),
        t,
        selectedKey: "Pupil",
        localTagListArray: [{ id: 1 }],
        setSearchSelectionError: jest.fn(),
        selectedDisplayKey: "pupils",
        handleDateChange: jest.fn(),
        setFromDate: jest.fn(),
        setFromDateError: jest.fn(),
        fromDate: { day: "1", month: "1", year: "2020" },
        toDate: { day: "2", month: "1", year: "2020" },
        setIsDateError: jest.fn(),
        setSelectedDateRange: jest.fn(),
        setToDateError: jest.fn(),
        fromDateError: "",
        toDateError: "",
        isDateError: false,
        setSelectedCategories: jest.fn(),
        localSelectedCategories: [{ id: 1 }],
        localSelectedDateRange: { fromDate: "2020-01-01", toDate: "2020-01-02" },
        setTagListArray: jest.fn(),
        setSelectedRelatedTo: jest.fn(),
        setDocumentRelatedTo: jest.fn(),
        handleApply: jest.fn(),
        refId: 1,
        filterEntities: [],
        setWasApplied: jest.fn(),
        gtmAnalytics: { pushEvent: jest.fn() },
        selectedDateRange: {}
      };
    });

    it("does not call anything if localSelectedRelatedTo is falsy", async () => {
      params.localSelectedRelatedTo = null;
      await utils.handleApplyWrapper(params);
      expect(params.setRelatedToError).toHaveBeenCalled();
      expect(params.setSelectedCategories).not.toHaveBeenCalled();
    });

    it("does not call anything if tagListArray is empty for Pupil", async () => {
      params.localTagListArray = [];
      await utils.handleApplyWrapper(params);
      expect(params.setSearchSelectionError).toHaveBeenCalled();
      expect(params.setSelectedCategories).not.toHaveBeenCalled();
    });

    it("calls all setters and analytics for valid input", async () => {
      await utils.handleApplyWrapper(params);
      expect(params.setRelatedToError).toHaveBeenCalledWith("");
      expect(params.setSearchSelectionError).toHaveBeenCalledWith("");
      expect(params.setSelectedCategories).toHaveBeenCalledWith(params.localSelectedCategories);
      expect(params.setSelectedDateRange).toHaveBeenCalledWith(params.localSelectedDateRange);
      expect(params.setTagListArray).toHaveBeenCalledWith(params.localTagListArray);
      expect(params.setSelectedRelatedTo).toHaveBeenCalledWith(params.localSelectedRelatedTo);
      expect(params.setDocumentRelatedTo).toHaveBeenCalledWith(Number(params.localSelectedRelatedTo.value));
      expect(params.handleApply).toHaveBeenCalledWith(params.refId, params.localSelectedCategories, params.filterEntities);
      expect(params.setWasApplied).toHaveBeenCalledWith(true);
      expect(params.gtmAnalytics.pushEvent).toHaveBeenCalled();
    });
  });

  describe("onSelectMultipleCategories", () => {
    it("inserts dateRange at correct index", () => {
      const setLocalSelectedCategories: jest.Mock = jest.fn((fn) => {
        const prev: any[] = [
          { data: "A" },
          { data: "B" },
          { data: { type: "dateRange" }, text: "Date" }
        ];
        return fn(prev);
      });
      const items: any[] = [
        { data: "A" },
        { data: { type: "dateRange" }, text: "Date" },
        { data: "B" }
      ];
      utils.onSelectMultipleCategories(setLocalSelectedCategories, items);
      expect(setLocalSelectedCategories).toHaveBeenCalled();
    });

    it("handles no dateRange", () => {
      const setLocalSelectedCategories: jest.Mock = jest.fn((fn) => fn([{ data: "A" }]));
      const items: any[] = [{ data: "A" }];
      utils.onSelectMultipleCategories(setLocalSelectedCategories, items);
      expect(setLocalSelectedCategories).toHaveBeenCalled();
    });

    it("handles dateRange at start", () => {
      const setLocalSelectedCategories: jest.Mock = jest.fn((fn) => {
        const prev: any[] = [
          { data: { type: "dateRange" }, text: "Date" },
          { data: "A" }
        ];
        return fn(prev);
      });
      const items: any[] = [
        { data: { type: "dateRange" }, text: "Date" },
        { data: "A" }
      ];
      utils.onSelectMultipleCategories(setLocalSelectedCategories, items);
      expect(setLocalSelectedCategories).toHaveBeenCalled();
    });
  });



  describe("clearAll", () => {
    it("calls all setters with correct values", () => {
      const setters = [
        "setFromDate", "setToDate", "setFromDateError", "setToDateError", "setIsDateError", "setRelatedToError",
        "setSearchTerm", "setSuggestions", "setShowSearchError", "setLocalSelectedCategories", "setLocalSelectedDateRange",
        "setLocalTagListArray", "setLocalSelectedRelatedTo", "setCategoryError", "setRelatedToSelected", "setSearchSelectionError", "setRefId"
      ];
      const params: any = {};
      setters.forEach(fn => params[fn] = jest.fn());
      utils.clearAll(params);
      expect(params.setFromDate).toHaveBeenCalled();
      expect(params.setToDate).toHaveBeenCalled();
      expect(params.setFromDateError).toHaveBeenCalledWith("");
      expect(params.setToDateError).toHaveBeenCalledWith("");
      expect(params.setIsDateError).toHaveBeenCalledWith(false);
      expect(params.setRelatedToError).toHaveBeenCalledWith("");
      expect(params.setSearchTerm).toHaveBeenCalledWith("");
      expect(params.setSuggestions).toHaveBeenCalledWith([]);
      expect(params.setShowSearchError).toHaveBeenCalledWith(false);
      expect(params.setLocalSelectedCategories).toHaveBeenCalledWith([]);
      expect(params.setLocalSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
      expect(params.setLocalTagListArray).toHaveBeenCalledWith([]);
      expect(params.setLocalSelectedRelatedTo).toHaveBeenCalledWith(undefined);
      expect(params.setCategoryError).toHaveBeenCalledWith(false);
      expect(params.setRelatedToSelected).toHaveBeenCalledWith(false);
      expect(params.setSearchSelectionError).toHaveBeenCalledWith("");
      expect(params.setRefId).toHaveBeenCalledWith([]);
    });
  });

  describe("getValidationTextMsg", () => {
    it("returns info unavailable if categoryError", () => {
      const t = (key: string) => "msg";
      expect(utils.getValidationTextMsg(true, t)).toBe("msg");
      expect(utils.getValidationTextMsg(false, t)).toBeUndefined();
    });
  });

  describe("getValidationLevelMsg", () => {
    it("returns warning if categoryError", () => {
      expect(utils.getValidationLevelMsg(true)).toBe(ValidationTextLevel.Warning);
      expect(utils.getValidationLevelMsg(false)).toBeUndefined();
    });
  });

  describe("shouldShowWarningNotification", () => {
    it("returns true if categoryError", () => {
      expect(utils.shouldShowWarningNotification(true, false)).toBe(true);
    });
    it("returns true if relatedToSelected and not allowed key", () => {
      expect(utils.shouldShowWarningNotification(false, true, { data: { data: { key: "Other" } } })).toBe(true);
    });
    it("returns false if not categoryError and allowed key", () => {
      expect(utils.shouldShowWarningNotification(false, true, { data: { data: { key: "Pupil" } } })).toBe(false);
    });
  });

  describe("handleDialogClose", () => {
    it("calls all setters and onClose", () => {
      const setRelatedToSelected: jest.Mock = jest.fn();
      const setRelatedToError: jest.Mock = jest.fn();
      const setSearchSelectionError: jest.Mock = jest.fn();
      const setSuggestions: jest.Mock = jest.fn();
      const onClose: jest.Mock = jest.fn();
      utils.handleDialogClose(setRelatedToSelected, setRelatedToError, setSearchSelectionError, setSuggestions, onClose);
      expect(setRelatedToSelected).toHaveBeenCalledWith(false);
      expect(setRelatedToError).toHaveBeenCalledWith("");
      expect(setSearchSelectionError).toHaveBeenCalledWith("");
      expect(setSuggestions).toHaveBeenCalledWith([]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("handleRemoveTag", () => {
    it("removes tag and updates reference ids", () => {
      const setLocalTagListArray: jest.Mock = jest.fn((fn) => fn([{ id: "1" }, { id: "2" }]));
      const setReferenceExternalIds: jest.Mock = jest.fn((fn) => fn(["1", "2"]));
      const setIsDropdownOpen: jest.Mock = jest.fn();
      utils.handleRemoveTag(
        {} as any,
        "tag",
        { id: "1" },
        setLocalTagListArray,
        setReferenceExternalIds,
        setIsDropdownOpen,
        [{ id: "1" }, { id: "2" }]
      );
      expect(setLocalTagListArray).toHaveBeenCalled();
      expect(setReferenceExternalIds).toHaveBeenCalled();
      expect(setIsDropdownOpen).toHaveBeenCalledWith(true);
    });

    it("works without setReferenceExternalIds", () => {
      const setLocalTagListArray: jest.Mock = jest.fn((fn) => fn([{ id: "1" }]));
      const setIsDropdownOpen: jest.Mock = jest.fn();
      utils.handleRemoveTag(
        {} as any,
        "tag",
        { id: "1" },
        setLocalTagListArray,
        undefined,
        setIsDropdownOpen,
        [{ id: "1" }]
      );
      expect(setLocalTagListArray).toHaveBeenCalled();
      expect(setIsDropdownOpen).toHaveBeenCalledWith(false);
    });
  });
});

describe("validateDate coverage", () => {
  const t: jest.Mock = jest.fn((key: string) => key);

  it("returns invalid for empty dateStr", () => {
    // Covers: if (!dateStr) { return { isValid: false, error: t("Filter.invalidDate") }; }
    const result: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("", "", true, t);
    expect(result).toEqual({ isValid: false, error: "Filter.invalidDate" });
  });

  it("returns invalid for invalid format", () => {
    // Covers: if (isInvalidFormat(dateStr)) { return { isValid: false, error: t("Filter.invalidDate") }; }
    const result: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("2020-13-40", "", true, t);
    expect(result).toEqual({ isValid: false, error: "Filter.invalidDate" });
  });

  it("returns invalid for To date before From date", () => {
    // Covers: if (!isFrom && otherDateStr && dayjs(dateStr).isBefore(dayjs(otherDateStr), "day"))
    const result: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("2020-01-01", "2020-01-02", false, t);
    expect(result).toEqual({ isValid: false, error: "Filter.toDateShouldNotBeBeforeFromDate" });
  });
});

describe("validateDate and handleDateChange - branch coverage", () => {
  const t: jest.Mock = jest.fn((key: string, opts?: any) => opts ? `${key}:${opts.date}` : key);

  it("returns error for future date (isFutureDate)", () => {
    const future: string = dayjs().add(1, "day").format("YYYY-MM-DD");
    const resultFrom: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate(future, "", true, t);
    expect(resultFrom).toEqual({
      isValid: false,
      error: "Filter.fromDateMustBeOnOrBefore:" + dayjs().format("DD-MM-YYYY")
    });
    const resultTo: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate(future, "", false, t);
    expect(resultTo).toEqual({
      isValid: false,
      error: "Filter.toDateMustBeOnOrBefore:" + dayjs().format("DD-MM-YYYY")
    });
  });

  it("returns error for before min date (isBeforeMinDate)", () => {
    const resultFrom: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("1899-12-31", "", true, t);
    expect(resultFrom).toEqual({
      isValid: false,
      error: "Filter.fromDateMustBeOnOrAfter:01/01/1900"
    });
    const resultTo: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("1899-12-31", "", false, t);
    expect(resultTo).toEqual({
      isValid: false,
      error: "Filter.toDateMustBeOnOrAfter:01/01/1900"
    });
  });

  it("returns toError for From date after To date", () => {
    // isFrom && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(dateStr), "day")
    const result: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("2022-01-02", "2022-01-01", true, t);
    expect(result).toEqual({
      isValid: false,
      toError: "Filter.toDateShouldNotBeBeforeFromDate"
    });
  });

  it("returns error for To date before From date", () => {
    // !isFrom && otherDateStr && dayjs(dateStr).isBefore(dayjs(otherDateStr), "day")
    const result: { isValid: boolean; error?: string; toError?: string; fromError?: string } = validateDate("2022-01-01", "2022-01-02", false, t);
    expect(result).toEqual({
      isValid: false,
      error: "Filter.toDateShouldNotBeBeforeFromDate"
    });
  });

  it("handleDateChange sets error, toError, and fromError correctly", () => {
    const setDate: jest.Mock = jest.fn();
    const setError: jest.Mock = jest.fn();
    const setIsDateError: jest.Mock = jest.fn();
    const setSelectedDateRange: jest.Mock = jest.fn();
    const setFromDateError: jest.Mock = jest.fn();
    const setToDateError: jest.Mock = jest.fn();

    // To date before From date triggers error
    utils.handleDateChange({
      setDate,
      setError,
      day: "1",
      month: "1",
      year: "2022",
      otherDate: { day: "2", month: "1", year: "2022" },
      isFrom: false,
      setIsDateError,
      setSelectedDateRange,
      t,
      setFromDateError,
      setToDateError
    });
    expect(setError).toHaveBeenCalledWith("Filter.toDateShouldNotBeBeforeFromDate");
    expect(setIsDateError).toHaveBeenCalledWith(true);

    // From date after To date triggers toError
    setError.mockClear();
    setIsDateError.mockClear();
    setFromDateError.mockClear();
    setToDateError.mockClear();

    utils.handleDateChange({
      setDate,
      setError,
      day: "2",
      month: "1",
      year: "2022",
      otherDate: { day: "1", month: "1", year: "2022" },
      isFrom: true,
      setIsDateError,
      setSelectedDateRange,
      t,
      setFromDateError,
      setToDateError
    });
    expect(setToDateError).toHaveBeenCalledWith("Filter.toDateShouldNotBeBeforeFromDate");
    expect(setIsDateError).toHaveBeenCalledWith(true);
  });
});