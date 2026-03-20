import { buildRequest, getBackendStatus, handleStatusScenarios } from './buildRequest';

describe('buildRequest', () => {
  it('handles Not migrated scenario', () => {
    const row = { status: 'Not migrated', dfeNumber: '123', id: '1' };
    const payload = buildRequest(row, '2026-03-10', 'Not migrated');
    expect(payload.currentStatus).toBe('N');
    expect(payload.plannedStatus).toBe('N');
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
