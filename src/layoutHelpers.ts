import React from "react";
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { IApplicationMenu, IModulePermission } from "@essnextgen/ui-application-kit";
import { envConfig, isAuthzUserAdmin } from "./shared/utils";
import { isOrganisationInVariant } from "./shared/utils/flagr-utils";
import NewHomepageView from "./pages/NewHomePage/NewHomePage.view";
import LandingPage from "./pages/LandingPage";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";

export const hasPermission: (securable: string, operation: string) => boolean =
    (securable, operation) =>
        authService.isAuthorised([{ Securable: securable, Operation: operation }], MatchPermissions.all);

export const hasFeatureFlag: (feature: string) => boolean =
    (feature) =>
        hasFeaturePermission(`${envConfig.APPLICATION}`, feature);

export const hasOrgVariant: (variant: string) => boolean =
    (variant) => isOrganisationInVariant(variant);


    export const shouldShowAdminConsole = () =>
        hasFeatureFlag("AdminConsoleView") && hasPermission("NG.AdminConsole", "View");
      
      export const shouldShowDocuments = () =>
        hasFeatureFlag("AdminConsoleView") && hasPermission("NG.AdminConsole", "View");
      
      export const shouldShowUAM = () =>
        hasFeatureFlag("UAMView") && hasOrgVariant("UAMView");
      
      export const shouldShowInviteUsers = () =>
        hasFeatureFlag("InviteUserView");
      
      export const shouldShowDBManagement = () =>
        hasFeatureFlag("RefreshDBORG") && hasOrgVariant("RefreshDBORG");
      

export const renderHomePage: (
    hasNewHomePagePermission: boolean,
    hasTeacherPermission: boolean,
    hasSLTPermission: boolean,
    hasAdminPermission: boolean
) => React.ComponentType<any> | undefined = (
    hasNewHomePagePermission,
    hasTeacherPermission,
    hasSLTPermission,
    hasAdminPermission
) => {
        if (hasNewHomePagePermission && (hasTeacherPermission || hasSLTPermission || hasAdminPermission)) {
            return NewHomepageView;
        }
        if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
            return SIMSIDAdminPageView;
        }
        return LandingPage;
    };

export const getMenus: (
    data: IModulePermission[],
    globalMenus: IApplicationMenu[]
) => IApplicationMenu[] = (
    data,
    globalMenus
) =>
        globalMenus.filter((menu) =>
            data.some(
                (x) => x.code === menu.appCode || menu.allowedRoles.includes("admin")
            )
        );

export const menuFilterHandler: (
    menus: IApplicationMenu[],
    t: (key: string) => string
) => IApplicationMenu[] = (
    menus,
    // eslint-disable-next-line
    t
) => // eslint-disable-next-line
    // const modules = filterAndMapModules(menus, t);
     menus;

export const filterAndMapModules: (
    menus: IApplicationMenu[],
    t: (key: string) => string
) => any[] = (
    menus,
    t
) =>
        menus
            .filter((x) => !x.allowedRoles.includes("admin"))
            .map((x) => ({
                appUrl: x.isStandalone === false ? x.relativePath : x.absolutePath,
                title: t(`slices.${x.appCode}.title`),
                description: t(`slices.${x.appCode}.description`),
                code: x.appCode,
                canView: true,
                linkText: t(`slices.${x.appCode}.linkText`),
                link: t(`slices.${x.appCode}.link`)
            }));
