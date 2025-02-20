import React,{ Suspense, lazy, LazyExoticComponent, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProtectedRoute, Auth, authService, MatchPermissions } from "@essnextgen/auth-ui";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  useHistory,
  Redirect
 } from "react-router-dom";
import {
  Header,
  IApplicationMenu,
  ApplicationConfig,
  IModulePermission,
  SchoolGroupRedirect
} from "@essnextgen/ui-application-kit";
import { Loader, LoaderType } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { saveAppPermission, startRequest } from "./actions/storeActions";
import { IAppModule } from "./types/AppPermission";
import getAppModulesPermissions from "./actions/queries";
import NewHomepageView from "./pages/NewHomePage/NewHomePage.view";
import { envConfig, isAuthzUserAdmin, service } from "./shared/utils";

import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import DBManagement from "./features/DBManagement/DBManagement.view";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";
import UAM from "./features/AdminConsole/UAM.view";
import { isOrganisationInVariant } from "./shared/utils/flagr-utils";
import EarlyAdpterPage from "./pages/EarlyAdopter/EarlyAdopterPage.view";
import DocumentManagementServer from "./features/DocumentManagementServer/DocumentManagementServer.logic";
import InviteUsersLogic from "./pages/InviteUsers";





const LandingPage: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./pages/LandingPage")
);
const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);


export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}
const allMenus: IApplicationMenu[] = ApplicationConfig.getRoleBasedMenus();
export const getMenus: (
  data: IModulePermission[],
  globalMenus: IApplicationMenu[]
) => IApplicationMenu[] = (
  data: IModulePermission[],
  globalMenus: IApplicationMenu[]
) => {
  const menusWithPermission: IApplicationMenu[] = globalMenus.filter(
    (menu: IApplicationMenu) =>
      data.some(
        (x: IModulePermission) =>
          x.code === menu.appCode || menu.allowedRoles.includes("admin")
      )
  );
  return menusWithPermission;
};
export const Layout: (props: ILayoutProps) => JSX.Element = ({
  isStandaloneApp,
  baseRouteName
}: ILayoutProps) => {
  const dispatch: any = useDispatch();
  const history: ReturnType<typeof useHistory> = useHistory();
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
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
      const response: any = await getAppModulesPermissions();
      const menusWithPermission: IApplicationMenu[] = getMenus(response.data, allMenus);
      menuFilterHandler(menusWithPermission);
    } catch {
      menuFilterHandler([]);
    }
  };

  const menuFilterHandler: (menus: IApplicationMenu[]) => IApplicationMenu[] = (menus: IApplicationMenu[]) => {
    startRequest();
    const modules: IAppModule[] = filterAndMapModules(menus);
    if (menus.length !== ApplicationConfig.getDefaultMenus().length) {
      dispatch(saveAppPermission(modules));
    }
    return menus;
  };

  const filterAndMapModules: (menus: IApplicationMenu[]) => IAppModule[] = (menus: IApplicationMenu[]) => {
    const filteredModules: IApplicationMenu[] = menus.filter(
      (x) => !x.allowedRoles.includes("admin")
    );
     /* eslint-disable */
    return filteredModules.map((x) => ({
      appUrl: x.isStandalone === false ? x.relativePath : x.absolutePath,
      title: t(`slices.${x.appCode}.title`),
      description: t(`slices.${x.appCode}.description`),
      code: x.appCode,
      canView: true,
      linkText: t(`slices.${x.appCode}.linkText`),
      link: t(`slices.${x.appCode}.link`)
    }));
  };
    /* eslint-enable */
  const onAuthenticated: any = () => {
    /* istanbul ignore next */
    if (authService.isAuthenticated()) {
      service.init();
      setIsServiceInitiated(true);
    }
    /* istanbul ignore next */
    else{
      authService.logOut();
      history.push("/auth");
    }
  };


  const hasAdminConsoleFlagrPermission: boolean = hasFeaturePermission(`${envConfig.APPLICATION}`, "AdminConsoleView");
  const hasUAMPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "UAMView"
  );
  const hasRefreshDBPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "RefreshDBORG"
  );

  const hasRefreshDBOrgPermission: boolean = isOrganisationInVariant("RefreshDBORG");
  const hasUAMOrgPermission: boolean = isOrganisationInVariant("UAMView");


  const hasNewHomePagePermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage", Operation: "View" }],
    MatchPermissions.all
  );
  const hasTeacherPermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage.Teacher", Operation: "View" }],
    MatchPermissions.all
  );
  const hasSLTPermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage.SLT", Operation: "View" }],
    MatchPermissions.all
  );
  const hasAdminPermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage.Admin", Operation: "View" }],
    MatchPermissions.all
  );
  const hasAdminConsolePermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.AdminConsole", Operation: "View" }],
    MatchPermissions.all
  );

  return (
    /* eslint-disable react/prop-types */
    <Router basename={baseRouteName}>
      {isStandaloneApp && (
        <Header
          isRenderOnFrame
          menuFilterHandler={menuFilterHandler}
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
          {/* eslint-disable */}
          <ProtectedRoute
            onAuthenticated={onAuthenticated}
            exact
            path="/"
            component={
              isServiceInitiated
                ? renderHomePage(
                    hasNewHomePagePermission,
                    hasTeacherPermission,
                    hasSLTPermission,
                    hasAdminPermission
                  )
                : EmptyComponent
            }
          />
           {/* eslint-enable */}
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          <ProtectedRoute exact path="/unauthorized" component={UnAuthorisedAccess} />
          {hasAdminConsoleFlagrPermission && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
              path="/AdminConsole"
              render={() => hasAdminConsolePermissions ? <AdminConsole /> : <Redirect to="/unauthorized" />}
            />
          )}
          {hasAdminConsoleFlagrPermission && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
              path="/documents"
              render={() => hasAdminConsolePermissions ? <DocumentManagementServer /> : <Redirect to="/unauthorized" />}
            />
          )}
          {hasUAMOrgPermission && hasUAMPermission && <ProtectedRoute exact path="/uam" component={UAM} />}
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <ProtectedRoute
              exact
              path="/adminConsole/userManagement"
              render={() => <EarlyAdpterPage /> }
            />
          <ProtectedRoute exact path="/schoolRedirect" component={SchoolGroupRedirect} />
          {hasRefreshDBOrgPermission && hasRefreshDBPermission &&<ProtectedRoute exact path="/dbmanagement" component={DBManagement} />}
          {<ProtectedRoute exact path="/InviteUsers" component={InviteUsersLogic} />}
          <ProtectedRoute exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};

const renderHomePage: (
  hasNewHomePagePermission: boolean,
  hasTeacherPermission: boolean,
  hasSLTPermission: boolean,
  hasAdminPermission: boolean
) => React.ComponentType<any> | undefined = (
  hasNewHomePagePermission: boolean,
  hasTeacherPermission: boolean,
  hasSLTPermission: boolean,
  hasAdminPermission: boolean
) => {
  /* istanbul ignore next */
  if (hasNewHomePagePermission && (hasTeacherPermission || hasSLTPermission || hasAdminPermission)) {
    return NewHomepageView;
  } /* eslint-disable */
  else if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
    return SIMSIDAdminPageView;
  } /* istanbul ignore next */
  else {
    return LandingPage;
  }
};

  {/* eslint-enable */}
/* istanbul ignore next */
const EmptyComponent: () => JSX.Element = () => (
  <div data-testid="empty-component" className=""/>
);