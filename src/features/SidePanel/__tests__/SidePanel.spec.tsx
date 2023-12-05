import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { authService } from "@essnextgen/auth-ui";
import SidePanel from "../SidePanel.view";
import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";
import * as qicklink from "../../../shared/services/quickLinkDomain/quickLinkService";

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
  })
); 


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
});
