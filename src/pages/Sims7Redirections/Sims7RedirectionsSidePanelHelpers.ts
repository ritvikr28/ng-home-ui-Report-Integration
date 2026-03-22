// Helper functions for Sims7RedirectionsSidePanel

export function isPanelEditable(mode: string, selectedRow: any): boolean {
    return !canEditSidePanel(mode, selectedRow);
}

export function isSuccessToast(selectedRow: any, isDirty: boolean): boolean {
    return shouldShowSuccessToast(selectedRow, isDirty);
}

export function isReasonMissing(selectedRow: any, redirectToNextGen: any, reasonForChanges: string, requiresReason: Function, setReasonError: Function): boolean {
    if (requiresReason(selectedRow.status, redirectToNextGen) && !reasonForChanges.trim()) {
        setReasonError('Reason for changes is required');
        return true;
    }
    return false;
}

export function isDateInvalid(effectiveDate: any, t: Function, setDateError: Function): boolean {
    return isEffectiveDateInPast(effectiveDate, t, setDateError);
}

export function isEffectiveDateInPast(effectiveDate: any, t: Function, setDateError: Function): boolean {
    if (!effectiveDate) return false;
    const now = new Date();
    const dateToCheck: Date = typeof effectiveDate === 'string' ? new Date(effectiveDate) : effectiveDate;
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const checkDate = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
    if (checkDate <= nowDate) {
        setDateError(t('SIMS7Redirects.dateError'));
        return true;
    }
    return false;
}

function canEditSidePanel(mode: string, selectedRow: any): boolean {
    return mode === 'edit' && !!selectedRow;
}

function shouldShowSuccessToast(selectedRow: any, isDirty: boolean): boolean {
    return !isDirty;
}
