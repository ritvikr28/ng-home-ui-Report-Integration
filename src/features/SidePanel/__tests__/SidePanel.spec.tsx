  import { render, fireEvent, waitFor } from "@testing-library/react";
  import "@testing-library/jest-dom/extend-expect";
  import { authService } from "@essnextgen/auth-ui";
  import { AxiosResponse } from "axios";
  import React from "react";
  import SidePanel from "../SidePanel.view";
  import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";
  import * as qicklink from "../../../shared/services/quickLinkDomain/quickLinkService";
  import * as  linkDetails  from "../../../shared/components/QuickLink/Quicklinkresponse";
  import gtmAnalytics from "../../../shared/utils/analytics";

  const mediaQuery = require('@essnextgen/ui-kit');

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
      const {getByText} =  render(<SidePanel isOpen
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
      const { container, getByText } = render(<SidePanel  isOpen
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
      
      const {getByText } = render(<SidePanel isOpen togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
      expect(getByText("JonathanQuincyAdamsSmithsonianabcd")).toBeInTheDocument();

    });

    test("renders sidepanel component with mock data and star icon", async () => {
      jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

      jest.spyOn(qicklink, "FetchQuickLinkData").mockResolvedValue(mockres);

      const setQuickLinkData = jest.fn();
      const useStateMock: any = (initiate: any) => [initiate, setQuickLinkData];

      jest.spyOn(React, "useState").mockImplementationOnce(useStateMock);

      const { getByText, getByTestId } = render(
        <SidePanel
          isOpen
          togglePanel={jest.fn()}
          closePanel={jest.fn()}
          showQuickLinkView={jest.fn()}
          setQuickLinkData={jest.fn()}
          quicklinkData={mockApiResponse}
        />
      );

      expect(getByText("Link 1")).toBeInTheDocument();
      expect(getByText("Link 2")).toBeInTheDocument();
      const axiosResponse: AxiosResponse<any, any> = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      };

      jest.spyOn(qicklink, "FetchQuickLinkpost").mockResolvedValue(axiosResponse);

      jest.spyOn(linkDetails, "fetchQuickLinkDetails").mockResolvedValue(mockres);

      const pushEventMock = jest.spyOn(gtmAnalytics, "pushEvent");

      fireEvent.click(getByTestId("btn-star1"));

      await waitFor(() => {
        expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
        expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
        expect(setQuickLinkData).toHaveBeenCalledTimes(0);

        expect(pushEventMock).toHaveBeenCalledWith({
          event: "interact_click",
          elementType: "filled_star",
          elementTextOrLabel: "Link 1",
          elementLocation: "sidebar",
        });
      });

      fireEvent.click(getByTestId("btn-star2"));

      await waitFor(() => {
        expect(qicklink.FetchQuickLinkpost).toHaveBeenCalledTimes(2);
        expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalledTimes(2);
        expect(setQuickLinkData).toHaveBeenCalledTimes(0);

        expect(pushEventMock).toHaveBeenCalledWith({
          event: "interact_click",
          elementType: "empty_star",
          elementTextOrLabel: "Link 2",
          elementLocation: "sidebar",
        });
      });
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
    const {getByText,queryAllByTestId,getByTestId} =  render(<SidePanel isOpen togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
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

    test("changes window location when a quick link is clicked", () => {
    
      const {getByText} =  render(<SidePanel isOpen togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
      
      fireEvent.click(getByText("Link 1"));
      expect(window.location.href).toBe("http://localhost/");
    });

    test('renders sidepanel component with mock data and star icon error for api',async () => {
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
      const useStateMock: any  = (initiate:any) => [initiate, setQuickLinkData];
      
    jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(useStateMock);
  
    const {getByText, queryAllByTestId, getByTestId} =  render(<SidePanel isOpen togglePanel={jest.fn()} closePanel={jest.fn()} showQuickLinkView={jest.fn()} setQuickLinkData={jest.fn()} quicklinkData={mockApiResponse} />);
    expect(getByText('Link 1')).toBeInTheDocument();  
      expect(queryAllByTestId("btn-star1", {exact:true}).length).toBe(1);
  
      jest
      .spyOn(qicklink, "FetchQuickLinkpost").mockReturnValueOnce(Promise.reject(axiosResponse));
  
      jest
      .spyOn(linkDetails, "fetchQuickLinkDetails")
      .mockResolvedValue(mockres);
      fireEvent.click(getByTestId("btn-star1"));  
      waitFor(()=>{
        expect(qicklink.FetchQuickLinkpost).toHaveBeenCalled();
        expect(qicklink.FetchQuickLinkpost).toBeTruthy();
        expect(linkDetails.fetchQuickLinkDetails).toHaveBeenCalled();
        expect(setQuickLinkData).toHaveBeenCalled()
        expect(setIsError).toHaveBeenCalledWith(true);
      }) ;
    });
    test('should call showQuickLinkView when "See all" is clicked', () => {
      const mockShowQuickLinkView = jest.fn();
      jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => true);
      const { getByText } = render(
        <SidePanel
          isOpen
          togglePanel={() => {}}
          closePanel={() => {}}
          showQuickLinkView={mockShowQuickLinkView}
          quicklinkData={[]}
          setQuickLinkData={() => {}}
          isLoader={false}
        />
      );

      const seeAllLink = getByText("See all");
      fireEvent.click(seeAllLink);

      expect(mockShowQuickLinkView).toHaveBeenCalled();
    });

    test('should call togglePanel when "See all" is clicked in mobile view', () => {
      const mockTogglePanel = jest.fn();
      const mockShowQuickLinkView = jest.fn();
      jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => true);
      const { getByText } = render(
        <SidePanel
          isOpen
          togglePanel={mockTogglePanel}
          closePanel={() => {}}
          showQuickLinkView={mockShowQuickLinkView}
          quicklinkData={[]}
          setQuickLinkData={() => {}}
          isLoader={false}
        
        />
      );

      const seeAllLink = getByText("See all");
      fireEvent.click(seeAllLink);

      expect(mockTogglePanel).toHaveBeenCalled();
      expect(mockShowQuickLinkView).toHaveBeenCalled();
    });

    test('should not call togglePanel when "See all" is clicked in non-mobile view', () => {
      const mockTogglePanel = jest.fn();
      const mockShowQuickLinkView = jest.fn();
      jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
      const { getByText } = render(
        <SidePanel
          isOpen
          togglePanel={mockTogglePanel}
          closePanel={() => {}}
          showQuickLinkView={mockShowQuickLinkView}
          quicklinkData={[]}
          setQuickLinkData={() => {}}
          isLoader={false}
        
        />
      );

      const seeAllLink = getByText("See all");
      fireEvent.click(seeAllLink);

      expect(mockTogglePanel).not.toHaveBeenCalled();
      expect(mockShowQuickLinkView).toHaveBeenCalled();
    });
    test("should render with a tooltip when loginFullname is longer than 24 characters", () => {
      jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
      render(
        <SidePanel
          isOpen
          togglePanel={() => {}}
          closePanel={() => {}}
          showQuickLinkView={() => {}}
          quicklinkData={[]}
          setQuickLinkData={() => {}}
          isLoader={false}
        />
      );
    });

    jest.mock('../../../shared/utils', () => ({
      envConfig: {
        INVITE_STAFF_URL: "http://localhost/"
      },
    }));

    test("clicking 'Invite Staff' navigates to the correct URL", () => {
      const { getByText } = render(
        <SidePanel
          isOpen
          togglePanel={jest.fn()}
          closePanel={jest.fn()}
          setQuickLinkData={jest.fn()}
          isSIMSIDAdmin={true}
        />
      );
      
      const inviteStaffLink = getByText("Invite Staff");
      expect(inviteStaffLink).toBeInTheDocument();
  
      fireEvent.click(inviteStaffLink);
  
      // Check that window.location.href was updated correctly
      expect(window.location.href).toBe("http://localhost/");
    });

  });