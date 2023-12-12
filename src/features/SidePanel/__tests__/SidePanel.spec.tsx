import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { authService } from "@essnextgen/auth-ui";
import { AxiosResponse } from "axios";
import React from "react";
import SidePanel from "../SidePanel.view";
import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";
import * as qicklink from "../../../shared/services/quickLinkDomain/quickLinkService";
import * as  linkDetails  from "../../../shared/components/QuickLink/Quicklinkresponse";

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
  responseData:mockApiResponse
}
jest.mock(
  "../../../shared/services/quickLinkDomain/quickLinkService",
  () => ({
    FetchQuickLinkData: jest.fn(),
    FetchQuickLinkpost: jest.fn()
  })
); 

jest.mock(
  "../../../shared/components/QuickLink/Quicklinkresponse",
  () => ({
    fetchQuickLinkDetails: jest.fn(),
    
  })
);
const setIsError = jest.fn();
describe("SidePanel Component", () => {
 
  test('renders correctly when closed', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
  

   const {getByTestId} =  render(<SidePanel isOpen={false}
    togglePanel={jest.fn()}
    closePanel={() => {}}
    showMainPanelView={undefined}
    showQuickLinkView= {jest.fn()}
    setQuickLinkData={jest.fn()} 
    quicklinkData={mockApiResponse}
    />);
    expect(getByTestId("btn-collapse")).toBeInTheDocument();
  });


  test("calls togglePanel when save button is clicked", () => {
    
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
  
    const togglePanelMock = jest.fn();
    const { getByTestId } = render(
      <SidePanel
        isOpen={false}
        togglePanel={togglePanelMock}
        closePanel={() => {}}
        showMainPanelView={undefined}
        showQuickLinkView= {jest.fn()}
        setQuickLinkData={jest.fn()}
       quicklinkData={mockApiResponse}
      />
    );
    expect(getByTestId("close-panel")).toBeInTheDocument();
    fireEvent.click(getByTestId("btn-collapse"));

    expect(togglePanelMock).toHaveBeenCalled();
    expect(togglePanelMock).toBeCalledTimes(1);
  });

  test('renders correctly with data when open ', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
    const {getByText} =  render(<SidePanel isOpen={true}
    togglePanel={jest.fn()}
    closePanel={jest.fn()}
    
    showQuickLinkView= {jest.fn()}
    setQuickLinkData={jest.fn()} 
    quicklinkData={mockApiResponse}
    />);
    expect(getByText('Link 1')).toBeInTheDocument();
    expect(getByText('Link 2')).toBeInTheDocument();
  });

  test("renders when isPermissionquicklink is true", () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
    const { container, getByText } = render(<SidePanel  isOpen={true}
      togglePanel={jest.fn()}
      closePanel={jest.fn()}
      showQuickLinkView= {jest.fn()}
      setQuickLinkData={jest.fn()} 
      quicklinkData={mockApiResponse}/>);
    
    
    expect(container).toBeInTheDocument();
    expect(getByText("Quick links")).toBeInTheDocument();
  });

 

  test('renders with Tooltip when userFullname is truthy and length > 24', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
    jest
 
    .spyOn(authService, "getUsername")
 
    .mockImplementation(() => "JonathanQuincyAdamsSmithsonianabcd");
    
    const {getByText } = render(<SidePanel isOpen={true} togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
     console.log(getByText);
    expect(getByText("JonathanQuincyAdamsSmithsonianabcd")).toBeInTheDocument();

  });

  test('renders sidepanel component with mock data and star icon',async () => {
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
    const useStateMock: any  = (initiate:any) => [initiate, setQuickLinkData];    
 
   jest
   .spyOn(React, 'useState')
   .mockImplementationOnce(useStateMock);
   const {getByText,queryAllByTestId,getByTestId} =  render(<SidePanel isOpen={true} togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
    
  expect(getByText('Link 1')).toBeInTheDocument();   
    expect(queryAllByTestId("btn-star1", {exact:true}).length).toBe(1);

    jest
    .spyOn(qicklink, "FetchQuickLinkpost").mockReturnValueOnce(Promise.resolve(axiosResponse));

    jest
    .spyOn(linkDetails, "fetchQuickLinkDetails")
    .mockResolvedValue(mockres); 
    fireEvent.click(getByTestId("btn-star1"));  
     waitFor(()=>{
      expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
      expect(qicklink.FetchQuickLinkpost).toBeTruthy();
      expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
      expect(setQuickLinkData).toHaveBeenCalled()
    }) ;
  
  });
  test('renders sidepanel component with empty data and star icon',async () => {
    const axiosResponse: AxiosResponse = {
      data: undefined,
      status: 500,
      statusText: "OK",
      config: {},
      headers: {}
    };
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);  
    
    const useStateMock: any  = (initiate:any) => [initiate,setIsError];    
 
   jest
   .spyOn(React, 'useState')
   .mockImplementationOnce(useStateMock);
   const {getByText,queryAllByTestId,getByTestId} =  render(<SidePanel isOpen={true} togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
  ;
  expect(getByText('Link 1')).toBeInTheDocument();   
    expect(queryAllByTestId("btn-star1", {exact:true}).length).toBe(1);
    const starClicks = getByTestId("btn-star1");   
    jest
    .spyOn(qicklink, "FetchQuickLinkpost").mockReturnValueOnce(Promise.resolve(axiosResponse));

    jest
    .spyOn(linkDetails, "fetchQuickLinkDetails")
    .mockResolvedValue(mockres);
    
      fireEvent.click(starClicks);     
  
    expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
     waitFor(()=>{expect(linkDetails.fetchQuickLinkDetails).not.toHaveBeenCalled();
      expect(setIsError).toHaveBeenCalled()      
    }) ;
    
  });
});
