import {
  Dialog,
  Button,
  ButtonColor,
  FormLabel,
  Dropdown,
  DropdownItem,
  ISelectedItem,
  DateInput,
  ButtonSize,
  ValidationTextLevel,
  Loader,
  LoaderType,
  Search,
  ISearchItemProp,
  Suggestion,
  TextInputSize,
  SelectedItem,
  Notification,
  NotificationStatus
} from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./style.scss";
import { CategoryData } from "../../../features/DocumentManagementServer/responseModel";
import { relatedToEnum } from "../../../../public/Constants";
import { addUniqueTagItem, fetchDocumentCategoryData, filterNonEmptySuggestions, getAllRegistrationIds, getValidationState, handleSearchChange } from "../../../features/DocumentManagementServer/DocumentManagementServer.logic";
import { getUserOrganisation } from "../../utils";
import gtmAnalytics from "../../utils/analytics";
import { useFetchSchoolNameData } from "../../services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../model/SchoolDomain/responsemodels";

interface FilterDialogProps {
  dataTestId?: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  selectedCategories: ISelectedItem[];
  handleApply: (referenceExternalIds: string[], categories?: ISelectedItem[], entities?: any[]) => void;
  isFilterDialogOpen: boolean;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  isDateError: boolean;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string, toDate: string }>>
  selectedDateRange: { fromDate: string, toDate: string }
  isLoading?: boolean;
  setReferenceExternalIds?: React.Dispatch<React.SetStateAction<string[]>>;
  setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>;
  selectedRelatedTo: ISelectedItem | undefined;
  setSelectedRelatedTo: React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>;
  tagListArray: SelectedItem[];
  setTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
}

