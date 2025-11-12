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
import { Category } from "../../../features/DocumentManagementServer/responseModel";
import { relatedToEnum } from "../../../../public/Constants";
import { addUniqueTagItem, fetchCategory, filterNonEmptySuggestions, getAllRegistrationIds, handleSearchChange } from "../../../features/DocumentManagementServer/DocumentManagementServer.logic";
import { getUserOrganisation } from "../../utils";

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
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [relatedToError, setRelatedToError] = useState<string>("");
  const [searchSelectionError, setSearchSelectionError] = useState<string>("");
  const [localSelectedCategories, setLocalSelectedCategories] = useState<ISelectedItem[]>(selectedCategories);
  const [localSelectedDateRange, setLocalSelectedDateRange] = useState<{ fromDate: string, toDate: string }>(selectedDateRange);
  const [localTagListArray, setLocalTagListArray] = useState<SelectedItem[]>(tagListArray);
  const [localSelectedRelatedTo, setLocalSelectedRelatedTo] = useState<ISelectedItem | undefined>(selectedRelatedTo);
  const [relatedToSelected, setRelatedToSelected] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [alreadyExistingTags, setAlreadyExistingTags] = useState<boolean>(false);

  // eslint-disable-next-line no-unused-expressions
  alreadyExistingTags;

const getDateString = (date: { day: string; month: string; year: string }) =>
  date.day && date.month && date.year ? `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}` : "";

const resetDateState = (setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>) => {
  setDate({ day: "", month: "", year: "" });
};

let validationText = "";
if (searchSelectionError) {
  validationText = searchSelectionError;
} else if (showSearchError) {
  validationText = t("Filter.informationUnavailable");
}

let validationTextLevel: ValidationTextLevel | undefined;
if (searchSelectionError) {
  validationTextLevel = ValidationTextLevel.Error;
} else if (showSearchError) {
  validationTextLevel = ValidationTextLevel.Warning;
} else {
  validationTextLevel = undefined;
}

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
  setRelatedToSelected(false);
  setRelatedToError("");
  setSearchSelectionError("");
};

useEffect(() => {
  if (isOpen) {
    setLocalSelectedCategories(selectedCategories);
    setLocalSelectedDateRange(selectedDateRange);
    setLocalTagListArray(tagListArray);
    setLocalSelectedRelatedTo(selectedRelatedTo);
  }
   if (selectedRelatedTo && selectedRelatedTo.text && selectedRelatedTo.text.length > 0) {
      fetchCategory(Number(selectedRelatedTo.value)).then((categories) => {
        setAvailableCategories(categories);
      });
    }
}, [isOpen]);

