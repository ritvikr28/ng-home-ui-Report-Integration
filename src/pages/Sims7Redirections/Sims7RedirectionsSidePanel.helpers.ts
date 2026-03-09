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
    validateReason: Function;
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
}: any) {
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
}: any) {
    handleDateChange({
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
    date,
    setDateError,
    handleValidateDate
}: any) {
    handleValidateDate(date, setDateError);
}
export function canEditSidePanel(mode: string, selectedRow: any): boolean {
    return mode === 'edit' && !!selectedRow;
}

export function shouldShowSuccessToast(selectedRow: any, isDirty: boolean): boolean {
    return selectedRow.status === 'Migrated' && !isDirty;
}

export function showSuccessAndClose(
    setShowSuccessToast: Function,
    setShowFailureBanner: Function,
    setSidePanelMode: Function,
    onSaveSuccess?: Function
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

export function buildRedirectionRequest(row: any, effectiveDateStr: string, status: string) {
    return buildRequest(row, effectiveDateStr, status);
}

export async function tryUpdateRedirection(
    req: any,
    setShowSuccessToast: (val: boolean) => void,
    setShowFailureBanner: (val: boolean) => void,
    setSidePanelMode: (mode: 'view' | 'edit') => void,
    onSaveSuccess?: () => void
) {
    try {
        const { updateSims7Redirection } = await import('./Sims7RedirectionsPage.api');
        await updateSims7Redirection(req);
        showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
    } catch (err) {
        setShowSuccessToast(false);
        setShowFailureBanner(true);
    }
}
