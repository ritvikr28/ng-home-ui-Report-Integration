import React, { useEffect } from "react";
import { DateInput, FormLabel, ValidationTextLevel } from "@essnextgen/ui-kit";

interface DateSectionProps {
  t: (key: string) => string;
  dataTestId: string;
  fromDate: { day: string; month: string; year: string };
  toDate: { day: string; month: string; year: string };
  fromDateError: string;
  toDateError: string;
  handleDateChange: (
    setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>,
    setDateError: React.Dispatch<React.SetStateAction<string>>,
    day: string,
    month: string,
    year: string,
    otherDate: { day: string; month: string; year: string },
    isFrom: boolean
  ) => void;
  setFromDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>;
  setFromDateError: React.Dispatch<React.SetStateAction<string>>;
  setToDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>;
  setToDateError: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  localSelectedDateRange: { fromDate: string; toDate: string } | null;
}

export const useFilterDateSectionEffects: any = (
  isOpen: boolean,
  localSelectedDateRange: { fromDate: string; toDate: string } | null,
  setFromDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>,
  setToDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>
) => {
    useEffect(() => {
  // Sync from localSelectedDateRange to fromDate and toDate
  if (isOpen && localSelectedDateRange) {
    const [fromYear, fromMonth, fromDay]: string[] = localSelectedDateRange.fromDate.split("-");
    const [toYear, toMonth, toDay]: string[] = localSelectedDateRange.toDate.split("-");
    setFromDate({
      day: fromDay || "",
      month: fromMonth || "",
      year: fromYear || ""
    });
    setToDate({
      day: toDay || "",
      month: toMonth || "",
      year: toYear || ""
    });
  }
}, [isOpen, localSelectedDateRange]);
}
export const FilterDateSection: React.FC<DateSectionProps> = ({
  t,
  dataTestId,
  fromDate,
  toDate,
  fromDateError,
  toDateError,
  handleDateChange,
  setFromDate,
  setFromDateError,
  setToDate,
  setToDateError,
  isOpen,
  localSelectedDateRange
}) =>{ 
  useFilterDateSectionEffects(isOpen, localSelectedDateRange, setFromDate, setToDate);
  return (
  <div className="dms-filter-dialog-date">
    <FormLabel className="date-added">
      {t("Filter.dateHeading")}
    </FormLabel>
    <div className="dms-filter-dialog-date-inputs">
      <div className="dms-filter-dialog-fromdate-input">
        <DateInput
          dataTestId={`${dataTestId}-date-added`}
          helpText={t("Filter.fromDateLabel")}
          showDatePicker
          day={fromDate.day ? parseInt(fromDate.day, 10) : undefined}
          month={fromDate.month ? parseInt(fromDate.month, 10) : undefined}
          year={fromDate.year ? parseInt(fromDate.year, 10) : undefined}
          onChange={(day, month, year) => handleDateChange(
            setFromDate,
            setFromDateError,
            day?.toString() ?? "",
            month?.toString() ?? "",
            year?.toString() ?? "",
            toDate,
            true
          )}
          invalidDateErrorMessage=""
          validationText={fromDateError}
          isInvalidDate={!!fromDateError}
          validationTextLevel={fromDateError ? ValidationTextLevel.Error : undefined} />
      </div>
      <div className="dms-filter-dialog-todate-input">
        <DateInput
          dataTestId={`${dataTestId}-date-added`}
          helpText={t("Filter.toDateLabel")}
          showDatePicker
          day={toDate.day ? parseInt(toDate.day, 10) : undefined}
          month={toDate.month ? parseInt(toDate.month, 10) : undefined}
          year={toDate.year ? parseInt(toDate.year, 10) : undefined}
          onChange={(day, month, year) => handleDateChange(
            setToDate,
            setToDateError,
            day?.toString() ?? "",
            month?.toString() ?? "",
            year?.toString() ?? "",
            fromDate,
            false
          )}
          invalidDateErrorMessage=""
          validationText={toDateError}
          isInvalidDate={!!toDateError}
          validationTextLevel={toDateError ? ValidationTextLevel.Error : undefined} />
      </div>
    </div>
  </div>
);}