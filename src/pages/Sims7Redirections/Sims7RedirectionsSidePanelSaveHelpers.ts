export function handleMigratedNoChanges(selectedRow: any, isDirty: boolean, setShowSuccessToast: Function, setShowFailureBanner: Function, setSidePanelMode: Function, onSaveSuccess?: Function) {
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

export function getEffectiveDateStr(effectiveDate: any) {
  if (effectiveDate instanceof Date && !Number.isNaN(effectiveDate.getTime())) {
    // Return local date in YYYY-MM-DD format
    return `${effectiveDate.getFullYear()}-${String(effectiveDate.getMonth() + 1).padStart(2, '0')}-${String(effectiveDate.getDate()).padStart(2, '0')}`;
  }
  if (typeof effectiveDate === 'string') {
    return effectiveDate;
  }
  return '';
}

export async function saveRedirection(
  updatedRow: any,
  effectiveDateStr: string,
  setDateError: Function,
  // eslint-disable-next-line no-shadow
  buildRequest: Function,
  onSaveSuccess: Function | undefined,
  setShowSuccessToast: Function,
  setShowFailureBanner: Function,
  setSidePanelMode: Function
) {
  const dfeNumber = updatedRow.dfeNumber || updatedRow.DfeNumber;
  if (!dfeNumber) {
    setDateError('DFE Number is missing from the selected row.');
    return;
  }
  const req = buildRequest(updatedRow, effectiveDateStr);
  const { updateSims7Redirection } = await import('./Sims7RedirectionsPage.api');
  await updateSims7Redirection(req);
  setShowSuccessToast(true);
  setShowFailureBanner(false);
  setTimeout(() => {
    setShowSuccessToast(false);
    setSidePanelMode('view');
    if (onSaveSuccess) onSaveSuccess();
  }, 1500);
}
export function buildRequest(updatedRow: any, effectiveDateStr: string, previousStatus?: string) {
  const dfeNumber = updatedRow.dfeNumber || updatedRow.DfeNumber;
  console.log(`dfeNumber for update: ${dfeNumber}`);
  let effectiveDateFinal = effectiveDateStr;
  let reasonForChangeFinal = updatedRow.reasonForChanges || updatedRow.reasonForChange || "";
  const plannedStatusFinal = updatedRow.plannedStatus || getBackendStatus(updatedRow.status);
  // If previous status was 'Reversing' and plannedStatus is 'Migrated', send empty effectiveDate
  if ((previousStatus === 'Reversing' && plannedStatusFinal === 'Migrated')) {
    effectiveDateFinal = updatedRow.previousDate || "";
    console.log('Using previousDate for effectiveDateFinal:', updatedRow.previousDate);
  }
  // If previous status was 'Reversing', always send empty reasonForChange
  if (previousStatus === 'Reversing') {
    reasonForChangeFinal = "";
  }
  const payload = {
    id: updatedRow.id || updatedRow.moduleId,
    dfeNumber,
    ngModule: updatedRow.category || updatedRow.ngModule, // swap: ngModule now maps category
    ngComponent: updatedRow.nextGenModule || updatedRow.ngComponent, // swap: ngComponent now maps nextGenModule
    switchToSchool: updatedRow.switchToSchool ?? false,
    effectiveDate: effectiveDateFinal,
    PlannedStatus: plannedStatusFinal,
    reasonForChange: reasonForChangeFinal
  };
  console.log(`Update API payload: previousStatus: ${previousStatus}, plannedStatus: ${plannedStatusFinal}, effectiveDate: ${effectiveDateFinal}, reasonForChange: ${reasonForChangeFinal}, fullPayload: ${JSON.stringify(payload)}`);
  return payload;
}

export function getBackendStatus(status: string) {
  const statusMap: Record<string, string> = {
    'Not migrated': 'NotMigrated',
    'Migrated': 'Migrated',
    'Planned': 'Planned',
    'Permanent': 'Permanent',
    'Reversing': 'Reversing'
  };
  return statusMap[status] || status;
}

export async function handleStatusLogic(updatedRow: any, redirectToNextGen: string, effectiveDate: any, reasonForChanges: string) {
  const { handleReversingStatus, handleFutureDateStatus, handleMigratedStatus, handlePlannedStatus } = await import('./Sims7RedirectionsSaveStatus.logic');
  if (updatedRow.status === 'Reversing') handleReversingStatus(updatedRow, redirectToNextGen, effectiveDate, reasonForChanges);
  handleFutureDateStatus(updatedRow, effectiveDate);
  if (updatedRow.status === 'Migrated') handleMigratedStatus(updatedRow, redirectToNextGen, effectiveDate, reasonForChanges);
  if (updatedRow.status === 'Planned') handlePlannedStatus(updatedRow, redirectToNextGen);
}
