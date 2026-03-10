import {
  getTomorrow,
  handleDateChange,
  handleValidateDate,
  getDateParts
} from './Sims7RedirectionsSidePanelDate.logic';

describe('getTomorrow', () => {
  it('returns tomorrow date at midnight', () => {
    const tomorrow = getTomorrow();
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0, 0, 0, 0);
    expect(tomorrow.getTime()).toBe(now.getTime());
  });
});

describe('handleDateChange', () => {
  let setDateParts: jest.Mock;
  let setEffectiveDate: jest.Mock;
  let setDateError: jest.Mock;
  let setIsDirty: jest.Mock;
  const selectedRow = {};
  const redirectToNextGen = 'yes';
  const reasonForChanges = '';

  beforeEach(() => {
    setDateParts = jest.fn();
    setEffectiveDate = jest.fn();
    setDateError = jest.fn();
    setIsDirty = jest.fn();
  });

  it('sets error for empty date parts', () => {
    handleDateChange({
      arg1: '',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateError).toHaveBeenCalledWith('Date is required');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
  });

  it('sets error for invalid date parts', () => {
    handleDateChange({
      arg1: 'invalid',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
  });

  it('sets error for invalid date object', () => {
    handleDateChange({
      arg1: 32, // invalid day
      arg2: 2,
      arg3: 2026,
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
  });

  it('sets valid date and clears error', () => {
    handleDateChange({
      arg1: 1,
      arg2: 2,
      arg3: 2026,
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateError).toHaveBeenCalledWith('');
    expect(setEffectiveDate).toHaveBeenCalledWith(expect.any(Date));
  });
});

describe('handleValidateDate', () => {
  it('sets error for falsy date', () => {
    const setDateError = jest.fn();
    handleValidateDate(undefined as unknown as Date, setDateError);
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
  });

  it('sets error for today or past date', () => {
    const setDateError = jest.fn();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    handleValidateDate(today, setDateError);
    expect(setDateError).toHaveBeenCalledWith('Date should be in the future');
  });

  it('clears error for future date', () => {
    const setDateError = jest.fn();
    const future = new Date();
    future.setDate(future.getDate() + 1);
    handleValidateDate(future, setDateError);
    expect(setDateError).toHaveBeenCalledWith('');
  });
});

describe('getDateParts', () => {
  it('returns numeric date parts', () => {
    const parts = getDateParts({ day: '01', month: '02', year: '2026' });
    expect(parts).toEqual({ day: 1, month: 2, year: 2026 });
  });
  it('returns undefined for missing parts', () => {
    const parts = getDateParts({ day: '', month: '', year: '' });
    expect(parts).toEqual({ day: undefined, month: undefined, year: undefined });
  });
});
