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
  ValidationTextLevel
} from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./style.scss";
import { Category } from "../../../features/DocumentManagementServer/responseModel";

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
  isFilterDialogOpen,
  setIsDateError,
  isDateError,
  setSelectedDateRange,
  selectedDateRange
}: FilterDialogProps) => {
  const { t } = useTranslation();
  const [fromDateError, setFromDateError] = useState<string>("");
  const [toDateError, setToDateError] = useState<string>("");
  const [fromDate, setFromDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [toDate, setToDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [wasApplied, setWasApplied] = useState(false);

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
  setFromDate({ day: "", month: "", year: "" })
  setToDate({ day: "", month: "", year: "" })
};
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
    const dateString = `${from} ${(to ? 'to ' : '-' )+ to}`;
 
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

      const thisDateStr = getDateString(newDate);
      const otherDateStr = getDateString(otherDate);

      if (!newDate.day && !newDate.month && !newDate.year) {
        setError("");
        setIsDateError(false);
        return;
      }

      if (isFrom) {
        if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
          setError(`From date must be on or before ${dayjs().format("DD-MM-YYYY")}`);
          setIsDateError(true);
          return;
        }
        if (thisDateStr && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(thisDateStr), "day")) {
          setError("");
          setToDateError("To date should not be before From date.");
          setIsDateError(true);
          return;
        }
         if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
          setError("Invalid date");
          setIsDateError(true);
          return;
  }
        if (thisDateStr) setToDateError("");
      } else {
        if (thisDateStr && !otherDateStr) {
          setFromDateError("From date is required");
          setIsDateError(true);
          return;
        }
        if (otherDateStr && thisDateStr && dayjs(thisDateStr).isBefore(dayjs(otherDateStr), "day")) {
          setError("To date should not be before From date.");
          setIsDateError(true);
          return;
        }
        if (thisDateStr && !dayjs(thisDateStr, "YYYY-MM-DD", true).isValid()) {
    setError("Invalid date");
    setIsDateError(true);
    return;
  }
        if (thisDateStr && otherDateStr) setError("");
      }
       const fromDateValue = isFrom ? thisDateStr : otherDateStr
       const toDateValue = !isFrom ? thisDateStr : otherDateStr
       setSelectedDateRange({ fromDate: fromDateValue, toDate: toDateValue })
       setError("");
       setFromDateError("");
        setIsDateError(false);
      };

      const handleApplyWrapper = () => {
  // Validate "From" date
      if (fromDate.day || fromDate.month || fromDate.year) {
        if (!(fromDate.day && fromDate.month && fromDate.year)) {
          setFromDateError("Invalid date");
          setIsDateError(true);
          return;
        }
        const fromDateStr = getDateString(fromDate);
        if (!dayjs(fromDateStr, "YYYY-MM-DD", true).isValid()) {
          setFromDateError("Invalid date");
          setIsDateError(true);
          return;
        }
      }

      // Validate "To" date
      if (toDate.day || toDate.month || toDate.year) {
        if (!(toDate.day && toDate.month && toDate.year)) {
          setToDateError("Invalid date");
          setIsDateError(true);
          return;
        }
        const toDateStr = getDateString(toDate);
        if (!dayjs(toDateStr, "YYYY-MM-DD", true).isValid()) {
          setToDateError("Invalid date");
          setIsDateError(true);
          return;
        }
      }

      // Check logical order
      const fromDateStr = getDateString(fromDate);
      const toDateStr = getDateString(toDate);
      if (fromDateStr && toDateStr && dayjs(toDateStr).isBefore(dayjs(fromDateStr), "day")) {
        setToDateError("To date should not be before From date.");
        setIsDateError(true);
        return;
      }

      // If any error, block apply
      if (fromDateError || toDateError || isDateError) {
        return;
      }

      setWasApplied(true);
      handleApply();
  };
    
  return (
    <Dialog
      className="dms-filter-dialog"
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={onClose}
      title={title}
    >     
      <FormLabel>{t("Category")}</FormLabel>
      <Dropdown
        dataTestId={`${dataTestId}-categories`}
        isFixedMultiSelect
        multiSelect
        isScrollbarVisible
      onSelectMultiple={(_, items) => {
      setSelectedCategories(prev => {
        // Find the previous index of dateRange
        const dateRangeIndex = prev.findIndex(item => item.data?.type === "dateRange");
        const dateRangeItem = prev[dateRangeIndex];

        // Remove dateRange from new selection
        const newItems = items.filter(item => item.data?.type !== "dateRange")
          .map(item => ({
            ...item,
            text: item.text || (typeof item.data === "string"
              ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
              : "")
          }));

    // Calculate new index for dateRange: count how many items from prev before dateRange are still in newItems
    let insertIndex = newItems.length;
    if (dateRangeItem && dateRangeIndex > 0) {
      const prevBeforeDate = prev.slice(0, dateRangeIndex).map(i => i.data);
      insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
      if (insertIndex === -1) insertIndex = newItems.length;
      else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
    } else if (dateRangeItem) {
      insertIndex = 0;
    }

    // Insert dateRange at calculated index
    if (dateRangeItem) {
      const safeDateRangeItem = {
        ...dateRangeItem,
        text: dateRangeItem.text ?? ""
      };
      newItems.splice(insertIndex, 0, safeDateRangeItem);
    }
    return newItems;
  });
}}
  selectedItems={selectedCategories.filter(item => item.data?.type !== "dateRange")}
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

      <div className="dms-filter-dialog-date">
        <FormLabel className="date-added">{t("Date Added")}</FormLabel>
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
              invalidDateErrorMessage={fromDateError}
              validationText={fromDateError}
              validationTextLevel={isDateError ? ValidationTextLevel.Error : undefined}
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
              invalidDateErrorMessage={toDateError}
              validationText={toDateError}
              validationTextLevel={isDateError ? ValidationTextLevel.Error : undefined}
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
          {t("Clear All")}
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
    </Dialog>
  );
};
FilterDialog.defaultProps = {
  dataTestId: "dms-filter-dialog"
};

export default FilterDialog;