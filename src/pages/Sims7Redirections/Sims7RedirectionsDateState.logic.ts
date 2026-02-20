import type { HandleDateChangeParams } from "./Sims7RedirectionsSidePanelDate.logic";
// State update logic for date change
import { isFormDirty } from "./Sims7RedirectionsFormDirty.logic";
import { parseDateParts } from "./Sims7RedirectionsDateParse.logic";
import { validateDateParts } from "./Sims7RedirectionsDateValidate.logic";

export function handleDateChange({
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
}: HandleDateChangeParams): void {
    const { day, month, year }: { day: string; month: string; year: string } = parseDateParts(arg1, arg2, arg3);
    setDateParts({ day, month, year });
    const error: string | null = validateDateParts(day, month, year);
    if (error) {
        setEffectiveDate(null);
        setDateError(error);
        setIsDirty(isFormDirty(selectedRow, redirectToNextGen, null, reasonForChanges));
        return;
    }
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    setEffectiveDate(dateObj);
    setDateError("");
    setIsDirty(isFormDirty(selectedRow, redirectToNextGen, dateObj, reasonForChanges));
}
