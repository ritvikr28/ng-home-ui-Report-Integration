import React from "react";
import dayjs from "dayjs";
import { ISelectedItem, SelectedItem, ValidationTextLevel } from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import { useFetchSchoolNameData } from "../../services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../model/SchoolDomain/responsemodels";
import { DateParts } from "./useFilterDialogLogicProps";

export const getDateString: (date: { day: string; month: string; year: string }) => string = (date) =>
  date.day && date.month && date.year ? `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}` : "";

export const resetDateState: (setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>) => void = (setDate) => {
  setDate({ day: "", month: "", year: "" });
};

export const isValidDate: (dateStr: string, minDateStr?: string) => boolean = (dateStr: string, minDateStr = "1900-01-01") => {
  if (!dateStr) return false;
  const date: dayjs.Dayjs = dayjs(dateStr, "YYYY-MM-DD", true);
  return (
    date.isValid() &&
    !date.isBefore(dayjs(minDateStr), "day") &&
    !date.isAfter(dayjs(), "day")
  );
};


const isFutureDate = (dateStr: string) =>
  dateStr && dayjs(dateStr).isAfter(dayjs(), "day");

const isBeforeMinDate = (dateStr: string) =>
  dateStr && dayjs(dateStr).isBefore(dayjs("1900-01-01"), "day");

const isInvalidFormat = (dateStr: string) =>
  dateStr && !dayjs(dateStr, "YYYY-MM-DD", true).isValid();

interface DateValidationResult {
  isValid: boolean;
  error?: string;
  fromError?: string;
  toError?: string;
}

export const validateDate = (
  dateStr: string,
  otherDateStr: string,
  isFrom: boolean,
  t: any
): DateValidationResult => {
  if (!dateStr) {
    return { isValid: true };
  }

  if (isFutureDate(dateStr)) {
    return {
      isValid: false,
      error: isFrom
        ? t("Filter.fromDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") })
        : t("Filter.toDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") })
    };
  }

  if (isBeforeMinDate(dateStr)) {
    return {
      isValid: false,
      error: isFrom
        ? t("Filter.fromDateMustBeOnOrAfter", { date: "01/01/1900" })
        : t("Filter.toDateMustBeOnOrAfter", { date: "01/01/1900" })
    };
  }

  if (isInvalidFormat(dateStr)) {
    return { isValid: false, error: t("Filter.invalidDate") };
  }

  if (isFrom && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(dateStr), "day")) {
    return {
      isValid: false,
      toError: t("Filter.toDateShouldNotBeBeforeFromDate")
    };
  }

  if (!isFrom && otherDateStr && dayjs(dateStr).isBefore(dayjs(otherDateStr), "day")) {
    return {
      isValid: false,
      error: t("Filter.toDateShouldNotBeBeforeFromDate")
    };
  }

  return { isValid: true };
};

interface HandleDateChangeParams {
  setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  day: string | number;
  month: string | number;
  year: string | number;
  otherDate: { day: string; month: string; year: string };
  isFrom: boolean;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string; toDate: string }>>;
  t: any;
  setFromDateError: React.Dispatch<React.SetStateAction<string>>;
  setToDateError: React.Dispatch<React.SetStateAction<string>>;
}

function getValidationError(params: {
  newDate: DateParts;
  otherDate: DateParts;
  isFrom: boolean;
  t: any;
}): DateValidationResult | null {
  const { newDate, otherDate, isFrom, t }: { newDate: DateParts; otherDate: DateParts; isFrom: boolean; t: any } = params;

  if (!newDate.day || !newDate.month || !newDate.year) {
    return {
      error: t("Filter.invalidDate"),
      isValid: false
    };
  }

  const thisDateStr: string = getDateString(newDate);
  const otherDateStr: string = getDateString(otherDate);


  if (isInvalidFormat(thisDateStr)) {
    return getInvalidFormatError(t);
  }

  if (isFutureDate(thisDateStr)) {
    return getFutureDateError("fromError", t);
  }

  if (isBeforeMinDate(thisDateStr)) {
    return getBeforeMinDateError(isFrom, t);
  }

  if (isFrom && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(thisDateStr), "day")) {
    return getToDateBeforeFromDateError(t);
  }

  if (isFutureDate(otherDateStr)) {
    return getFutureDateError("toError", t);
  }
  if (!isFrom && otherDateStr && dayjs(thisDateStr).isBefore(dayjs(otherDateStr), "day")) {
    return getToDateShouldNotBeBeforeFromDateError(t);
  }

  const result: DateValidationResult = validateDate(thisDateStr, otherDateStr, isFrom, t);
  if (!result.isValid) return result;

  return null;
}



