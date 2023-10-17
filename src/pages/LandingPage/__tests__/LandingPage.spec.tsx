import { RenderResult, fireEvent, render, waitFor } from "@testing-library/react";
import { Provider} from "react-redux";
import { createBrowserHistory } from "history";
import * as redux from "react-redux";
import { Router } from "react-router-dom";
import { authService } from "@essnextgen/auth-ui";
import configureStore from "../../../redux/store";
import LandingPage from "../index";
import { AppPermissionState } from "../../../types/AppPermission";
import LandingPageView from "../LandingPage.view";

jest.mock('../../../shared/utils', () => ({
  envConfig: {
    IS_NEWHOMEPAGE_ACCESSIBLE: 'True',
  },
}));

describe("Landing Page", () => { 
  jest.mock("@essnextgen/ui-intl-kit");
  
  const history = createBrowserHistory();
 
  beforeEach(() => {  
    
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should redirect to /noAccess when there are no active modules', () => {
    const appPermissions: AppPermissionState = {
      modules: [],
      isLoaded: true
    };
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(appPermissions); 
    jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(appPermissions);  
    history.push("/") 
    render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <LandingPage />
        </Router>
      </Provider>
    );
    expect(history.location.pathname).toEqual('/noAccess')
  });
  it('should redirect to Landing Page when there is no active modules but include Home', () => {
    const apps: AppPermissionState = {
      modules: [{
        title: "",
        description: "",
        code: "Home",
        canView: false
      },
      {
        title: "",
        description: "",
        code: "StaffProfile",
        canView: false
      }],
      isLoaded: true
    };
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(apps); 
    jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(apps);  
    history.push("/") 
    const {getByTestId}:RenderResult=render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <LandingPage />
        </Router>
      </Provider>
    );
    expect(getByTestId("LandingPageTestId")).toBeInTheDocument();
  });
  it('should display loader when active modules include only Home', () => {
    const apps: AppPermissionState = {
      modules: [{
        title: "",
        description: "",
        code: "Home",
        canView: true
      }
     ],
      isLoaded: true
    };
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(apps); 
    jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(apps);  
    history.push("/") 
    const {getByTestId}:RenderResult=render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <LandingPage />
        </Router>
      </Provider>
    );
    expect(getByTestId("loader-cir")).toBeInTheDocument();   
  });
});

jest.spyOn(authService, 'isAuthorised').mockImplementation(() => true);
    const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  }));
describe("Landing Page tests", () => { 

  
 
  jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(
      (): AppPermissionState => ({ modules: [], isLoaded: false })
    ),
    useDispatch: jest.fn(() => jest.fn())
  }));
   
  jest.mock("../../../actions/storeActions", () => ({
    saveAppPermission: jest.fn(),
    clearAppPermission: jest.fn(),
    startRequest: jest.fn()
  }));
  beforeEach(() => {
    
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
 
  it("should render the loading spinner while fetching data", async () => {
    const { getByTestId }: RenderResult = renderWithProvider();  

    await waitFor(() => {
      expect(getByTestId("loader-arc")).toBeInTheDocument();
    });
  });

  it("should render the loading spinner while fetching data is empty", async () => {
    const { getByTestId }: RenderResult = render( <LandingPageView
      data={[]}
    />);
   
    await waitFor(() => {
      expect(getByTestId("loader-arc")).toBeInTheDocument();      
    });
  });

  it("should return null when canview is false", async () => {   
    const { getByTestId }: RenderResult = render( <LandingPageView
      data={[{ code: "Test", canView: false ,title:"Test",description:""}]}
    />);
   
    await waitFor(() => {
      expect(getByTestId("LandingPageTestId")).toBeInTheDocument();
      
    });
  });
  it("should return tile with empty link when canview is true", async () => {   
    const { getByTestId }: RenderResult = render( <LandingPageView
      data={[{ code: "Test", canView: true ,title:"Test",description:"",link:""}]}
    />);
   
    await waitFor(() => {
      expect(getByTestId("LandingPageTestId")).toBeInTheDocument();      
    });
  });

  test('shows the New Homepage button when authorized and config is True', () => {
    jest.spyOn(authService, 'isAuthorised').mockImplementation(() => true);
    const { queryByTestId } = render(<LandingPageView data={[{ code: "Test", canView: true ,title:"Test",description:"",link:""}]} />);
    expect(queryByTestId('create-event-button')).toBeInTheDocument();
  });

  test('does not render "New Homepage" button if not authorised', () => {
    jest.spyOn(authService, 'isAuthorised').mockImplementation(() => false);

    const { queryByText } = render(<LandingPageView data={[{ code: "Test", canView: true ,title:"Test",description:"",link:""}]} />);
    expect(queryByText('New Homepage')).toBeNull();
  });
  
  test('redirects to "/new-home" when the "New Homepage" button is clicked', () => {
    jest.spyOn(authService, 'isAuthorised').mockImplementation(() => true);
    const { getByText,getByTestId } = render(<LandingPageView data={[{ code: "Test", canView: true ,title:"Test",description:"",link:""}]} />);
    const button = getByText(/New Homepage/i);
    expect(button).toBeInTheDocument();
    fireEvent.click(getByTestId('create-event-button'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/new-home');
  });
});

function renderWithProvider() {
  return render(
    <Provider store={configureStore()}>
      <LandingPage />
    </Provider>
  );
}
