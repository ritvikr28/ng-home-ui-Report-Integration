import {
  getTomorrow,
  handleDateChange,
  handleValidateDate,
  getDateParts
} from './Sims7RedirectionsSidePanelDate.logic';

const t = (key: string) => key;

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
      t,
      arg1: '',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });

    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.dateRequired');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);

  });

  it('sets error for invalid date parts', () => {

    handleDateChange({
      t,
      arg1: 'invalid',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });

    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.invaliddate');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);

  });

  it('sets error for invalid date object', () => {

    handleDateChange({
      t,
      arg1: 32,
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

    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.invaliddate');
    expect(setEffectiveDate).toHaveBeenCalledWith(null);

  });

  it('sets valid date and clears error', () => {

    handleDateChange({
      t,
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

    handleValidateDate(undefined as unknown as Date, setDateError, t);

    expect(setDateError).toHaveBeenCalledWith('Invalid Date');

  });

  it('sets error for today or past date', () => {

    const setDateError = jest.fn();

    const today = new Date();
    today.setHours(0,0,0,0);

    handleValidateDate(today, setDateError, t);

    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.dateError');

  });

  it('clears error for future date', () => {

    const setDateError = jest.fn();

    const future = new Date();
    future.setDate(future.getDate() + 1);

    handleValidateDate(future, setDateError, t);

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

    expect(parts).toEqual({
      day: undefined,
      month: undefined,
      year: undefined
    });

  });

  describe('additional coverage tests', () => {

  // const t = (key:string)=>key;

  let setDateParts: jest.Mock;
  let setEffectiveDate: jest.Mock;
  let setDateError: jest.Mock;
  let setIsDirty: jest.Mock;

  const selectedRow = {};
  const redirectToNextGen = 'yes';
  const reasonForChanges = '';

  beforeEach(()=>{
    setDateParts = jest.fn();
    setEffectiveDate = jest.fn();
    setDateError = jest.fn();
    setIsDirty = jest.fn();
  });

  it('pads single digit day and month correctly', () => {

    handleDateChange({
      t,
      arg1:1,
      arg2:2,
      arg3:2030,
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });

    expect(setDateParts).toHaveBeenCalledWith({
      day:'01',
      month:'02',
      year:'2030'
    });

  });

  it('handles Date object input correctly', () => {

    const date = new Date(2030,4,10);

    handleDateChange({
      t,
      arg1:date,
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });

    expect(setDateParts).toHaveBeenCalled();

  });

  it('getDateParts handles partial values', () => {

    const result = getDateParts({
      day:'10',
      month:'',
      year:'2025'
    });

    expect(result).toEqual({
      day:10,
      month:undefined,
      year:2025
    });

  });

});

});