function getInvalidFormatError(t: any): DateValidationResult {
  return {
    error: t("Filter.invalidDate"),
    isValid: false
  };
}

function getFutureDateError(errorType: string, t: any): DateValidationResult {
  return {
    [errorType]: errorType === "fromError"
      ? t("Filter.fromDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") })
      : t("Filter.toDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") }),
    isValid: false
  };
}

function getBeforeMinDateError(isFrom: boolean, t: any): DateValidationResult {
  return {
    error: isFrom
      ? t("Filter.fromDateMustBeOnOrAfter", { date: "01/01/1900" })
      : t("Filter.toDateMustBeOnOrAfter", { date: "01/01/1900" }),
    isValid: false
  };
}

function getToDateBeforeFromDateError(t: any): DateValidationResult {
  return {
    toError: t("Filter.toDateShouldNotBeBeforeFromDate"),
    isValid: false
  };
}

function getToDateShouldNotBeBeforeFromDateError(t: any): DateValidationResult {
  return {
    error: t("Filter.toDateShouldNotBeBeforeFromDate"),
    isValid: false
  };
}


interface ErrorSetters {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setFromDateError: React.Dispatch<React.SetStateAction<string>>;
  setToDateError: React.Dispatch<React.SetStateAction<string>>;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
}

function applyValidationError(
  validation: DateValidationResult,
  setters: ErrorSetters
): void {
  const { setError, setFromDateError, setToDateError, setIsDateError }: ErrorSetters = setters;

  setError(validation.error || "");
  if (validation.fromError) setFromDateError(validation.fromError);
  if (validation.toError) setToDateError(validation.toError);

  setIsDateError(true);
}


export function handleDateChange({
  setDate,
  setError,
  day,
  month,
  year,
  otherDate,
  isFrom,
  setIsDateError,
  setSelectedDateRange,
  t,
  setFromDateError,
  setToDateError
}: HandleDateChangeParams): void {
  const newDate: DateParts = {
    day: day?.toString() ?? "",
    month: month?.toString() ?? "",
    year: year?.toString() ?? ""
  };

  setDate(newDate);

  // Special rule: To Date entered before From Date
  if (!isFrom && isEmptyDate(otherDate)) {
    setFromDateError(t("Filter.fromDateRequired"));
    setToDateError("");
    setIsDateError(true);
    return;
  }

  if (isFrom && isEmptyDate(newDate)) {
    setFromDateError("");
  }

  const validation: DateValidationResult | null = getValidationError({
    newDate,
    otherDate,
    isFrom,
    t
  });

  if (validation) {
    applyValidationError(validation, {
      setError,
      setFromDateError,
      setToDateError,
      setIsDateError
    });
    return;
  }

  // ✅ Success
  setError("");
  setFromDateError("");
  setToDateError("");
  setIsDateError(false);

  const thisDateStr: string = getDateString(newDate);
  const otherDateStr: string = getDateString(otherDate);

  setSelectedDateRange({
    fromDate: isFrom ? thisDateStr : otherDateStr,
    toDate: !isFrom ? thisDateStr : otherDateStr
  });
}


// --- Helper functions ---

function isEmptyDate(date: { day: string; month: string; year: string }): boolean {
  return !date.day && !date.month && !date.year;
}

