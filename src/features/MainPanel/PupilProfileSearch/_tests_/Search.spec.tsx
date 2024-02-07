import { RenderResult, render} from "@testing-library/react";
import Search from "../Search.logic";
import searchInputValidation, { SearchInputProps } from "../utils/SearchInputValidation";



describe("Search Input field tests", () => {

  describe("Search input component rendering tests", () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    test("should render the Search Component", () => {
      const { getByTestId }: RenderResult = render(<Search isOpen />);

      const searchElement: HTMLElement = getByTestId("new-search-element");
      const searchInputElement: HTMLElement = getByTestId("search-autocomplete-input");

      expect(searchElement).toBeInTheDocument();
      expect(searchInputElement).toBeInTheDocument();
    });
    test('Empty input should be invalid with no errors', () => {
        const result: SearchInputProps = searchInputValidation('');
        expect(result.invalid).toBe(true);
        expect(result.error).toBe(false);
      });
  });


test('Empty input should be invalid with no errors', () => {
    const result: SearchInputProps = searchInputValidation('');
    expect(result.invalid).toBe(true);
    expect(result.error).toBe(false);
  });
  
  test('Valid input should be valid with no errors', () => {
    const result: SearchInputProps = searchInputValidation('Valid Input');
    expect(result.invalid).toBe(false);
    expect(result.error).toBe(false);
  });
  
  test('Input with special characters should be invalid with no errors', () => {
    const result: SearchInputProps = searchInputValidation('Invalid@Input');
    expect(result.invalid).toBe(true);
    expect(result.error).toBe(false);
  });
  
  test('Input with words less than 2 characters should be invalid with errors', () => {
    const result: SearchInputProps = searchInputValidation('A b C');
    expect(result.invalid).toBe(false);
    expect(result.error).toBe(true);
  });
  test('Input with words less than 2 characters should be invalid with errors', () => {
    const result: SearchInputProps = searchInputValidation('12b C');
    expect(result.invalid).toBe(false);
    expect(result.error).toBe(true);
  });
});


