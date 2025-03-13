 
import { MemoryRouter, Redirect, Route } from "react-router-dom";
import { act, fireEvent, render,screen, waitFor } from "@testing-library/react";
import React from "react";
import { authService } from "@essnextgen/auth-ui";
import { AxiosResponse } from "axios";
import QuickLink from "../QuickLink.view";
import QuickLinkLogic from "../QuickLink.logic";
import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";
import * as qicklink from "../../../shared/services/quickLinkDomain/quickLinkService";
import * as  linkDetails  from "../../../shared/components/QuickLink/Quicklinkresponse";
 
 
 
jest.mock("../../../shared/utils", () => ({
  envConfig: {
    IS_NEWHOMEPAGE_ACCESSIBLE: "True",
  },
}));
 
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
 
  Redirect: jest.fn(() => null),
}));
const setIsError = jest.fn();
 
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
    favourite: false,
    createdOn: '2023-01-01T12:00:00Z',
  }
];
 
const mockres:any={
  status: 200,
  responseData:mockApiResponse
}
 
jest.mock(
  "../../../shared/services/quickLinkDomain/quickLinkService",
  () => ({
    FetchQuickLinkData: jest.fn(),
    FetchQuickLinkpost: jest.fn(),
  })
);
jest.mock(
  "../../../shared/components/QuickLink/Quicklinkresponse",
  () => ({
    fetchQuickLinkDetails: jest.fn(),
   
  })
);
 
