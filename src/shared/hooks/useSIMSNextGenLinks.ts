import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { getCachedData } from "./cacheHelperFile";

export interface SIMSNextGenLink {
  name: string;
  code: string;
  link: string;
  organisationId: string;
}

export const fetchLinks: () => Promise<boolean> = async () => {
  try {
    const response: any = getCachedData("SIMS_CONNECTED_PERMISSIONS")
    // await service.get('v1/SIMSConnected/simsnextgenlinks');
    const apiMenus = response.data || [];
    const launcherInApi: SIMSNextGenLink | undefined = apiMenus.find((menu: SIMSNextGenLink) => menu.code === "SIMSConnectedLauncher");

    if (!launcherInApi) {
      return false;
    }

    const hasValidLink = Boolean(launcherInApi.link && launcherInApi.link.trim());
    const isExcluded: boolean = hasFeaturePermission("ExcludedSIMSNextGenLinks", "SIMSConnectedLauncher");

    return (hasValidLink && !isExcluded);
  } catch (err) {
    console.error("Error fetching SIMS Next Gen links:", err);
    return false;
  }
};