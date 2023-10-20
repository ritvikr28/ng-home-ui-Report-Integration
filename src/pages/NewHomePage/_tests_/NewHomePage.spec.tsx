import { render } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import { Redirect } from "react-router-dom";
import { NewHomepageView } from "../NewHomePage.view";

jest.mock("../../../shared/utils", () => ({
  envConfig: {
    IS_NEWHOMEPAGE_ACCESSIBLE: "True"
  }
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  Redirect: jest.fn(() => null)
}));

describe("<NewHomepageView />", () => {
  // test("renders welcome message if authorized and envConfig is set to True", () => {
  //   jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

  //   jest

  //     .spyOn(authService, "getUsername")

  //     .mockImplementation(() => "John Doe");

  //   const { getByText } = render(<NewHomepageView />);

  //   expect(getByText("John Doe")).toBeInTheDocument();
  // });

  test("renders Redirect component if not authorised or envConfig is not set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => false);

    render(<NewHomepageView />);

    expect(Redirect).toHaveBeenCalledWith({ to: "/noAccess" }, {});
  });
});