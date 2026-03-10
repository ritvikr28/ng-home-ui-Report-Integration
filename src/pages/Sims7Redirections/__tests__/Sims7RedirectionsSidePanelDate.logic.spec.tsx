import { handleValidateDate } from '../Sims7RedirectionsSidePanelDate.logic';

describe('handleValidateDate', () => {
  let setDateError: jest.Mock;

  beforeEach(() => {
    setDateError = jest.fn();
  });

  const t = (key: string) => key;

  it('sets error if date is null/undefined', () => {
    handleValidateDate(undefined as any, setDateError ,t);
    expect(setDateError).toHaveBeenCalledWith('Invalid Date');
  });

  it('sets error if date is before today', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    handleValidateDate(yesterday, setDateError ,t);
    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.dateError');
  });

  it('sets error if date is today', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    handleValidateDate(today, setDateError,t);
    expect(setDateError).toHaveBeenCalledWith('SIMS7Redirects.dateError');
  });

  it('clears error if date is in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    handleValidateDate(tomorrow, setDateError,t);
    expect(setDateError).toHaveBeenCalledWith('');
  });
});
