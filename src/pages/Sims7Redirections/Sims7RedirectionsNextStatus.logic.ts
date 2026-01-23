import {
    handleReversingYes,
    handleReversingNo,
    handleFutureDate,
    handleMigratedNo,
    handlePlannedNo
} from "./Sims7RedirectionsNextStatusHelpers.logic";
import { Sims7RedirectionsRow } from "./Sims7RedirectionsInterfaces";

export function getNextStatus(
    selectedRow: Sims7RedirectionsRow,
    redirectToNextGen: string,
    effectiveDate: Date | null,
    reasonForChanges: string
): Sims7RedirectionsRow {
    const updated: Sims7RedirectionsRow = { ...selectedRow };
    if (selectedRow.status === 'Reversing' && redirectToNextGen === 'yes') {
        handleReversingYes(updated);
    }
    if (selectedRow.status === 'Reversing' && redirectToNextGen === 'no') {
        handleReversingNo(updated, effectiveDate, reasonForChanges);
    }
    handleFutureDate(updated, effectiveDate);
    if (selectedRow.status === 'Migrated' && redirectToNextGen === 'no') {
        handleMigratedNo(updated, effectiveDate, reasonForChanges);
    }
    if (selectedRow.status === 'Planned' && redirectToNextGen === 'no') {
        handlePlannedNo(updated);
    }
    return updated;
}
