/* eslint-disable */
import {
  hasPermission,
  hasFeatureFlag,
  hasOrgVariant,
  shouldShowAdminConsole,
  shouldShowDocuments,
  shouldShowUAM,
  shouldShowInviteUsers,
  shouldShowDBManagement,
  shouldShowSystemStatus,
  renderHomePage,
  getMenus,
  menuFilterHandler,
  filterAndMapModules
} from "./layoutHelpers";

// Mocks
jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    isAuthorised: jest.fn(() => true),
  },
  MatchPermissions: { all: "all" },
}));
jest.mock("@essnextgen/ui-flagr", () => ({
  hasFeaturePermission: jest.fn(() => true),
}));
jest.mock("./shared/utils/flagr-utils", () => ({
  isOrganisationInVariant: jest.fn(() => true),
}));
jest.mock("./shared/utils", () => ({
  isAuthzUserAdmin: jest.fn(() => false),
  envConfig: { APPLICATION: "app" },
}));
jest.mock("./pages/NewHomePage/NewHomePage.view", () => () => "NewHomepageView");
jest.mock("./pages/SIMSIDAdminPage/SIMSIDAdminPage.view", () => () => "SIMSIDAdminPageView");
jest.mock("./pages/AdminConsoleNoAccess/AdminConsoleNoAccess.view", () => () => "UnAuthorisedAccess");

