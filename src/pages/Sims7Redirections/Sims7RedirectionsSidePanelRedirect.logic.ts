import React from "react";
import { isFormDirty } from "./Sims7RedirectionsFormDirty.logic";
import { parseDateString } from "./Sims7RedirectionsDateHelpers";

export interface HandleRedirectToNextGenChangeParams {
    event: React.SyntheticEvent<Element, Event>;
    value: string | number;
    selectedRow: any;
    setRedirectToNextGen: (val: string) => void;
    setEffectiveDate: (date: Date | null) => void;
    setDateParts: (parts: { day: string; month: string; year: string }) => void;
    setIsDirty: (dirty: boolean) => void;
    effectiveDate: Date | null;
    reasonForChanges: string;
    setDateError?: (val: string) => void;
}

export function handleRedirectToNextGenChange(params: HandleRedirectToNextGenChangeParams): void {
    const {
        // event,
        value,
        selectedRow,
        setRedirectToNextGen,
        setEffectiveDate,
        setDateParts,
        setIsDirty,
        effectiveDate,
        reasonForChanges,
        setDateError
    }: HandleRedirectToNextGenChangeParams = params;
    const val = value as string;
    setRedirectToNextGen(val);
    if (selectedRow.status === 'Not migrated' && val === 'yes') {
        const tomorrow: Date = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setEffectiveDate(tomorrow);
        setDateParts({
            day: tomorrow.getDate().toString().padStart(2, '0'),
            month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
            year: tomorrow.getFullYear().toString()
        });
        if (typeof setDateError === 'function') {
            setDateError("");
        }
    }
    if (selectedRow.status === 'Migrated' && val === 'no') {
        const tomorrow: Date = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setEffectiveDate(tomorrow);
        setDateParts({
            day: tomorrow.getDate().toString().padStart(2, '0'),
            month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
            year: tomorrow.getFullYear().toString()
        });
        if (typeof setDateError === 'function') {
            setDateError("");
        }
    }
    if (selectedRow.status === 'Migrated' && val === 'yes') {
        const origDate: Date | null = parseDateString(selectedRow.effectiveDate);
        setEffectiveDate(origDate);
        if (origDate) {
            setDateParts({
                day: origDate.getDate().toString().padStart(2, '0'),
                month: (origDate.getMonth() + 1).toString().padStart(2, '0'),
                year: origDate.getFullYear().toString()
            });
        }
        if (typeof setDateError === 'function') {
            setDateError("");
        }
    }
    if (selectedRow.status === 'Reversing' && val === 'no') {
        const origDate: Date | null = parseDateString(selectedRow.effectiveDate);
        setEffectiveDate(origDate);
        if (origDate) {
            setDateParts({
                day: origDate.getDate().toString().padStart(2, '0'),
                month: (origDate.getMonth() + 1).toString().padStart(2, '0'),
                year: origDate.getFullYear().toString()
            });
        }
        if (typeof setDateError === 'function') {
            setDateError("");
        }
    }
    let effectiveDateForDirtyCheck: Date | null = effectiveDate;
    if (selectedRow.status === 'Migrated' && val === 'yes') {
        effectiveDateForDirtyCheck = parseDateString(selectedRow.effectiveDate);
    }
    if (selectedRow.status === 'Reversing' && val === 'no') {
        effectiveDateForDirtyCheck = parseDateString(selectedRow.effectiveDate);
    }
    setIsDirty(isFormDirty(selectedRow, val, effectiveDateForDirtyCheck, reasonForChanges));
}
