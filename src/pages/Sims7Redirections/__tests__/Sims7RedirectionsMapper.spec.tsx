import { mapSims7RedirectionsItem } from '../Sims7RedirectionsMapper';

const {
  formatDateDDMMYYYY,
  formatDateISO,
  getEffectiveDate,
  getStatusString,
  getStatus,
  getFieldFromApi,
} = require('../Sims7RedirectionsMapper');

describe('mapSims7RedirectionsItem', () => {
  describe('formatDateDDMMYYYY', () => {
    it('formats valid DD MM YYYY string', () => {
      expect(formatDateDDMMYYYY('01 03 2026')).toBe('01 Mar 2026');
    });
    it('returns null for invalid format', () => {
      expect(formatDateDDMMYYYY('2026-03-01')).toBeNull();
    });
  });

  describe('formatDateISO', () => {
    it('formats valid ISO string', () => {
      expect(formatDateISO('2026-03-01')).toBe('01 Mar 2026');
    });
    it('returns null for invalid format', () => {
      expect(formatDateISO('01 03 2026')).toBeNull();
    });
  });

  describe('getEffectiveDate', () => {
    it('uses formatDateDDMMYYYY if possible', () => {
      expect(getEffectiveDate({ effectiveDate: '01 03 2026' })).toBe('01 Mar 2026');
    });
    it('uses formatDateISO if possible', () => {
      expect(getEffectiveDate({ effectiveDate: '2026-03-01' })).toBe('01 Mar 2026');
    });
    it('returns original string if not matching formats', () => {
      expect(getEffectiveDate({ effectiveDate: 'March 1st, 2026' })).toBe('March 1st, 2026');
    });
    it('returns empty string if no item or no effectiveDate', () => {
      expect(getEffectiveDate(undefined)).toBe('');
      expect(getEffectiveDate({})).toBe('');
    });
  });

  describe('getStatusString', () => {
    it('capitalizes and formats string status', () => {
      expect(getStatusString('not_migrated')).toBe('Not migrated');
      expect(getStatusString('PLANNED')).toBe('Planned');
    });
    it('handles non-string status', () => {
      expect(getStatusString(123)).toBe('123');
    });
    it('returns empty string for falsy input', () => {
      expect(getStatusString(null)).toBe('');
      expect(getStatusString(undefined)).toBe('');
    });
  });

  describe('getStatus', () => {
    it('returns formatted status from item', () => {
      expect(getStatus({ status: 'not_migrated' })).toBe('Not migrated');
    });
    it('returns empty string if no item', () => {
      expect(getStatus(undefined)).toBe('');
    });
  });

  describe('getFieldFromApi', () => {
    const item = {
      ngModule: 'NextGen',
      ngComponent: 'Category',
      sims7Module: 'SIMS7',
      updatedByUserName: 'User',
      effectiveDate: '2026-03-01',
      redirectStatus: 'Migrated',
      tooltipMessage: 'Tooltip',
      reasonForChanges: 'Reason',
      dfeNumber: '123456',
      DfeNumber: '654321',
      id: '42',
    };
    it('returns correct fields for each mapping', () => {
      expect(getFieldFromApi(item, 'nextGenModule')).toBe('NextGen');
      expect(getFieldFromApi(item, 'category')).toBe('Category');
      expect(getFieldFromApi(item, 'sims7Module')).toBe('SIMS7');
      expect(getFieldFromApi(item, 'modifiedBy')).toBe('User');
      expect(getFieldFromApi(item, 'effectiveDate')).toBe('2026-03-01');
      expect(getFieldFromApi(item, 'status')).toBe('Migrated');
      expect(getFieldFromApi(item, 'tooltipMessage')).toBe('Tooltip');
      expect(getFieldFromApi(item, 'reasonForChanges')).toBe('Reason');
      expect(getFieldFromApi(item, 'id')).toBe('42');
    });
    it('returns empty string for missing/invalid fields', () => {
      expect(getFieldFromApi({}, 'nextGenModule')).toBe('');
      expect(getFieldFromApi({}, 'category')).toBe('');
      expect(getFieldFromApi({}, 'sims7Module')).toBe('');
      expect(getFieldFromApi({}, 'modifiedBy')).toBe('');
      expect(getFieldFromApi({}, 'effectiveDate')).toBe('');
      expect(getFieldFromApi({}, 'status')).toBe('');
      expect(getFieldFromApi({}, 'tooltipMessage')).toBe('');
      expect(getFieldFromApi({}, 'reasonForChanges')).toBe('');
      expect(getFieldFromApi({}, 'id')).toBe('');
    });
  });
        it('returns string value for non-string status', () => {
        });
        it('returns empty string for falsy status', () => {
        });
      it('returns null from formatDateISO if not ISO format', () => {
      });
    it('returns date string as-is if not DD MM YYYY or ISO', () => {
    });
  it('maps all fields correctly from API item', () => {
    const apiItem = {
      moduleId: 1,
      ngComponent: 'TestCat',
      ngModule: 'TestNextGen',
      sims7Module: 'TestSIMS7',
      updatedByUserName: 'TestUser',
      effectiveDate: '2026-02-18T00:00:00',
      redirectStatus: 'PLANNED',
      tooltipMessage: 'Test tooltip',
      cellStatus: '',
      actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
      reasonForChanges: 'Reason'
    };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.id).toBe('1');
    expect(result.category).toBe('TestCat');
    expect(result.nextGenModule).toBe('TestNextGen');
    expect(result.sims7Module).toBe('TestSIMS7');
    expect(result.modifiedBy).toBe('TestUser');
    expect(result.effectiveDate).toBe('18 Feb 2026');
    expect(result.status).toBe('Planned');
    expect(result.tooltipMessage).toBe('Test tooltip');
    expect(result.cellStatus).toBe('');
    expect(result.actions.options[0].text).toBe(' View');
    expect(result.reasonForChanges).toBe('Reason');
  });

  it('handles missing fields gracefully', () => {
    const apiItem = {};
    const result = mapSims7RedirectionsItem(apiItem, 5);
    expect(result.id).toBe('6'); // idx + 1
    expect(result.category).toBe('');
    expect(result.nextGenModule).toBe('');
    expect(result.sims7Module).toBe('');
    expect(result.modifiedBy).toBe('');
    expect(result.effectiveDate).toBe('');
    expect(result.status).toBe('');
    expect(result.tooltipMessage).toBe('');
    expect(result.cellStatus).toBe('');
    expect(result.actions.options.length).toBe(2);
    expect(result.reasonForChanges).toBe('');
  });

  it('formats DD MM YYYY date correctly', () => {
    const apiItem = { effectiveDate: '18 02 2026' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toBe('18 Feb 2026');
  });

  it('formats ISO date correctly', () => {
    const apiItem = { effectiveDate: '2026-02-18T00:00:00' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toBe('18 Feb 2026');
  });

  it('formats status correctly', () => {
    const apiItem = { redirectStatus: 'PLANNED' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.status).toBe('Planned');
  });
});
