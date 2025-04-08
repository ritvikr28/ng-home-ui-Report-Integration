import { Suspense, lazy, FC, useEffect, useState, LazyExoticComponent } from "react";
import { ProtectedRoute, authService } from "@essnextgen/auth-ui";
import { Switch, BrowserRouter as Router, useHistory, Redirect } from "react-router-dom";
import {
  Header,
  IApplicationMenu,
  IModulePermission
} from "@essnextgen/ui-application-kit";
import { Loader, LoaderType } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import getAppModulesPermissions from "./actions/queries";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";
import { getMenus, menuFilterHandler, renderHomePage, hasPermission, hasFeatureFlag } from "./layoutHelpers";


const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);

export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

export const Layout: FC<ILayoutProps> = ({ isStandaloneApp, baseRouteName }) => {
  // const dispatch = useDispatch();
  const history: any = useHistory();
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  const [isServiceInitiated, setIsServiceInitiated]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  useEffect(() => {
    if (!isStandaloneApp) {
      fetchData();
    }
  }, []);

  const fetchData: () => Promise<void> = async () => {
    try {
      const response : any = await getAppModulesPermissions();
      processFetchedData(response.data);
    } catch {
      processFetchedData([]);
    }
  };

  const processFetchedData = (data: IModulePermission[]): void => {
    const menusWithPermission : IApplicationMenu[] = getMenus(data, []);
    menuFilterHandler(menusWithPermission, t);
  };

  const onAuthenticated = (): void => {
    if (authService.isAuthenticated()) {
      setIsServiceInitiated(true);
    } else {
      history.push("/auth");
    }
  };

  return (
    <Router basename={baseRouteName}>
      {isStandaloneApp && (
        <Header
          isRenderOnFrame
          menuFilterHandler={(menus) => menuFilterHandler(menus, t)}
          onClickLogo={() => {}}
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
            onAuthenticated={onAuthenticated}
            exact
            path="/"
            component={
              isServiceInitiated
                ? renderHomePage(
                    hasPermission("NG.Homepage", "View"),
                    hasPermission("NG.Homepage.Teacher", "View"),
                    hasPermission("NG.Homepage.SLT", "View"),
                    hasPermission("NG.Homepage.Admin", "View")
                  )
                : () => <div />
            }
          />
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          <ProtectedRoute exact path="/unauthorized" component={UnAuthorisedAccess} />
          {hasFeatureFlag("AdminConsoleView") && (
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
          )}
          <ProtectedRoute exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};