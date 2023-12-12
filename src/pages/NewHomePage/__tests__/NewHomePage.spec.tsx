import React from "react";
import { authService } from "@essnextgen/auth-ui";
import { act, fireEvent, render,waitFor } from "@testing-library/react";
import NewHomepageView from "../NewHomePage.view";
import * as qicklink from "../../../shared/components/QuickLink/Quicklinkresponse";
import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";



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
  test.skip("renders welcome message if authorized and envConfig is set to True", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest

      .spyOn(authService, "getUsername")

      .mockImplementation(() => "John");

    const { getByText } = render(<NewHomepageView />);

    expect(getByText("John")).toBeInTheDocument();
  });
  test.skip("renders welcome message when authorized with a long username", () => {
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

    const {getByTestId}=render(<NewHomepageView />);
    expect(getByTestId("mainPanelView")).toBeInTheDocument();    
  });

  test("test state change on side panel open", () => {
    const setIsOpen = jest.fn();
    const setShowQuickLink = jest.fn();
    const useSateMock: any = (useState: any) => [
      useState,
      setIsOpen,
      setShowQuickLink
    ];
    //   jest.mock('react', () => {
    //     const actualReact = jest.requireActual('react');

    //     return {
    //         ...actualReact,
    //         useState: jest.fn()
    //     };
    // });

    jest.spyOn(React, "useState").mockImplementation(useSateMock);
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    const { getByTestId } = render(<NewHomepageView />);
    fireEvent.click(getByTestId("btn-90-btn"));

    expect(setIsOpen).toHaveBeenCalled();
  });  
  test("test state change on side panel close", () => {
    const setIsOpen = jest.fn(); 
     const useStateMock: any  = () => [false, setIsOpen];    
  
    jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(useStateMock);
    
  jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);    

    const {getByTestId}=render(<NewHomepageView />);
   
    expect(getByTestId("btn-collapse")).toBeInTheDocument();
    act(() => {
    fireEvent.click(getByTestId("btn-collapse"));
    });
    expect(setIsOpen).toHaveBeenCalled(); 
  });
  test("test state change for quick Link when response is not null", () => {
    const mockApiResponse: IQuickLinkApiResponse[] = [
      {
        id: 1,
        name: 'Link 1',
        link: '/link-1',
        favourite: true,
        createdOn: '2023-01-01T12:00:00Z',
      },
      {
        id: 2,
        name: 'Link 2',
        link: '/link-2',
        favourite: false,
        createdOn: '2023-01-01T12:00:00Z',
      },
      {
        id: 3,
        name: 'Link 3',
        link: '/link-3',
        favourite: true,
        createdOn: '2023-01-01T12:00:00Z',
      },
      {
        id: 4,
        name: 'Link 4',
        link: '/link-4',
        favourite: true,
        createdOn: '2023-01-01T12:00:00Z',
      }
    ];
   
    const mockres:any={
      status: 200,
      response:mockApiResponse
    }
    const setIsOpen = jest.fn();
    const setQuickLinkData = jest.fn();
    const setShowQuickLink = jest.fn();
    const useSateMock: any = (useState: any) => [
      useState,
      setIsOpen,
      setShowQuickLink,
      setQuickLinkData
    ];  
       
    jest.spyOn(React, "useState").mockImplementation(useSateMock);
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
    jest.spyOn(qicklink,"fetchQuickLinkDetails").mockResolvedValueOnce(mockres);
    const getUserOrganisationMock=jest.fn()
    jest.mock("../../../shared/utils", () => ({
      getUserOrganisation:getUserOrganisationMock
    }));
    render(<NewHomepageView />);
   waitFor(()=>{
    expect(setShowQuickLink).toHaveBeenCalled();
    expect(setQuickLinkData).toHaveBeenCalled();
    expect(qicklink.fetchQuickLinkDetails).toHaveBeenCalled();
    expect(setQuickLinkData).toHaveBeenCalledWith(mockres.response);
   })
     
  });
  test("test state change for quick Link when response is null", () => {
    const setIsOpen = jest.fn();
    const setQuickLinkData = jest.fn();
    const setShowQuickLink = jest.fn();
    const useSateMock: any = (useState: any) => [
      useState,
      setIsOpen,
      setShowQuickLink,
      setQuickLinkData
    ];  
       
    jest.spyOn(React, "useState").mockImplementation(useSateMock);
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
    jest.spyOn(qicklink,"fetchQuickLinkDetails").mockResolvedValueOnce(null);
    const getUserOrganisationMock=jest.fn()
    jest.mock("../../../shared/utils", () => ({
      getUserOrganisation:getUserOrganisationMock
    }));
    render(<NewHomepageView />);
   waitFor(()=>{
    expect(setShowQuickLink).toHaveBeenCalled();
    expect(setQuickLinkData).not.toHaveBeenCalled();
   // expect(setQuickLinkData).toHaveBeenCalledWith(null);
   })
     
  });
});
