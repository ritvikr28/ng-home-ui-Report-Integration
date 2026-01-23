/* eslint-disable no-param-reassign */
import { formatDate } from "./Sims7RedirectionsDateHelpers";

export function handleReversingStatus(selectedRow: any, redirectToNextGen: string, effectiveDate: Date | null, reasonForChanges: string): void {
    if (redirectToNextGen === 'yes') {
        selectedRow.status = 'Migrated';
        selectedRow.redirectToNextGen = 'yes';
        selectedRow.reasonForChanges = '';
    } else if (redirectToNextGen === 'no') {
        if (effectiveDate) {
            selectedRow.effectiveDate = formatDate(effectiveDate);
        }
        selectedRow.reasonForChanges = reasonForChanges;
    }
}

export function handleFutureDateStatus(selectedRow: any, effectiveDate: Date | null): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
        effectiveDate &&
        effectiveDate > today &&
        (selectedRow.status === 'Not migrated' || selectedRow.status === 'Planned')
    ) {
        if (selectedRow.status === 'Not migrated') {
            selectedRow.status = 'Planned';
            if (selectedRow.reasonForChanges) {
                selectedRow.reasonForChanges = '';
            }
        }
        selectedRow.effectiveDate = formatDate(effectiveDate);
    }
}

export function handleMigratedStatus(selectedRow: any, redirectToNextGen: string, effectiveDate: Date | null, reasonForChanges: string): void {
    if (redirectToNextGen === 'no') {
        selectedRow.status = 'Reversing';
        selectedRow.redirectToNextGen = 'no';
        if (effectiveDate) {
            selectedRow.effectiveDate = formatDate(effectiveDate);
        }
        selectedRow.reasonForChanges = reasonForChanges;
    }
}

export function handlePlannedStatus(selectedRow: any, redirectToNextGen: string): void {
    if (redirectToNextGen === 'no') {
        selectedRow.status = 'Not migrated';
        selectedRow.effectiveDate = "-";
        selectedRow.modifiedBy = "-";
    }
}
