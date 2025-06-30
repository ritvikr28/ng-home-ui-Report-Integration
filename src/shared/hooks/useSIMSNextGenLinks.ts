import { useEffect, useState } from "react";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { service } from "../utils/api-service";

export interface SIMSNextGenLink {
  name: string;
  code: string;
  link: string;
  organisationId: string;
}

export const useSIMSNextGenLinks = (): {
  hasConnectedLauncher: boolean;
  error: boolean;
  isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasConnectedLauncher, setHasConnectedLauncher] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchLinks = async () => {
      if (!isLoading) return;

      try {
        const response = await service.get('v1/SIMSConnected/simsnextgenlinks');
        const apiMenus = response.data || [];
        const launcherInApi = apiMenus.find((menu: SIMSNextGenLink) => menu.code === "SIMSConnectedLauncher");

        if (!launcherInApi) {
          setHasConnectedLauncher(false);
          setIsLoading(false);
          return;
        }

        const hasValidLink = Boolean(launcherInApi.link && launcherInApi.link.trim());
        const isExcluded = hasFeaturePermission("ExcludedSIMSNextGenLinks", "SIMSConnectedLauncher");

        setHasConnectedLauncher(hasValidLink && !isExcluded);
        setIsLoading(false);
        setError(false);
      } catch (err) {
        console.log('[useSIMSNextGenLinks] Error fetching links:', err);
        setError(true);
        setHasConnectedLauncher(false);
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [isLoading]);

  return { hasConnectedLauncher, error, isLoading };
}; 