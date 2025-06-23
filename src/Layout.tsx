import React, { Suspense, lazy, LazyExoticComponent, FC, useState } from "react";
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
import DocumentManagementServer from "./features/DocumentManagementServer/DocumentManagementServer.view";
import InviteUsersLogic from "./pages/InviteUsers";
import SystemStatus from "./features/SystemStatusAlerts/SystemStatus.view";

const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);

export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

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
    sessionStorage.removeItem("IS_NAVIGATED_FROM_COVER");
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

const hasInviteUserView : boolean =  hasFeaturePermission(
  `${envConfig.APPLICATION}`,
  "InviteUserView"
);

  const hasAdminConsoleFlagrPermission: boolean = hasFeaturePermission(`${envConfig.APPLICATION}`, "AdminConsoleView");

  const hasRefreshDBPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "RefreshDBORG"
  );

  const hasRefreshDBOrgPermission: boolean = isOrganisationInVariant("RefreshDBORG");
  
  const hasSystemStatusPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "SystemStatusORG"
  );

  const hasSystemStatusOrgPermission: boolean = isOrganisationInVariant("SystemStatusORG");

  const hasNewHomePagePermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage", Operation: "View" }],
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
          onClickLogo={() => { } }
          useSchoolPermission simsMenuData={[]}        />
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
                    hasNewHomePagePermission
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
              render={() => hasAdminConsolePermissions || isAuthzUserAdmin() ? <AdminConsole /> : <Redirect to="/unauthorized" />}
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
          <ProtectedRoute exact path="/uam" component={UAM} />
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <ProtectedRoute
              exact
              path="/adminConsole/userManagement"
              render={() => <EarlyAdpterPage /> }
            />
          <ProtectedRoute exact path="/schoolRedirect" component={SchoolGroupRedirect} />
          {hasRefreshDBOrgPermission && hasRefreshDBPermission &&<ProtectedRoute exact path="/dbmanagement" component={DBManagement} />}
          {hasSystemStatusPermission || hasSystemStatusOrgPermission  &&<ProtectedRoute exact path="/systemstatus" component={SystemStatus} />}
          {hasInviteUserView && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
              path="/inviteusers"
              render={() => hasInviteUserView ? <InviteUsersLogic /> : <Redirect to="/unauthorized" />} 
            />
          )}
          <ProtectedRoute exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};

const renderHomePage: (
  hasNewHomePagePermission: boolean
) => React.ComponentType<any> | undefined = (
  hasNewHomePagePermission: boolean
) => {
  /* istanbul ignore next */
  if (hasNewHomePagePermission) {
    return NewHomepageView;
  } /* eslint-disable */
  else if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
    return SIMSIDAdminPageView;
  } /* istanbul ignore next */
  else {
    return UnAuthorisedAccess;
  }
};

  {/* eslint-enable */}
/* istanbul ignore next */
const EmptyComponent: () => JSX.Element = () => (
  <div data-testid="empty-component" className=""/>
);