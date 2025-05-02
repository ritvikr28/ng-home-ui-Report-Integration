import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { authService } from "@essnextgen/auth-ui";
import * as redux from "react-redux";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { AppPermissionState, IAppModule } from "../types/AppPermission";
import { Layout } from "../Layout";
import configureStore from "../redux/store";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import * as getAppModulesPermissions from "../actions/queries";

const history = createBrowserHistory();
const appPermissions: AppPermissionState = {
  modules: [],
  isLoaded: true
};
const appModules: IAppModule[] = [
  {
    title: "",
    description: "",
    code: "Home",
    canView: true
  },
  {
    title: "",
    description: "",
    code: "StaffProfile",
    canView: true
  }
];
jest.mock('@essnextgen/ui-flagr', () => ({
  getFeaturePermission: jest.fn(),
  hasFeaturePermission: jest.fn()
}));
describe("Layout component", () => {

  beforeEach(() => {
    jest.spyOn(authService, "isAuthenticated").mockImplementation(() => true);
    jest
      .spyOn(authService, "getAuthTokens")
      .mockImplementation(() => "dummy token");
    appPermissions.modules.push(...appModules);
    jest
      .spyOn(authService, "getAuthTokens")
      .mockReturnValue(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJwbS1zc28tZWRjNGE3ZWMtNjI0Zi00OWQ0LTkxODEtNTU1YjczMDFlMzNmIiwiZXhwIjoxNjcyMDU2NTk5LCJuYmYiOjE2NzIwNTYyOTksImlhdCI6MTY3MjA1NjI5OSwic2lkIjoiNzMyNzAzZWQ3NzQ5ZTZhZWE3ZjJlN2U0OTdlMDM5ZjQiLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw2NTNhNDVjZi1hOGY3LTQyM2EtYjEzNC1jOGVjMmE0NGE1OGQiLCJhdXRoX3RpbWUiOjE2NzIwNTYyOTcsImlkcCI6Imlkc3J2IiwiTGFzdExvZ2luVGltZXN0YW1wIjoiRGVjIDI2LCAyMDIyIDEwOjE5OjEzIiwiUGFzc3dvcmRDaGFuZ2VkVGltZXN0YW1wIjoiRGVjIDA4LCAyMDIxIDE3OjAyOjQwIiwic2l0ZSI6IkI0MUJCMkFCIiwibGF1bmNoZXIiOiJ3ZWItYWNjZXNzIiwiU2l0ZVJvbGUiOiJBZG1pbiIsImhvbWVvcmdhbmlzYXRpb25pZGVudGlmaWVyIjoiQjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5IiwibXVsdGlwbGVvcmdhbmlzYXRpb25zIjoiZmFsc2UiLCJuYW1lIjoiSW5pdGlhbCBBZG1pbiIsInJvbGUiOiJhZG1pbkBiNDFiYjJhYi0zOTdhLTRmY2YtYmE1OS02MTU2ZjQ1NTMyNjkiLCJhZGRpdGlvbmFscm9sZXNwcmVzZW50IjoiZmFsc2UiLCJ1c2Vyb3JnYW5pc2F0aW9uaWRlbnRpZmllciI6IjlGMEU2RTUyLTVGMjItNDYxRi05RjNCLTYwNEJFRDQxMEU5Q3xCNDFCQjJBQi0zOTdBLTRGQ0YtQkE1OS02MTU2RjQ1NTMyNjl8UyIsInByb3ZpZGVyIjoiU0lNUyBJRCIsInByb3ZpZGVyaWQiOiIxNDk5MDYiLCJwcm92aWRlcm5hbWUiOiJJbml0aWFsIEFkbWluIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiMUEyQjMyQzctOUMzOS00Q0NGLUE1ODEtRTI1M0E5RkEwN0E0IiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU3RhZmYgJiBBZG1pbiIsImFtciI6WyJwYXNzd29yZCJdfQ.0dhbAIzNyXm5oJ679cOuiqwT8RgqcBhEGACfvxfGBLKHSNxvlBKqwmtRNxySYIc4MgH3w2sT4SLpo8yaEihjk9AXzfSPshHKbfAigb82834xnfMAEDnyc0hMT9jaxvfYVw8ZORPsVw68mxAwt4-WTVoUxLy4IK7tpI-Pzc_aFpW-BbMHr9Ctt_ls8EPH8NxJ22LnNbxJPSx3iBn8OwvcCIf2TeJL0fs30_VAm-XMLnF4w2SMbOC5O8CNd-ii6dmDLDriYYVzp-mQ4NiARohGJyDl6IwdgX6wXsSJB78Yy6AmCxUIXPQk4TYg_8wI9a_XNgilY5iMmEV6GXoLtm4e0A"
      );

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        "SIMSCX/Role": "admin@66f4f5d0-b6aa-4959-b9d3-fa6e69bf250a"
      }))
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    appPermissions.modules = [];
  });
  it("renders the NotFound component", async () => {
    const spy = jest.spyOn(redux, "useSelector");
    const {getByTestId} = render(<PageNotFound />);
    spy.mockReturnValue(appPermissions);

    history.push("*");
    // const { getByText } = render(
    //   <Provider store={configureStore()}>
    //     <Router history={history}>
    //       <Layout isStandaloneApp baseRouteName="" />
    //     </Router>
    //   </Provider>
    // );
    const container: any = getByTestId(
      "page-not-found-1144534sdw"
    );
    await waitFor(() => {
      expect(
        container
        // getByText("Sorry, the page you requested cannot be found")
      ).toBeInTheDocument();
    });
  });

  it("renders the NoAccess component", async () => {
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(appPermissions);
    history.push("/noAccess");
    const { getByTestId } = render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <Layout isStandaloneApp baseRouteName="" />
        </Router>
      </Provider>
    );
    await waitFor(() => {
      expect(getByTestId("NoAccessPageTestId")).toBeInTheDocument();
    });
  });

  it("renders the Header component", async () => {
    const { getByTestId } = render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <Layout isStandaloneApp baseRouteName="" />
        </Router>
      </Provider>
    );
    await waitFor(() => {
      expect(getByTestId("header-menu-icon-btn")).toBeInTheDocument();
    });
  });

  it.skip("renders the New Home Page component", async () => {
    const useSelector = jest.spyOn(redux, "useSelector");
    useSelector.mockReturnValue(appPermissions);
    jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);
    (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    jest.mock('../shared/utils/flagr-utils', () => ({
      isOrganisationInVariant: jest.fn().mockImplementationOnce(()=>true)

    }));

    const getAppModulePermissionMock: any = jest
    .spyOn(getAppModulesPermissions, "default")
    .mockResolvedValueOnce({
      data: [{ code: "module1" }, { code: "module2" }],
      status: 200,
      statusText: "",
      headers: {},
      config: {}
    });
    history.push("/");



      await render(
        <Provider store={configureStore()}>
          <Router history={history}>
            <Layout isStandaloneApp={false} baseRouteName="" />
          </Router>
        </Provider>
      );
     expect(getAppModulePermissionMock).toHaveBeenCalled();
  });
});
