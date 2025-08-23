import { CapitalizeFirstLetter, isValidDate, truncatedString } from '../commonFunctions';

describe('CapitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(CapitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('should return the same string if it is empty', () => {
    expect(CapitalizeFirstLetter('')).toBe('');
  });

  it('should return the same string if the first character is not a letter', () => {
    expect(CapitalizeFirstLetter('1hello')).toBe('1hello');
  });

  it('should handle single character strings', () => {
    expect(CapitalizeFirstLetter('a')).toBe('A');
  });

  it('should handle already capitalized strings', () => {
    expect(CapitalizeFirstLetter('Hello')).toBe('Hello');
  });
});

describe('truncatedString', () => {
  it('should return truncated string with ellipsis if length exceeds maxLimit', () => {
    const result = truncatedString('Hello World', 5);
    expect(result.truncated).toBe('Hello... ');
    expect(result.full).toBe('Hello World');
  });

  it('should return empty truncated string if length does not exceed maxLimit', () => {
    const result = truncatedString('Hi', 5);
    expect(result.truncated).toBe(' ');
    expect(result.full).toBe('Hi');
  });

  it('should handle empty string input', () => {
    const result = truncatedString('', 5);
    expect(result.truncated).toBe(' ');
    expect(result.full).toBe('');
  });

  it('should handle maxLimit of 0', () => {
    const result = truncatedString('Hello', 0);
    expect(result.truncated).toBe('... ');
    expect(result.full).toBe('Hello');
  });
});



describe("isValidDate", () => {
  it("returns true for a valid date in YYYY-MM-DD format", () => {
    expect(isValidDate("2023-05-15")).toBe(true);
  });

  it("returns false for an invalid date format", () => {
    expect(isValidDate("15-05-2023")).toBe(false);
    expect(isValidDate("2023/05/15")).toBe(false);
    expect(isValidDate("20230515")).toBe(false);
  });

  it("returns false for out-of-range year", () => {
    expect(isValidDate("1800-05-15")).toBe(false);
    expect(isValidDate("2200-05-15")).toBe(false);
  });

  it("returns false for out-of-range month", () => {
    expect(isValidDate("2023-00-15")).toBe(false);
    expect(isValidDate("2023-13-15")).toBe(false);
  });

  it("returns false for out-of-range day", () => {
    expect(isValidDate("2023-05-00")).toBe(false);
    expect(isValidDate("2023-05-32")).toBe(false);
  });
});