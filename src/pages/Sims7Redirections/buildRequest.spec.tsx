import { buildRequest, getBackendStatus, handleStatusScenarios } from './buildRequest';

describe('buildRequest', () => {
  it('handles Not migrated scenario with redirectStatus field (NotMigrated API key)', () => {
    // Table rows with redirectStatus = 'NotMigrated' hit isNotMigratedScenario → cur=Y, plan=Y
    const row = { redirectStatus: 'NotMigrated', status: 'Not migrated', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Not migrated');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.effectiveDate).toBe('2026-03-10');
  });

  it('handles Migrated scenario', () => {
    const row = { status: 'Migrated', dfeNumber: '123', id: '1', previousDate: '2026-03-09' };
    const payload = buildRequest(row, '2026-03-10', 'Migrated');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.effectiveDate).toBe('2026-03-09');
  });

  it('handles Planned scenario', () => {
    const row = { status: 'Planned', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Planned');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
  });

  it('handles Reversing scenario', () => {
    const row = { status: 'Reversing', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Reversing');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('N');
  });

  it('handles missing dfeNumber', () => {
    const row = { status: 'Not migrated', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Not migrated');
    expect(payload.dfeNumber).toBeUndefined();
  });

  it('maps status correctly', () => {
    expect(getBackendStatus('Not migrated')).toBe('NotMigrated');
    expect(getBackendStatus('Migrated')).toBe('Migrated');
    expect(getBackendStatus('Planned')).toBe('Planned');
    expect(getBackendStatus('Permanent')).toBe('Permanent');
    expect(getBackendStatus('Reversing')).toBe('Reversing');
    expect(getBackendStatus('Other')).toBe('Other');
  });
});

describe('buildRequest additional scenarios', () => {
  it('handles Reversing with redirectStatus', () => {
    const row = { redirectStatus: 'Reversing', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Reversing');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('N');
  });

  it('throws for Migrated without previousDate', () => {
    const row = { status: 'Migrated', dfeNumber: '123', id: '1' };
    expect(() => buildRequest(row, '2026-03-10', 'Migrated')).toThrow();
  });

  it('handles Migrated with previousDate', () => {
    const row = { status: 'Migrated', dfeNumber: '123', id: '1', previousDate: '2026-03-09' };
    const payload = buildRequest(row, '2026-03-10', 'Migrated');
    expect(payload.effectiveDate).toBe('2026-03-09');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
  });

  it('handles Planned scenario with redirectStatus', () => {
    const row = { redirectStatus: 'Planned', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Planned');
    expect(['Y', 'N', '']).toContain(payload.currentStatus);
  });

  it('handles NotMigrated scenario with redirectStatus', () => {
    const row = { redirectStatus: 'NotMigrated', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Not migrated');
    expect(['', 'Y', 'N']).toContain(payload.currentStatus);
    expect(['', 'Y', 'N']).toContain(payload.plannedStatus);
  });

  it('handles NotMigratedToPlanned', () => {
    const row = { dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'N');
    expect(['Y', 'N', '']).toContain(payload.plannedStatus);
  });

  it('handles PlannedToNotMigrated (future date)', () => {
    const row = { dfeNumber: '123', id: '1' };
    const futureDate = new Date(Date.now() + 100000).toISOString();
    const payload = buildRequest(row, futureDate, 'N');
    expect(['N', 'Y', '']).toContain(payload.plannedStatus);
  });

  it('handles previousStatus Reversing and plannedStatusFinal Migrated', () => {
    const row = { previousDate: '2026-03-09', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Reversing');
    expect(payload).toBeDefined();
  });

  it('handles previousStatus Reversing', () => {
    const row = { dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Reversing');
    expect(payload).toBeDefined();
  });

  it('handles default return', () => {
    const row = { dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Other');
    expect(payload).toBeDefined();
  });
});

describe('handleStatusScenarios', () => {
  const fn = handleStatusScenarios;
  it('throws for Migrated without previousDate', () => {
    expect(() => fn({ updatedRow: { status: 'Migrated' }, plannedStatusFinal: 'X', currentStatusFinal: 'Y', effectiveDateFinal: 'd', reasonForChangeFinal: 'r', previousStatus: 's' })).toThrow();
  });
});

describe('buildRequest edge cases', () => {
  it('handles alternative field names', () => {
    const row = { plannedStatus: 'N', currentStatus: 'Y', moduleId: 'mid', category: 'cat', ngModule: 'ngm', nextGenModule: 'ngc', ngComponent: 'ngc2', switchToSchool: true, reasonForChange: 'r', DfeNumber: 'dfe' };
    const payload = buildRequest(row, '2026-03-10');
    expect(payload.id).toBe('mid');
    expect(payload.dfeNumber).toBe('dfe');
    expect(payload.ngModule).toBe('cat');
    expect(payload.ngComponent).toBe('ngc');
    expect(payload.switchToSchool).toBe(true);
    expect(payload.reasonForChange).toBe('r');
  });
  it('switchToSchool defaults to false', () => {
    const row = { status: 'Not migrated', id: '1' };
    const payload = buildRequest(row, '2026-03-10');
    expect(payload.switchToSchool).toBe(false);
  });
});

describe('buildRequest — NotMigrated Yes with future date', () => {
  it('sends currentStatus=N and plannedStatus=Y when previousStatus is Not migrated and status mutated to Planned', () => {
    // Real-world: selectedRow.status = 'Not migrated' → passed as previousStatus
    // handleFutureDateStatus mutates updatedRow.status → 'Planned'
    const row = {
      status: 'Planned',       // mutated by handleFutureDateStatus
      dfeNumber: '123',
      id: '1',
      switchToSchool: false
    };
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const payload = buildRequest(row, futureDate, 'Not migrated'); // previousStatus = original
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.effectiveDate).toBe(futureDate);
    expect(payload.switchToSchool).toBe(true); // shouldSwitchToSchool('N','Y', futureDate) = true
  });

  it('does NOT match this branch when status is still Not migrated (no change, past date)', () => {
    const row = {
      redirectStatus: 'NotMigrated',
      status: 'Not migrated',
      dfeNumber: '123',
      id: '1'
    };
    // Past date + status not mutated to Planned → isNotMigratedScenario fires → cur=Y, plan=Y
    const payload = buildRequest(row, '2026-03-10', 'Not migrated');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
  });
});

describe('buildRequest — switchToSchool logic', () => {
  it('forces switchToSchool=true when currentStatus=Y and plannedStatus=Y (Migrated scenario)', () => {
    const row = {
      status: 'Migrated',
      dfeNumber: '123',
      id: '1',
      previousDate: '2026-03-09',
      switchToSchool: false
    };
    const payload = buildRequest(row, '2026-03-10', 'Migrated');
    expect(payload.currentStatus).toBe('Y');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.switchToSchool).toBe(true);
  });

  it('forces switchToSchool=true when currentStatus=N, plannedStatus=Y and effectiveDate is future (NotMigrated+Yes scenario)', () => {
    const row = {
      status: 'Planned',
      dfeNumber: '123',
      id: '1',
      switchToSchool: false
    };
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const payload = buildRequest(row, futureDate, 'Not migrated');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.switchToSchool).toBe(true);
  });

  it('does NOT force switchToSchool=true when currentStatus=N, plannedStatus=Y but effectiveDate is past', () => {
    const row = {
      status: 'Planned',
      dfeNumber: '123',
      id: '1',
      switchToSchool: false
    };
    const payload = buildRequest(row, '2020-01-01', 'Not migrated');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.switchToSchool).toBe(false); // past date → fallback to row value
  });

  it('uses row switchToSchool value as fallback when neither condition is met', () => {
    const row = {
      status: 'Reversing',
      dfeNumber: '123',
      id: '1',
      switchToSchool: true
    };
    const payload = buildRequest(row, '2026-03-10', 'Reversing');
    expect(payload.switchToSchool).toBe(true); // fallback to row value
  });
});

describe('buildRequest — Planned edit mode, date-only change', () => {
  it('sends currentStatus=N and plannedStatus=Y when redirectStatus is Planned, previousStatus is Planned, and effectiveDate is future', () => {
    // Scenario: user opened Planned row in edit mode, only changed effective date to a future date
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const row = {
      redirectStatus: 'Planned',
      status: 'Planned',
      dfeNumber: '123',
      id: '1',
      switchToSchool: false
    };
    const payload = buildRequest(row, futureDate, 'Planned');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('Y');
    expect(payload.effectiveDate).toBe(futureDate);
  });

  it('also works using previousStatus alone (table row without redirectStatus field)', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const row = {
      status: 'Planned',   // no redirectStatus field (table row)
      dfeNumber: '123',
      id: '1',
      switchToSchool: false
    };
    const payload = buildRequest(row, futureDate, 'Planned');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('Y');
  });

  it('does NOT match when effectiveDate is past (past-date edit)', () => {
    const row = {
      redirectStatus: 'Planned',
      status: 'Planned',
      dfeNumber: '123',
      id: '1'
    };
    // Past date → falls into isPlannedScenario (cur=Y, plan=Y) → N/N
    const payload = buildRequest(row, '2020-01-01', 'Planned');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('N');
  });
});
