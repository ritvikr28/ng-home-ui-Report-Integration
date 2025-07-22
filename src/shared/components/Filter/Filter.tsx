import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import "./style.scss";
import { Category } from "../../../features/DocumentManagementServer/responseModel";
import dayjs from "dayjs";

interface DMSFilterDialogProps {
  dataTestId?: string;
  title: string;
  isOpen: boolean;
  availableCategories: Category[];
  availableFormats: string[];
  onClose: () => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  selectedCategories: ISelectedItem[];
  handleApply: () => void;
  selectedFormats: ISelectedItem[];
  setIsFilterDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  availableFormats,
  onClose,
  setSelectedCategories,
  selectedCategories,
  handleApply,
  selectedFormats,
  setIsFilterDialogOpen,
  isFilterDialogOpen,
  setIsDateError,
  isDateError,
  setSelectedDateRange,
  selectedDateRange
}: DMSFilterDialogProps) => {
  const { t } = useTranslation();
  const [fromDay, setFromDay] = useState<string>("");
  const [fromMonth, setFromMonth] = useState<string>("");
  const [fromYear, setFromYear] = useState<string>("");
  const [toDay, setToDay] = useState<string>("");
  const [toMonth, setToMonth] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [fromDateError, setFromDateError] = useState<string>("");
const [toDateError, setToDateError] = useState<string>("");

  useEffect(() => {
    if (isFilterDialogOpen) {
      const selectedFromDate = fromDay && fromMonth && fromYear ? `${fromYear}-${fromMonth.padStart(2, "0")}-${fromDay.padStart(2, "0")}` : "";
      const selectedToDate = toDay && toMonth && toYear ? `${toYear}-${toMonth.padStart(2, "0")}-${toDay.padStart(2, "0")}` : "";
      setSelectedDateRange({fromDate: selectedFromDate, toDate: selectedToDate})
      if (selectedToDate && !selectedFromDate) {
        setFromDateError("Please select a From date before selecting a To date.");
        setToDateError("");
        setIsDateError(true);
        return;
      }
      else if (selectedFromDate && dayjs(selectedFromDate).isAfter(dayjs(), "day")) {
        setFromDateError("From date cannot be after today.");
        setToDateError("");
        setIsDateError(true);
        return;
      }
      else if (selectedFromDate && selectedToDate && dayjs(selectedToDate).isBefore(dayjs(selectedFromDate), "day")) {
        setToDateError("To date cannot be before From date.");
        setFromDateError("");
        setIsDateError(true);
        return;
      } else {
        setFromDateError("");
        setToDateError("");
        setIsDateError(false);
      }
    }
  }, [isFilterDialogOpen, fromYear, toYear, toDay, toMonth, fromDay, fromMonth])

  useEffect(() => {
    if (selectedDateRange?.toDate && dayjs(selectedDateRange?.toDate, "YYYY-MM-DD")?.isValid() && isFilterDialogOpen) {
      let date = selectedDateRange?.toDate.split("-")
      setToDay(date[2]);
      setToMonth(date[1]);
      setToYear(date[0]);
    }
    if (selectedDateRange?.fromDate && dayjs(selectedDateRange?.fromDate, "YYYY-MM-DD")?.isValid() && isFilterDialogOpen) {
      let date = selectedDateRange?.fromDate.split("-")

      setFromDay(date[2]);
      setFromMonth(date[1]);
      setFromYear(date[0]);
    }
  }, [isFilterDialogOpen, selectedDateRange])

  const clearAll = () => {
    setSelectedCategories([]);
    setFromDay("");
    setFromMonth("");
    setFromYear("");
    setToDay("");
    setToMonth("");
    setToYear("");
    setFromDateError("");
    setToDateError("");
    setValidationError("");
    setIsDateError(false);
    setSelectedDateRange({ fromDate: "", toDate: "" })
  }

  return (
    <Dialog
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={onClose}
      title={title}
    >
        <FormLabel>
          {t("Category")}
        </FormLabel>
        <Dropdown
          dataTestId={`${dataTestId}-categories`}
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
      {availableCategories?.map((category) => (
        <DropdownItem
          key={category.registrationId}
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
        <FormLabel>
          {t("Date Added")}
        </FormLabel>
        
        <div className="dms-filter-dialog-date-inputs">
          <div className="dms-filter-dialog-fromdate-input">
            <DateInput
              dataTestId={`${dataTestId}-date-added`}
              helpText="From"
              showDatePicker
              day={fromDay ? parseInt(fromDay) : undefined}
              month={fromMonth ? parseInt(fromMonth) : undefined}
              year={fromYear ? parseInt(fromYear) : undefined}
              onChange={(day, month, year) => {
                setFromDay(day?.toString() ?? "");
                setFromMonth(month?.toString() ?? "");
                setFromYear(year?.toString() ?? "");
                if (!day && !month && !year) {
                  setFromDateError("");
                  setIsDateError(false);
                }
              }}
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
              day={toDay ? parseInt(toDay) : undefined}
              month={toMonth ? parseInt(toMonth) : undefined}
              year={toYear ? parseInt(toYear) : undefined}
              onChange={(day, month, year) => {
                setToDay(day?.toString() ?? "");
                setToMonth(month?.toString() ?? "");
                setToYear(year?.toString() ?? "");
                if (!day && !month && !year) {
                  setToDateError("");
                  setIsDateError(false);
                }
              }}
              invalidDateErrorMessage={toDateError}
              validationText={toDateError}
              validationTextLevel={isDateError ? ValidationTextLevel.Error : undefined}
            />
          </div>
      
        </div>
        <div>
                      {/* {validationError && (
    <div className="dms-filter-dialog-error" style={{ color: "#d9372b", marginTop: "4px", fontSize: "15px" }}>
      {validationError}
    </div>
  )}     */}
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
