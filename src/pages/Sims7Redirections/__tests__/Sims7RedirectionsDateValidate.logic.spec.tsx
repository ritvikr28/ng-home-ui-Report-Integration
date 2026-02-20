import { validateDateParts } from '../Sims7RedirectionsDateValidate.logic';

describe('validateDateParts', () => {
  it('should return "Date is required" if all parts are empty', () => {
    expect(validateDateParts('', '', '')).toBe('Date is required');
  });

  it('should return "Invalid Date" if any part is missing', () => {
    expect(validateDateParts('01', '', '2023')).toBe('Invalid Date');
    expect(validateDateParts('', '01', '2023')).toBe('Invalid Date');
    expect(validateDateParts('01', '01', '')).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for zero or invalid day/month', () => {
    expect(validateDateParts('00', '01', '2023')).toBe('Invalid Date');
    expect(validateDateParts('01', '00', '2023')).toBe('Invalid Date');
    expect(validateDateParts('0', '01', '2023')).toBe('Invalid Date');
    expect(validateDateParts('01', '0', '2023')).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for year less than 4 digits', () => {
    expect(validateDateParts('01', '01', '23')).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for non-numeric values', () => {
    expect(validateDateParts('aa', '01', '2023')).toBe('Invalid Date');
    expect(validateDateParts('01', 'bb', '2023')).toBe('Invalid Date');
    expect(validateDateParts('01', '01', 'cccc')).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for impossible calendar dates', () => {
    expect(validateDateParts('31', '02', '2023')).toBe('Invalid Date'); // Feb 31st
    expect(validateDateParts('30', '02', '2023')).toBe('Invalid Date'); // Feb 30th
    expect(validateDateParts('29', '02', '2021')).toBe('Invalid Date'); // Not a leap year
  });

  it('should return null for valid date', () => {
    expect(validateDateParts('28', '02', '2024')).toBeNull();
    expect(validateDateParts('29', '02', '2024')).toBeNull(); // Leap year
    expect(validateDateParts('31', '01', '2023')).toBeNull();
  });
});
