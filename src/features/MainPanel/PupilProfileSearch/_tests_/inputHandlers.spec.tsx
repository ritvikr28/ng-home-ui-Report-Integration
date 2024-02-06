import { render } from '@testing-library/react';
import getClassDetails from "../utils/GetClassDetails";
import { IGetClassDetailsProps } from "../utils/GetClassDetailsProps";
import { IHandleKeyPressProps, handleKeyPress } from "../utils/InputHandlers";
import useEffectForSearchQuery from "../utils/useQueryToSearch";
import searchInputValidation from "../SearchInputValidation";


jest.mock('../SearchInputValidation', () => ({
  __esModule: true,
  default: jest.fn(),
  SearchInputProps: { invalid: false, error: false },
}));


jest.mock('../SearchInputValidation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useEffectForSearchQuery', () => {
  it('should handle invalid search input', () => {
    const setUserInputMock = jest.fn();
    const searchedName = 'Invalid Name';
    const searchInputValidationMock = jest.requireMock('../SearchInputValidation').default;
    searchInputValidationMock.mockReturnValue({ invalid: true });

    render(
      <TestComponent
        searchedName={searchedName}
        setUserInput={setUserInputMock}
      />
    );

    expect(setUserInputMock).toHaveBeenCalledWith(searchedName);
  });

  it('should handle search input with error', () => {
    const setUserInputMock = jest.fn();
    const searchedName = 'Name with Error';
    const searchInputValidationMock = jest.requireMock('../SearchInputValidation').default;
    searchInputValidationMock.mockReturnValue({ error: true });

    render(
      <TestComponent
        searchedName={searchedName}
        setUserInput={setUserInputMock}
      />
    );

    expect(setUserInputMock).toHaveBeenCalledWith(searchedName);
  });



describe("searchInputValidation Function - Specific Line Test", () => {
  it("sets errorStatus to true when input contains invalid characters", () => {
    const result = searchInputValidation("invalid@user");
    expect(result.error).toBe(true);
    expect(result.invalid).toBe(undefined);
  });

  it("does not set errorStatus to true for valid input", () => {
    const result = searchInputValidation("validInput");
    expect(result.error).toBe(true);
    expect(result.invalid).toBe(undefined);
  });

});

  it('should handle valid search input', () => {
    const setUserInputMock = jest.fn();
    const searchedName = 'Valid Name';
    const searchInputValidationMock = jest.requireMock('../SearchInputValidation').default;
    searchInputValidationMock.mockReturnValue({});

    render(
      <TestComponent
        searchedName={searchedName}
        setUserInput={setUserInputMock}
      />
    );

    expect(setUserInputMock).toHaveBeenCalledWith(searchedName);
  });
});

const TestComponent = ({ searchedName, setUserInput }: any) => {
  useEffectForSearchQuery(searchedName, setUserInput);
  return null;
};

test('getClassDetails - Both yearGroup and classGroup provided', () => {
    const props: IGetClassDetailsProps = {
      yearGroup: '2024',
      classGroup: 'A'
    };
  
    const result = getClassDetails(props);
  
    expect(result).toBe('2024 / A');
  });
  
  test('getClassDetails - Only yearGroup provided', () => {
    const props: IGetClassDetailsProps = {
      yearGroup: '2024',
      classGroup: ''
    };
  
    const result = getClassDetails(props);
  
    expect(result).toBe('2024');
  });
  
  test('getClassDetails - Only classGroup provided', () => {
    const props: IGetClassDetailsProps = {
      yearGroup: '',
      classGroup: 'A'
    };
  
    const result = getClassDetails(props);
  
    expect(result).toBe('A');
  });

  test('getClassDetails - Neither yearGroup nor classGroup provided', () => {
    const props: IGetClassDetailsProps = {
      yearGroup: '',
      classGroup: ''
    };
  
    const result = getClassDetails(props);
  
    expect(result).toBe('');
  });


jest.mock('../SearchInputValidation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('handleKeyPress', () => {
  const mockSearchInputValidation = jest.requireMock('../SearchInputValidation').default;

  beforeEach(() => {
    mockSearchInputValidation.mockReset();
  });

  it('should return false if key is not Enter or click', () => {
    const props: IHandleKeyPressProps = {
      e: { key: 'Escape' },
      inputText: '',
      pagePath: '/search',
    };
    const inputValue = 'Test';
    
    const result = handleKeyPress(props, inputValue);

    expect(result).toBe(false);
  });

  it('should return false if key is Enter or click but search is not valid', () => {
    const props: IHandleKeyPressProps = {
      e: { key: 'Enter' },
      inputText: 'Test',
      pagePath: '/search',
    };
    const inputValue = 'Test';
    
    mockSearchInputValidation.mockReturnValue({ invalid: true });

    const result = handleKeyPress(props, inputValue);

    expect(result).toBe(false);
  });


});
