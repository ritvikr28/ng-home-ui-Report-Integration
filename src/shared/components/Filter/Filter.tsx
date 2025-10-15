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
  SelectedItem
} from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./style.scss";
import { Category } from "../../../features/DocumentManagementServer/responseModel";
import { relatedToEnum } from "../../../../public/Constants";
import { filterNonEmptySuggestions, getAllRegistrationIds, handleSearchChange } from "../../../features/DocumentManagementServer/DocumentManagementServer.logic";

interface FilterDialogProps {
  dataTestId?: string;
  title: string;
  isOpen: boolean;
  availableCategories: Category[];
  onClose: () => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  selectedCategories: ISelectedItem[];
  handleApply: () => void;
  isFilterDialogOpen: boolean;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  isDateError: boolean;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string, toDate: string }>>
  selectedDateRange: { fromDate: string, toDate: string }
  isLoading?: boolean;
}

const FilterDialog = ({
  dataTestId = "dms-filter-dialog",
  title,
  isOpen,
  availableCategories,
  onClose,
  setSelectedCategories,
  selectedCategories,
  handleApply,
  isDateError,
  isFilterDialogOpen,
  setIsDateError,
  setSelectedDateRange,
  selectedDateRange,
  isLoading
}: FilterDialogProps) => {
  const { t } = useTranslation();
  const [fromDateError, setFromDateError] = useState<string>("");
  const [toDateError, setToDateError] = useState<string>("");
  const [fromDate, setFromDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [toDate, setToDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [wasApplied, setWasApplied] = useState(false);
  const [selectedRelatedTo, setSelectedRelatedTo] = useState<ISelectedItem | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [showSearchError, setShowSearchError] = useState<boolean>(false);
  const [relatedToError, setRelatedToError] = useState<string>("");
  const [tagListArray, setTagListArray] = useState<SelectedItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


const getDateString = (date: { day: string; month: string; year: string }) =>
  date.day && date.month && date.year ? `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}` : "";

const resetDateState = (setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>) => {
  setDate({ day: "", month: "", year: "" });
};

const clearAll = () => {
  setSelectedCategories([]);
  resetDateState(setFromDate);
  resetDateState(setToDate);
  setFromDateError("");
  setToDateError("");
  setIsDateError(false);
  setSelectedDateRange({ fromDate: "", toDate: "" });
};

const relatedTo = Object.entries(relatedToEnum).map(([key, value]) => ({
  text: key,
  value: value,
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
    // Return a no-op cleanup function for consistent return
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
    setError("Invalid Date");
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
    setError(isFrom ? "From date is required" : "");
    setIsDateError(true);
    return;
  }

  if (!newDate.day && !newDate.month && !newDate.year) {
    setError("");
    setIsDateError(false);
    if (isFrom && otherDate.day && otherDate.month && otherDate.year) {
      setError("From date is required");
      setIsDateError(true);
    }
    return;
  }

  // If any field is missing (partial date), show required error instead of invalid date
  if (isFrom && (!newDate.day || !newDate.month || !newDate.year)) {
    setError("Invalid Date");
    setIsDateError(true);
    return;
  }

  // --- Validation for From Date ---
  if (isFrom) {
    if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
      setError(`From date must be on or before ${dayjs().format("DD-MM-YYYY")}`);
      setIsDateError(true);
      return;
    }
    if (thisDateStr && dayjs(thisDateStr).isBefore(dayjs("1900-01-01"), "day")) {
      setError("From date must be on or after 01/01/1900");
      setIsDateError(true);
      return;
    }
    if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
      setError("Invalid Date");
      setIsDateError(true);
      return;
    }
    // Check if To date is before From date
    if (thisDateStr && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(thisDateStr), "day")) {
      setToDateError("To date should not be before From date.");
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
        setError("Invalid Date");
        setIsDateError(true);
        return;
      }

    if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
      setError(`To date must be on or before ${dayjs().format("DD-MM-YYYY")}`);
      setIsDateError(true);
      return;
    }
    if (thisDateStr && dayjs(thisDateStr).isBefore(dayjs("1900-01-01"), "day")) {
      setError("To date must be on or after 01/01/1900");
      setIsDateError(true);
      return;
    }
    if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
      setError("Invalid Date");
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

      if (!selectedRelatedTo) {
        setRelatedToError("Pupil, Staff, or School is required.");
        return;
      } else {
        setRelatedToError("");
      }
      
      handleDateChange(setFromDate, setFromDateError, fromDate.day, fromDate.month, fromDate.year, toDate, true);
      if (fromDateError || toDateError || isDateError) {
        setIsDateError(true);
        return;
      }
      setWasApplied(true);
      handleApply();
  };

   useEffect(() => {
  console.log("Search Term:", searchTerm); // Debugging log
  if (searchTerm?.length > 1) {
    handleSearchChange(
      { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
      getAllRegistrationIds(selectedCategories),
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading
    );
    console.log("Fetching suggestions for:", suggestions); // Debugging log
  }
}, [searchTerm, selectedCategories, selectedDateRange]);

  const filteredSuggestions = filterNonEmptySuggestions(suggestions).map((group, groupIdx) => ({
  ...group,
  values: group.values.map((item, idx) => ({
    ...item,
    props: {
      ...item.props,
      id: item.props?.id ?? `${item.text}-${groupIdx}-${idx}` // Ensure unique id
    }
  }))
}));
useEffect(() => {
  if (filteredSuggestions.length > 0) {
    console.log("Suggestions updated, showing dropdown:", filteredSuggestions);
    setShowSearchError(false); // Clear any previous errors
  } else if (!isSearchLoading) {
    console.log("No suggestions available");
    setShowSearchError(true); // Show error if no suggestions and not loading
  }
}, [suggestions, isSearchLoading]);

  return (
    <Dialog
      className="dms-filter-dialog"
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={onClose}
      title={isLoading ? "" : title}
      
    >
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
          selectedItem={selectedRelatedTo}
          onSelect={(e, item: ISelectedItem) => {
            setSelectedRelatedTo(item);
            setRelatedToError("");
          }}
          validationText={relatedToError}
          validationTextLevel={relatedToError ? ValidationTextLevel.Error : undefined}
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

        {selectedRelatedTo && (
          <>
            <Search
                  className="dms-related-to-search"
                  dataTestId={`${dataTestId}-search`}
                  placeholderText={`${selectedRelatedTo.text} name`} 
                  titleText={`${selectedRelatedTo.text}`}
                  isFixedMultiSelect
                  isSearchWithId
                  size={TextInputSize.Large}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  existingValues={[searchTerm]}
                  keyUpHandler={() => {}}
                  isShowListBox={isDropdownOpen}
                  headingText={`${t("Filter.selectEntity")} ${selectedRelatedTo.text}s`}
                  onCloseHandle={ () => {
                    setSearchTerm("")
                  }

                   }
                  isListBox
                  isCommaSeparted
                  getSelectedItems={() => [searchTerm].filter(Boolean).map((text) => ({ text, value: text }))}
                  onItemClick={(item: ISearchItemProp | null) => {
                    
                    setSearchTerm(item?.text || "")
                    if (tagListArray.length < 5 && item) {
                      setTagListArray([...tagListArray, item as SelectedItem]);
                    }
                    setIsDropdownOpen(true)
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
                  validationTextForTagList={`${selectedRelatedTo.text} already added`}
                  validationTextForLimit={`${selectedRelatedTo.text} list limit reached`}
                  validationTextLevelForTagList={ValidationTextLevel.Warning}
                  addLimit={5}
                  tagListValueArray={tagListArray}
                  
                              />
          </>
        )}
          
            {selectedRelatedTo && (
              <>
          <FormLabel>{t("Category")}</FormLabel>
        <Dropdown
          dataTestId={`${dataTestId}-categories`}
          isFixedMultiSelect
          multiSelect
          isScrollbarVisible
          selectedItems={selectedCategories.filter((item) => item.data?.type !== "dateRange") || []} // Use [] as fallback
          onSelectMultiple={(_, items) => {
            setSelectedCategories((prev) => {
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
          {availableCategories
            .slice()
            .sort((a, b) => a.application.localeCompare(b.application))
            .map((category) => (
              <DropdownItem
                key={category.application}
                data={category}
                id={category.application}
                text={category.application.charAt(0).toUpperCase() + category.application.slice(1)}
                value={category.application}
                isSelected={selectedCategories.some((item) => item.data === category.application)}
              >
                {category.application.charAt(0).toUpperCase() + category.application.slice(1)}
              </DropdownItem>
            ))}
        </Dropdown>
      </>
        )}

      <div className="dms-filter-dialog-date">
        <FormLabel className="date-added">{t("Date added")}</FormLabel>
        <div className="dms-filter-dialog-date-inputs">
          <div className="dms-filter-dialog-fromdate-input">
            <DateInput
              dataTestId={`${dataTestId}-date-added`}
              helpText="From"
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
              helpText="To"
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
          {t("Clear all")}
        </Button>
        <Button
          dataTestId={`${dataTestId}-apply-btn`}
          onClick={handleApplyWrapper}
          color={ButtonColor.Primary}
          size={ButtonSize.Small}
        >
          {t("Apply")}
        </Button>
        </div>
        </>)}
    </Dialog>
  );
};
FilterDialog.defaultProps = {
  dataTestId: "dms-filter-dialog",
  isLoading: false,
};

export default FilterDialog;