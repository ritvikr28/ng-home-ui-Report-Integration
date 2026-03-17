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
    const apiMenus = response || [];
    const launcherInApi: SIMSNextGenLink | undefined = apiMenus.find((menu: SIMSNextGenLink) => menu.code === "SIMSConnectedLauncher");

    if (!launcherInApi) {
      return false;
    }

    const hasValidLink = Boolean(launcherInApi.link && launcherInApi.link.trim());
    return (hasValidLink);
  } catch (err) {
    console.error("Error fetching SIMS Next Gen links:", err);
    return false;
  }
};