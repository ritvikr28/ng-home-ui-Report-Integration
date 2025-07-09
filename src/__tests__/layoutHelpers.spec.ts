import * as authUi from '@essnextgen/auth-ui';
import * as layoutHelpers from '../layoutHelpers';
import * as flagrUtils from '../shared/utils/flagr-utils';

describe('layoutHelpers', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('hasPermission', () => {
    it('returns true if isAuthorised returns true', () => {
      jest.spyOn(authUi.authService, 'isAuthorised').mockReturnValue(true);
      expect(layoutHelpers.hasPermission('foo', 'bar')).toBe(true);
    });
    it('returns false if isAuthorised returns false', () => {
      jest.spyOn(authUi.authService, 'isAuthorised').mockReturnValue(false);
      expect(layoutHelpers.hasPermission('foo', 'bar')).toBe(false);
    });
  });

  describe('hasOrgVariant', () => {
    it('returns true if isOrganisationInVariant returns true', () => {
      jest.spyOn(flagrUtils, 'isOrganisationInVariant').mockReturnValue(true);
      expect(layoutHelpers.hasOrgVariant('variant')).toBe(true);
    });
    it('returns false if isOrganisationInVariant returns false', () => {
      jest.spyOn(flagrUtils, 'isOrganisationInVariant').mockReturnValue(false);
      expect(layoutHelpers.hasOrgVariant('variant')).toBe(false);
    });
  });

  describe('shouldShowAdminConsole', () => {
    it('returns true if hasFeatureFlag and hasPermission are true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(true);
      expect(layoutHelpers.shouldShowAdminConsole()).toBe(true);
    });
    it('returns false if hasFeatureFlag is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(true);
      expect(layoutHelpers.shouldShowAdminConsole()).toBe(false);
    });
    it('returns false if hasPermission is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(false);
      expect(layoutHelpers.shouldShowAdminConsole()).toBe(false);
    });
  });

  describe('shouldShowDocuments', () => {
    it('returns true if hasFeatureFlag and hasPermission are true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(true);
      expect(layoutHelpers.shouldShowDocuments()).toBe(true);
    });
    it('returns false if hasFeatureFlag is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(true);
      expect(layoutHelpers.shouldShowDocuments()).toBe(false);
    });
    it('returns false if hasPermission is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasPermission').mockReturnValue(false);
      expect(layoutHelpers.shouldShowDocuments()).toBe(false);
    });
  });

  describe('shouldShowUAM', () => {
    it('returns true if hasFeatureFlag and hasOrgVariant are true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(true);
      expect(layoutHelpers.shouldShowUAM()).toBe(true);
    });
    it('returns false if hasFeatureFlag is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(true);
      expect(layoutHelpers.shouldShowUAM()).toBe(false);
    });
    it('returns false if hasOrgVariant is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(false);
      expect(layoutHelpers.shouldShowUAM()).toBe(false);
    });
  });

  describe('shouldShowInviteUsers', () => {
    it('returns true if hasFeatureFlag is true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      expect(layoutHelpers.shouldShowInviteUsers()).toBe(true);
    });
    it('returns false if hasFeatureFlag is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      expect(layoutHelpers.shouldShowInviteUsers()).toBe(false);
    });
  });

  describe('shouldShowDBManagement', () => {
    it('returns true if hasFeatureFlag and hasOrgVariant are true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(true);
      expect(layoutHelpers.shouldShowDBManagement()).toBe(true);
    });
    it('returns false if hasFeatureFlag is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(true);
      expect(layoutHelpers.shouldShowDBManagement()).toBe(false);
    });
    it('returns false if hasOrgVariant is false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(false);
      expect(layoutHelpers.shouldShowDBManagement()).toBe(false);
    });
  });

  describe('shouldShowSystemStatus', () => {
    it('returns true if hasFeatureFlag is true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(true);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(false);
      expect(layoutHelpers.shouldShowSystemStatus()).toBe(true);
    });
    it('returns true if hasOrgVariant is true', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(true);
      expect(layoutHelpers.shouldShowSystemStatus()).toBe(true);
    });
    it('returns false if both are false', () => {
      jest.spyOn(layoutHelpers, 'hasFeatureFlag').mockReturnValue(false);
      jest.spyOn(layoutHelpers, 'hasOrgVariant').mockReturnValue(false);
      expect(layoutHelpers.shouldShowSystemStatus()).toBe(false);
    });
  });

  describe('getMenus', () => {
    it('filters menus based on permission and admin role', () => {
      const menus = [
        { appCode: 'a', allowedRoles: '', isStandalone: false, appName: 'A' },
        { appCode: 'b', allowedRoles: 'admin', isStandalone: false, appName: 'B' },
        { appCode: 'c', allowedRoles: '', isStandalone: false, appName: 'C' }
      ];
      const perms = [
        { code: 'a', key: 'a' },
        { code: 'c', key: 'c' }
      ];
      const result = layoutHelpers.getMenus(perms, menus as any);
      expect(result).toContainEqual(menus[0]);
      expect(result).toContainEqual(menus[1]); // admin always included
      expect(result).toContainEqual(menus[2]);
    });
  });

  describe('menuFilterHandler', () => {
    it('returns menus as is', () => {
      const menus = [{ appCode: 'a', allowedRoles: '', isStandalone: false, appName: 'A' }];
      const t = jest.fn();
      expect(layoutHelpers.menuFilterHandler(menus as any, t)).toBe(menus);
    });
  });

  describe('filterAndMapModules', () => {
    it('filters out admin and maps', () => {
      const menus = [
        { appCode: 'a', allowedRoles: 'admin', isStandalone: false, relativePath: '/a', absolutePath: '/a', appName: 'A' },
        { appCode: 'b', allowedRoles: '', isStandalone: false, relativePath: '/b', absolutePath: '/b', appName: 'B' }
      ];
      const t = jest.fn((k) => k);
      const result = layoutHelpers.filterAndMapModules(menus as any, t);
      expect(result.length).toBe(1);
      expect(result[0].appUrl).toBe('/b');
      expect(result[0].title).toBe('slices.b.title');
    });
  });
});