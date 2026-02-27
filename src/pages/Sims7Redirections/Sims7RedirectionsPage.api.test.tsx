import { fetchSims7Redirections } from './Sims7RedirectionsPage.api';
import { service } from '../../shared/utils/api-service';
import { mapSims7RedirectionsItem } from './Sims7RedirectionsMapper';
import {
  handleReversingYes,
  handleReversingNo,
  handleFutureDate,
  handleMigratedNo,
  handlePlannedNo
} from './Sims7RedirectionsNextStatusHelpers.logic';
import {
  handleReversingStatus,
  handleFutureDateStatus,
  handleMigratedStatus,
  handlePlannedStatus
} from './Sims7RedirectionsSaveStatus.logic';
import {
  getTomorrow,
  handleDateChange,
  handleValidateDate,
  getDateParts
} from './Sims7RedirectionsSidePanelDate.logic';
import { validateDate, validateReason } from './Sims7RedirectionsSaveValidate.logic';

jest.mock('../../shared/utils/api-service', () => ({
  service: {
    get: jest.fn()
  }
}));
jest.mock('./Sims7RedirectionsDateHelpers', () => ({
  formatDate: (date: any) => date ? '2024-01-01' : ''
}));
jest.mock('./Sims7RedirectionsFormDirty.logic', () => ({
  isFormDirty: jest.fn(() => true)
}));
jest.mock('./Sims7RedirectionsDateHelpers.logic', () => ({
  extractDateParts: jest.fn(() => ({ day: 1, month: 1, year: 2024 })),
  formatDateParts: jest.fn(() => ({ formattedDay: '01', formattedMonth: '01', formattedYear: '2024' })),
  isDatePartsEmpty: jest.fn(() => false),
  isDatePartsInvalid: jest.fn(() => false),
  isDateObjectInvalid: jest.fn(() => false)
}));

const helpers = require('./Sims7RedirectionsDateHelpers.logic');

