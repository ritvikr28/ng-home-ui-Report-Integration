import { isPanelEditable, isSuccessToast, isReasonMissing, isDateInvalid } from './Sims7RedirectionsSidePanelHelpers';

export function isSaveBlocked({
  mode,
  selectedRow,
  isDirty,
  redirectToNextGen,
  reasonForChanges,
  requiresReason,
  setReasonError,
  effectiveDate,
  t,
  setDateError
}: {
  mode: string;
  selectedRow: any;
  isDirty: boolean;
  redirectToNextGen: any;
  reasonForChanges: string;
  requiresReason: Function;
  setReasonError: Function;
  effectiveDate: any;
  t: Function;
  setDateError: Function;
}): boolean | 'success' {
  const saveBlockChecks: Array<() => boolean | 'success' | undefined> = [
    () => isPanelEditable(mode, selectedRow) ? true : undefined,
    () => isSuccessToast(selectedRow, isDirty) ? 'success' : undefined,
    () => isReasonMissing(selectedRow, redirectToNextGen, reasonForChanges, requiresReason, setReasonError) ? true : undefined,
    () => isDateInvalid(effectiveDate, t, setDateError) ? true : undefined
  ];
  const found: boolean | 'success' | undefined = saveBlockChecks.map(check => check()).find(result => result !== undefined);
  return found !== undefined ? found : false;
}
