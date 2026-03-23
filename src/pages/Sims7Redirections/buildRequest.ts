import type { UpdateSims7RedirectionRequest } from './Sims7RedirectionsPage.api';

export function getBackendStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Not migrated': 'NotMigrated',
    'Migrated': 'Migrated',
    'Planned': 'Planned',
    'Permanent': 'Permanent',
    'Reversing': 'Reversing'
  };
  return statusMap[status] || status;
}

function mapStatusToChar(status: string): string {
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

function isReversingScenario(updatedRow: any): boolean {
  return updatedRow.status === 'Reversing' || updatedRow.redirectStatus === 'Reversing';
}
function isMigratedScenario(updatedRow: any): boolean {
  return updatedRow.status === 'Migrated' || updatedRow.redirectStatus === 'Migrated';
}
function isMigratedEditScenario(updatedRow: any): boolean {
  return updatedRow.redirectStatus === 'Migrated' && updatedRow.isEditMode;
}
function isPlannedScenario(updatedRow: any, currentStatusFinal: any, plannedStatusFinal: any): boolean {
  const plannedScenarios: Array<{ cur: string; plan: string }> = [
    { cur: 'Y', plan: '' },
    { cur: 'Y', plan: 'Y' },
    { cur: 'N', plan: 'Y' }
  ];
  return updatedRow.redirectStatus === 'Planned' && plannedScenarios.some(
    s => currentStatusFinal === s.cur && plannedStatusFinal === s.plan
  );
}
function isNotMigratedScenario(updatedRow: any, currentStatusFinal: any, plannedStatusFinal: any): boolean {
  const notMigratedScenarios: Array<{ cur: string; plan: string }> = [
    { cur: 'N', plan: '' },
    { cur: 'N', plan: 'N' },
    { cur: '', plan: 'N' }
  ];
  return updatedRow.redirectStatus === 'NotMigrated' && notMigratedScenarios.some(
    s => currentStatusFinal === s.cur && plannedStatusFinal === s.plan
  );
}
function isNotMigratedYesWithFutureDate(updatedRow: any, previousStatus?: string): boolean {
  const wasNotMigrated =
    updatedRow.redirectStatus === 'NotMigrated' ||
    previousStatus === 'Not migrated' ||
    previousStatus === 'NotMigrated';
  return wasNotMigrated && updatedRow.status === 'Planned';
}
function isPlannedEditDateOnly(updatedRow: any, previousStatus: any, effectiveDateFinal: string): boolean {
  const wasPlanned =
    updatedRow.redirectStatus === 'Planned' ||
    previousStatus === 'Planned';
  return (
    wasPlanned &&
    updatedRow.status === 'Planned' &&
    !!effectiveDateFinal &&
    new Date(effectiveDateFinal) > new Date()
  );
}
function isNotMigratedToPlanned(previousStatus: any, plannedStatusFinal: any): boolean {
  return mapStatusToChar(previousStatus || '') === 'N' && plannedStatusFinal === 'P';
}
function isPlannedToNotMigrated(currentStatusFinal: any, plannedStatusFinal: any, effectiveDateFinal: any): boolean {
  return (
    (currentStatusFinal === '' || currentStatusFinal === undefined || currentStatusFinal === null) &&
    plannedStatusFinal === 'Y' &&
    effectiveDateFinal && new Date(effectiveDateFinal) > new Date()
  );
}
function shouldSwitchToSchool(currentStatusFinal: string, plannedStatusFinal: string, effectiveDateFinal: string): boolean {
  if (currentStatusFinal === 'Y' && plannedStatusFinal === 'Y') {
    return true;
  }
  if (
    currentStatusFinal === 'N' &&
    plannedStatusFinal === 'Y' &&
    !!effectiveDateFinal &&
    new Date(effectiveDateFinal) > new Date()
  ) {
    return true;
  }
  return false;
}
export function handleStatusScenarios({ updatedRow, plannedStatusFinal, currentStatusFinal, effectiveDateFinal, reasonForChangeFinal, previousStatus }: any): {
  plannedStatusFinal: string; currentStatusFinal: string; effectiveDateFinal: string; reasonForChangeFinal: string; } {
  if (isReversingScenario(updatedRow)) {
    return {
      plannedStatusFinal: 'N',
      currentStatusFinal: 'Y',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isMigratedScenario(updatedRow)) {
    if (!updatedRow.previousDate) {
      throw new Error('Previous date is required when updating from Reversing to Migrated.');
    }
    return {
      plannedStatusFinal: 'Y',
      currentStatusFinal: 'Y',
      effectiveDateFinal: updatedRow.previousDate,
      reasonForChangeFinal
    };
  }
  if (isMigratedEditScenario(updatedRow)) {
    return {
      plannedStatusFinal: 'N',
      currentStatusFinal: 'Y',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isPlannedEditDateOnly(updatedRow, previousStatus, effectiveDateFinal)) {
    return {
      plannedStatusFinal: 'Y',
      currentStatusFinal: 'N',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isPlannedScenario(updatedRow, currentStatusFinal, plannedStatusFinal)) {
    return {
      plannedStatusFinal: 'N',
      currentStatusFinal: 'N',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  } 
  // eslint-disable-next-line no-else-return
  else if (updatedRow.redirectStatus === 'Planned') {
    return {
      plannedStatusFinal: '',
      currentStatusFinal: 'Y',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isNotMigratedYesWithFutureDate(updatedRow, previousStatus)) {
    return {
      plannedStatusFinal: 'Y',
      currentStatusFinal: 'N',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isNotMigratedScenario(updatedRow, currentStatusFinal, plannedStatusFinal)) {
    return {
      plannedStatusFinal: 'Y',
      currentStatusFinal: 'Y',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isNotMigratedToPlanned(previousStatus, plannedStatusFinal)) {
    return {
      plannedStatusFinal: 'Y',
      currentStatusFinal: 'Y',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if (isPlannedToNotMigrated(currentStatusFinal, plannedStatusFinal, effectiveDateFinal)) {
    return {
      plannedStatusFinal: 'N',
      currentStatusFinal: 'N',
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  if ((previousStatus === 'Reversing' && plannedStatusFinal === 'Migrated')) {
    return {
      plannedStatusFinal,
      currentStatusFinal,
      effectiveDateFinal: updatedRow.previousDate || '',
      reasonForChangeFinal
    };
  }
  if (previousStatus === 'Reversing') {
    return {
      plannedStatusFinal,
      currentStatusFinal,
      effectiveDateFinal,
      reasonForChangeFinal
    };
  }
  return { plannedStatusFinal, currentStatusFinal, effectiveDateFinal, reasonForChangeFinal };
}

export function buildRequest(
  updatedRow: any,
  effectiveDateStr: string,
  previousStatus?: string
): UpdateSims7RedirectionRequest {
  let plannedStatusFinal: string = mapStatusToChar(updatedRow.plannedStatus || getBackendStatus(updatedRow.status));
  let currentStatusFinal: string = mapStatusToChar(updatedRow.currentStatus || updatedRow.status || "");
  const dfeNumber = updatedRow.dfeNumber || updatedRow.DfeNumber;
  let effectiveDateFinal: string = effectiveDateStr;
  let reasonForChangeFinal = updatedRow.reasonForChanges || updatedRow.reasonForChange || "";

  ({ plannedStatusFinal, currentStatusFinal, effectiveDateFinal, reasonForChangeFinal } = handleStatusScenarios({
    updatedRow,
    plannedStatusFinal,
    currentStatusFinal,
    effectiveDateFinal,
    reasonForChangeFinal,
    previousStatus
  }));

  const payload: UpdateSims7RedirectionRequest = {
    id: updatedRow.id || updatedRow.moduleId,
    dfeNumber,
    ngModule: updatedRow.category || updatedRow.ngModule,
    ngComponent: updatedRow.nextGenModule || updatedRow.ngComponent,
    switchToSchool: shouldSwitchToSchool(currentStatusFinal, plannedStatusFinal, effectiveDateFinal)
      ? true
      : (updatedRow.switchToSchool ?? false),
    effectiveDate: effectiveDateFinal,
    currentStatus: currentStatusFinal,
    plannedStatus: plannedStatusFinal,
    reasonForChange: reasonForChangeFinal
  };
  return payload;
}
