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

export interface SaveRedirectionConfig {
  updatedRow: any;
  effectiveDateStr: string;
  setDateError: Function;
  // eslint-disable-next-line no-shadow
  buildRequest: Function;
  onSaveSuccess?: Function;
  setShowSuccessToast: Function;
  setShowFailureBanner: Function;
  setSidePanelMode: Function;
}

export async function saveRedirection(config: SaveRedirectionConfig) {
  const {
    updatedRow,
    effectiveDateStr,
    setDateError,
    // eslint-disable-next-line
    buildRequest,
    onSaveSuccess,
    setShowSuccessToast,
    setShowFailureBanner,
    setSidePanelMode
  } = config;
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
  let plannedStatusFinal = mapStatusToChar(updatedRow.plannedStatus || getBackendStatus(updatedRow.status));
  let currentStatusFinal = mapStatusToChar(updatedRow.currentStatus || updatedRow.status || "");
  // Custom logic: If status or redirectStatus is 'Reversing', backend wants currentStatus 'Y' and plannedStatus 'N'
  if (updatedRow.status === 'Reversing' || updatedRow.redirectStatus === 'Reversing') {
    currentStatusFinal = 'Y';
    plannedStatusFinal = 'N';
  }

  const dfeNumber = updatedRow.dfeNumber || updatedRow.DfeNumber;
  let effectiveDateFinal = effectiveDateStr;
  let reasonForChangeFinal = updatedRow.reasonForChanges || updatedRow.reasonForChange || "";

  // Custom logic: If redirectStatus is 'Reversing', in edit mode, and updating to Migrated, send both statuses 'Y' and effectiveDate as previousDate
  if (
    updatedRow.status === 'Migrated' || updatedRow.redirectStatus === 'Migrated'
  ) {
    currentStatusFinal = 'Y';
    plannedStatusFinal = 'Y';
    if (!updatedRow.previousDate) {
      throw new Error('Previous date is required when updating from Reversing to Migrated.');
    }
    effectiveDateFinal = updatedRow.previousDate;
  }
  
  // Custom logic: If redirectStatus is 'Migrated' and in edit mode, set currentStatus to 'Y' and plannedStatus to 'N' for reversing
  if (updatedRow.redirectStatus === 'Migrated' && updatedRow.isEditMode) {
    currentStatusFinal = 'Y';
    plannedStatusFinal = 'N';
  }
  // ...existing code...
  // Custom logic: If redirectStatus is 'Planned' and any of the listed status combinations, set both to 'N'
  if (updatedRow.redirectStatus === 'Planned') {
    const plannedScenarios = [
      { cur: 'Y', plan: '' },
      { cur: 'Y', plan: 'Y' },
      { cur: 'N', plan: 'Y' }
    ];
    const matchesScenario = plannedScenarios.some(
      s => currentStatusFinal === s.cur && plannedStatusFinal === s.plan
    );
    if (matchesScenario) {
      currentStatusFinal = 'N';
      plannedStatusFinal = 'N';
    }
    else {
      currentStatusFinal = 'Y';
      plannedStatusFinal = '';
    }
  }
  // Custom logic: If redirectStatus is 'NotMigrated' and any of the listed status combinations, set both to 'Y'
  if (updatedRow.redirectStatus === 'NotMigrated') {
    const notMigratedScenarios = [
      { cur: 'N', plan: '' },
      { cur: 'N', plan: 'N' },
      { cur: '', plan: 'N' }
    ];
    const matchesScenario = notMigratedScenarios.some(
      s => currentStatusFinal === s.cur && plannedStatusFinal === s.plan
    );
    if (matchesScenario) {
      currentStatusFinal = 'Y';
      plannedStatusFinal = 'Y';
    }
  }
  // Custom logic: If updating from NotMigrated to Planned, send 'Y' for both statuses
  const isNotMigratedToPlanned =
    mapStatusToChar(previousStatus || '') === 'N' && plannedStatusFinal === 'P';
  if (isNotMigratedToPlanned) {
    currentStatusFinal = 'Y';
    plannedStatusFinal = 'Y';
  }
  // Custom logic: If currentStatus is null, plannedStatus is 'Y', and effectiveDate is future, set both statuses to 'N' for NotMigrated
  const isPlannedToNotMigrated =
    (currentStatusFinal === '' || currentStatusFinal === undefined || currentStatusFinal === null) &&
    plannedStatusFinal === 'Y' &&
    effectiveDateFinal && new Date(effectiveDateFinal) > new Date();
  if (isPlannedToNotMigrated) {
    plannedStatusFinal = 'N';
    currentStatusFinal = 'N';
  }
function mapStatusToChar(status: string): string {
  // Accepts full status or already mapped char
  if (!status) return '';
  const statusMap: Record<string, string> = {
    'Not migrated': 'N',
    'NotMigrated': 'N',
    'N': 'N',
    'Migrated': 'Y',
    'Y': 'Y',
    'Planned': 'Y',
    'Permanent': 'P',
    'P': 'P',
    'Reversing': '',
    '': ''
  };
  return statusMap[status] || '';
}
  if ((previousStatus === 'Reversing' && plannedStatusFinal === 'Migrated')) {
    effectiveDateFinal = updatedRow.previousDate || "";
  }
  if (previousStatus === 'Reversing') {
    reasonForChangeFinal = "";
  }
  const payload = {
    id: updatedRow.id || updatedRow.moduleId,
    dfeNumber,
    ngModule: updatedRow.category || updatedRow.ngModule,
    ngComponent: updatedRow.nextGenModule || updatedRow.ngComponent,
    switchToSchool: updatedRow.switchToSchool ?? false,
    effectiveDate: effectiveDateFinal,
    currentStatus: currentStatusFinal,
    plannedStatus: plannedStatusFinal,
    reasonForChange: reasonForChangeFinal
  };
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
