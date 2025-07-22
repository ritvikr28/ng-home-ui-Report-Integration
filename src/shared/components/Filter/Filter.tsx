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

interface DMSFilterDialogProps {
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

const DMSFilterDialog = ({
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
}: DMSFilterDialogProps) => {
  const { t } = useTranslation();
  const [fromDateError, setFromDateError] = useState<string>("");
  const [toDateError, setToDateError] = useState<string>("");
  const [fromDate, setFromDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [toDate, setToDate] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });

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
  // Populate date fields from selectedDateRange when dialog opens
  useEffect(() => {
    if (selectedDateRange?.toDate && dayjs(selectedDateRange?.toDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
      const [year, month, day] = selectedDateRange.toDate.split("-");
      setToDate({ day: day, month: month, year: year })
    }
    if (selectedDateRange?.fromDate && dayjs(selectedDateRange?.fromDate, "YYYY-MM-DD").isValid() && isFilterDialogOpen) {
      const [year, month, day] = selectedDateRange.fromDate.split("-");
      setFromDate({ day: day, month: month, year: year })
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
        // First time: just add it
        return [...prev, dateVal];
      }
      const updated = [...prev];
      updated[index] = dateVal;
      return updated;
    });
  }
}, [selectedDateRange?.fromDate, selectedDateRange?.toDate]);

  // Handlers for date input changes
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

      // Build date strings
      const thisDateStr = getDateString(newDate);
      const otherDateStr = getDateString(otherDate);

      // Validation logic
      if (!newDate.day && !newDate.month && !newDate.year) {
        setError("");
        setIsDateError(false);
        return;
      }

      if (isFrom) {
        // From date validations
        if (otherDateStr && !thisDateStr) {
          setError("Please select a From date before selecting a To date.");
          setIsDateError(true);
          return;
        }
        if (thisDateStr && dayjs(thisDateStr).isAfter(dayjs(), "day")) {
          setError("From date cannot be after today.");
          setIsDateError(true);
          return;
        }
        if (thisDateStr && otherDateStr && dayjs(otherDateStr).isBefore(dayjs(thisDateStr), "day")) {
          setError("");
          setToDateError("To date cannot be before From date.");
          setIsDateError(true);
          return;
        }
      } else {
        // To date validations
        if (thisDateStr && !otherDateStr) {
          setError("Please select a From date before selecting a To date.");
          setIsDateError(true);
          return;
        }
        if (otherDateStr && thisDateStr && dayjs(thisDateStr).isBefore(dayjs(otherDateStr), "day")) {
          setError("To date cannot be before From date.");
          setIsDateError(true);
          return;
         }
       }
       const fromDateValue = isFrom ? thisDateStr : otherDateStr
       const toDateValue = !isFrom ? thisDateStr : otherDateStr
       setSelectedDateRange({ fromDate: fromDateValue, toDate: toDateValue })
       setError("");
       setFromDateError("");
        setIsDateError(false);
      };
    
  return (
    <Dialog
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
        onSelectMultiple={(_, items) =>
          setSelectedCategories(
            items.map(item => ({
              ...item,
              text: item.text || (typeof item.data === "string"
                ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
                : "")
            }))
          )
        }
        selectedItems={selectedCategories}
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
        <FormLabel>{t("Date Added")}</FormLabel>
        <div className="dms-filter-dialog-date-inputs">
          <div className="dms-filter-dialog-fromdate-input">
            <DateInput
              dataTestId={`${dataTestId}-date-added`}
              helpText="From"
              showDatePicker
               day={fromDate.day ? parseInt(fromDate.day) : undefined}
              month={fromDate.month ? parseInt(fromDate.month) : undefined}
              year={fromDate.year ? parseInt(fromDate.year) : undefined}
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
               day={toDate.day ? parseInt(toDate.day) : undefined}
              month={toDate.month ? parseInt(toDate.month) : undefined}
              year={toDate.year ? parseInt(toDate.year) : undefined}
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
          onClick={handleApply}
          color={ButtonColor.Primary}
          size={ButtonSize.Small}
        >
          {t("Apply Filters")}
        </Button>
        </div>
    </Dialog>
  );
};

export default DMSFilterDialog;