export interface HandleApplyWrapperParams {
  localSelectedRelatedTo: any;
  setRelatedToError: (msg: string) => void;
  t: any;
  selectedKey: string;
  localTagListArray: any[];
  setSearchSelectionError: (msg: string) => void;
  selectedDisplayKey: string;
  handleDateChange: (...args: any[]) => void;
  setFromDate: any;
  setFromDateError: any;
  fromDate: { day: string; month: string; year: string };
  toDate: { day: string; month: string; year: string };
  setIsDateError: any;
  setSelectedDateRange: any;
  setToDateError: any;
  fromDateError: string;
  toDateError: string;
  isDateError: boolean;
  setSelectedCategories: any;
  localSelectedCategories: any;
  localSelectedDateRange: any;
  setTagListArray: any;
  setSelectedRelatedTo: any;
  setDocumentRelatedTo: any;
  handleApply: any;
  refId: any;
  filterEntities: any;
  setWasApplied: any;
  gtmAnalytics: any;
  selectedDateRange: any;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}
const validateApply = (params: HandleApplyWrapperParams): boolean => {
  if (!params.localSelectedRelatedTo) {
    params.setRelatedToError(params.t("Filter.relatedToRequired"));
    return false;
  }

  if (
    ["Pupil", "Disgybl", "Staff"].includes(params.selectedKey) &&
    params.localTagListArray.length === 0
  ) {
    params.setSearchSelectionError(
      params.t("Filter.entityIsRequired", {
        entity: params.t(`Filter.${params.selectedDisplayKey}`)
      })
    );
    return false;
  }

  return true;
};

export async function handleApplyWrapper(params: HandleApplyWrapperParams): Promise<void> {
  if (!validateApply(params)) return;

  params.setRelatedToError("");
  params.setSearchSelectionError("");

  params.setSelectedCategories(params.localSelectedCategories);
  params.setSelectedDateRange(params.localSelectedDateRange);
  params.setTagListArray(params.localTagListArray);
  params.setSelectedRelatedTo(params.localSelectedRelatedTo);
  params.setDocumentRelatedTo(Number(params.localSelectedRelatedTo?.value));

  params.handleApply(params.refId, params.localSelectedCategories, params.filterEntities);
  params.setWasApplied(true);
  params.setSearchText("");
  params.setSearchInput("");

  params.gtmAnalytics.pushEvent({
    event: "key_action",
    actionType: "advanced_search"
  });
}



export function onSelectMultipleCategories(
  setLocalSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>,
  items: ISelectedItem[]
): void {
  setLocalSelectedCategories(prev => {
    const dateRangeIndex: number = prev.findIndex(item => item.data?.type === "dateRange");
    const dateRangeItem: ISelectedItem | undefined = prev[dateRangeIndex];

    const newItems: ISelectedItem[] = items
      .filter(item => item.data?.type !== "dateRange")
      .map(item => ({
        ...item,
        text:
          item.text ||
          (typeof item.data === "string"
            ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
            : "")
      }));

    let insertIndex: number = newItems.length;
    if (dateRangeItem && dateRangeIndex > 0) {
      const prevBeforeDate: any[] = prev.slice(0, dateRangeIndex).map(i => i.data);
      insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
      if (insertIndex === -1) insertIndex = newItems.length;
      else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
    } else if (dateRangeItem) {
      insertIndex = 0;
    }

    if (dateRangeItem) {
      const safeDateRangeItem: ISelectedItem = {
        ...dateRangeItem,
        text: dateRangeItem.text ?? ""
      };
      newItems.splice(insertIndex, 0, safeDateRangeItem);
    }
    return newItems;
  });
}

/* istanbul ignore next */

export const getEntityLabel: (entity: string) => string = (entity: string) => {
  const { t }: { t: any } = useTranslation();
  if (!entity) return "";
  let key = "";
  const lowerEntity: string = entity.toLowerCase();
  if (lowerEntity === "pupil") {
    key = "Filter.pupils";
  }
  else if (lowerEntity === "disgybl") {
    key = "Filter.pupils";
  } else if (lowerEntity === "staff") {
    key = "Filter.staffs";
  }
  return key ? t(key) : "";
};


