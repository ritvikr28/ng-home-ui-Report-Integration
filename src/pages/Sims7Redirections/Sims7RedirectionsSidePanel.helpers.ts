import React from 'react';
import { handleRedirectToNextGenChange } from './Sims7RedirectionsSidePanelRedirect.logic';
import { handleDateChange } from './Sims7RedirectionsSidePanelDate.logic';
import { buildRequest } from './Sims7RedirectionsSidePanelSaveHelpers';

export function setReasonForChangesHandler({
    val: reasonVal,
    setReasonForChangesRaw,
    validateReason,
    requiresReason,
    selectedRow,
    redirectToNextGen,
    setReasonError
}: {
    val: string;
    setReasonForChangesRaw: (val: string) => void;
    validateReason: (args: {
        requiresReason: any;
        selectedRow: any;
        redirectToNextGen: string;
        reasonForChanges: string;
        setReasonError: (val: string) => void;
    }) => void;
    requiresReason: any;
    selectedRow: any;
    redirectToNextGen: string;
    setReasonError: (val: string) => void;
}) {
    setReasonForChangesRaw(reasonVal);
    validateReason({
        requiresReason,
        selectedRow,
        redirectToNextGen,
        reasonForChanges: reasonVal,
        setReasonError
    });
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
}: {
    event: any;
    value: any;
    selectedRow: any;
    setRedirectToNextGen: (val: any) => void;
    setEffectiveDate: (val: any) => void;
    setDateParts: (val: any) => void;
    setIsDirty: (val: boolean) => void;
    effectiveDate: any;
    reasonForChanges: any;
}) {
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
}: {
    t: any;
    arg1: any;
    arg2: any;
    arg3: any;
    setDateParts: (val: any) => void;
    setEffectiveDate: (val: any) => void;
    setDateError: React.Dispatch<React.SetStateAction<string>>;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRow: any;
    redirectToNextGen: string;
    reasonForChanges: any;
}) {
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

export function onValidateDateHandler({
    date: validateDate,
    setDateError: validateDateError,
    handleValidateDate: validateDateHandler
}: {
    date: any;
    setDateError: React.Dispatch<React.SetStateAction<string>>;
    handleValidateDate: (date: any, setDateError: React.Dispatch<React.SetStateAction<string>>) => void;
}) {
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
) {
    setShowSuccessToast(true);
    setShowFailureBanner(false);
    setTimeout(() => {
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
): {
    id: string;
    dfeNumber: string;
    ngModule: string;
    ngComponent: string;
    switchToSchool: boolean;
    effectiveDate: string;
    currentStatus: string;
    plannedStatus: string;
    reasonForChange: string;
} {
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
