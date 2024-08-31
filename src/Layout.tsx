import React,{ Suspense, lazy, LazyExoticComponent, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProtectedRoute, Auth, authService, Permission, MatchPermissions } from "@essnextgen/auth-ui";
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
import { envConfig, getUserOrganisation, isAuthzUserAdmin, service } from "./shared/utils";
import SLTmockpage from "./features/SLTView/SLTmockpage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";



const organisationId = [ "4b4eb751-c3f1-4a95-aade-d762b6c70693",
"29a88689-e51f-4928-aead-1a92402c1a09",
"54dbb8a7-9a07-48c5-92a3-014f13519f1d",
"133ba2ce-a183-4ef9-8db3-f073d7941660",
"d1ac710d-a8a4-4097-b30d-622c311dc535",
"e6795699-4584-4829-89dd-41c67a1b1bbf",
"ecb01589-7a16-44e3-8089-ebcdd9bc2458",
"b8fd9320-6b94-40e5-bbcc-88efd5974951",
"8e42af99-d37f-455b-bccd-20dffd8946ac",
"6f039714-5c4a-4ab4-ad2e-f22e1145fcce",
"ba8937a9-e63e-43ff-ada2-05a4eda64a6f",
"f1d00baf-1bc3-4e43-a3fd-ba8cd59465d3",
"c365ab78-ebba-4956-a2fa-11a967fb2cc6",
"cff91875-22fc-463c-be4c-cec9e86b5752",
"430c0edc-6482-476d-ae18-2eac23e57621",
"cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe",
"6607c902-d51d-4200-9740-f230bb1bc8c1",
"58df2bbd-1d47-4ea0-9613-aee79c442991",
"4b4eb751-c3f1-4a95-aade-d762b6c70693",
"ba8937a9-e63e-43ff-ada2-05a4eda64a6f"];

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
      const response = await getAppModulesPermissions();
      const menusWithPermission = getMenus(response.data, allMenus);
      menuFilterHandler(menusWithPermission);
    } catch {
      menuFilterHandler([]);
    }
  };

  const menuFilterHandler = (menus: IApplicationMenu[]) => {
    startRequest();
    const modules = filterAndMapModules(menus);
    if (menus.length !== ApplicationConfig.getDefaultMenus().length) {
      dispatch(saveAppPermission(modules));
    }
    return menus;
  };

  const filterAndMapModules = (menus: IApplicationMenu[]): IAppModule[] => {
    const filteredModules = menus.filter(
      (x) => !x.allowedRoles.includes("admin")
    );
     /* eslint-disable */
    return filteredModules.map((x) => ({
      appUrl: getAppUrl(x),
      title: t(`slices.${x.appCode}.title`),
      description: t(`slices.${x.appCode}.description`),
      code: x.appCode,
      canView: true,
      linkText: t(`slices.${x.appCode}.linkText`),
      link: t(`slices.${x.appCode}.link`),
    }));
  };
    /* eslint-enable */

  const getAppUrl = (x: IApplicationMenu) => {
    if (x.isStandalone === false) return x.relativePath;
    /* istanbul ignore next */
    if (x.appCode === "StaffProfile" && ["Development", "QA"].includes(envConfig.REACT_ENVIRONMENT))
      return "/staff";
    return x.absolutePath;
  };

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

  const shouldRenderSLTView: boolean = organisationId.includes(getUserOrganisation());
  const hasAdminConsoleFlagrPermission: boolean = hasFeaturePermission(`${envConfig.APPLICATION}`, "AdminConsoleView");

  const hasNewHomePagePermission = authService.isAuthorised(
    [{ Securable: "NG.Homepage", Operation: "View" }],
    MatchPermissions.all
  );
  const hasTeacherPermission = authService.isAuthorised(
    [{ Securable: "NG.Homepage.Teacher", Operation: "View" }],
    MatchPermissions.all
  );
  const hasSLTPermission = authService.isAuthorised(
    [{ Securable: "NG.Homepage.SLT", Operation: "View" }],
    MatchPermissions.all
  );
  const hasAdminPermission = authService.isAuthorised(
    [{ Securable: "NG.Homepage.Admin", Operation: "View" }],
    MatchPermissions.all
  );
  const hasAdminConsolePermissions = authService.isAuthorised(
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
          {shouldRenderSLTView && <ProtectedRoute exact path="/slt-view" component={SLTmockpage} />}
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <ProtectedRoute exact path="/schoolRedirect/:id" component={SchoolGroupRedirect} />
          <ProtectedRoute exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};

const renderHomePage = (
  hasNewHomePagePermission: boolean,
  hasTeacherPermission: boolean,
  hasSLTPermission: boolean,
  hasAdminPermission: boolean
) => {
    /* istanbul ignore next */
  if (hasNewHomePagePermission && (hasTeacherPermission || hasSLTPermission || hasAdminPermission)) {
    return NewHomepageView;
  } else if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
    return SIMSIDAdminPageView;
  }   /* istanbul ignore next */
  else {
    return LandingPage;
  }
};
/* istanbul ignore next */
const EmptyComponent: () => JSX.Element = () => (
  <div data-testid="empty-component" className=""/>
);