import React from "react";
import { isFormDirty } from "./Sims7RedirectionsFormDirty.logic";
import { DateParts } from "./Sims7RedirectionsInterfaces";
import {
    extractDateParts,
    formatDateParts,
    isDatePartsEmpty,
    isDatePartsInvalid,
    isDateObjectInvalid
} from "./Sims7RedirectionsDateHelpers.logic";

export interface HandleDateChangeParams {
     t: (key: string) => string;
    arg1: string | number | Date | React.ChangeEvent<HTMLInputElement>;
    arg2?: string | number | React.ChangeEvent<HTMLInputElement>;
    arg3?: string | number | React.ChangeEvent<HTMLInputElement>;
    setDateParts: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>;
    setEffectiveDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setDateError: React.Dispatch<React.SetStateAction<string>>;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRow: any;
    redirectToNextGen: string;
    reasonForChanges: string;
}

export function getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

export function handleDateChange({
    t,
    arg1,
    arg2,
    arg3,
    setDateParts,
    setEffectiveDate,
    setDateError,
    setIsDirty,
    selectedRow,
    redirectToNextGen,
    reasonForChanges
}: HandleDateChangeParams): void {
    const { day, month, year }: { day: number | undefined; month: number | undefined; year: number | undefined } = extractDateParts(arg1, arg2, arg3);
    setDateParts({
        day: day ? String(day).padStart(2, '0') : '',
        month: month ? String(month).padStart(2, '0') : '',
        year: year ? String(year) : ''
    });
    const { formattedDay, formattedMonth, formattedYear }: { formattedDay: string; formattedMonth: string; formattedYear: string } = formatDateParts(day, month, year);
    if (isDatePartsEmpty(formattedDay, formattedMonth, formattedYear)) {
        setEffectiveDate(null);
         setDateError(t('SIMS7Redirects.dateRequired'));
        setIsDirty(isFormDirty(selectedRow, redirectToNextGen, null, reasonForChanges));
        return;
    }
    if (isDatePartsInvalid(formattedDay, formattedMonth, formattedYear)) {
        setEffectiveDate(null);
         setDateError(t('SIMS7Redirects.invaliddate'));
        setIsDirty(isFormDirty(selectedRow, redirectToNextGen, null, reasonForChanges));
        return;
    }
    const dateObj = new Date(Number(formattedYear), Number(formattedMonth) - 1, Number(formattedDay));
    if (isDateObjectInvalid(dateObj, formattedDay, formattedMonth, formattedYear)) {
        setEffectiveDate(null);
      setDateError(t('SIMS7Redirects.invaliddate'));
        setIsDirty(isFormDirty(selectedRow, redirectToNextGen, null, reasonForChanges));
        return;
    }
    setEffectiveDate(dateObj);
    setDateError("");
    setIsDirty(isFormDirty(selectedRow, redirectToNextGen, dateObj, reasonForChanges));
}

export function handleValidateDate(date: Date, setDateError: (msg: string) => void, t: (key: string) => string): void {
    if (!date) {
        setDateError('Invalid Date');
        return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date <= today) {
        setDateError(t("SIMS7Redirects.dateError"));
        return;
    }
    setDateError("");
}

export function getDateParts(dateParts: DateParts): { day: number | undefined; month: number | undefined; year: number | undefined } {
    return {
        day: dateParts.day ? Number(dateParts.day) : undefined,
        month: dateParts.month ? Number(dateParts.month) : undefined,
        year: dateParts.year ? Number(dateParts.year) : undefined
    };
}
