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
import { envConfig, isAuthzUserAdmin, service } from "./shared/utils";

import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";
import UAM from "./features/AdminConsole/UAM.view";





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
  const history = useHistory();
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
    const [isServiceInitiated, setIsServiceInitiated]: [
      boolean,
      React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData: () => Promise<void> = async () => {
      getAppModulesPermissions()
        .then((response: any) => {
          const menusWithPermission: IApplicationMenu[] = getMenus(
            response.data,
            allMenus
          );
          menuFilterHandler(menusWithPermission);
        })
        .catch(() => menuFilterHandler([]));
    };
    if (isStandaloneApp === false) {
      fetchAllData();     
    }    
  }, []);

  const menuFilterHandler: (
    menus: IApplicationMenu[]
  ) => (IApplicationMenu | undefined)[] = (menus: IApplicationMenu[]) => {
    startRequest();
    const filteredModules: IApplicationMenu[] = menus.filter(
      (x: IApplicationMenu) => !x.allowedRoles.includes("admin")
    );
    const modules: IAppModule[] = filteredModules.map(
      (x: IApplicationMenu) => ({
        /* eslint-disable */
        appUrl:  x.isStandalone === false ? x.relativePath: (x.appCode==="StaffProfile" && (envConfig.REACT_ENVIRONMENT==="Development" || envConfig.REACT_ENVIRONMENT==="QA" ))? "/staff": x.absolutePath,
         /* eslint-enable */
        title: t(`slices.${x.appCode}.title`),
        description: t(`slices.${x.appCode}.description`),
        code: x.appCode,
        canView: true,
        linkText: t(`slices.${x.appCode}.linkText`),
        link: t(`slices.${x.appCode}.link`)
      })
    );

    if (menus.length !== ApplicationConfig.getDefaultMenus().length) {
      dispatch(saveAppPermission(modules));
    }

    return menus;
  };

  const EmptyComponent: () => JSX.Element = () => (
    <div data-testid="empty-component" className=""/>
  );
  
  const hasAdminConsoleFlagrPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "AdminConsoleView"
  );
  const hasUAMPermission: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "UAMView"
  );
  
  const requiredNewHomePagePermissions: Permission[] = [
    {
      Securable: "NG.Homepage",
      Operation: "View"
    }
  ]; 
  const requiredSLTPermissions: Permission[] = [
    {
      Securable: "NG.Homepage.SLT",
      Operation: "View"
    }
  ]; 
  const requiredTeacherPermissions: Permission[] = [
    {
      Securable: "NG.Homepage.Teacher",
      Operation: "View"
    }
  ]; 
  const requiredAdminPermissions: Permission[] = [
    {
      Securable: "NG.Homepage.Admin",
      Operation: "View"
    }
  ]; 

  const requiredAdminConsolePermissions: Permission[] = [
    {
      Securable: "NG.AdminConsole",
      Operation: "View"
    }
  ];
  

  const hasNewHomePagePermission:boolean =  authService.isAuthorised(requiredNewHomePagePermissions, MatchPermissions.all); 
  const hasTeacherPermission:boolean =  authService.isAuthorised(requiredTeacherPermissions, MatchPermissions.all); 
  const hasSLTPermission:boolean =  authService.isAuthorised(requiredSLTPermissions, MatchPermissions.all); 
  const hasAdminPermission:boolean= authService.isAuthorised(requiredAdminPermissions,MatchPermissions.all);
  const hasAdminConsolePermissions:boolean= authService.isAuthorised(requiredAdminConsolePermissions,MatchPermissions.all);


  const isAuthzAdmin: boolean = isAuthzUserAdmin();
  const onAuthenticated: any = () => {
    if (authService.isAuthenticated()) {
      service.init();
      setIsServiceInitiated(true);
    } 
    else{
      authService.logOut();
      history.push("/auth");
    }
  };
  

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
        <ProtectedRoute onAuthenticated={onAuthenticated} exact path="/" component={isServiceInitiated ?
             ((hasNewHomePagePermission && (hasTeacherPermission || (hasSLTPermission) || (hasAdminPermission)))
             ? NewHomepageView : (!hasNewHomePagePermission && isAuthzAdmin)
             ? SIMSIDAdminPageView : LandingPage) : EmptyComponent} />  
          {/* eslint-enable */}
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          <ProtectedRoute exact path="/unauthorized" component={UnAuthorisedAccess} />
          {hasAdminConsoleFlagrPermission && <ProtectedRoute exact path="/AdminConsole" render={() => hasAdminConsolePermissions ? <AdminConsole /> : <Redirect to="/unauthorized"/>} />}
          
          {hasUAMPermission && <ProtectedRoute exact path="/uam" component={UAM} />}
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <ProtectedRoute onAuthenticated={onAuthenticated}  exact  path="/schoolRedirect/:id" render={() => <SchoolGroupRedirect />} />
          <ProtectedRoute exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};