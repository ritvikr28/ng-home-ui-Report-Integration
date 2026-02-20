import React from "react";
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
  setToDateError
}) => (
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
          onChange={(day, month, year) =>
            handleDateChange(
              setFromDate,
              setFromDateError,
              day?.toString() ?? "",
              month?.toString() ?? "",
              year?.toString() ?? "",
              toDate,
              true
            )
          }
          invalidDateErrorMessage=""
          validationText={fromDateError}
          isInvalidDate={!!fromDateError}
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
            handleDateChange(
              setToDate,
              setToDateError,
              day?.toString() ?? "",
              month?.toString() ?? "",
              year?.toString() ?? "",
              fromDate,
              false
            )
          }
          invalidDateErrorMessage=""
          validationText={toDateError}
          isInvalidDate={!!toDateError}
          validationTextLevel={toDateError ? ValidationTextLevel.Error : undefined}
        />
      </div>
    </div>
  </div>
);