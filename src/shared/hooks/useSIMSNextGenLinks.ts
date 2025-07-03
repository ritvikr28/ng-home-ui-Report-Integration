import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { service } from "../utils/api-service";

export interface SIMSNextGenLink {
  name: string;
  code: string;
  link: string;
  organisationId: string;
}

export const fetchLinks: () => Promise<boolean> = async () => {
  try {
    const response = await service.get('v1/SIMSConnected/simsnextgenlinks');
    const apiMenus = response.data || [];
    const launcherInApi = apiMenus.find((menu: SIMSNextGenLink) => menu.code === "SIMSConnectedLauncher");

    if (!launcherInApi) {
      return false;
    }

    const hasValidLink = Boolean(launcherInApi.link && launcherInApi.link.trim());
    const isExcluded = hasFeaturePermission("ExcludedSIMSNextGenLinks", "SIMSConnectedLauncher");

    return (hasValidLink && !isExcluded);
  } catch (err) {
    return false;
  }
};