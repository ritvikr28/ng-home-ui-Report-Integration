import React,{ Suspense, lazy, LazyExoticComponent, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProtectedRoute, Auth, authService, Permission, MatchPermissions } from "@essnextgen/auth-ui";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  useHistory
 } from "react-router-dom";
import {
  Header,
  IApplicationMenu,
  ApplicationConfig,
  IModulePermission
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
import { isOrganisationInVariant } from "./shared/utils/flagr-utils";
import NewHomepageView from "./pages/NewHomePage/NewHomePage.view";
import { getUser, service } from "./shared/utils";
import gtmAnalytics from "./shared/utils/analytics";
import SLTmockpage from "./features/SLTView/SLTmockpage";



const LandingPage: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./pages/LandingPage")
);
const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);
const PageNotFound: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/PageNotFound/PageNotFound")
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
        appUrl: x.isStandalone === false ? x.relativePath: x.absolutePath,
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

  const hasFlagrPermission:boolean=(hasFeaturePermission('NewHomePage') &&
  isOrganisationInVariant());
  const requiredPermissions: Permission[] = [
    {
      Securable: "NG.Homepage",
      Operation: "View"
    }
  ];
  const history = useHistory();
  const showNewHomePage:boolean =  authService.isAuthorised(requiredPermissions, MatchPermissions.all);
  const onAuthenticated: any = () => {

    if (authService.isAuthenticated()) {
      service.init();     
      gtmAnalytics.pushEvent({
        event: "identify_user",
        userId: getUser()
      })
      gtmAnalytics.pushEvent({
        event: "identify_group",
        userId: getUser()
      })
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
          <ProtectedRoute onAuthenticated={onAuthenticated} exact path="/" component={isServiceInitiated?
             (hasFlagrPermission && showNewHomePage? NewHomepageView          
            :LandingPage ):EmptyComponent} />
          {/* eslint-enable */}
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          <ProtectedRoute exact path="/slt-view" component={SLTmockpage} />
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          {isStandaloneApp && <Route exact path="*" component={PageNotFound} />}
        </Switch>
      </Suspense>
    </Router>
  );
};
