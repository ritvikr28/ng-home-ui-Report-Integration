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
import { envConfig, getUserOrganisation, service } from "./shared/utils";
import SLTmockpage from "./features/SLTView/SLTmockpage";

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

  const hasFlagrPermission:boolean=(hasFeaturePermission(`${envConfig.APPLICATION}`,'NewHomePage') &&
  isOrganisationInVariant('NewHomePage'));
  const IsSLTFlagONPermission:boolean=hasFeaturePermission(`${envConfig.APPLICATION}`,'SLTView');
  const hasAdminFlagrPermission:boolean=(hasFeaturePermission(`${envConfig.APPLICATION}`,'AdminView') &&
  isOrganisationInVariant('AdminView'));
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
  
  const history = useHistory();
  const hasNewHomePagePermission:boolean =  authService.isAuthorised(requiredNewHomePagePermissions, MatchPermissions.all); 
  const hasTeacherPermission:boolean =  authService.isAuthorised(requiredTeacherPermissions, MatchPermissions.all); 
  const hasSLTPermission:boolean =  authService.isAuthorised(requiredSLTPermissions, MatchPermissions.all); 
  const hasAdminPermission:boolean= authService.isAuthorised(requiredAdminPermissions,MatchPermissions.all);
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
  const shouldRenderSLTView: boolean = organisationId.includes(getUserOrganisation());

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
             ((hasFlagrPermission && hasNewHomePagePermission && (hasTeacherPermission || (IsSLTFlagONPermission && hasSLTPermission) || (hasAdminFlagrPermission && hasAdminPermission)))? NewHomepageView :  LandingPage):EmptyComponent} />  
          {/* eslint-enable */}
          <ProtectedRoute exact path="/noAccess" component={NoAccess} />
          {shouldRenderSLTView && <ProtectedRoute exact path="/slt-view" component={SLTmockpage} />}
          {isStandaloneApp && <Route exact path="/auth" component={Auth} />}
          <Route exact path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
};