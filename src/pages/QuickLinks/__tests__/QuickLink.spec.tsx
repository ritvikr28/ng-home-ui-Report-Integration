import { MemoryRouter, Redirect, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import QuickLink from "../QuickLink.view";




jest.mock("../../../shared/utils", () => ({
  envConfig: {
    IS_NEWHOMEPAGE_ACCESSIBLE: "True",
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  Redirect: jest.fn(() => null),
}));
describe("QuickLink Component", () => {

  test("renders QuickLink component with BreadcrumbWrapper when authorized", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

   const {getByText} =  render(<QuickLink />);
 
    console.log(getByText);
    expect(getByText("Home")).toBeInTheDocument();
   

  });

  test("renders Redirect component if not authorised or envConfig is not set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => false);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Route path="/" component={QuickLink} />
      </MemoryRouter>
    );

    expect(Redirect).toHaveBeenCalledWith({ to: "/noAccess" }, {});
  });
});


