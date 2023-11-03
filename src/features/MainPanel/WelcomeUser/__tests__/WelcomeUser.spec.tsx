import { authService } from "@essnextgen/auth-ui";
import { render } from "@testing-library/react";
import WelcomeUser from "../WelcomeUser.logic";
import * as schoolName from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolName } from "../model";


const mockApiResponse: ISchoolName = {
    externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
    schoolName: "Waters Edge Primary School"
    
  };

test("renders welcome message if authorized and envConfig is set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
    jest
 
      .spyOn(authService, "getUsername")
 
      .mockImplementation(() => "John");
 
    const { getByText } = render(<WelcomeUser  />);
 
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

  test('fetches and displays school name', async () => {
     
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