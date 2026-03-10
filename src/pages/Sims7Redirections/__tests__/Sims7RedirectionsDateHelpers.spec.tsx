import { extractDateParts } from "../Sims7RedirectionsDateHelpers.logic";
import { parseDateParts } from "../Sims7RedirectionsDateParse.logic";

describe('parseDateParts - object arg1', () => {
  it('should extract day, month, year from object arg1', () => {
    const result = parseDateParts({ day: 2, month: 3, year: 2024 });
    expect(result).toEqual({ day: '02', month: '03', year: '2024' });
  });

  it('should handle string values in object arg1', () => {
    const result = parseDateParts({ day: '7', month: '8', year: '2025' });
    expect(result).toEqual({ day: '07', month: '08', year: '2025' });
  });

  it('should handle missing properties in object arg1', () => {
    const result = parseDateParts({ day: 5, month: 6 }); // missing year
    expect(result).toEqual({ day: '[object Object]', month: '', year: '' });
  });

  it('should handle null arg1', () => {
    const result = parseDateParts(null);
    expect(result).toEqual({ day: '', month: '', year: '' });
  });

  it('should handle arg1 as object without day/month/year', () => {
    const result = parseDateParts({ foo: 1, bar: 2 });
    expect(result).toEqual({ day: '[object Object]', month: '', year: '' });
  });
  
it('should extract day, month, year when arg1 is an object with all properties', () => {
  const result = extractDateParts({ day: 10, month: 5, year: 2023 },undefined, undefined);
  expect(result).toEqual({ day: 10, month: 5, year: 2023 });
});
});
