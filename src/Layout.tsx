import { Suspense, lazy, FC, LazyExoticComponent } from "react";
import { Auth, ProtectedRoute } from "@essnextgen/auth-ui";
import { Switch, BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import {
  Header,
  SchoolGroupRedirect
} from "@essnextgen/ui-application-kit";
import { Loader, LoaderType } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";
import { menuFilterHandler, renderHomePage, hasPermission, hasFeatureFlag, hasOrgVariant } from "./layoutHelpers";
import DocumentManagementServer from "./features/DocumentManagementServer/DocumentManagementServer.logic";
import UAM from "./features/AdminConsole/UAM.view";
import EarlyAdpterPage from "./pages/EarlyAdopter/EarlyAdopterPage.view";
import DBManagement from "./features/DBManagement/DBManagement.view"; 
import InviteUsersLogic from "./pages/InviteUsers";
import { useLayoutInit } from "./useLayoutInit";


const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);

export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

export const Layout: FC<ILayoutProps> = ({ isStandaloneApp, baseRouteName }) => {
  // const dispatch = useDispatch();
  // const history: any = useHistory();
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  // const [isServiceInitiated, setIsServiceInitiated]: [
  //   boolean,
  //   React.Dispatch<React.SetStateAction<boolean>>
  // ] = useState<boolean>(false);

  const { isServiceInitiated , onAuthenticated } : any = useLayoutInit(isStandaloneApp, t);

  // useEffect(() => {
  //   if (!isStandaloneApp) {
  //     fetchData();
  //   }
  // }, []);

  // const fetchData: () => Promise<void> = async () => {
  //   try {
  //     const response: any = await getAppModulesPermissions();
  //     processFetchedData(response.data);
  //   } catch {
  //     processFetchedData([]);
  //   }
  // };

  // const processFetchedData: (data: IModulePermission[]) => void = (data) => {
  //   const menusWithPermission: IApplicationMenu[] = getMenus(data, []);
  //   menuFilterHandler(menusWithPermission, t);
  // };

  // const onAuthenticated: () => void = (): void => {
  //   if (authService.isAuthenticated()) {
  //     setIsServiceInitiated(true);
  //   } else {
  //     history.push("/auth");
  //   }
  // };

  // const onAuthenticated : () => void = (): void => {
  //   if (!isServiceInitiated) {
  //     history.push("/auth");
  //   }
  // };

  const homepageComponent : any =
    isServiceInitiated
      ? renderHomePage(
          hasPermission("NG.Homepage", "View"),
          hasPermission("NG.Homepage.Teacher", "View"),
          hasPermission("NG.Homepage.SLT", "View"),
          hasPermission("NG.Homepage.Admin", "View")
        )
      : () => <div />;


  return (
    <Router basename={baseRouteName}>
      {isStandaloneApp && (
        <Header
          isRenderOnFrame
          menuFilterHandler={(menus) => menuFilterHandler(menus, t)}
          onClickLogo={() => { }}
          useSchoolPermission
        />
      )}
      <Suspense
        fallback={
          <Loader
            className="loader-wrapper"
            loaderText="Loading..."
            loaderType={LoaderType.Circular}
          />
        }
      >
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            onAuthenticated={onAuthenticated}
            component={homepageComponent}
          />

          <ProtectedRoute
            exact
            path="/noAccess"
            component={NoAccess}
          />

          <ProtectedRoute
            exact
            path="/unauthorized"
            component={UnAuthorisedAccess}
          />

          {hasFeatureFlag("AdminConsoleView") && (
            <>
              <ProtectedRoute
                exact
                path="/AdminConsole"
                render={() =>
                  hasPermission("NG.AdminConsole", "View") ? (
                    <AdminConsole />
                  ) : (
                    <Redirect to="/unauthorized" />
                  )
                }
              />
              <ProtectedRoute
                exact
                path="/documents"
                render={() =>
                  hasPermission("NG.AdminConsole", "View") ? (
                    <DocumentManagementServer />
                  ) : (
                    <Redirect to="/unauthorized" />
                  )
                }
              />
            </>
          )}

          {hasOrgVariant("UAMView") && hasFeatureFlag("UAMView") && (
            <ProtectedRoute
              exact
              path="/uam"
              component={UAM}
            />
          )}

          {hasFeatureFlag("InviteUserView") && (
            <ProtectedRoute
              exact
              path="/inviteusers"
              render={() =>
                hasFeatureFlag("InviteUserView") ? (
                  <InviteUsersLogic />
                ) : (
                  <Redirect to="/unauthorized" />
                )
              }
            />
          )}

          {hasOrgVariant("RefreshDBORG") && hasFeatureFlag("RefreshDBORG") && (
            <ProtectedRoute
              exact
              path="/dbmanagement"
              component={DBManagement}
            />
          )}

          <ProtectedRoute
            exact
            path="/adminConsole/userManagement"
            component={EarlyAdpterPage}
          />

          <ProtectedRoute
            exact
            path="/schoolRedirect"
            component={SchoolGroupRedirect}
          />

          {isStandaloneApp && (
            <Route exact path="/auth" component={Auth} />
          )}

          <ProtectedRoute
            exact
            path="*"
            component={PageNotFound}
          />
        </Switch>
      </Suspense>
    </Router>
  );
};