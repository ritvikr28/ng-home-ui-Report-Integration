import { parseDateParts } from "../Sims7RedirectionsDateParse.logic";

describe('parseDateParts', () => {
  it('should parse from object with day, month, year', () => {
    expect(parseDateParts({ day: 1, month: 2, year: 2023 }))
      .toEqual({ day: '01', month: '02', year: '2023' });
  });

  it('should parse from three arguments', () => {
    expect(parseDateParts(5, 6, 2024))
      .toEqual({ day: '05', month: '06', year: '2024' });
  });

  it('should handle missing values', () => {
    expect(parseDateParts(undefined, undefined, undefined))
      .toEqual({ day: '', month: '', year: '' });
  });

  it('should handle zero values', () => {
    expect(parseDateParts(0, 0, 0))
      .toEqual({ day: '', month: '', year: '' });
  });

  it('should handle string values', () => {
    expect(parseDateParts('7', '8', '2025'))
      .toEqual({ day: '07', month: '08', year: '2025' });
  });

  it('should handle null object', () => {
    expect(parseDateParts(null)).toEqual({ day: '', month: '', year: '' });
  });
});
