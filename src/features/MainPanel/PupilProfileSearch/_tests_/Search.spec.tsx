import { RenderResult, fireEvent, render, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../Search.logic";
import searchInputValidation, { SearchInputProps } from "../utils/SearchInputValidation";
import * as fetchSearchSuggestions from "../utils/FetchSearchSuggestions";
import { ISearchSuggestionsResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";



describe("Search Input field tests", () => {

  describe("Search input component rendering tests", () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    test("should render the Search Component", () => {
      const { getByTestId }: RenderResult = render(<Search isOpen={false} />);

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
  
  it('should return false if key is Enter or click but search is not valid for path other than search', async () => {    
     const searchInputValidationMock = jest.requireMock('../utils/SearchInputValidation').default;
     searchInputValidationMock.mockReturnValue({ invalid: true });
    const mockKeyPress1=jest.spyOn(fetchSearchSuggestions,"default");
   
    
   const {container,getByTestId}=render(   
  <Search isOpen={true}/>
  )
expect(getByTestId("new-search-element")).toBeInTheDocument();
getByTestId("new-search-element").focus();
fireEvent.change(container.getElementsByTagName('input')[0],{ target: { value: 'ben@' } });
userEvent.type(getByTestId("new-search-element"),'ben@')
await waitFor(() => {
    expect(mockKeyPress1).not.toHaveBeenCalled();
});
  });
  it.skip('should return false if key is Enter or click but search api gives error', async () => {    
     const searchInputValidationMock = jest.requireMock('../utils/SearchInputValidation').default;
     searchInputValidationMock.mockReturnValue({ invalid: false });
    const mockKeyPress1=jest.spyOn(fetchSearchSuggestions,"default").mockImplementationOnce(() => Promise.reject(new Error("error message")));
   
    
   const {container,getByTestId}=render(   
  <Search isOpen={true}/>
  )
expect(getByTestId("new-search-element")).toBeInTheDocument();
getByTestId("new-search-element").focus();
fireEvent.change(container.getElementsByTagName('input')[0],{ target: { value: 'ben' } });
userEvent.type(getByTestId("new-search-element"),'ben')
await waitFor(() => {
    expect(mockKeyPress1).rejects.toThrow(new Error("error message"));
});
  });

  it('should return false if key is Enter or click but search is valid for path other than search', async () => {
    const suggestionresponse:ISearchSuggestionsResultsApiResponse[]=[{
      organizationExternalId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe",
      schoolNumber: "1",
      learnerExternalId: "77a766a4-54ca-487d-86a0-4ea89f8a0af5",
      admissionNumber: "001659",
      preferredForename: "Ben",
      preferredSurname: "Pineton",
      preferredName: "Ben Pineton",
      legalForename: "Benjamin",
      legalSurname: "Pinetondsds",
      legalName: "Benjamin Pinetondsds",
      yearGroup: "5",
      classGroup: "(PINE)",
      imagePath: "https://stimagecoredevuksouth.blob.core.windows.net/cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe/77a766a4-54ca-487d-86a0-4ea89f8a0af5?sv=2023-08-03&se=2024-02-07T06%3A11%3A33Z&sr=b&sp=r&sig=buaYi1xDKYpt6S6WenVpsotePBKj3sSZ7tBXXXsZOEs%3D",
      dateOfBirth: "2015-07-30T00:00:00"      
  }];
  const mockKeyPress1=jest.spyOn(fetchSearchSuggestions,"default").mockReturnValueOnce(Promise.resolve(suggestionresponse));    
   const {container,getByTestId}=render(   
  <Search isOpen={false}/>
  )
expect(getByTestId("new-search-element")).toBeInTheDocument();
getByTestId("new-search-element").focus();
fireEvent.change(container.getElementsByTagName('input')[0],{ target: { value: 'ben' } });
userEvent.type(getByTestId("new-search-element"),'ben')
await waitFor(() => {
    expect(mockKeyPress1).toHaveBeenCalled();
});
  });  
});