describe('fetchSims7Redirections', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should build query string and call service.get with correct URL', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: [{ moduleId: 1 }] } } });
    const query = {
      SearchText: 'test',
      SearchFilter: ['Migrated'],
      SortColumnName: 'redirectStatus',
      SortOrder: 'ASC' as 'ASC',
      PageNumber: 2,
      PageSize: 10
    };
    await fetchSims7Redirections(query);
  });

  it('should return items array if response is valid', async () => {
  (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: [{ moduleId: 1 }] } } });
  const result = await fetchSims7Redirections();
  expect(result).toEqual({ items: [{ moduleId: 1 }], totalItems: 0 });
  });

  it('should return empty array if response is missing items', async () => {
  (service.get as jest.Mock).mockResolvedValue({ data: { payload: {} } });
  const result = await fetchSims7Redirections();
  expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('should return empty array if response is missing payload', async () => {
  (service.get as jest.Mock).mockResolvedValue({ data: {} });
  const result = await fetchSims7Redirections();
  expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('should return empty array if response is undefined', async () => {
  (service.get as jest.Mock).mockResolvedValue(undefined);
  const result = await fetchSims7Redirections();
  expect(result).toEqual({ items: [], totalItems: 0 });
  });
});

describe('Sims7RedirectionsMapper', () => {
  it('should map item fields correctly', () => {
    const apiItem = {
      moduleId: 123,
      ngModule: 'Admissions',
      ngComponent: 'Admissions',
      sims7Module: 'Admissions',
      updatedBy: 'Admin',
      effectiveDate: '2024-01-01T00:00:00',
      redirectStatus: 'Migrated',
      tooltipMessage: 'Tooltip',
      reasonForChanges: 'Reason',
    };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.id).toBe('123');
    expect(result.category).toBe('Admissions');
    expect(result.nextGenModule).toBe('Admissions');
    expect(result.sims7Module).toBe('Admissions');
    expect(result.modifiedBy).toBe('Admin');
    expect(result.effectiveDate).toContain('2024');
    expect(result.status).toBe('Migrated');
    expect(result.tooltipMessage).toBe('Tooltip');
    expect(result.reasonForChanges).toBe('Reason');
    expect(result.actions.options.length).toBe(2);
  });

  it('should handle missing fields gracefully', () => {
    const apiItem = {};
    const result = mapSims7RedirectionsItem(apiItem, 1);
    expect(result.id).toBe('2');
    expect(result.category).toBe('');
    expect(result.nextGenModule).toBe('');
    expect(result.sims7Module).toBe('');
    expect(result.modifiedBy).toBe('');
    expect(result.effectiveDate).toBe('');
    expect(result.status).toBe('');
    expect(result.tooltipMessage).toBe('');
    expect(result.reasonForChanges).toBe('');
  });

  it('should format ISO date correctly', () => {
    const apiItem = { effectiveDate: '2024-01-01T00:00:00' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toContain('2024');
  });

  it('should format DDMMYYYY date correctly', () => {
    const apiItem = { effectiveDate: '01 01 2024' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toBe('01 Jan 2024');
  });

  it('should handle status string formatting', () => {
    const apiItem = { redirectStatus: 'not_migrated' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.status).toBe('Not migrated');
  });
});

describe('Sims7RedirectionsNextStatusHelpers.logic', () => {
  it('handleReversingYes sets Migrated and yes', () => {
    const updated: any = {};
    handleReversingYes(updated);
    expect(updated.status).toBe('Migrated');
    expect(updated.redirectToNextGen).toBe('yes');
    expect(updated.reasonForChanges).toBe('');
  });

  it('handleReversingNo sets effectiveDate and reason', () => {
    const updated: any = {};
    handleReversingNo(updated, new Date('2024-01-01'), 'Reason');
    expect(updated.effectiveDate).toBe('2024-01-01');
    expect(updated.reasonForChanges).toBe('Reason');
  });

  it('handleFutureDate sets Planned and clears reason for Not migrated', () => {
    const updated: any = { status: 'Not migrated', reasonForChanges: 'Some reason' };
    handleFutureDate(updated, new Date(Date.now() + 86400000)); // tomorrow
    expect(updated.status).toBe('Planned');
    expect(updated.reasonForChanges).toBe('');
    expect(updated.effectiveDate).toBe('2024-01-01');
  });

  it('handleFutureDate sets effectiveDate for Planned', () => {
    const updated: any = { status: 'Planned', reasonForChanges: 'Some reason' };
    handleFutureDate(updated, new Date(Date.now() + 86400000)); // tomorrow
    expect(updated.status).toBe('Planned');
    expect(updated.effectiveDate).toBe('2024-01-01');
  });

  it('handleFutureDate does nothing for past date', () => {
    const updated: any = { status: 'Not migrated', reasonForChanges: 'Some reason' };
    handleFutureDate(updated, new Date(Date.now() - 86400000)); // yesterday
    expect(updated.status).toBe('Not migrated');
    expect(updated.effectiveDate).toBeUndefined();
  });

  it('handleMigratedNo sets Reversing, no, effectiveDate, and reason', () => {
    const updated: any = {};
    handleMigratedNo(updated, new Date('2024-01-01'), 'Reason');
    expect(updated.status).toBe('Reversing');
    expect(updated.redirectToNextGen).toBe('no');
    expect(updated.effectiveDate).toBe('2024-01-01');
    expect(updated.reasonForChanges).toBe('Reason');
  });

  it('handlePlannedNo sets Not migrated and resets fields', () => {
    const updated: any = {};
    handlePlannedNo(updated);
    expect(updated.status).toBe('Not migrated');
    expect(updated.effectiveDate).toBe('-');
    expect(updated.modifiedBy).toBe('-');
  });
});

describe('Sims7RedirectionsSaveStatus.logic', () => {
  it('handleReversingStatus sets Migrated and yes', () => {
    const row: any = {};
    handleReversingStatus(row, 'yes', new Date('2024-01-01'), 'Reason');
    expect(row.status).toBe('Migrated');
    expect(row.redirectToNextGen).toBe('yes');
    expect(row.reasonForChanges).toBe('');
  });

  it('handleReversingStatus sets effectiveDate and reason for no', () => {
    const row: any = {};
    handleReversingStatus(row, 'no', new Date('2024-01-01'), 'Reason');
    expect(row.effectiveDate).toBe('2024-01-01');
    expect(row.reasonForChanges).toBe('Reason');
  });

  it('handleFutureDateStatus sets Planned and clears reason for Not migrated', () => {
    const row: any = { status: 'Not migrated', reasonForChanges: 'Some reason' };
    handleFutureDateStatus(row, new Date(Date.now() + 86400000)); // tomorrow
    expect(row.status).toBe('Planned');
    expect(row.reasonForChanges).toBe('');
    expect(row.effectiveDate).toBe('2024-01-01');
  });

  it('handleFutureDateStatus sets effectiveDate for Planned', () => {
    const row: any = { status: 'Planned', reasonForChanges: 'Some reason' };
    handleFutureDateStatus(row, new Date(Date.now() + 86400000)); // tomorrow
    expect(row.status).toBe('Planned');
    expect(row.effectiveDate).toBe('2024-01-01');
  });

  it('handleFutureDateStatus does nothing for past date', () => {
    const row: any = { status: 'Not migrated', reasonForChanges: 'Some reason' };
    handleFutureDateStatus(row, new Date(Date.now() - 86400000)); // yesterday
    expect(row.status).toBe('Not migrated');
    expect(row.effectiveDate).toBeUndefined();
  });

  it('handleMigratedStatus sets Reversing, no, effectiveDate, and reason', () => {
    const row: any = {};
    handleMigratedStatus(row, 'no', new Date('2024-01-01'), 'Reason');
    expect(row.status).toBe('Reversing');
    expect(row.redirectToNextGen).toBe('no');
    expect(row.effectiveDate).toBe('2024-01-01');
    expect(row.reasonForChanges).toBe('Reason');
  });

  it('handlePlannedStatus sets Not migrated and resets fields', () => {
    const row: any = {};
    handlePlannedStatus(row, 'no');
    expect(row.status).toBe('Not migrated');
    expect(row.effectiveDate).toBe('-');
    expect(row.modifiedBy).toBe('-');
  });
});

describe('Sims7RedirectionsSidePanelDate.logic', () => {
  it('getTomorrow returns tomorrow date', () => {
    const tomorrow = getTomorrow();
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0, 0, 0, 0);
    expect(tomorrow.getTime()).toBe(now.getTime());
  });

  it('handleDateChange sets date, clears error, and sets dirty', () => {
    const setDateParts = jest.fn();
    const setEffectiveDate = jest.fn();
    const setDateError = jest.fn();
    const setIsDirty = jest.fn();
    handleDateChange({
      arg1: '01',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow: {},
      redirectToNextGen: '',
      reasonForChanges: ''
    });
    expect(setDateParts).toHaveBeenCalled();
    expect(setEffectiveDate).toHaveBeenCalledWith(expect.any(Date));
    expect(setDateError).toHaveBeenCalledWith("");
    expect(setIsDirty).toHaveBeenCalledWith(true);
  });

  it('handleDateChange sets error if date parts empty', () => {
    const setDateParts = jest.fn();
    const setEffectiveDate = jest.fn();
    const setDateError = jest.fn();
    const setIsDirty = jest.fn();
    helpers.isDatePartsEmpty.mockReturnValue(true);
    handleDateChange({
      arg1: '01',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow: {},
      redirectToNextGen: '',
      reasonForChanges: ''
    });
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
    expect(setDateError).toHaveBeenCalledWith('Date is required');
    expect(setIsDirty).toHaveBeenCalledWith(true);
    helpers.isDatePartsEmpty.mockReturnValue(false);
  });

  it('handleDateChange sets error if date parts invalid', () => {
    const setDateParts = jest.fn();
    const setEffectiveDate = jest.fn();
    const setDateError = jest.fn();
    const setIsDirty = jest.fn();
    helpers.isDatePartsInvalid.mockReturnValue(true);
    handleDateChange({
      arg1: '01',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow: {},
      redirectToNextGen: '',
      reasonForChanges: ''
    });
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
    expect(setIsDirty).toHaveBeenCalledWith(true);
    helpers.isDatePartsInvalid.mockReturnValue(false);
  });

  it('handleDateChange sets error if date object invalid', () => {
    const setDateParts = jest.fn();
    const setEffectiveDate = jest.fn();
    const setDateError = jest.fn();
    const setIsDirty = jest.fn();
    helpers.isDateObjectInvalid.mockReturnValue(true);
    handleDateChange({
      arg1: '01',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow: {},
      redirectToNextGen: '',
      reasonForChanges: ''
    });
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
    expect(setIsDirty).toHaveBeenCalledWith(true);
    helpers.isDateObjectInvalid.mockReturnValue(false);
  });

  it('handleValidateDate sets error if date is falsy', () => {
    const setDateError = jest.fn();
    handleValidateDate(undefined as any, setDateError);
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
  });

  it('handleValidateDate sets error if date is not in future', () => {
    const setDateError = jest.fn();
    handleValidateDate(new Date(Date.now() - 86400000), setDateError); // yesterday
    expect(setDateError).toHaveBeenCalledWith('Date should be in the future');
  });

  it('handleValidateDate clears error if date is in future', () => {
    const setDateError = jest.fn();
    handleValidateDate(new Date(Date.now() + 86400000), setDateError); // tomorrow
    expect(setDateError).toHaveBeenCalledWith("");
  });

  it('getDateParts returns correct numbers', () => {
    const result = getDateParts({ day: '01', month: '02', year: '2024' });
    expect(result).toEqual({ day: 1, month: 2, year: 2024 });
  });

  it('getDateParts returns undefined for missing parts', () => {
    const result = getDateParts({ day: '', month: '', year: '' });
    expect(result).toEqual({ day: undefined, month: undefined, year: undefined });
  });
});

describe('Sims7RedirectionsSaveValidate.logic', () => {
  describe('validateDate', () => {
    it('returns false and sets error if date is required and all date parts are missing', () => {
      const setDateError = jest.fn();
      const result = validateDate({
        requiresDate: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        dateParts: { day: '', month: '', year: '' },
        effectiveDate: null,
        isFutureDate: () => true,
        setDateError
      });
      expect(result).toBe(false);
      expect(setDateError).toHaveBeenCalledWith('Date is required');
    });

    it('returns false and sets error if date is required and effectiveDate is missing', () => {
      const setDateError = jest.fn();
      const result = validateDate({
        requiresDate: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        dateParts: { day: '01', month: '01', year: '2024' },
        effectiveDate: null,
        isFutureDate: () => true,
        setDateError
      });
      expect(result).toBe(false);
      expect(setDateError).toHaveBeenCalledWith('Invalid Date');
    });

    it('returns false and sets error if date is not in future', () => {
      const setDateError = jest.fn();
      const result = validateDate({
        requiresDate: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        dateParts: { day: '01', month: '01', year: '2024' },
        effectiveDate: new Date('2020-01-01'),
        isFutureDate: () => false,
        setDateError
      });
      expect(result).toBe(false);
      expect(setDateError).toHaveBeenCalledWith('Date should be in the future');
    });

    it('returns true and clears error if date is valid and in future', () => {
      const setDateError = jest.fn();
      const result = validateDate({
        requiresDate: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        dateParts: { day: '01', month: '01', year: '2024' },
        effectiveDate: new Date('2099-01-01'),
        isFutureDate: () => true,
        setDateError
      });
      expect(result).toBe(true);
      expect(setDateError).toHaveBeenCalledWith('');
    });

    it('returns true and clears error if date is not required', () => {
      const setDateError = jest.fn();
      const result = validateDate({
        requiresDate: () => false,
        selectedRow: { status: 'Migrated' },
        redirectToNextGen: 'no',
        dateParts: { day: '', month: '', year: '' },
        effectiveDate: null,
        isFutureDate: () => true,
        setDateError
      });
      expect(result).toBe(true);
      expect(setDateError).toHaveBeenCalledWith('');
    });
  });

  describe('validateReason', () => {
    it('returns false and sets error if reason is required and empty', () => {
      const setReasonError = jest.fn();
      const result = validateReason({
        requiresReason: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        reasonForChanges: '',
        setReasonError
      });
      expect(result).toBe(false);
      expect(setReasonError).toHaveBeenCalledWith('Reason for changes is required');
    });

    it('returns false and sets error if reason is required and whitespace', () => {
      const setReasonError = jest.fn();
      const result = validateReason({
        requiresReason: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        reasonForChanges: '   ',
        setReasonError
      });
      expect(result).toBe(false);
      expect(setReasonError).toHaveBeenCalledWith('Reason for changes is required');
    });

    it('returns true and clears error if reason is required and present', () => {
      const setReasonError = jest.fn();
      const result = validateReason({
        requiresReason: () => true,
        selectedRow: { status: 'Planned' },
        redirectToNextGen: 'yes',
        reasonForChanges: 'Valid reason',
        setReasonError
      });
      expect(result).toBe(true);
      expect(setReasonError).toHaveBeenCalledWith('');
    });

    it('returns true and clears error if reason is not required', () => {
      const setReasonError = jest.fn();
      const result = validateReason({
        requiresReason: () => false,
        selectedRow: { status: 'Migrated' },
        redirectToNextGen: 'no',
        reasonForChanges: '',
        setReasonError
      });
      expect(result).toBe(true);
      expect(setReasonError).toHaveBeenCalledWith('');
    });
  });
});
