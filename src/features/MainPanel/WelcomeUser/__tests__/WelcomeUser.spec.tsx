import { authService } from "@essnextgen/auth-ui";
import { act, render, waitFor } from "@testing-library/react";
import WelcomeUser from "../WelcomeUser.logic";
import * as schoolName from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";
 
const mockApiResponse: ISchoolNameDataResponse = {
  externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
  schoolName: "Waters Edge Primary School",
  isSchoolPrimary:true
};
 
const setIsError = jest.fn();
 
jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(),
}));
 
test("renders welcome message if authorized and envConfig is set to True", () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
  jest
 
    .spyOn(authService, "getUsername")
 
    .mockImplementation(() => "John");

  const { getByText } = render(<WelcomeUser 
    organisationName={mockApiResponse.schoolName}
    isApiError={false}
  />);
  expect(getByText("John")).toBeInTheDocument();
});
 
test("renders welcome message when authorized with a long username", () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
  jest
    .spyOn(authService, "getUsername")
    .mockImplementation(
      () =>
        "Brendapeterssfeeismynameitsalongnamendeetebtjhtwwwbtswrygoptcrrwtfseetuymbmllswwrtyyndhhttdsretemnusretet"
    );
  const { getByText } = render(<WelcomeUser 
                        organisationName={mockApiResponse.schoolName}
                        isApiError={false}
                        />);
  expect(
    getByText(
      "Brendapeterssfeeismynameitsalongnamendeetebtjhtwwwbtswrygoptcrrwtfseetuymbmllswwrtyyndhhttdsretemnusretet"
    )
  ).toBeInTheDocument();
});
 
test("fetches and displays school name", async () => {
  jest
    .spyOn(schoolName, "useFetchSchoolNameData")
    .mockResolvedValue(mockApiResponse);
 
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
  jest
 
    .spyOn(authService, "getUsername")
 
    .mockImplementation(() => "John");

  const { findByText } = render(<WelcomeUser 
                          organisationName={mockApiResponse.schoolName}
                          isApiError={false}
                        />);
  expect(await findByText(/Waters Edge Primary School/i)).toBeInTheDocument();
});
 
test("When api is failed then displays school name blank", async () => {
  const mockSchoolData = { externalId: null, schoolName: null };
 
  (useFetchSchoolNameData as jest.Mock).mockReturnValue(mockSchoolData);
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
  jest
    .spyOn(authService, "getUsername")
 
    .mockImplementation(() => "John");
  const schooldetails = await useFetchSchoolNameData();
 
  expect(schooldetails?.schoolName).toBe(null);
});
 
test("handles errors during data fetching", async () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
  jest.spyOn(authService, "getUsername").mockImplementation(() => "John");
  jest.spyOn(console, "error").mockImplementation(() => {});
  (useFetchSchoolNameData as jest.Mock).mockRejectedValueOnce(
    new Error("Mocked error")
  );
 
  setIsError(true);
 
  await act(async () => {
    setIsError(true);
    render(<WelcomeUser 
      organisationName={mockApiResponse.schoolName}
      isApiError={false}
    />);
  });
  expect(setIsError).toHaveBeenCalledWith(true);
})

test("handles console errors during fetchData function call", async () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
  jest.spyOn(authService, "getUsername").mockImplementation(() => {
    throw new Error("Username fetching error");
  });
 
  setIsError(true);
  render(<WelcomeUser
    organisationName={mockApiResponse.schoolName}
    isApiError={false}
     />);
  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching username:",
      expect.any(Error)
    );
  });
});
  test('should use "parent2" class when user name is long', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
    jest.spyOn(authService, 'getUsername').mockReturnValue('JohnDoeWithALongSurnameNameSurname');
    jest
    .spyOn(schoolName, "useFetchSchoolNameData")
    .mockResolvedValue(mockApiResponse);
    const {  getByText  } = render(<WelcomeUser
      organisationName={mockApiResponse.schoolName}
      isApiError={false}
       />);
    const welcomeParentElement = getByText('JohnDoeWithALongSurnameNameSurname').closest('.essui-grid-nested-container');
    expect(welcomeParentElement).toHaveClass('parent2');
   
  });



  test("renders subparentClass based on isMobileView", () => {
    const propsMobile = {
      isApiError: false,
      organisationName: 'Sample Org',
      isOpen: true,
    };
    const { getByTestId } = render(<WelcomeUser {...propsMobile} isMobileView={true} />);
    const subparentElementMobile = getByTestId('subparent-element');
  
    // Log the actual class names to help identify any mismatches
    console.log("Actual class names:", subparentElementMobile.className);
  
    // Assuming you want to check for the presence of "parent1-open-subparent" class
    expect(subparentElementMobile).toBeInTheDocument();
  
    // Check if the class "parent1-open-subparent" is present
    expect(subparentElementMobile).toHaveClass(' subparent parent2-subparent');
  });

  test("renders subparentClass based on isMobileView", () => {
    const propsMobile = {
      isApiError: false,
      organisationName: 'Sample Org',
      isOpen: true,
    };
  
    const { getByTestId } = render(<WelcomeUser {...propsMobile} isMobileView={false} />);
    const subparentElementMobile = getByTestId('subparent-element');
  
    // Log the actual class names to help identify any mismatches
    console.log("Actual class names:", subparentElementMobile.className);
  
    // Assuming you want to check for the presence of "parent1-open-subparent" class
    expect(subparentElementMobile).toBeInTheDocument();
  
    // Check if the class "parent1-open-subparent" is present
    expect(subparentElementMobile).toHaveClass('subparent parent2-subparent');
  });
  
  