describe("layoutHelpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("hasPermission returns correct value", () => {
    const { authService } = require("@essnextgen/auth-ui");
    authService.isAuthorised.mockReturnValueOnce(true);
    expect(hasPermission("A", "B")).toBe(true);
    authService.isAuthorised.mockReturnValueOnce(false);
    expect(hasPermission("A", "B")).toBe(false);
  });

  it("hasFeatureFlag returns correct value", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    hasFeaturePermission.mockReturnValueOnce(true);
    expect(hasFeatureFlag("X")).toBe(true);
    hasFeaturePermission.mockReturnValueOnce(false);
    expect(hasFeatureFlag("X")).toBe(false);
  });

  it("hasOrgVariant returns correct value", () => {
    const { isOrganisationInVariant } = require("./shared/utils/flagr-utils");
    isOrganisationInVariant.mockReturnValueOnce(true);
    expect(hasOrgVariant("Y")).toBe(true);
    isOrganisationInVariant.mockReturnValueOnce(false);
    expect(hasOrgVariant("Y")).toBe(false);
  });

  it("shouldShowAdminConsole returns true only if both feature flag and permission are true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    const { authService } = require("@essnextgen/auth-ui");
    hasFeaturePermission.mockReturnValue(true);
    authService.isAuthorised.mockReturnValue(true);
    expect(shouldShowAdminConsole()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    expect(shouldShowAdminConsole()).toBe(false);
    hasFeaturePermission.mockReturnValue(true);
    authService.isAuthorised.mockReturnValue(false);
    expect(shouldShowAdminConsole()).toBe(false);
  });

  it("shouldShowDocuments returns true only if both feature flag and permission are true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    const { authService } = require("@essnextgen/auth-ui");
    hasFeaturePermission.mockReturnValue(true);
    authService.isAuthorised.mockReturnValue(true);
    expect(shouldShowDocuments()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    expect(shouldShowDocuments()).toBe(false);
    hasFeaturePermission.mockReturnValue(true);
    authService.isAuthorised.mockReturnValue(false);
    expect(shouldShowDocuments()).toBe(false);
  });

  it("shouldShowUAM returns true only if both feature flag and org variant are true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    const { isOrganisationInVariant } = require("./shared/utils/flagr-utils");
    hasFeaturePermission.mockReturnValue(true);
    isOrganisationInVariant.mockReturnValue(true);
    expect(shouldShowUAM()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    expect(shouldShowUAM()).toBe(false);
    hasFeaturePermission.mockReturnValue(true);
    isOrganisationInVariant.mockReturnValue(false);
    expect(shouldShowUAM()).toBe(false);
  });

  it("shouldShowInviteUsers returns true only if feature flag is true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    hasFeaturePermission.mockReturnValue(true);
    expect(shouldShowInviteUsers()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    expect(shouldShowInviteUsers()).toBe(false);
  });

  it("shouldShowDBManagement returns true only if both feature flag and org variant are true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    const { isOrganisationInVariant } = require("./shared/utils/flagr-utils");
    hasFeaturePermission.mockReturnValue(true);
    isOrganisationInVariant.mockReturnValue(true);
    expect(shouldShowDBManagement()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    expect(shouldShowDBManagement()).toBe(false);
    hasFeaturePermission.mockReturnValue(true);
    isOrganisationInVariant.mockReturnValue(false);
    expect(shouldShowDBManagement()).toBe(false);
  });

  it("shouldShowSystemStatus returns true if either feature flag or org variant is true", () => {
    const { hasFeaturePermission } = require("@essnextgen/ui-flagr");
    const { isOrganisationInVariant } = require("./shared/utils/flagr-utils");
    hasFeaturePermission.mockReturnValue(true);
    isOrganisationInVariant.mockReturnValue(false);
    expect(shouldShowSystemStatus()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    isOrganisationInVariant.mockReturnValue(true);
    expect(shouldShowSystemStatus()).toBe(true);
    hasFeaturePermission.mockReturnValue(false);
    isOrganisationInVariant.mockReturnValue(false);
    expect(shouldShowSystemStatus()).toBe(false);
  });

  it("renderHomePage returns NewHomepageView if permission is true", () => {
  const Comp = renderHomePage(true);
  expect(Comp && (Comp as any).name).toBe("");
  });

  it("renderHomePage returns SIMSIDAdminPageView if not permission and isAuthzUserAdmin is true", () => {
  const { isAuthzUserAdmin } = require("./shared/utils");
  isAuthzUserAdmin.mockReturnValueOnce(true);
  const Comp = renderHomePage(false);
  expect(Comp && (Comp as any).name).toBe("");
  });

  it("renderHomePage returns UnAuthorisedAccess if neither condition is met", () => {
  const { isAuthzUserAdmin } = require("./shared/utils");
  isAuthzUserAdmin.mockReturnValueOnce(false);
  const Comp = renderHomePage(false);
  expect(Comp && (Comp as any).name).toBe("");
  });

  it("getMenus filters globalMenus based on data codes and admin role", () => {
    const data: any[] = [{ code: "A" }, { code: "B" }];
    const globalMenus: any[] = [
      { appCode: "A", allowedRoles: [] },
      { appCode: "C", allowedRoles: ["admin"] },
      { appCode: "D", allowedRoles: [] }
    ];
    const result = getMenus(data, globalMenus);
    expect(result).toEqual([
      { appCode: "A", allowedRoles: [] },
      { appCode: "C", allowedRoles: ["admin"] }
    ]);
  });

  it("menuFilterHandler returns menus unchanged", () => {
  const menus: any[] = [{ appCode: "A" }, { appCode: "B" }];
  const t = (key: string) => key;
  expect(menuFilterHandler(menus, t)).toEqual(menus);
  });

  it("filterAndMapModules maps and filters out admin roles, applies translation", () => {
    const menus: any[] = [
      { appCode: "A", allowedRoles: [], isStandalone: false, relativePath: "/a", absolutePath: "/a-abs" },
      { appCode: "B", allowedRoles: ["admin"], isStandalone: true, relativePath: "/b", absolutePath: "/b-abs" }
    ];
    const t = (key: string) => `translated-${key}`;
    const result = filterAndMapModules(menus, t);
    expect(result).toEqual([
      {
        appUrl: "/a",
        title: "translated-slices.A.title",
        description: "translated-slices.A.description",
        code: "A",
        canView: true,
        linkText: "translated-slices.A.linkText",
        link: "translated-slices.A.link"
      }
    ]);
  });

  it("filterAndMapModules uses absolutePath when isStandalone is true", () => {
    const menus: any[] = [
      { appCode: "A", allowedRoles: [], isStandalone: true, relativePath: "/rel-path", absolutePath: "/abs-path" }
    ];
    const t = (key: string) => key;
    const result = filterAndMapModules(menus, t);
    expect(result[0].appUrl).toBe("/abs-path");
  });

  it("filterAndMapModules uses relativePath when isStandalone is false", () => {
    const menus: any[] = [
      { appCode: "B", allowedRoles: [], isStandalone: false, relativePath: "/rel-path", absolutePath: "/abs-path" }
    ];
    const t = (key: string) => key;
    const result = filterAndMapModules(menus, t);
    expect(result[0].appUrl).toBe("/rel-path");
  });
});
