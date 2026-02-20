import { handleDateChange } from '../Sims7RedirectionsDateState.logic';

describe('handleDateChange', () => {
  let setDateParts: jest.Mock;
  let setEffectiveDate: jest.Mock;
  let setDateError: jest.Mock;
  let setIsDirty: jest.Mock;
  let selectedRow: any;
  let redirectToNextGen: string;
  let reasonForChanges: string;

  beforeEach(() => {
    setDateParts = jest.fn();
    setEffectiveDate = jest.fn();
    setDateError = jest.fn();
    setIsDirty = jest.fn();
    selectedRow = { id: 1 };
    redirectToNextGen = 'no';
    reasonForChanges = 'test reason';
  });

  it('should set date parts and call setEffectiveDate with date if valid', () => {
    handleDateChange({
      arg1: 5,
      arg2: 6,
      arg3: 2024,
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateParts).toHaveBeenCalledWith({ day: '05', month: '06', year: '2024' });
    expect(setEffectiveDate).toHaveBeenCalledWith(new Date(2024, 5, 5));
    expect(setDateError).toHaveBeenCalledWith('');
    expect(setIsDirty).toHaveBeenCalled();
  });

  it('should handle invalid date and set error', () => {
    handleDateChange({
      arg1: '',
      arg2: '',
      arg3: '',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
    expect(setDateError).not.toBe('');
    expect(setIsDirty).toHaveBeenCalled();
  });

  it('should handle missing args', () => {
    handleDateChange({
      arg1: '',
      arg2: '',
      arg3: '',
      setDateParts,
      setEffectiveDate,
      setDateError,
      setIsDirty,
      selectedRow,
      redirectToNextGen,
      reasonForChanges
    });
    expect(setDateParts).toHaveBeenCalledWith({ day: '', month: '', year: '' });
    expect(setEffectiveDate).toHaveBeenCalledWith(null);
    expect(setDateError).not.toBe('');
    expect(setIsDirty).toHaveBeenCalled();
  });
});