const FilterDialog = ({
  dataTestId = "dms-filter-dialog",
  title,
  isOpen,
  onClose,
  setSelectedCategories,
  selectedCategories,
  handleApply,
  isDateError,
  isFilterDialogOpen,
  setIsDateError,
  setSelectedDateRange,
  selectedDateRange,
  isLoading,
  setReferenceExternalIds,
  setDocumentRelatedTo,
  selectedRelatedTo,
  setSelectedRelatedTo,
  tagListArray,
  setTagListArray
}: FilterDialogProps) => {
  const { t } = useTranslation();
  const [fromDateError, setFromDateError] = useState<string>("");
  const [toDateError, setToDateError] = useState<string>("");
  const [fromDate, setFromDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [toDate, setToDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [wasApplied, setWasApplied] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [showSearchError, setShowSearchError] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<CategoryData[]>([]);
  const [relatedToError, setRelatedToError] = useState<string>("");
  const [searchSelectionError, setSearchSelectionError] = useState<string>("");
  const [localSelectedCategories, setLocalSelectedCategories] = useState<ISelectedItem[]>([]);
  const [localSelectedDateRange, setLocalSelectedDateRange] = useState<{ fromDate: string, toDate: string }>(selectedDateRange);
  const [localTagListArray, setLocalTagListArray] = useState<SelectedItem[]>(tagListArray);
  const [localSelectedRelatedTo, setLocalSelectedRelatedTo] = useState<ISelectedItem | undefined>();
  const [relatedToSelected, setRelatedToSelected] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [alreadyExistingTags, setAlreadyExistingTags] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>(localSelectedRelatedTo?.data?.data?.key || "");
  const selectedDisplayKey = selectedKey === "Organisation" ? "School" : selectedKey;
  const [schoolData, setSchoolData] = useState<ISchoolNameDataResponse | null>(null);
  const [refId, setRefId] = useState<string[]>([]);
  const [filterEntities, setFilterEntities] = useState<any[]>([]);
  const [categoryError, setCategoryError] = useState<boolean>(false);

  // eslint-disable-next-line no-unused-expressions
  alreadyExistingTags;

const getDateString = (date: { day: string; month: string; year: string }) =>
  date.day && date.month && date.year ? `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}` : "";

const resetDateState = (setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>) => {
  setDate({ day: "", month: "", year: "" });
};
const { validationText, validationTextLevel } = getValidationState(searchSelectionError, showSearchError, t);

const clearAll = () => {
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

  const fetchSchoolData = async () => {
    const data = await useFetchSchoolNameData();
    setSchoolData(data);
  };

  useEffect(() => {
    if (selectedDisplayKey === "School") {
      fetchSchoolData();
    }
  }, [selectedDisplayKey]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCategories(selectedCategories);
      setLocalSelectedDateRange(selectedDateRange);
      setLocalTagListArray(tagListArray);
      setLocalSelectedRelatedTo(selectedRelatedTo);
    }
  }, [isOpen]);

  useEffect(() => {
      setSelectedKey(localSelectedRelatedTo?.data?.data?.key || "");
  }, [localSelectedRelatedTo]);

  /* istanbul ignore next */
  useEffect(() => {
    if (isOpen) {
      let ids: string[] = [];
      let entities: any[] = localTagListArray || [];
      if (selectedKey === "Pupil") {
        ids = localTagListArray.map(item => (item as any).learnerExternalId).filter(Boolean);
      } else if (selectedKey === "Staff") {
        ids = localTagListArray.map(item => (item as any).externalId).filter(Boolean);
      } else if ((selectedKey === "Organisation" || selectedKey === "School") && schoolData) {
        const orgId = getUserOrganisation();
        ids = orgId ? [orgId] : [];
        const orgSchoolEntity = {
          organisationId: orgId,
          schoolName: schoolData?.schoolName || "",
        };
        entities = orgSchoolEntity ? [orgSchoolEntity] : [];
      }

      setRefId(ids);
      setFilterEntities(entities);
    }
  }, [selectedKey, localTagListArray, schoolData, isOpen]);


  /* istanbul ignore next */
  useEffect(() => {
    const payload = { CategoryRequest: { ReferenceExternalId: refId || [] } };

    if (isOpen && (selectedKey === "Organisation" || selectedKey === "School") && refId?.length > 0) {
      fetchDocumentCategoryData({ payload, setCategoryError, setAvailableCategories, setLocalSelectedCategories, localSelectedCategories })

    }
    else if (isOpen && localSelectedRelatedTo && localSelectedRelatedTo.text && localSelectedRelatedTo.text.length > 0 && refId?.length > 0) {
      const payload = { CategoryRequest: { ReferenceExternalId: refId || [] } };
      fetchDocumentCategoryData({ payload, setCategoryError, setAvailableCategories, setLocalSelectedCategories, localSelectedCategories })
    }
  }, [localSelectedRelatedTo?.text, isOpen, refId]);


  useEffect(() => {
    if (refId.length === 0) {
      setCategoryError(false);
    }
  }, [refId, isOpen, selectedCategories, schoolData]);

// Use keys for logic, translation for display
const relatedTo = Object.entries(relatedToEnum).map(([key, value]) => ({
  value,
  text: t(`Filter.${key === "Organisation" ? "School" : key}`),
  data: { key }, // property shorthand for key
}));

useEffect(() => {
  const hasFrom = !!selectedDateRange.fromDate;
  const hasTo = !!selectedDateRange.toDate;

  if (hasFrom || hasTo) {
    const from = hasFrom ? dayjs(selectedDateRange.fromDate).format("DD MMM YYYY") : "";
    const to = hasTo ? dayjs(selectedDateRange.toDate).format("DD MMM YYYY") : "";

    let dateString = "";
      if (hasFrom && hasTo) {
        dateString = `${from} to ${to}`;
      } else if (hasFrom) {
        dateString = `${from} to -`;
      }

    const dateVal = {
      text: dateString,
      data: { type: "dateRange" },
      value: dateString,
    };

    setSelectedCategories((prev) => {
      const index = prev.findIndex(item => item.data?.type === "dateRange");
      if (index === -1) return [...prev, dateVal];
      const updated = [...prev];
      updated[index] = dateVal;
      return updated;
    });
  } else {
    setSelectedCategories((prev) =>
      prev.filter(item => item.data?.type !== "dateRange")
    );
  }
}, [selectedDateRange?.fromDate, selectedDateRange?.toDate]);

  useEffect(() => {
    if (selectedDateRange?.toDate && dayjs(selectedDateRange.toDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
      const [year, month, day] = selectedDateRange.toDate.split("-");
      setToDate({ day, month, year })
    }
    if (selectedDateRange?.fromDate && dayjs(selectedDateRange.fromDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
      const [year, month, day] = selectedDateRange.fromDate.split("-");
      setFromDate({ day, month, year })
    }
    setTagListArray(tagListArray);
    if(tagListArray.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [isFilterDialogOpen, selectedDateRange]);

   useEffect(() => {
  if (selectedDateRange?.fromDate || selectedDateRange?.toDate) {
    const from = dayjs(selectedDateRange.fromDate).format("DD MMM YYYY");
    const to = selectedDateRange.toDate && dayjs(selectedDateRange.toDate).format("DD MMM YYYY");
      let dateString = "";
    if (selectedDateRange.fromDate && selectedDateRange.toDate) {
      dateString = `${from} to ${to}`;
    } else if (selectedDateRange.fromDate) {
      dateString = `${from} to -`; 
    } 
 
    const dateVal = {
      text: dateString,
      data: { type: "dateRange" },
      value: dateString,
    };
 
    setSelectedCategories((prev) => {
      const index = prev.findIndex(item => item.data?.type === "dateRange");
      if (index === -1) {
        return [...prev, dateVal];
      }
      const updated = [...prev];
      updated[index] = dateVal;
      return updated;
    });
  }
  setFromDate({
    day: selectedDateRange?.fromDate ? dayjs(selectedDateRange.fromDate).date().toString() : "",
    month: selectedDateRange?.fromDate ? (dayjs(selectedDateRange.fromDate).month() + 1).toString() : "",
    year: selectedDateRange?.fromDate ? dayjs(selectedDateRange.fromDate).year().toString() : "",
  });
  setToDate({
    day: selectedDateRange?.toDate ? dayjs(selectedDateRange.toDate).date().toString() : "",
    month: selectedDateRange?.toDate ? (dayjs(selectedDateRange.toDate).month() + 1).toString() : "",
    year: selectedDateRange?.toDate ? dayjs(selectedDateRange.toDate).year().toString() : "",
  });
}, [selectedDateRange?.fromDate, selectedDateRange?.toDate]);

  useEffect(() => {
  if (!isOpen && !wasApplied) {
    setFromDate({ day: "", month: "", year: "" });
    setToDate({ day: "", month: "", year: "" });
    setSelectedDateRange({ fromDate: "", toDate: "" });
    setFromDateError("");
    setToDateError("");
    setIsDateError(false);
  }
  if (!isOpen) {
    setWasApplied(false);
    setSearchTerm("");
    setSuggestions([]);
  }
}, [isOpen]);


 
useEffect(() => {
  if (!isOpen) {
    setCategoryError(false);
    return () => {};
  }

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setCategoryError(false);
      onClose();
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
  
}, [isOpen, onClose]);


        const isValidDate = (dateStr: string, minDateStr = "1900-01-01") => {
          if (!dateStr) return false;
          const date = dayjs(dateStr, "YYYY-MM-DD", true);
          return (
            date.isValid() &&
            !date.isBefore(dayjs(minDateStr), "day") &&
            !date.isAfter(dayjs(), "day")
          );
        };
  
const handleDateChange = (
  setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  day: string | number,
  month: string | number,
  year: string | number,
  otherDate: { day: string; month: string; year: string },
  isFrom: boolean
) => {
  const newDate = {
    day: day.toString() ?? "",
    month: month.toString() ?? "",
    year: year.toString() ?? "",
  };
  setDate(newDate);

  if (
    newDate.day === "00" || newDate.day === "0" ||
    newDate.month === "00" || newDate.month === "0"
  ) {
    setError(t("Filter.invalidDate"));
    setIsDateError(true);
    return;
  }

  const thisDateStr = getDateString(newDate);
  const otherDateStr = getDateString(otherDate);

  if (
    !newDate.day && !newDate.month && !newDate.year &&
    !otherDate.day && !otherDate.month && !otherDate.year
  ) {
    setError("");
    setIsDateError(false);
    setFromDateError("");
    setToDateError("");
    setSelectedDateRange({ fromDate: "", toDate: "" });
    return;
  }

  if (newDate.year && newDate.year.length < 4) {
    setError(isFrom ? t("Filter.fromDateRequired") : "");
    setIsDateError(true);
    return;
  }

  if (!newDate.day && !newDate.month && !newDate.year) {
    setError("");
    setIsDateError(false);
    if (isFrom && otherDate.day && otherDate.month && otherDate.year) {
      setError(t("Filter.fromDateRequired"));
      setIsDateError(true);
    }
    return;
  }

  // If any field is missing (partial date), show required error instead of invalid date
  if (isFrom && (!newDate.day || !newDate.month || !newDate.year)) {
    setError(t("Filter.invalidDate"));
    setIsDateError(true);
    return;
  }

  // --- Validation for From Date ---
  if (isFrom) {
    if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
      setError(t("Filter.fromDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") }));
      setIsDateError(true);
      return;
    }
    if (thisDateStr && dayjs(thisDateStr).isBefore(dayjs("1900-01-01"), "day")) {
      setError(t("Filter.fromDateMustBeOnOrAfter", { date: "01/01/1900" }));
      setIsDateError(true);
      return;
    }
    if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
      setError(t("Filter.invalidDate"));
      setIsDateError(true);
      return;
    }
    // Check if To date is before From date
    if (thisDateStr && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(thisDateStr), "day")) {
      setToDateError(t("Filter.toDateShouldNotBeBeforeFromDate"));
      setIsDateError(true);
    } else {
      // Only clear To date error if To date is valid
      if (isValidDate(otherDateStr)) {
        setToDateError("");
      }
      setIsDateError(false);
    }
    setError("");
  }
  // --- Validation for To Date ---
  else {
    if (!newDate.day || !newDate.month || !newDate.year) {
        setError(t("Filter.invalidDate"));
        setIsDateError(true);
        return;
      }
      if (!otherDate.day || !otherDate.month || !otherDate.year) {
        setFromDateError(t("Filter.fromDateRequired"));
        setIsDateError(true);
        return;
      }
    if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
      setError(`${t("Filter.toDateMustBeOnOrBefore", { date: dayjs().format("DD-MM-YYYY") })}`);
      setIsDateError(true);
      return;
    }
    if (thisDateStr && dayjs(thisDateStr).isBefore(dayjs("1900-01-01"), "day")) {
      setError(t("Filter.toDateMustBeOnOrAfter", { date: "01/01/1900" }));
      setIsDateError(true);
      return;
    }
    if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
      setError(t("Filter.invalidDate"));
      setIsDateError(true);
      return;
    }
    // Check if To date is before From date
    if (otherDateStr && thisDateStr && dayjs(thisDateStr).isBefore(dayjs(otherDateStr), "day")) {
      setError(t("Filter.toDateShouldNotBeBeforeFromDate"));
      setIsDateError(true);
      return;
    } 
      // Only clear From date error if From date is valid
      if (isValidDate(otherDateStr)) {
        setFromDateError("");
      }
      setIsDateError(false);
    
    setError("");
  }

  // Update selectedDateRange
  const fromDateValue = isFrom ? thisDateStr : otherDateStr;
  const toDateValue = !isFrom ? thisDateStr : otherDateStr;
  setSelectedDateRange({ fromDate: fromDateValue, toDate: toDateValue });
};


  const handleApplyWrapper = async () => {
      
      if (!localSelectedRelatedTo) {
        setRelatedToError(t("Filter.relatedToRequired"));
        return;
      }
      setRelatedToError("");

    // Use key for logic
    if ((selectedKey === "Pupil" || selectedKey === "Disgybl"|| selectedKey === "Staff") && localTagListArray.length === 0) {
        setSearchSelectionError(t("Filter.entityIsRequired", { entity: t(`Filter.${selectedDisplayKey}`) }));
        return;
      }
      setSearchSelectionError("");


      handleDateChange(setFromDate, setFromDateError, fromDate.day, fromDate.month, fromDate.year, toDate, true);
      if (fromDateError || toDateError || isDateError) {
        setIsDateError(true);
        return;
      }


    setSelectedCategories(localSelectedCategories);
    setSelectedDateRange(localSelectedDateRange);
    setTagListArray(localTagListArray);
    setSelectedRelatedTo(localSelectedRelatedTo);
    setDocumentRelatedTo(Number(localSelectedRelatedTo?.value));

    handleApply(refId, localSelectedCategories, filterEntities);
      setWasApplied(true);

    gtmAnalytics.pushEvent({
      event: "key_action",
      actionType: "advanced_search"
    });

    const filterValueTags = localTagListArray?.map((item) => item.name)?.length || 0;
    const filterTypeTag = localSelectedRelatedTo?.text === "Organisation" || localSelectedRelatedTo?.text === "School" ? "School" : localSelectedRelatedTo?.text || "";
    if(localSelectedRelatedTo?.text) {
      gtmAnalytics.pushEvent({
        event: "apply_filter",
        filterType: filterTypeTag,
        filterValue: localSelectedRelatedTo.text === "Organisation" || localSelectedRelatedTo.text === "School" ? "" : filterValueTags
      });
    }

    /* istanbul ignore next */
    if (localSelectedCategories && localSelectedCategories.length > 0) {
      gtmAnalytics.pushEvent({
        event: "apply_filter",
        filterType: "Category",
        filterValue: ""
      });
    }
    if ((selectedDateRange?.fromDate || selectedDateRange?.toDate) &&
      Object.keys(selectedDateRange).length > 0) {
      Object.keys(selectedDateRange).forEach((key) => {
        const typedKey = key as keyof typeof selectedDateRange;
        if (selectedDateRange[typedKey]) {
          gtmAnalytics.pushEvent({
            event: "apply_filter",
            filterType: typedKey === "fromDate" ? "From Date" : "To Date",
            filterValue: ""
          });
        }
      });
    }
  };

   useEffect(() => {
  if (searchTerm?.length > 1) {
    handleSearchChange(
      t,
      { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
      getAllRegistrationIds(selectedCategories),
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowSearchError,
      localSelectedRelatedTo?.value ? Number(localSelectedRelatedTo.value) : undefined
    );
      }
}, [searchTerm, selectedCategories, selectedDateRange]);

  const filteredSuggestions = filterNonEmptySuggestions(suggestions).map((group, groupIdx) => ({
  ...group,
  values: group.values.map((item, idx) => ({
    ...item,
    props: {
      ...item.props,
      id: item.props?.id ?? `${item.text}-${groupIdx}-${idx}`
    }
  }))
}));

  /* istanbul ignore next */
  const getEntityLabel = (entity: string) => {
    if (!entity) return "";
    let key = "";
    const lowerEntity = entity.toLowerCase();
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

  /* istanbul ignore next */
  const onSelectMultipleCategories = (_: any, items: ISelectedItem[]) => {
    setLocalSelectedCategories((prev) => {
      const dateRangeIndex = prev.findIndex((item) => item.data?.type === "dateRange");
      const dateRangeItem = prev[dateRangeIndex];

      const newItems = items
        .filter((item) => item.data?.type !== "dateRange")
        .map((item) => ({
          ...item,
          text:
            item.text ||
            (typeof item.data === "string"
              ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
              : ""),
        }));

      let insertIndex = newItems.length;
      if (dateRangeItem && dateRangeIndex > 0) {
        const prevBeforeDate = prev.slice(0, dateRangeIndex).map((i) => i.data);
        insertIndex = newItems.findIndex((i) => !prevBeforeDate.includes(i.data));
        if (insertIndex === -1) insertIndex = newItems.length;
        else insertIndex = newItems.filter((i) => prevBeforeDate.includes(i.data)).length;
      } else if (dateRangeItem) {
        insertIndex = 0;
      }

      if (dateRangeItem) {
        const safeDateRangeItem = {
          ...dateRangeItem,
          text: dateRangeItem.text ?? "",
        };
        newItems.splice(insertIndex, 0, safeDateRangeItem);
      }
      return newItems;
    });
  }

  const handleDialogClose = () => {
    setRelatedToSelected(false);
    setRelatedToError("");
    setSearchSelectionError("");
    setSuggestions([]);
    onClose();
  }

  const handleRemoveTag = (
    e: React.SyntheticEvent<Element, Event>,
    text: string,
    closeObj: any
  ) => {
    if (!closeObj || typeof closeObj.id === "undefined") return;
    setLocalTagListArray(prev => {
      const updated = prev.filter(tag => tag.id !== closeObj.id);
      if (updated.length === 0) setIsDropdownOpen(false); // Hide box if no tags left
      return updated;
    });
    if (setReferenceExternalIds) {
      /* istanbul ignore next */
      setReferenceExternalIds(prev =>
        prev.filter(id => id !== closeObj.id?.toString())
      );
    }
  }

  /* istanbul ignore next */
  const getValidationTextMsg = () => {
    if (categoryError) {
      return t("Filter.informationUnavailable");
    }
    return undefined;
  }
  /* istanbul ignore next */
  const getValidationLevelMsg = () => {
    if (categoryError) {
      return ValidationTextLevel.Warning;
    }
    return undefined;
  }
  return (
    <Dialog
      className="dms-filter-dialog"
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={handleDialogClose}
      title={isLoading ? "" : title}
      
    >
      <>
       {categoryError || (relatedToSelected &&
       !["Pupil", "Staff", "Organisation", "School"].includes(localSelectedRelatedTo?.data?.data?.key ?? "")) ? (
                <Notification
                  className="dms-filter-notification"
                  dataTestId={`${dataTestId}-notification`}
                  status={NotificationStatus.WARNING}
                  title={t("Filter.filterInfoHeading")}
                  message={t("Filter.filterInfoMessage")}
                />
              ) : null}
            </>

      {isLoading ? (
        <div className="filter-dialog-loader">
          <Loader 
            loaderType={LoaderType.Circular}
            loaderText="Please Wait"
           />
        </div>
      ) : (
        <>
      <FormLabel>{t("Filter.relatedToHeading")}</FormLabel>
        <Dropdown
          className="dms-related-to-dropdown"
          dataTestId={`${dataTestId}-related-to`}
          isScrollbarVisible
          selectedItem={localSelectedRelatedTo}
          onSelect={(e, item: ISelectedItem) => {
            setLocalSelectedRelatedTo(item);
            setRelatedToError("");
            setRefId([]);
            setSchoolData(null);
            setRelatedToSelected(true);
            setSuggestions([]);
            setLocalTagListArray([]);
            if (setReferenceExternalIds) setReferenceExternalIds([]);
            setSearchTerm("");
            setShowSearchError(false);
            setIsDropdownOpen(false);
            setSearchSelectionError("");
            setLocalSelectedCategories([]);
            setFromDate({ day: "", month: "", year: "" });
            setToDate({ day: "", month: "", year: "" });
            setSelectedDateRange({ fromDate: "", toDate: "" });
            setSearchKey(prevKey => prevKey + 1);
          }}
          validationText={relatedToError}
          validationTextLevel={relatedToError ? ValidationTextLevel.Error : undefined}
          placeholderText={t("Filter.selectOption")}
        >
          {relatedTo.map((item) => (
            <DropdownItem
              key={item.value}
              data={item}
              id={item.value.toString()}
              text={item.text}
              value={item.value.toString()}
            >
              {item.text}
            </DropdownItem>
          ))}
        </Dropdown>
        {(localSelectedRelatedTo && (localSelectedRelatedTo.data?.data.key === "Pupil" || localSelectedRelatedTo.data?.data.key === "Staff")) && (
          <>
            <Search
                  key={tagListArray.length + searchKey}
                  className="dms-related-to-search"
                  dataTestId={`${dataTestId}-search`}
                  placeholderText={t(`Filter.${(selectedDisplayKey ?? "").toLowerCase()}Name`)}
                  titleText={ t(`Filter.${selectedDisplayKey ?? ""}`)}
                  isFixedMultiSelect
                  isSearchWithId
                  size={TextInputSize.Large}
                  value={searchTerm}
                  searchTerm={searchTerm}
                  debouncerTreshold={1000}
                  setSearchTerm={setSearchTerm}
                  existingValues={[searchTerm]}
                  keyUpHandler={() => {}}
                  onKeyUpLenght={3}
                  isShowListBox={isDropdownOpen && (localTagListArray.length > 0)}
                  headingText={`${t("Filter.selectEntity")} ${getEntityLabel(selectedDisplayKey ?? "")}`}
                  onCloseHandle={ () => {
                    setSearchTerm("")
                  }
                   }
                  isListBox
                  isCommaSeparted
                  getSelectedItems={() => [searchTerm].filter(Boolean).map((text) => ({ text, value: text }))}
                  onItemClick={(item: ISearchItemProp | null) => {
                    setSearchTerm(item?.text || "");
                    addUniqueTagItem({
                      item,
                      selectedRelatedTo: localSelectedRelatedTo,
                      tagListArray: localTagListArray,
                      setTagListArray: setLocalTagListArray,
                      setReferenceExternalIds,
                      maxLimit: 5,
                      setAlreadyExistingTags
                    });
                    setIsDropdownOpen(true);
                    setSearchSelectionError("");
                  }}
                  suggestions={filteredSuggestions}
                  isLoader={isSearchLoading}
                  onChange={(e: any) =>   
                    handleSearchChange(
                      t,
                      e,
                      getAllRegistrationIds(selectedCategories),
                      selectedDateRange?.fromDate,
                      selectedDateRange?.toDate,
                      setSearchTerm,
                      setSuggestions,
                      setShowSearchError,
                      setIsSearchLoading,
                      setShowSearchError
                    )
                  }
                  onFocus={() => {
                    /* istanbul ignore next */
                    setSuggestions(suggestions)
                  }
                  }
                  isNotificationShow={false}
                  validationTextForTagList={t("Filter.entityAlreadyAdded", { entity: t(`Filter.${selectedDisplayKey ?? ""}`) })}
                  validationTextForLimit={t("Filter.entityListLimitReached", { entity: t(`Filter.${selectedDisplayKey ?? ""}`) })}
                  validationTextLevelForTagList={ValidationTextLevel.Warning}
                  validationText={validationText}
                  validationTextLevel={validationTextLevel}
                  addLimit={5}
                  allowSearchIfError={!showSearchError}
                  isCustomInputForAdded
                  tagListValueArray={localTagListArray}
                  onRemoveTag={handleRemoveTag}
                  tagListBoxLabelText={t("Filter.Added")}
                />
          </>
        )}
          
            {refId?.length ? (
              <>
                <FormLabel>{t("Filter.categoryHeading")}</FormLabel>
                <Dropdown
                  dataTestId={`${dataTestId}-categories`}
                  isFixedMultiSelect
                  multiSelect
                  isScrollbarVisible
                  placeholderText={t("Filter.selectOption")}
                  validationText={getValidationTextMsg()}
                  validationTextLevel={getValidationLevelMsg()}
                  selectedItems={localSelectedCategories.filter((item) => item.data?.type !== "dateRange") || []} // Use [] as fallback
                  onSelectMultiple={onSelectMultipleCategories}
                >
                  {availableCategories && Array.from(availableCategories ?? [])
                    ?.slice()
                    .sort((a, b) => a.category.localeCompare(b.category))
                    .map((category) => (
                      <DropdownItem
                        key={`${category.category}-${category.categoryId ?? category.categoryId ?? ""}`}
                        data={category}
                        id={`${category.category}-${category.categoryId ?? category.categoryId ?? ""}`}
                        text={category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                        value={`${category.category}-${category.categoryId ?? category.categoryId ?? ""}`}
                        isSelected={localSelectedCategories.some(
                          (item) =>
                            (item.data?.category || item.data) === category.category &&
                            (item.data?.categoryId || item.data?.id) === (category.categoryId ?? category.categoryId)
                        )}
                      >
                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                      </DropdownItem>
                    ))}
                </Dropdown>
              </>
            ) : null}

      <div className="dms-filter-dialog-date">
        <FormLabel className="date-added">{t("Filter.dateHeading")}</FormLabel>
        <div className="dms-filter-dialog-date-inputs">
          <div className="dms-filter-dialog-fromdate-input">
            <DateInput
              dataTestId={`${dataTestId}-date-added`}
              helpText={t("Filter.fromDateLabel")}
              showDatePicker
               day={fromDate.day ? parseInt(fromDate.day, 10) : undefined}
              month={fromDate.month ? parseInt(fromDate.month, 10) : undefined}
              year={fromDate.year ? parseInt(fromDate.year, 10) : undefined}
                onChange={(day, month, year) =>
                  handleDateChange(setFromDate, setFromDateError, day, month, year, toDate, true)
                }
              invalidDateErrorMessage=""
              validationText={fromDateError}
              isInvalidDate={false}
              validationTextLevel={fromDateError ? ValidationTextLevel.Error : undefined}
            />
          </div>
          <div className="dms-filter-dialog-todate-input">
           <DateInput
              dataTestId={`${dataTestId}-date-added`}
              helpText={t("Filter.toDateLabel")}
              showDatePicker
               day={toDate.day ? parseInt(toDate.day, 10) : undefined}
              month={toDate.month ? parseInt(toDate.month, 10) : undefined}
              year={toDate.year ? parseInt(toDate.year, 10) : undefined}
               onChange={(day, month, year) =>
                  handleDateChange(setToDate, setToDateError, day, month, year, fromDate, false)
                }
              invalidDateErrorMessage=""
              validationText={toDateError}
              isInvalidDate={false}
              validationTextLevel={toDateError ? ValidationTextLevel.Error : undefined}
            />
          </div>
        </div>
      </div>
          
        <div className="dms-filter-dialog-buttons">
        <Button
          dataTestId={`${dataTestId}-clear-btn`}
          onClick={clearAll}
          color={ButtonColor.Secondary}
          size={ButtonSize.Small}
        >
          {t("Filter.clearFilters")}
        </Button>
        <Button
          dataTestId={`${dataTestId}-apply-btn`}
          onClick={handleApplyWrapper}
          color={ButtonColor.Primary}
          size={ButtonSize.Small}
        >
          {t("Filter.applyFilters")}
        </Button>
        </div>
        </>)}
    </Dialog>
  );
};
FilterDialog.defaultProps = {
  dataTestId: "dms-filter-dialog",
  isLoading: false,
  setReferenceExternalIds: () => {}
};

export default FilterDialog;