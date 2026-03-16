export { buildRequest } from './buildRequest';
export function handleMigratedNoChanges(
  selectedRow: any,
  isDirty: boolean,
  setShowSuccessToast: (val: boolean) => void,
  setShowFailureBanner: (val: boolean) => void,
  setSidePanelMode: (mode: 'view' | 'edit') => void,
  onSaveSuccess?: () => void
): boolean {
  if (selectedRow.status === 'Migrated' && !isDirty) {
    setShowSuccessToast(true);
    setShowFailureBanner(false);
    setTimeout(() => {
      setShowSuccessToast(false);
      setSidePanelMode('view');
      if (onSaveSuccess) onSaveSuccess();
    }, 1500);
    return true;
  }
  return false;
}

export function getEffectiveDateStr(effectiveDate: Date | string | null): string {
  if (effectiveDate instanceof Date && !Number.isNaN(effectiveDate.getTime())) {
    // Return local date in YYYY-MM-DD format
    return `${effectiveDate.getFullYear()}-${String(effectiveDate.getMonth() + 1).padStart(2, '0')}-${String(effectiveDate.getDate()).padStart(2, '0')}`;
  }
  if (typeof effectiveDate === 'string') {
    return effectiveDate;
  }
  return '';
}

export interface SaveRedirectionConfig {
  updatedRow: any;
  effectiveDateStr: string;
  setDateError: Function;
  // eslint-disable-next-line no-shadow
  onSaveSuccess?: Function;
  setShowSuccessToast: Function;
  setShowFailureBanner: Function;
  setSidePanelMode: Function;
}

