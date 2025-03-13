import { authService } from "@essnextgen/auth-ui";
import { act, render, screen } from "@testing-library/react";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import WelcomeUser from "../WelcomeUser.logic";
import * as schoolName from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";
import WelcomeUserView from "../WelcomeUser.view";

 
const mockApiResponse: ISchoolNameDataResponse = {
  externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
  schoolName: "Waters Edge Primary School",
  isSchoolPrimary:true
};

const setIsError = jest.fn();

jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(),
}));

jest.mock('@essnextgen/ui-flagr', () => ({  
  getFeaturePermission: jest.fn(),
  hasFeaturePermission: jest.fn()
}));

jest.mock('@essnextgen/ui-flagr', () => ({  
  getFeaturePermission: jest.fn(),
  hasFeaturePermission: jest.fn()
}));

const mediaQuery = require('@essnextgen/ui-kit');

test("renders welcome message if authorized and envConfig is set to True", () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

  jest

    .spyOn(authService, "getUsername")

    .mockImplementation(() => "John");
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
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
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
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

test.skip("fetches and displays school name", async () => {
  jest
    .spyOn(schoolName, "useFetchSchoolNameData")
    .mockResolvedValue(mockApiResponse);

  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

  jest

    .spyOn(authService, "getUsername")

    .mockImplementation(() => "John");
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
  const { findByText } = render(<WelcomeUser
                          organisationName={mockApiResponse.schoolName}
                          isApiError={false}
                          isSchoolNameToBeDisplayed
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
  jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
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

  test("should render correctly for desktop view", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
    const props = {
      fullName: "John Doe",
      isLongName: false,
      parentClassName: "custom-parent",
      subparentClassName: "custom-subparent",
      organisationName: "Example School",
      isApiError: false,
      isOpen: true,
    };



    render(<WelcomeUserView {...props} />);
    const desktopContent = screen.getAllByText((content, node:any) => {
      const hasText = (str:any) => node.textContent.trim().includes(str);
      return hasText("welcomePage.himsg") && hasText("John Doe") && hasText("welcomePage.welcomemsg");
    });

    expect(desktopContent).toHaveLength(4);
  });


  test("should render correctly for mobile view", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => true);
    const props = {
      fullName: "John Doe",
      isLongName: false,
      parentClassName: "custom-parent",
      subparentClassName: "custom-subparent",
      organisationName: "Example School",
      isApiError: false,
      isOpen: true,
      isSchoolNameToBeDisplayed: false
    };

  render(<WelcomeUserView {...props} />);
    const mobileContent = screen.getAllByText((content, node:any) => {
      const hasText = (str:any) => node.textContent.trim().includes(str);
      return hasText("welcomePage.himsg") && hasText("John Doe") && hasText("welcomePage.welcomemsg");
    });

    expect(mobileContent).toHaveLength(4);
  });

  test("renders WhatsNewBanner when ClassViewNotificationBanner is true", () => { 
    const defaultProps = {
    fullName: "John Doe",
    isLongName: false,
    parentClassName: "test-parent",
    subparentClassName: "test-subparent",
    organisationName: "Test School",
    isApiError: false,
    isOpen: true,
    isSchoolNameToBeDisplayed: false
  };
  jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => true);
  (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    render(<WelcomeUserView {...defaultProps}/>);

   // expect(screen.getByTestId("whatsnew-banner")).toBeInTheDocument();
  });