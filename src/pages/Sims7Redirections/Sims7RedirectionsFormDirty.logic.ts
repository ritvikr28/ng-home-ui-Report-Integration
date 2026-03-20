import { parseDateString } from "./Sims7RedirectionsDateHelpers";

export function isFormDirty(
    selectedRow: any,
    redirect: string,
    date: Date | null,
    reason: string
): boolean {
    if (selectedRow.status === 'Not migrated' || selectedRow.status === 'Reversing') {
        return redirect !== 'no';
    }
    const origDate: Date | null = parseDateString(selectedRow.effectiveDate);
    const dateChanged = date && origDate && date.toDateString() !== origDate.toDateString();
    return (
        redirect !== 'yes' ||
        dateChanged ||
        (reason !== (selectedRow.reasonForChanges || ''))
    );
}
