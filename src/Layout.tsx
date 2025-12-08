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
  // ActionCard,
  // Button,
  // ButtonColor,
  // ButtonSize,
  // Divider,
  // ErrorActionList,
  // ErrorActionListItem,
  // Grid,
  // GridItem,
  // Link,
  Loader,
  LoaderType
  // useMediaQuery
} from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { saveAppPermission, startRequest } from "./actions/storeActions";
import { IAppModule } from "./types/AppPermission";
import NewHomepageView from "./pages/NewHomePage/NewHomePage.view";
import { envConfig, getUserOrganisation, isAuthzUserAdmin, service } from "./shared/utils";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AdminConsole from "./features/AdminConsole/AdminConsole.view";
import DBManagement from "./features/DBManagement/DBManagement.view";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";
import UnAuthorisedAccess from "./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view";
import UAM from "./features/AdminConsole/UAM.view";
import {
  isOrganisationExcludedInVariant,
  isOrganisationInVariant,
  isOrganisationInVariantForAnyOrAll
} from "./shared/utils/flagr-utils";
import EarlyAdpterPage from "./pages/EarlyAdopter/EarlyAdopterPage.view";
import DocumentManagementServer from "./features/DocumentManagementServer/DocumentManagementServer.view";
import InviteUsersLogic from "./pages/InviteUsers";
import SystemStatus from "./features/SystemStatusAlerts/SystemStatus.view";
// import SIMSConnectedLauncher from "./shared/components/Notification-menu/SIMSConnectedLauncherBanner";
// import { SectionTitle } from "./shared/components/SectionTitle/SectionTitle";
import { useSimsConnectedBanner } from "./shared/hooks/useSimsConnectedBanner";
import NotificationsLogic from "./features/MainPanel/Notifications/Notifications.logic";

// interface HomePageForSimsConnectedNormalUserProps {
//   isRenderSimsConnectedBanner: boolean;
// }

const NoAccess: LazyExoticComponent<FC<{}>> = lazy(
  () => import("./pages/NoAccess")
);

export const sendNotificationFlagr: boolean = hasFeaturePermission(
  `${envConfig.APPLICATION}`,
  "SendNotification"
);

export const HomePageVideoFlagr: boolean = hasFeaturePermission(
  `${envConfig.APPLICATION}`,
  "HomePageVideoFlag"
);

export const homepageVideoOrgViewExcluded: boolean =
  isOrganisationExcludedInVariant("HomePageVideoFlag") || false;


export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