describe("QuickLink Component", () => {
 
  test("renders QuickLink component with BreadcrumbWrapper when authorized", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
   const {getByText} =  render(
    <MemoryRouter initialEntries={["/"]}>
      <Route path="/" component={QuickLink} />
    </MemoryRouter>
  );
 
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
 
  test('renders QuickLink component with data', async () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
 
    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
    setIsError(false);
 
   await act(async () => {
       render(<QuickLinkLogic isOpen setQuickLinkData={jest.fn()}/>);
     
  });
 
   
  });
 
  test('renders QuickLink component with mock data', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
    setIsError(false);
 
   const {getByText} =  render(<QuickLink apiQuickLinkData={mockApiResponse} apiError={false} displaystarredicon={jest.fn()} togglePanel={()=>{}}/>);
    expect(getByText('Link 1')).toBeInTheDocument();
    expect(getByText('Link 2')).toBeInTheDocument();
    expect(getByText('Link 3')).toBeInTheDocument();
    expect(getByText('Link 4')).toBeInTheDocument();
  });
 
  test("should handle click event for link", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
      jest
      .spyOn(qicklink, "FetchQuickLinkData")
      .mockResolvedValue(mockres);
      const {getByText} =  render(<QuickLink apiQuickLinkData={mockApiResponse} isOpen apiError={false} displaystarredicon={jest.fn()} togglePanel={()=>{}}/>);
   
    const linkElement = getByText("Link 1");
 
    fireEvent.click(linkElement);
  });
 
  test('renders QuickLink component with mock data and star icon',async () => {
    const axiosResponse: AxiosResponse = {
      data: {error:null,payload:true,status:200},
      status: 200,
      statusText: "OK",
      config: {},
      headers: {}
    };
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);  
   
 
    const setQuickLinkData = jest.fn();
    const setIsStarClickable = jest.fn();
   // const useStateMock: any  = (initiate:any) => [initiate, setQuickLinkData,setIsStarClickable];    
 
  //  jest
  //  .spyOn(React, 'useState')
  //  .mockImplementationOnce(useStateMock);
   jest.spyOn(React, 'useState').mockReturnValueOnce([false, setQuickLinkData]).mockReturnValueOnce([true, setIsStarClickable]);
 
   const {getByText} =  render(<QuickLinkLogic isOpen apiQuickLinkData={mockApiResponse} setQuickLinkData={jest.fn()}/>);
  expect(getByText('Link 1')).toBeInTheDocument();  
    expect(screen.queryAllByTestId("btn-star1", {exact:true}).length).toBe(1);
 
    jest
    .spyOn(qicklink, "FetchQuickLinkpost").mockReturnValueOnce(Promise.resolve(axiosResponse));
 
    jest
    .spyOn(linkDetails, "fetchQuickLinkDetails")
    .mockResolvedValue(mockres);
    fireEvent.click(screen.getByTestId("btn-star1"));  
     waitFor(()=>{
      expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
      expect(qicklink.FetchQuickLinkpost).toBeTruthy();
      expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalledTimes(0);
      expect(setQuickLinkData).toHaveBeenCalled();
     
    }) ;
   
    expect(setIsStarClickable).toHaveBeenCalledWith(false);
  });
 
  test('renders QuickLink component with mock data and star icon', async () => {
    const axiosResponse: AxiosResponse = {
      data: { error: null, payload: true, status: 200 },
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    };
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest.spyOn(qicklink, "FetchQuickLinkData").mockResolvedValue(mockres);

    const setQuickLinkData = jest.fn();
    const setIsStarClickable = jest.fn();

    jest
      .spyOn(React, "useState")
      .mockReturnValueOnce([false, setQuickLinkData])
      .mockReturnValueOnce([true, setIsStarClickable]);

    const { getByText, getByTestId } = render(
      <QuickLinkLogic
        isOpen
        apiQuickLinkData={mockApiResponse}
        setQuickLinkData={jest.fn()}
      />
    );
    expect(getByText("Link 1")).toBeInTheDocument();
    expect(getByTestId("btn-star1")).toBeInTheDocument();
    jest
      .spyOn(qicklink, "FetchQuickLinkpost")
      .mockResolvedValueOnce(axiosResponse);

    jest
      .spyOn(linkDetails, "fetchQuickLinkDetails")
      .mockResolvedValueOnce(mockres);
    fireEvent.click(getByTestId("btn-star1"));
    await waitFor(() => {
      expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
      expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
      expect(setQuickLinkData).toHaveBeenCalledTimes(0);
      expect(setIsStarClickable).toHaveBeenCalledWith(false);
    });
    expect(getByTestId("btn-star1").getAttribute("name")).toEqual(null);

    jest.clearAllMocks();
    jest.spyOn(qicklink, "FetchQuickLinkpost").mockReset();
    jest.spyOn(linkDetails, "fetchQuickLinkDetails").mockReset();
    setQuickLinkData.mockReset();
    setIsStarClickable.mockReset();
    jest
      .spyOn(qicklink, "FetchQuickLinkpost")
      .mockResolvedValueOnce(axiosResponse);
    jest
      .spyOn(linkDetails, "fetchQuickLinkDetails")
      .mockResolvedValueOnce(mockres);

    fireEvent.click(getByTestId("btn-star2"));

    await waitFor(() => {
      expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
      expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
      expect(setQuickLinkData).toHaveBeenCalledTimes(0);
      expect(setIsStarClickable).toHaveBeenCalledWith(false);
    });
    expect(getByTestId("btn-star2").getAttribute("name")).toEqual(null);
  });

  test('renders QuickLink component with mock data and star icon error for api',async () => {
    const axiosResponse: AxiosResponse = {
      data: {error:null,payload:true,status:200},
      status: 500,
      statusText: "Internal server error",
      config: {},
      headers: {}
    };
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
 
    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);  
   
 
    const setQuickLinkData = jest.fn();
  //   const useStateMock: any  = (initiate:any) => [initiate, setQuickLinkData];    
 
  //  jest
  //  .spyOn(React, 'useState')
  //  .mockImplementationOnce(useStateMock);
  const setIsStarClickable = jest.fn();
  jest.spyOn(React, 'useState').mockReturnValueOnce([false, setQuickLinkData]).mockReturnValueOnce([true, setIsStarClickable]);
 
   const {getByText} =  render(<QuickLinkLogic isOpen apiQuickLinkData={mockApiResponse} setQuickLinkData={jest.fn()}/>);
  expect(getByText('Link 1')).toBeInTheDocument();  
    expect(screen.queryAllByTestId("btn-star1", {exact:true}).length).toBe(1);
 
    jest
    .spyOn(qicklink, "FetchQuickLinkpost").mockReturnValueOnce(Promise.reject(axiosResponse));
 
    jest
    .spyOn(linkDetails, "fetchQuickLinkDetails")
    .mockResolvedValue(mockres);
    fireEvent.click(screen.getByTestId("btn-star1"));  
     waitFor(()=>{
      expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
      expect(qicklink.FetchQuickLinkpost).toBeTruthy();
      expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
      expect(setQuickLinkData).toHaveBeenCalled();
      expect(setIsStarClickable).toHaveBeenCalled();
    }) ;
  });
});