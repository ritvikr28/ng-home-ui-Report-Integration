import { handleRedirectToNextGenChange } from '../Sims7RedirectionsSidePanelRedirect.logic';

jest.mock('../Sims7RedirectionsDateHelpers', () => ({
  parseDateString: (str: string) => {
    if (!str || str === '-') return null;
    const d = new Date(str);
    // eslint-disable-next-line no-restricted-globals
    return Number.isNaN(d.getTime()) ? null : d;
  }
}));

jest.mock('../Sims7RedirectionsFormDirty.logic', () => ({
  isFormDirty: jest.fn(() => false)
}));

const { isFormDirty } = require('../Sims7RedirectionsFormDirty.logic');

function makeParams(overrides: any = {}) {
  return {
    event: {} as any,
    value: 'no',
    selectedRow: { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' },
    setRedirectToNextGen: jest.fn(),
    setEffectiveDate: jest.fn(),
    setDateParts: jest.fn(),
    setIsDirty: jest.fn(),
    effectiveDate: null,
    reasonForChanges: '',
    setDateError: jest.fn(),
    ...overrides
  };
}

describe('handleRedirectToNextGenChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isFormDirty.mockReturnValue(false);
  });

  describe('Not migrated + Yes', () => {
    it('sets effectiveDate to tomorrow', () => {
      const setEffectiveDate = jest.fn();
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' },
        setEffectiveDate,
        setDateParts
      }));
      expect(setEffectiveDate).toHaveBeenCalledTimes(1);
      const dateArg: Date = setEffectiveDate.mock.calls[0][0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(dateArg.toDateString()).toBe(tomorrow.toDateString());
    });

    it('sets dateParts to tomorrow', () => {
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' },
        setDateParts
      }));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(setDateParts).toHaveBeenCalledWith({
        day: tomorrow.getDate().toString().padStart(2, '0'),
        month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
        year: tomorrow.getFullYear().toString()
      });
    });

    it('clears dateError', () => {
      const setDateError = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' },
        setDateError
      }));
      expect(setDateError).toHaveBeenCalledWith('');
    });

    it('does not throw if setDateError is not provided', () => {
      expect(() =>
        handleRedirectToNextGenChange(makeParams({
          value: 'yes',
          selectedRow: { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' },
          setDateError: undefined
        }))
      ).not.toThrow();
    });
  });

  describe('Migrated + No', () => {
    it('sets effectiveDate to tomorrow', () => {
      const setEffectiveDate = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-01-15', reasonForChanges: '' },
        setEffectiveDate
      }));
      const dateArg: Date = setEffectiveDate.mock.calls[0][0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(dateArg.toDateString()).toBe(tomorrow.toDateString());
    });

    it('sets dateParts to tomorrow', () => {
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-01-15', reasonForChanges: '' },
        setDateParts
      }));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(setDateParts).toHaveBeenCalledWith({
        day: tomorrow.getDate().toString().padStart(2, '0'),
        month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
        year: tomorrow.getFullYear().toString()
      });
    });

    it('clears dateError', () => {
      const setDateError = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-01-15', reasonForChanges: '' },
        setDateError
      }));
      expect(setDateError).toHaveBeenCalledWith('');
    });
  });

  describe('Migrated + Yes', () => {
    it('restores original effectiveDate from selectedRow', () => {
      const setEffectiveDate = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-03-10', reasonForChanges: '' },
        setEffectiveDate
      }));
      expect(setEffectiveDate).toHaveBeenCalledTimes(1);
      const dateArg: Date = setEffectiveDate.mock.calls[0][0];
      expect(dateArg).toBeInstanceOf(Date);
      expect(dateArg.getFullYear()).toBe(2026);
    });

    it('restores original dateParts from selectedRow', () => {
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-03-10', reasonForChanges: '' },
        setDateParts
      }));
      expect(setDateParts).toHaveBeenCalledTimes(1);
    });

    it('handles null origDate (invalid effectiveDate)', () => {
      const setEffectiveDate = jest.fn();
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Migrated', effectiveDate: '-', reasonForChanges: '' },
        setEffectiveDate,
        setDateParts
      }));
      expect(setEffectiveDate).toHaveBeenCalledWith(null);
      expect(setDateParts).not.toHaveBeenCalled();
    });

    it('uses original date for dirty check (not stale effectiveDate)', () => {
      const setIsDirty = jest.fn();
      isFormDirty.mockReturnValue(false);
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Migrated', effectiveDate: '2026-03-10', reasonForChanges: '' },
        effectiveDate: new Date('2026-04-01'), // stale React state
        setIsDirty
      }));
      // effectiveDateForDirtyCheck should be parseDateString(selectedRow.effectiveDate), not stale
      const [, , dateArg] = isFormDirty.mock.calls[0];
      expect(dateArg.getFullYear()).toBe(2026);
      expect(dateArg.getMonth()).toBe(2); // March = 2
    });
  });

  describe('Reversing + No', () => {
    it('restores original effectiveDate from selectedRow', () => {
      const setEffectiveDate = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'some reason' },
        setEffectiveDate
      }));
      expect(setEffectiveDate).toHaveBeenCalledTimes(1);
      const dateArg: Date = setEffectiveDate.mock.calls[0][0];
      expect(dateArg).toBeInstanceOf(Date);
    });

    it('restores original dateParts from selectedRow', () => {
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'some reason' },
        setDateParts
      }));
      expect(setDateParts).toHaveBeenCalledTimes(1);
    });

    it('uses original date for dirty check (not tomorrow set by Yes)', () => {
      const setIsDirty = jest.fn();
      isFormDirty.mockReturnValue(false);
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'reason' },
        effectiveDate: new Date(), // stale — set to today after clicking Yes
        setIsDirty
      }));
      expect(setIsDirty).toHaveBeenCalledWith(false);
    });

    it('returns false dirty (No → Yes → No scenario)', () => {
      const setIsDirty = jest.fn();
      isFormDirty.mockReturnValue(false);
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'reason' },
        setIsDirty
      }));
      expect(setIsDirty).toHaveBeenCalledWith(false);
    });

    it('handles null origDate (invalid effectiveDate)', () => {
      const setEffectiveDate = jest.fn();
      const setDateParts = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'no',
        selectedRow: { status: 'Reversing', effectiveDate: '-', reasonForChanges: '' },
        setEffectiveDate,
        setDateParts
      }));
      expect(setEffectiveDate).toHaveBeenCalledWith(null);
      expect(setDateParts).not.toHaveBeenCalled();
    });
  });

  describe('Reversing + Yes', () => {
    it('does not change effectiveDate (no block fires)', () => {
      const setEffectiveDate = jest.fn();
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'reason' },
        setEffectiveDate
      }));
      expect(setEffectiveDate).not.toHaveBeenCalled();
    });

    it('marks form as dirty', () => {
      const setIsDirty = jest.fn();
      isFormDirty.mockReturnValue(true);
      handleRedirectToNextGenChange(makeParams({
        value: 'yes',
        selectedRow: { status: 'Reversing', effectiveDate: '2026-03-21', reasonForChanges: 'reason' },
        setIsDirty
      }));
      expect(setIsDirty).toHaveBeenCalledWith(true);
    });
  });

  describe('general behaviour', () => {
    it('always calls setRedirectToNextGen with the new value', () => {
      const setRedirectToNextGen = jest.fn();
      handleRedirectToNextGenChange(makeParams({ value: 'yes', setRedirectToNextGen }));
      expect(setRedirectToNextGen).toHaveBeenCalledWith('yes');
    });

    it('always calls setIsDirty', () => {
      const setIsDirty = jest.fn();
      handleRedirectToNextGenChange(makeParams({ setIsDirty }));
      expect(setIsDirty).toHaveBeenCalledTimes(1);
    });
  });
});
