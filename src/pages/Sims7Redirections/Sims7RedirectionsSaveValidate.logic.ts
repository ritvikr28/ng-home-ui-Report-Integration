export function validateDate({ requiresDate, selectedRow, redirectToNextGen, dateParts, effectiveDate, isFutureDate, setDateError }: any): boolean {
    if (requiresDate(selectedRow.status, redirectToNextGen)) {
        if (!dateParts.day && !dateParts.month && !dateParts.year) {
            setDateError('Date is required');
            return false;
        }
        if (!effectiveDate) {
            setDateError('Invalid Date');
            return false;
        }
        if (!isFutureDate(effectiveDate)) {
            setDateError('Date should be in the future');
            return false;
        }
    }
    setDateError("");
    return true;
}

export function validateReason({ requiresReason, selectedRow, redirectToNextGen, reasonForChanges, setReasonError }: any): boolean {
    if (requiresReason(selectedRow.status, redirectToNextGen)) {
        if (!reasonForChanges.trim()) {
            setReasonError('Reason for changes is required');
            return false;
        }
    }
    setReasonError("");
    return true;
}
