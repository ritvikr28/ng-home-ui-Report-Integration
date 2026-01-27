/* eslint-disable no-param-reassign */
import { formatDate } from "./Sims7RedirectionsDateHelpers";

export function handleReversingYes(updated: any): void {
    updated.status = 'Migrated';
    updated.redirectToNextGen = 'yes';
    updated.reasonForChanges = '';
}

export function handleReversingNo(updated: any, effectiveDate: Date | null, reasonForChanges: string): void {
    if (effectiveDate) {
        updated.effectiveDate = formatDate(effectiveDate);
    }
    updated.reasonForChanges = reasonForChanges;
}

export function handleFutureDate(updated: any, effectiveDate: Date | null): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
        effectiveDate &&
        effectiveDate > today &&
        (updated.status === 'Not migrated' || updated.status === 'Planned')
    ) {
        if (updated.status === 'Not migrated') {
            updated.status = 'Planned';
            if (updated.reasonForChanges) {
                updated.reasonForChanges = '';
            }
        }
        updated.effectiveDate = formatDate(effectiveDate);
    }
}

export function handleMigratedNo(updated: any, effectiveDate: Date | null, reasonForChanges: string): void {
    updated.status = 'Reversing';
    updated.redirectToNextGen = 'no';
    if (effectiveDate) {
        updated.effectiveDate = formatDate(effectiveDate);
    }
    updated.reasonForChanges = reasonForChanges;
}

export function handlePlannedNo(updated: any): void {
    updated.status = 'Not migrated';
    updated.effectiveDate = "-";
    updated.modifiedBy = "-";
}
