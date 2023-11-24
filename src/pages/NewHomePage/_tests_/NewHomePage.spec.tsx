import React from "react";
import { authService } from "@essnextgen/auth-ui";
import { fireEvent, render} from "@testing-library/react";
import { Redirect } from "react-router-dom";
import { NewHomepageView } from "../NewHomePage.view";
import SidePanelView from "../../../features/SidePanel/SidePanel.view";


jest.mock("../../../shared/utils", () => ({
  envConfig: {
    IS_NEWHOMEPAGE_ACCESSIBLE: "True",
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  Redirect: jest.fn(() => null),
}));

describe("<NewHomepageView />", () => {
  test("renders welcome message if authorized and envConfig is set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest

      .spyOn(authService, "getUsername")

      .mockImplementation(() => "John");

    const { getByText } = render(<NewHomepageView />);

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
    const { getByText } = render(<NewHomepageView />);
    expect(
      getByText(
        "Brendapeterssfeeismynameitsalongnamendeetebtjhtwwwbtswrygoptcrrwtfseetuymbmllswwrtyyndhhttdsretemnusretet"
      )
    ).toBeInTheDocument();
  });
  test("renders Redirect component if not authorised or envConfig is not set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => false);

    render(<NewHomepageView />);

    expect(Redirect).toHaveBeenCalledWith({ to: "/noAccess" }, {});
  });

  test("test state change on side panel open", () => {
    const setIsOpen = jest.fn();
    const useSateMock:any = (useState:any) => [useState, setIsOpen];
    jest.mock('react', () => {
      const actualReact = jest.requireActual('react');
  
      return {
          ...actualReact,
          useState: jest.fn()
      };
  });

  jest.spyOn(React, 'useState').mockImplementation(useSateMock);  
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);    

    const {getByTestId}=render(<NewHomepageView />);
    fireEvent.click(getByTestId("btn-90-btn"));

    expect(setIsOpen).toHaveBeenCalled();
  });
  test("test state change on side panel close", () => {
    const setIsOpen = jest.fn().mockImplementation(()=>false);   
    const useSateMock:any = (useState:any) => [useState, setIsOpen];
    const toggle = jest.fn();
  
    jest.mock('../../../features/SidePanel/SidePanel.view', () => ({
      SidePanel: () => (
        <SidePanelView isOpen={false} togglePanel={toggle}  />
      ),
    }));

  jest.spyOn(React, 'useState').mockImplementation(useSateMock);  
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);    

    const {getByTestId}=render(<NewHomepageView />);
   
    expect(getByTestId("btn-save")).toBeInTheDocument();
    expect(setIsOpen).toHaveBeenCalled();
    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(setIsOpen).toHaveBeenCalledTimes(3);
   
    
  });
});