interface ClearAllParams {
  setFromDate: any;
  setToDate: any;
  setFromDateError: any;
  setToDateError: any;
  setIsDateError: any;
  setRelatedToError: any;
  setSearchTerm: any;
  setSuggestions: any;
  setShowSearchError: any;
  setLocalSelectedCategories: any;
  setLocalSelectedDateRange: any;
  setLocalTagListArray: any;
  setLocalSelectedRelatedTo: any;
  setCategoryError: any;
  setRelatedToSelected: any;
  setSearchSelectionError: any;
  setRefId: any;
}

export const clearAll: (params: ClearAllParams) => void = ({
  setFromDate,
  setToDate,
  setFromDateError,
  setToDateError,
  setIsDateError,
  setRelatedToError,
  setSearchTerm,
  setSuggestions,
  setShowSearchError,
  setLocalSelectedCategories,
  setLocalSelectedDateRange,
  setLocalTagListArray,
  setLocalSelectedRelatedTo,
  setCategoryError,
  setRelatedToSelected,
  setSearchSelectionError,
  setRefId
}: ClearAllParams) => {
  resetDateState(setFromDate);
  resetDateState(setToDate);
  setFromDateError("");
  setToDateError("");
  setIsDateError(false);
  setRelatedToError("");
  setSearchTerm("");
  setSuggestions([]);
  setShowSearchError(false);

  setLocalSelectedCategories([]);
  setLocalSelectedDateRange({ fromDate: "", toDate: "" });
  setLocalTagListArray([]);
  setLocalSelectedRelatedTo(undefined);
  setCategoryError(false);
  setRelatedToSelected(false);
  setRelatedToError("");
  setSearchSelectionError("");
  setRefId([]);
};

export const fetchSchoolData: (
  setSchoolData: React.Dispatch<React.SetStateAction<any>>
) => void = async (setSchoolData) => {
  const data: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
  setSchoolData(data);
};

export const handleDialogClose: (
  setRelatedToSelected: any,
  setRelatedToError: any,
  setSearchSelectionError: any,
  setSuggestions: any,
  onClose: any,
  setShowErrorBanner: any,
  setShowSearchError: any
) => void = (
  setRelatedToSelected,
  setRelatedToError,
  setSearchSelectionError,
  setSuggestions,
  onClose,
  setShowErrorBanner,
  setShowSearchError
) => {
    setRelatedToSelected(false);
    setRelatedToError("");
    setSearchSelectionError("");
    setSuggestions([]);
    onClose();
    setShowErrorBanner(false);      // <-- Reset error banner
    setShowSearchError(false);      // <-- Reset search error
    setSearchSelectionError("");    // <-- Reset search selection error    
  }

export const handleRemoveTag: any = (
  e: React.SyntheticEvent<Element, Event>,
  text: string,
  closeObj: any,
  setLocalTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>,
  setReferenceExternalIds: React.Dispatch<React.SetStateAction<string[]>>,
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
  localTagListArray: SelectedItem[]
) => {
  setLocalTagListArray(prev => prev.filter(tag => tag.id !== closeObj.id));
  if (setReferenceExternalIds) {
    setReferenceExternalIds(prev => prev.filter(id => id !== closeObj.id?.toString()));
  }
  setIsDropdownOpen(localTagListArray.length > 1); // Hide dropdown if no tags left after removal

}

/* istanbul ignore next */
export const getValidationTextMsg: (
  categoryError: boolean,
  t: any
) => string | undefined = (
  categoryError,
  t
) => {
    if (categoryError) {
      return t("Filter.informationUnavailable");
    }
    return undefined;
  }
/* istanbul ignore next */
export const getValidationLevelMsg: (
  categoryError: boolean
) => ValidationTextLevel | undefined = (
  categoryError
) => {
    if (categoryError) {
      return ValidationTextLevel.Warning;
    }
    return undefined;
  }

/* istanbul ignore next */

export const shouldShowWarningNotification = (
  categoryError: boolean,
  relatedToSelected: boolean,
  localSelectedRelatedTo?: ISelectedItem
): boolean =>
  categoryError ||
  (relatedToSelected &&
    !["Pupil", "Staff", "Organisation", "School"].includes(
      localSelectedRelatedTo?.data?.data?.key ?? ""
    ));
