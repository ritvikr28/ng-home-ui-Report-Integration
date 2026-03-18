import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { handleRedirectToNextGenChange } from './Sims7RedirectionsSidePanelRedirect.logic';
import { handleDateChange } from './Sims7RedirectionsSidePanelDate.logic';
import { buildRequest } from './Sims7RedirectionsSidePanelSaveHelpers';
import type { UpdateSims7RedirectionRequest } from './Sims7RedirectionsPage.api';

interface SetReasonForChangesHandlerArgs {
    val: string;
    setReasonForChangesRaw: (val: string) => void;
    validateReason: (args: ValidateReasonArgs) => void;
    requiresReason: (status: string, redirectToNextGen: string) => boolean;
    selectedRow: { status: string };
    redirectToNextGen: string;
    setReasonError: (val: string) => void;
}

interface ValidateReasonArgs {
    requiresReason: (status: string, redirectToNextGen: string) => boolean;
    selectedRow: { status: string };
    redirectToNextGen: string;
    reasonForChanges: string;
    setReasonError: (val: string) => void;
}

export function setReasonForChangesHandler({
    val: reasonVal,
    setReasonForChangesRaw,
    validateReason,
    requiresReason,
    selectedRow,
    redirectToNextGen,
    setReasonError
}: SetReasonForChangesHandlerArgs): void {
    setReasonForChangesRaw(reasonVal);
    validateReason({
        requiresReason,
        selectedRow,
        redirectToNextGen,
        reasonForChanges: reasonVal,
        setReasonError
    });
}

interface OnRedirectToNextGenChangeHandlerArgs {
    event: React.SyntheticEvent<Element, Event>;
    value: string | number;
    selectedRow: { [key: string]: unknown };
    setRedirectToNextGen: (val: string | number) => void;
    setEffectiveDate: (date: Date | null) => void;
    setDateParts: (val: unknown) => void;
    setIsDirty: (val: boolean) => void;
    effectiveDate: Date | null;
    reasonForChanges: string;
}

export function onRedirectToNextGenChangeHandler({
    event,
    value,
    selectedRow,
    setRedirectToNextGen,
    setEffectiveDate,
    setDateParts,
    setIsDirty,
    effectiveDate,
    reasonForChanges
}: OnRedirectToNextGenChangeHandlerArgs): void {
    handleRedirectToNextGenChange({
        event,
        value,
        selectedRow,
        setRedirectToNextGen,
        setEffectiveDate,
        setDateParts,
        setIsDirty,
        effectiveDate,
        reasonForChanges
    });
}

type DateChangeArg = string | number | ChangeEvent<HTMLInputElement>;

interface OnDateChangeHandlerArgs {
    t: (key: string) => string;
    arg1: DateChangeArg;
    arg2?: DateChangeArg;
    arg3?: DateChangeArg;
    setDateParts: (val: unknown) => void;
    setEffectiveDate: Dispatch<SetStateAction<Date | null>>;
    setDateError: Dispatch<SetStateAction<string>>;
    setIsDirty: Dispatch<SetStateAction<boolean>>;
    selectedRow: { [key: string]: unknown };
    redirectToNextGen: string;
    reasonForChanges: string;
}

export function onDateChangeHandler({
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
}: OnDateChangeHandlerArgs): void {
    handleDateChange({
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
    });
}

interface OnValidateDateHandlerArgs {
    date: Date;
    setDateError: React.Dispatch<React.SetStateAction<string>>;
    handleValidateDate: (date: Date, setDateError: React.Dispatch<React.SetStateAction<string>>) => void;
}

export function onValidateDateHandler({
    date: validateDate,
    setDateError: validateDateError,
    handleValidateDate: validateDateHandler
}: OnValidateDateHandlerArgs): void {
    validateDateHandler(validateDate, validateDateError);
}

export function canEditSidePanel(mode: string, selectedRow: any): boolean {
    return mode === 'edit' && !!selectedRow;
}

export function shouldShowSuccessToast(selectedRow: any, isDirty: boolean): boolean {
    return selectedRow.status === 'Migrated' && !isDirty;
}

export function showSuccessAndClose(
    setShowSuccessToast: (val: boolean) => void,
    setShowFailureBanner: (val: boolean) => void,
    setSidePanelMode: (mode: 'view' | 'edit') => void,
    onSaveSuccess?: () => void
): void {
    setShowSuccessToast(true);
    setShowFailureBanner(false);
    setTimeout((): void => {
        setShowSuccessToast(false);
        setSidePanelMode('view');
        if (onSaveSuccess) onSaveSuccess();
    }, 1500);
}
// Helper functions for Sims7RedirectionsSidePanel

export function hasValidDfeNumber(row: any, setDateError: (val: string) => void): boolean {
    const dfeNumber = row.dfeNumber || row.DfeNumber;
    if (!dfeNumber) {
        setDateError('DFE Number is missing from the selected row.');
        return false;
    }
    return true;
}

export function buildRedirectionRequest(
    row: any,
    effectiveDateStr: string,
    status: string
): UpdateSims7RedirectionRequest {
    return buildRequest(row, effectiveDateStr, status);
}

export async function tryUpdateRedirection(
    req: any,
    setShowSuccessToast: (val: boolean) => void,
    setShowFailureBanner: (val: boolean) => void,
    setSidePanelMode: (mode: 'view' | 'edit') => void,
    onSaveSuccess?: () => void
): Promise<void> {
    try {
        const { updateSims7Redirection }: { updateSims7Redirection: (request: any) => Promise<void> } = await import('./Sims7RedirectionsPage.api');
        await updateSims7Redirection(req);
        showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
    } catch (err) {
        setShowSuccessToast(false);
        setShowFailureBanner(true);
    }
}
