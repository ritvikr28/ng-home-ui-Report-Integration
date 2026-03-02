/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  Suspense,
  lazy,
  LazyExoticComponent,
  FC,
  useState
} from "react";
import { useDispatch } from "react-redux";
import {
  ProtectedRoute,
  Auth,
  authService,
  MatchPermissions,
  Permission
} from "@essnextgen/auth-ui";
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
import {

  Loader,
  LoaderType
} from "@essnextgen/ui-kit";
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
// import UAM from "./features/AdminConsole/UAM.view";
import {
  isOrganisationInVariant,
  isOrganisationInVariantForAnyOrAll
} from "./shared/utils/flagr-utils";
import EarlyAdpterPage from "./pages/EarlyAdopter/EarlyAdopterPage.view";
import DocumentManagementServer from "./features/DocumentManagementServer/Views/DocumentManagementServer.view";
import InviteUsersLogic from "./pages/InviteUsers";
import SystemStatus from "./features/SystemStatusAlerts/SystemStatus.view";
// import { useSimsConnectedBanner } from "./shared/hooks/useSimsConnectedBanner";
import NotificationsLogic from "./features/MainPanel/Notifications/Notifications.logic";
import Sims7RedirectionsLayout from "./pages/Sims7Redirections/Sims7RedirectionsLayout.logic";

const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);

export const sendNotificationFlagr: boolean = hasFeaturePermission(
  `${envConfig.APPLICATION}`,
  "SendNotification"
);

export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

// declare global {
//   interface Window {
//     userpilot: any;
//     sharedStorage: any;
//   }
// }

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


  const hasSIMS7RedirectsOrgView: boolean =
    isOrganisationInVariant("Sims7RedirectsFlag");

  const hasAdminConsoleAccessPermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.AdminConsole.Access", Operation: "View" }],
    MatchPermissions.all
  );

  console.log('hasAdminConsoleAccessPermission', hasAdminConsoleAccessPermission);

  console.log('hasSIMS7RedirectsOrgView', hasSIMS7RedirectsOrgView);

const AdminConsoleandSystemStatusRoutes: ({ hasAdminConsoleFlagrPermission, hasAdminConsolePermissions, hasDMSPermissions }: {
  hasAdminConsoleFlagrPermission: boolean;
  hasAdminConsolePermissions: boolean;
  hasDMSPermissions: boolean;
  hasSystemStatusPermission: boolean;
  hasSystemStatusOrgPermission: boolean;
  canViewSystemStatus: boolean;
  canUpdateSystemStatus: boolean;
}) => JSX.Element = ({
  hasAdminConsoleFlagrPermission,
  hasAdminConsolePermissions,
  hasDMSPermissions,
  hasSystemStatusPermission,
  hasSystemStatusOrgPermission,
  canViewSystemStatus,
  canUpdateSystemStatus
}: {
  hasAdminConsoleFlagrPermission: boolean;
  hasAdminConsolePermissions: boolean;
  hasDMSPermissions: boolean;
  hasSystemStatusPermission: boolean;
  hasSystemStatusOrgPermission: boolean;
  canViewSystemStatus: boolean;
  canUpdateSystemStatus: boolean;
}): JSX.Element => (
    <>
      {hasAdminConsoleFlagrPermission && (
        <ProtectedRoute
          exact
          path="/AdminConsole"
          render={() =>
            hasAdminConsolePermissions || isAuthzUserAdmin() ? (
              <AdminConsole />
            ) : (
              <Redirect to="/unauthorized" />
            )
          }
        />
      )}
      {hasAdminConsoleFlagrPermission && (
        <ProtectedRoute
          exact
          path="/documents"
          render={() =>
            hasAdminConsolePermissions && hasDMSPermissions ? (
              <DocumentManagementServer />
            ) : (
              <Redirect to="/unauthorized" />
            )
          }
        />
      )}

       {hasAdminConsoleAccessPermission && (
        <ProtectedRoute
          exact
          path="/sims7redirections"
          render={() =>
            hasSIMS7RedirectsOrgView ? (
              <Sims7RedirectionsLayout />
            ) : (
              <Redirect to="/unauthorized" />
            )
          }
        />
      )}
       
      <SystemStatusRoute
        hasSystemStatusPermission={hasSystemStatusPermission}
        hasSystemStatusOrgPermission={hasSystemStatusOrgPermission}
        canViewSystemStatus={canViewSystemStatus}
        canUpdateSystemStatus={canUpdateSystemStatus}
      />
    </>
  );