const relatedTo = Object.entries(relatedToEnum).map(([text, value]) => ({
  text,
  value,
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
    if (selectedDateRange?.toDate && dayjs(selectedDateRange?.toDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
      const [year, month, day] = selectedDateRange.toDate.split("-");
      setToDate({ day, month, year })
    }
    if (selectedDateRange?.fromDate && dayjs(selectedDateRange?.fromDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
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
    day: selectedDateRange?.fromDate ? dayjs(selectedDateRange?.fromDate).date().toString() : "",
    month: selectedDateRange?.fromDate ? (dayjs(selectedDateRange?.fromDate).month() + 1).toString() : "",
    year: selectedDateRange?.fromDate ? dayjs(selectedDateRange?.fromDate).year().toString() : "",
  });
  setToDate({
    day: selectedDateRange?.toDate ? dayjs(selectedDateRange?.toDate).date().toString() : "",
    month: selectedDateRange?.toDate ? (dayjs(selectedDateRange?.toDate).month() + 1).toString() : "",
    year: selectedDateRange?.toDate ? dayjs(selectedDateRange?.toDate).year().toString() : "",
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
  }
}, [isOpen]);
 
useEffect(() => {
  if (!isOpen) {
    return () => {};
  }

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
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
    day: day?.toString() ?? "",
    month: month?.toString() ?? "",
    year: year?.toString() ?? "",
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
      setError("To date must be on or after 01/01/1900");
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
      setError("To date should not be before From date.");
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


  const handleApplyWrapper = () => {
      
      if (!localSelectedRelatedTo) {
        setRelatedToError(t("Filter.relatedToRequired"));
        return;
      }
      setRelatedToError("");

      if (
        (localSelectedRelatedTo.text === "Pupil" || localSelectedRelatedTo.text === "Staff") &&
        localTagListArray.length === 0
      ) {
        setSearchSelectionError(t("Filter.entityIsRequired", { entity: localSelectedRelatedTo.text }));
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

      let ids: string[] = [];
      let entities: any[] = [];
      if (localSelectedRelatedTo?.text === "Pupil") {
        ids = localTagListArray.map(item => (item as any).learnerExternalId).filter(Boolean);
        entities = localTagListArray;
      } else if (localSelectedRelatedTo?.text === "Staff") {
        ids = localTagListArray.map(item => (item as any).externalId).filter(Boolean);
        entities = localTagListArray;
      } else if (localSelectedRelatedTo?.text === "Organisation" || localSelectedRelatedTo?.text === "School") {
        const orgId = getUserOrganisation();
        ids = orgId ? [orgId] : [];
        entities = orgId ? [{ organisationId: orgId }] : [];
      }

      handleApply(ids, localSelectedCategories, entities)
      setWasApplied(true);
  };

   useEffect(() => {
  if (searchTerm?.length > 1) {
    handleSearchChange(
      { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
      getAllRegistrationIds(selectedCategories),
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
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
  return (
    <Dialog
      className="dms-filter-dialog"
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={() => {
        setRelatedToSelected(false);
        setRelatedToError("");
        setSearchSelectionError("");
        onClose();
      }}
      title={isLoading ? "" : title}
      
    >
      <>
       {relatedToSelected &&
        (!localSelectedRelatedTo ||
          !["Pupil", "Staff", "Organisation", "School"].includes(localSelectedRelatedTo?.text ?? "")) ? (
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
            setRelatedToSelected(true);
            fetchCategory(Number(item.value))
              .then((categories) => {
                setAvailableCategories(categories);
              })
              .catch((error) => {
                setAvailableCategories([]);
                console.error("Failed to fetch categories", error);
            });
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
              text={item.text === "Organisation" ? "School" : item.text}
              value={item.value.toString()}
            >
              {item.text === "Organisation" ? "School" : item.text}
            </DropdownItem>
          ))}
        </Dropdown>

        {(localSelectedRelatedTo?.text === 'Pupil' || localSelectedRelatedTo?.text === 'Staff') && (
          <>
            <Search
                  key={searchKey}
                  className="dms-related-to-search"
                  dataTestId={`${dataTestId}-search`}
                  placeholderText={`${localSelectedRelatedTo?.text} name`} 
                  titleText={`${localSelectedRelatedTo?.text}`}
                  isFixedMultiSelect
                  isSearchWithId
                  size={TextInputSize.Large}
                  value={searchTerm}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  existingValues={[searchTerm]}
                  keyUpHandler={() => {}}
                  onKeyUpLenght={2}
                  isShowListBox={isDropdownOpen && (localTagListArray.length > 0)}
                  headingText={`${t("Filter.selectEntity")} ${localSelectedRelatedTo?.text}s`}
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
                      e,
                      getAllRegistrationIds(selectedCategories),
                      selectedDateRange?.fromDate,
                      selectedDateRange?.toDate,
                      setSearchTerm,
                      setSuggestions,
                      setShowSearchError,
                      setIsSearchLoading
                    )
                  }
                  onFocus={() => {
                    setSuggestions(suggestions)
                  }
                  }
                  isNotificationShow={false}
                  validationTextForTagList={t("Filter.entityAlreadyAdded", { entity: localSelectedRelatedTo.text })}
                  validationTextForLimit={t("Filter.entityListLimitReached", { entity: localSelectedRelatedTo.text })}
                  validationTextLevelForTagList={ValidationTextLevel.Warning}
                  validationText={validationText}
                  validationTextLevel={validationTextLevel}
                  addLimit={5}
                  allowSearchIfError={!showSearchError}
                  isCustomInputForAdded
                  tagListValueArray={localTagListArray}
                  onRemoveTag={(e, text, closeObj) => {
                    if (!closeObj || typeof closeObj.id === "undefined") return;
                    setLocalTagListArray(prev => {
                      const updated = prev.filter(tag => tag.id !== closeObj.id);
                      if (updated.length === 0) setIsDropdownOpen(false); // Hide box if no tags left
                      return updated;
                    });
                    if (setReferenceExternalIds) {
                      setReferenceExternalIds(prev =>
                        prev.filter(id => id !== closeObj.id?.toString())
                      );
                    }
                  }}
                  tagListBoxLabelText={t("Filter.Added")}
                />
          </>
        )}
          
            {localSelectedRelatedTo && (
              <>
          <FormLabel>{t("Filter.categoryHeading")}</FormLabel>
        <Dropdown
          dataTestId={`${dataTestId}-categories`}
          isFixedMultiSelect
          multiSelect
          isScrollbarVisible
          placeholderText={t("Filter.selectOption")}
          selectedItems={localSelectedCategories.filter((item) => item.data?.type !== "dateRange") || []} // Use [] as fallback
          onSelectMultiple={(_, items) => {
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
          }}
        >
          {availableCategories && availableCategories
            ?.slice()
            .sort((a, b) => a.application.localeCompare(b.application))
            .map((category) => (
              <DropdownItem
                key={`${category.application}-${category.registrationId ?? category.registrationId ?? ""}`}
                data={category}
                id={`${category.application}-${category.registrationId ?? category.registrationId ?? ""}`}
                text={category.application.charAt(0).toUpperCase() + category.application.slice(1)}
                value={`${category.application}-${category.registrationId ?? category.registrationId ?? ""}`}
                isSelected={localSelectedCategories.some(
                  (item) =>
                    (item.data?.application || item.data) === category.application &&
                    (item.data?.registrationId || item.data?.id) === (category.registrationId ?? category.registrationId)
                )}
              >
                {category.application.charAt(0).toUpperCase() + category.application.slice(1)}
              </DropdownItem>
            ))}
        </Dropdown>
      </>
        )}

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