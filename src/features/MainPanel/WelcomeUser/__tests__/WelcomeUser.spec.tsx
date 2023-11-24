import { authService } from "@essnextgen/auth-ui";
import { act, render } from "@testing-library/react";
import WelcomeUser from "../WelcomeUser.logic";
import * as schoolName from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolName } from "../model";
import WelcomeUserView from "../WelcomeUser.view";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";

const mockApiResponse: ISchoolName = {
  externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
  schoolName: "Waters Edge Primary School",
};

const setIsError = jest.fn();

test("renders welcome message if authorized and envConfig is set to True", () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

  jest

    .spyOn(authService, "getUsername")

    .mockImplementation(() => "John");

  const { getByText } = render(<WelcomeUser />);
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
  const { getByText } = render(<WelcomeUser />);
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

  const { findByText } = render(<WelcomeUser />);
  expect(await findByText(/Waters Edge Primary School/i)).toBeInTheDocument();
});

test("When api is failed then displays school name blank", async () => {
  jest
    .spyOn(schoolName, "useFetchSchoolNameData")
    .mockResolvedValue(mockApiResponse);

  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

  jest

    .spyOn(authService, "getUsername")

    .mockImplementation(() => "John");

  const props = {
    fullName: "John",
    isLongName: false,
    parentClassName: "parent1",
    subparentClassName: "parent1-subparent",
    organisationName: "School Name",
    isApiError: true,
  };
  const blankString = "";
  render(
    <WelcomeUserView
      fullName={props.fullName}
      isLongName={props.isLongName}
      parentClassName={props.parentClassName}
      subparentClassName={props.subparentClassName}
      organisationName={props.organisationName}
      isApiError={props.isApiError}
    />
  );
  expect(blankString).toMatch("");
});

test('handles errors during data fetching', async () => {
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  (useFetchSchoolNameData as jest.Mock).mockRejectedValue(mockApiResponse);
  setIsError(true);
 
   await act(async () => {
    setIsError(true);
    render(<WelcomeUser />);
  });
  expect(consoleErrorMock).toHaveBeenCalledWith('Error while fetching schoolName:', mockApiResponse);
  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(setIsError).toHaveBeenCalledWith(true);
  });