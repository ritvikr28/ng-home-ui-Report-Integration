import { Suspense, lazy, LazyExoticComponent, FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProtectedRoute, Auth } from "@essnextgen/auth-ui";
import {
  Switch,
  Route,
  BrowserRouter as Router
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
import { NewHomepageView } from "./pages/NewHomePage/NewHomePage.view";
import { isOrganisationInVariant } from "./shared/utils/flagr-utils";
import { envConfig } from "./shared/utils";



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

  const hasFlagrPermission:boolean=(hasFeaturePermission('NewHomePage') &&
  isOrganisationInVariant())

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
          
          { (envConfig.REACT_ENVIRONMENT==="Development" || envConfig.REACT_ENVIRONMENT==="localhost")? false: !hasFlagrPermission && <ProtectedRoute exact path="/new-home" component={NewHomepageView}  />}
          <ProtectedRoute exact path="/" component={
             hasFlagrPermission? NewHomepageView          
            :LandingPage} />
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          {isStandaloneApp && <Route exact path="*" component={PageNotFound} />}
        </Switch>
      </Suspense>
    </Router>
  );
};
