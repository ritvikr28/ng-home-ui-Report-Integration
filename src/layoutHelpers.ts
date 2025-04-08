import React from "react";
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { IApplicationMenu, IModulePermission } from "@essnextgen/ui-application-kit";
import { envConfig, isAuthzUserAdmin } from "./shared/utils";
import { isOrganisationInVariant } from "./shared/utils/flagr-utils";
import NewHomepageView from "./pages/NewHomePage/NewHomePage.view";
import LandingPage from "./pages/LandingPage";
import SIMSIDAdminPageView from "./pages/SIMSIDAdminPage/SIMSIDAdminPage.view";

export const hasPermission = (securable: string, operation: string): boolean =>
    authService.isAuthorised([{ Securable: securable, Operation: operation }], MatchPermissions.all);

export const hasFeatureFlag = (feature: string): boolean =>
    hasFeaturePermission(`${envConfig.APPLICATION}`, feature);

export const hasOrgVariant = (variant: string): boolean => isOrganisationInVariant(variant);

export const renderHomePage = (
    hasNewHomePagePermission: boolean,
    hasTeacherPermission: boolean,
    hasSLTPermission: boolean,
    hasAdminPermission: boolean
): React.ComponentType<any> | undefined => {
    if (hasNewHomePagePermission && (hasTeacherPermission || hasSLTPermission || hasAdminPermission)) {
        return NewHomepageView;
    }
    if (!hasNewHomePagePermission && isAuthzUserAdmin()) {
        return SIMSIDAdminPageView;
    }
    return LandingPage;
};

export const getMenus = (
    data: IModulePermission[],
    globalMenus: IApplicationMenu[]
): IApplicationMenu[] =>
    globalMenus.filter((menu) =>
        data.some(
            (x) => x.code === menu.appCode || menu.allowedRoles.includes("admin")
        )
    );

export const menuFilterHandler = (
    menus: IApplicationMenu[],
    t: (key: string) => string
): IApplicationMenu[] => {
   // eslint-disable-next-line
    const modules = filterAndMapModules(menus, t);
    return menus;
};

export const filterAndMapModules = (
    menus: IApplicationMenu[],
    t: (key: string) => string
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
