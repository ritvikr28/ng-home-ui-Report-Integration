// Explicit interface for the form state returned by useSims7RedirectionsForm
import React, { useState, useEffect } from "react";
import { DateParts } from "./Sims7RedirectionsInterfaces";
import { getTomorrow as getTomorrowImpl } from "./Sims7RedirectionsSidePanelDate.logic";

export interface Sims7RedirectionsFormStateExplicit {
    reasonForChanges: string;
    setReasonForChanges: React.Dispatch<React.SetStateAction<string>>;
    showSuccessToast: boolean;
    setShowSuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
    isDirty: boolean;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    dateError: string;
    setDateError: React.Dispatch<React.SetStateAction<string>>;
    reasonError: string;
    setReasonError: React.Dispatch<React.SetStateAction<string>>;
    showCancelDialog: boolean;
    setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
    redirectToNextGen: string;
    setRedirectToNextGen: React.Dispatch<React.SetStateAction<string>>;
    dateParts: DateParts;
    setDateParts: React.Dispatch<React.SetStateAction<DateParts>>;
    effectiveDate: Date | null;
    setEffectiveDate: React.Dispatch<React.SetStateAction<Date | null>>;
}
// Export a type for the form state returned by useSims7RedirectionsForm
export type Sims7RedirectionsFormState = ReturnType<typeof useSims7RedirectionsForm>;

export function useSims7RedirectionsForm(selectedRow: any, mode: string): Sims7RedirectionsFormStateExplicit {
    const [reasonForChanges, setReasonForChanges]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>(
        String(selectedRow?.reasonForChanges ?? selectedRow?.reasonForChange ?? "")
    );
    const [showSuccessToast, setShowSuccessToast]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isDirty, setIsDirty]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [dateError, setDateError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [reasonError, setReasonError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [showCancelDialog, setShowCancelDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [redirectToNextGen, setRedirectToNextGen]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(
        selectedRow?.status === 'Not migrated' || selectedRow?.status === 'Reversing' ? 'no' : 'yes'
    );

    useEffect(() => {
        setReasonForChanges(selectedRow?.reasonForChanges ?? selectedRow?.reasonForChange ?? "");
    }, [selectedRow]);

    useEffect(() => {
        if (selectedRow?.status === 'Not migrated' || selectedRow?.status === 'Reversing') {
            setRedirectToNextGen('no');
        } else {
            setRedirectToNextGen('yes');
        }
    }, [selectedRow]);

    let initialEffectiveDate: Date = getTomorrow();
    if (selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
        const parts: string[] = selectedRow.effectiveDate.split(' ');
        if (parts.length === 3) {
            const [day, monthStr, year] = parts as [string, string, string];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month: number = months.indexOf(monthStr);
            if (month !== -1) {
                initialEffectiveDate = new Date(Number(year), month, Number(day));
            }
        }
    }

    const [dateParts, setDateParts]: [DateParts, React.Dispatch<React.SetStateAction<DateParts>>] = useState<DateParts>(() => {
        if (initialEffectiveDate) {
            return {
                day: initialEffectiveDate.getDate().toString().padStart(2, '0'),
                month: (initialEffectiveDate.getMonth() + 1).toString().padStart(2, '0'),
                year: initialEffectiveDate.getFullYear().toString()
            };
        }
        return { day: '', month: '', year: '' };
    });
    const [effectiveDate, setEffectiveDate]: [Date | null, React.Dispatch<React.SetStateAction<Date | null>>] = useState<Date | null>(initialEffectiveDate);

    useEffect(() => {
        setReasonError("");
        setDateError("");
        setIsDirty(false);
    }, [selectedRow, mode]);

    useEffect(() => {
        let date: Date = getTomorrow();
        let partsObj: DateParts = { day: '', month: '', year: '' };
        if (selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
            const parts: string[] = selectedRow.effectiveDate.split(' ');
            if (parts.length === 3) {
                const [day, monthStr, year] = parts as [string, string, string];
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month: number = months.indexOf(monthStr);
                if (month !== -1) {
                    date = new Date(Number(year), month, Number(day));
                    partsObj = {
                        day: String(day).padStart(2, '0'),
                        month: String(month + 1).padStart(2, '0'),
                        year: String(year)
                    };
                }
            }
        } else {
            partsObj = {
                day: date.getDate().toString().padStart(2, '0'),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                year: date.getFullYear().toString()
            };
        }
        setEffectiveDate(date);
        setDateParts(partsObj);
    }, [selectedRow]);

    return {
        reasonForChanges,
        setReasonForChanges,
        showSuccessToast,
        setShowSuccessToast,
        isDirty,
        setIsDirty,
        dateError,
        setDateError,
        reasonError,
        setReasonError,
        showCancelDialog,
        setShowCancelDialog,
        redirectToNextGen,
        setRedirectToNextGen,
        dateParts,
        setDateParts,
        effectiveDate,
        setEffectiveDate
    };
}

function getTomorrow(): Date {
    return getTomorrowImpl();
}
