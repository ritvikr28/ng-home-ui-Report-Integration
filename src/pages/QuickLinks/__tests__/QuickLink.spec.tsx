import { MemoryRouter, Redirect, Route } from "react-router-dom";
import { act, render } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import QuickLink from "../QuickLink.view";
import QuickLinkLogic from "../QuickLink.logic";
import { IQuickLinkApiResponse } from "../../../shared/model/quickLink/responsemodels";
import * as qicklink from "../../../shared/services/quickLinkDomain/quickLinkService";



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
       render(<QuickLinkLogic />);
      
  });

    
  });

  test('renders QuickLink component with mock data', () => {
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

    jest
    .spyOn(qicklink, "FetchQuickLinkData")
    .mockResolvedValue(mockres);
    setIsError(false);

   const {getByText} =  render(<QuickLink apiQuickLinkData={mockApiResponse} apiError={false} displaystarredicon={jest.fn()}/>);
    expect(getByText('Link 1')).toBeInTheDocument();
    expect(getByText('Link 2')).toBeInTheDocument();
    expect(getByText('Link 3')).toBeInTheDocument();
    expect(getByText('Link 4')).toBeInTheDocument();
  });
});