declare global {
  interface Window {
    userpilot: any;
    sharedStorage: any;
  }
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
  const [isRenderSimsConnectedBanner] = useSimsConnectedBanner();
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

  const hasInviteUserOrgView: boolean =
    isOrganisationInVariant("InviteUserView");

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
  const canViewSystemStatus = authService.isAuthorised(
    requiredSystemStatusViewPermission,
    MatchPermissions.any
  );
  const canUpdateSystemStatus = authService.isAuthorised(
    requiredSystemStatusUpdatePermission,
    MatchPermissions.any
  );

  console.log("HomePageVideoFlagr in Layout", { homepageVideoOrgViewExcluded, orgId: getUserOrganisation() });

  return (
    /* eslint-disable react/prop-types */
    <Router basename={baseRouteName}>
      {isStandaloneApp && (
        <Header
          isRenderOnFrame
          menuFilterHandler={menuFilterHandler}
          onClickLogo={() => {}}
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
                    hasNewHomePagePermission,
                    isRenderSimsConnectedBanner
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
          {hasAdminConsoleFlagrPermission && (
            <ProtectedRoute
              exact
              /* istanbul ignore next */
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
              /* istanbul ignore next */
              path="/documents"
              render={() =>
                (hasAdminConsolePermissions && hasDMSPermissions) ? (
                  <DocumentManagementServer />
                ) : (
                  <Redirect to="/unauthorized" />
                )
              }
            />
          )}
          <ProtectedRoute exact path="/uam" component={UAM} />
          {/* {sendNotificationFlagr && (
            <ProtectedRoute
              exact
              path="/notification"
              component={SendNotification}
            />
          )} */}
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
          {hasSystemStatusPermission && hasSystemStatusOrgPermission && (
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
          )}
          <ProtectedRoute
            exact
            /* istanbul ignore next */
            path="/inviteusers"
            render={() =>
              hasInviteUserOrgView &&
              (isAuthzUserAdmin() || hasInviteUserPermissions) ? (
                <InviteUsersLogic />
              ) : (
                <Redirect to="/unauthorized" />
              )
            }
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
  isRenderSimsConnectedBanner: boolean
) => React.ComponentType<any> | undefined = (
  hasNewHomePagePermission: boolean
  // isRenderSimsConnectedBanner: boolean
) => {
  // if (!isAuthzUserAdmin() && !hasNewHomePagePermission) {
  //   return () => (
  //     <HomePageForSimsConnectedNormalUser
  //       isRenderSimsConnectedBanner={isRenderSimsConnectedBanner}
  //     />
  //   );
  // }
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

/* istanbul ignore next */
// const HomePageForSimsConnectedNormalUser: React.FC<
//   HomePageForSimsConnectedNormalUserProps
// > = ({ isRenderSimsConnectedBanner }) => {
//   const rel: any = { rel: "noopener noreferrer" };
//   const onCardClick: () => void = () => {};
//   const { t }: UseTranslationResponse<"translation", undefined> =
//     useTranslation();
//   const isMobileView: boolean = useMediaQuery("(max-width: 767.9px)");
//   const onButtonClick: () => void = () => {
//     const anchor: HTMLAnchorElement = document.createElement("a");
//     anchor.href =
//       "https://help.parentpaygroup.com/csm/en/sims-next-gen-videos?id=kb_article_view&sysparm_article=KB0012323";
//     anchor.target = "_blank";
//     anchor.rel = "noopener noreferrer";
//     anchor.click();
//   };
//   return (
//     <div className="home-page-for-sims-connected-normal-user-wrapper">
//       <Grid container className="gap-24">
//         {isRenderSimsConnectedBanner && (
//           <GridItem sm={12} md={12} lg={12} xl={12} xxl={12} className="mt-16">
//             <SIMSConnectedLauncher />
//           </GridItem>
//         )}
//         <GridItem
//           sm={12}
//           md={12}
//           lg={12}
//           xl={12}
//           xxl={12}
//           className="welcome-heading-container"
//         >
//           <div>
//             <span className="welcome-heading">
//               {t("HomePageForSimsConnectedNormalUser.welcomeToSims")}
//             </span>
//           </div>
//         </GridItem>
//         <GridItem sm md lg>
//           <Grid className="new-sims-uppersection sims-next-gen-update-wrapper">
//             <GridItem sm md lg className="new-sims-uppersection">
//               <SectionTitle title={t("discoverMore.simsupdatetext")} />
//             </GridItem>

//             <GridItem sm md lg className="new-sims-discoverbtn">
//               <Button
//                 color={ButtonColor.Secondary}
//                 dataTestId="btn-save"
//                 onClick={onButtonClick}
//                 size={ButtonSize.Small}
//               >
//                 <span className="new-discoverbtn-style">
//                   {isMobileView
//                     ? t("discoverMore.mobilesimsupdatetext")
//                     : t("discoverMore.mobilesimsupdatemoretext")}
//                 </span>
//               </Button>
//             </GridItem>
//           </Grid>
//         </GridItem>
//         <GridItem sm={12} md={12} lg={12} xl={12} xxl={12}>
//           <Grid className="action-card-container-closeview sims-ng">
//             {hasFeaturePermission(`${envConfig.APPLICATION}`, "VideoTile") && (
//               <GridItem sm={12} lg md={12} className="what-new-sims">
//                 <Link
//                   dataTestId="link1"
//                   href="https://fast.wistia.com/embed/channel/3q9dzfvekg"
//                   target="_blank"
//                   {...rel}
//                 >
//                   <ActionCard
//                     className="primary-text"
//                     dataTestId="what-new-videos-test-id"
//                     id="action-card"
//                     onClickActionCard={() => onCardClick()}
//                     primaryText={t("discoverMore.primaryvideotext")}
//                     secondaryText={t("discoverMore.secondaryvideotext")}
//                   />
//                 </Link>
//               </GridItem>
//             )}

//             <GridItem sm={12} lg md={12} className="what-new-sims">
//               <Link
//                 dataTestId="link2"
//                 href="https://help.parentpaygroup.com/csm?id=ppg_emp_taxonomy_topic_customer&topic_id=6120c5de1b335250dffc2f04b24bcb12&in_context=true"
//                 target="_blank"
//                 {...rel}
//               >
//                 <ActionCard
//                   className="primary-text"
//                   dataTestId="what-new-test-id"
//                   id="action-card"
//                   onClickActionCard={() => onCardClick()}
//                   primaryText={t("discoverMore.primarytext")}
//                   secondaryText={t("discoverMore.secondarytext")}
//                 />
//               </Link>
//             </GridItem>
//             <GridItem sm={12} lg md={12} className="what-new-sims action-card">
//               <Link
//                 dataTestId="link2"
//                 href="https://help.parentpaygroup.com/csm/en/%25short_descr?id=copy_of_kb_article_view_1&sysparm_article=KB0012256"
//                 target="_blank"
//                 {...rel}
//               >
//                 <ActionCard
//                   className="primary-text"
//                   dataTestId="test-id"
//                   id="action-card"
//                   onClickActionCard={() => onCardClick()}
//                   primaryText={t("discoverMore.primarytextsimsnextgen")}
//                   secondaryText={t("discoverMore.secondarytextsimsnextgen")}
//                 />
//               </Link>
//             </GridItem>
//           </Grid>
//         </GridItem>
//         <GridItem sm={12} md lg={12}>
//           <ErrorActionList
//             description={t(
//               "HomePageForSimsConnectedNormalUser.needAccessToSimsNextGen"
//             )}
//           >
//             <ErrorActionListItem
//               iconName="information"
//               title={t(
//                 "HomePageForSimsConnectedNormalUser.contactYourAdministrator"
//               )}
//             >
//               {t("HomePageForSimsConnectedNormalUser.subHeadingPartOne")}
//               <br />
//               {t("HomePageForSimsConnectedNormalUser.subHeadingPartTwo")}
//             </ErrorActionListItem>
//             <Divider />
//           </ErrorActionList>
//         </GridItem>
//       </Grid>
//     </div>
//   );
// };