const SystemStatusRoute: ({ hasSystemStatusPermission, hasSystemStatusOrgPermission, canViewSystemStatus, canUpdateSystemStatus }: {
  hasSystemStatusPermission: boolean;
  hasSystemStatusOrgPermission: boolean;
  canViewSystemStatus: boolean;
  canUpdateSystemStatus: boolean;
}) => JSX.Element | null = ({
  hasSystemStatusPermission,
  hasSystemStatusOrgPermission,
  canViewSystemStatus,
  canUpdateSystemStatus
}: {
  hasSystemStatusPermission: boolean;
  hasSystemStatusOrgPermission: boolean;
  canViewSystemStatus: boolean;
  canUpdateSystemStatus: boolean;
}): JSX.Element | null =>
    hasSystemStatusPermission && hasSystemStatusOrgPermission ? (
      <ProtectedRoute
        exact
        path="/systemstatus"
        render={() =>
          canViewSystemStatus || canUpdateSystemStatus ? (
            <SystemStatus />
          ) : (
            <UnAuthorisedAccess />
          )
        }
      />
    ) : null;


export const Layout: (props: ILayoutProps) => JSX.Element = ({
  isStandaloneApp,
  baseRouteName
}: ILayoutProps) => {
  // const [isRenderSimsConnectedBanner]: [boolean, boolean] = useSimsConnectedBanner();
  const dispatch: any = useDispatch();
  const history: ReturnType<typeof useHistory> = useHistory();
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  const [isServiceInitiated, setIsServiceInitiated]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const menuFilterHandler: (menus: IApplicationMenu[]) => IApplicationMenu[] = (
    menus: IApplicationMenu[]
  ) => {
    startRequest();
    const modules: IAppModule[] = filterAndMapModules(menus);
    if (menus.length !== ApplicationConfig.getDefaultMenus().length) {
      dispatch(saveAppPermission(modules));
    }
    return menus;
  };

  const filterAndMapModules: (menus: IApplicationMenu[]) => IAppModule[] = (
    menus: IApplicationMenu[]
  ) => {
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
    } else {
      /* istanbul ignore next */
      authService.logOut();
      history.push("/auth");
    }
  };

  const hasInviteUserPermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.UserManagement.Invite", Operation: "View" }],
    MatchPermissions.all
  );

  const hasAdminConsoleFlagrPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "AdminConsoleView"
  );

  const hasRefreshDBPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "RefreshDBORG"
  );

  const hasRefreshDBOrgPermission: boolean =
    isOrganisationInVariant("RefreshDBORG");

  const hasSystemStatusPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "SystemStatusORG"
  );
  const hasSystemStatusOrgPermission: boolean =
    isOrganisationInVariantForAnyOrAll("SystemStatusORG");

  const hasNewHomePagePermission: boolean = authService.isAuthorised(
    [{ Securable: "NG.Homepage.Access", Operation: "View" }],
    MatchPermissions.all
  );

  const hasAdminConsolePermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.AdminConsole.Access", Operation: "View" }],
    MatchPermissions.all
  );

  const hasDMSPermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.DocumentManagementServer.Documents", Operation: "View" }],
    MatchPermissions.all
  );

  const requiredSystemStatusViewPermission: Permission[] = [
    { Securable: "NG.AlertEmails.List", Operation: "View" }
  ];
  const requiredSystemStatusUpdatePermission: Permission[] = [
    { Securable: "NG.AlertEmails.List", Operation: "Update" },
    { Securable: "NG.AlertEmails.List", Operation: "Write" }
  ];
  const canViewSystemStatus: boolean = authService.isAuthorised(
    requiredSystemStatusViewPermission,
    MatchPermissions.any
  );
  const canUpdateSystemStatus: boolean = authService.isAuthorised(
    requiredSystemStatusUpdatePermission,
    MatchPermissions.any
  );

  return (
    /* eslint-disable react/prop-types */
    <Router basename={baseRouteName}>
      {isStandaloneApp && (
        <Header
          isRenderOnFrame
          menuFilterHandler={menuFilterHandler}
          onClickLogo={() => { }}
          useSchoolPermission
          simsMenuData={[]}
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
                  hasNewHomePagePermission
                )
                : EmptyComponent
            }
          />
          {/* eslint-enable */}
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          <ProtectedRoute
            exact
            path="/unauthorized"
            component={UnAuthorisedAccess}
          />
          {/* {hasAdminConsoleFlagrPermission && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
             /* path="/AdminConsole"
              render={() =>
                hasAdminConsolePermissions || isAuthzUserAdmin() ? (
                  <AdminConsole />
                ) : (
                  <Redirect to="/unauthorized" />
                )
              }
            />
          )} */}
          {/* {hasAdminConsoleFlagrPermission && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
              /* path="/documents"
              render={() =>
                (hasAdminConsolePermissions && hasDMSPermissions) ? (
                  <DocumentManagementServer />
                ) : (
                  <Redirect to="/unauthorized" />
                )
              }
            />
          )}
          {/* 
          Commenting this code as we already remove the flagr check on this route
          <ProtectedRoute exact path="/uam" component={UAM} />
          */}
          {sendNotificationFlagr && (
            <ProtectedRoute
              exact
              path="/notification-layout"
              component={NotificationsLogic}
            />
          )}

          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <ProtectedRoute
            exact
            path="/adminConsole/userManagement"
            render={() => <EarlyAdpterPage />}
          />
          <ProtectedRoute
            exact
            path="/schoolRedirect"
            component={SchoolGroupRedirect}
          />
          {hasRefreshDBOrgPermission && hasRefreshDBPermission && (
            <ProtectedRoute
              exact
              path="/dbmanagement"
              component={DBManagement}
            />
          )}
          {/* {hasSystemStatusPermission && hasSystemStatusOrgPermission && (
            <ProtectedRoute
              exact
              path="/systemstatus"
              render={() =>
                canViewSystemStatus || canUpdateSystemStatus ? (
                  <SystemStatus />
                ) : (
                  <UnAuthorisedAccess />
                )
              }
            />
          )} */}

          <ProtectedRoute
            exact
            /* istanbul ignore next */
            path="/inviteusers"
            render={() =>
              (isAuthzUserAdmin() || hasInviteUserPermissions) ? (
                <InviteUsersLogic />
              ) : (
                <Redirect to="/unauthorized" />
              )
            }
          />
          <AdminConsoleandSystemStatusRoutes
            hasAdminConsoleFlagrPermission={hasAdminConsoleFlagrPermission}
            hasAdminConsolePermissions={hasAdminConsolePermissions}
            hasDMSPermissions={hasDMSPermissions}
            hasSystemStatusPermission={hasSystemStatusPermission}
            hasSystemStatusOrgPermission={hasSystemStatusOrgPermission}
            canViewSystemStatus={canViewSystemStatus}
            canUpdateSystemStatus={canUpdateSystemStatus}
          />

          <ProtectedRoute exact path="*" component={PageNotFound} />

        </Switch>
      </Suspense>
    </Router>
  );
};

/* istanbul ignore next */
const renderHomePage: (
  hasNewHomePagePermission: boolean,
  isRenderSimsConnectedBanner?: boolean
) => React.ComponentType<any> | undefined = (
  hasNewHomePagePermission: boolean
) => {
    if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
      return SIMSIDAdminPageView;
    }
    if (hasNewHomePagePermission) {
      return NewHomepageView;
    }
    return UnAuthorisedAccess;
  };

/* eslint-enable */
/* istanbul ignore next */
const EmptyComponent: () => JSX.Element = () => (
  <div data-testid="empty-component" className="" />
);
