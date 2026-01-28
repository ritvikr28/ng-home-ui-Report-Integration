import { useState, useEffect } from "react";
import { fetchVideoPlayStatus } from "../services/videoPlayStatus";
// import { homepageVideoOrgViewIncluded } from "../../Layout";
import { hasNewHomePagePermission } from "../../App";

export interface UseVideoPlayStatusResult {
  isPlayed: boolean;
  apiError: boolean;
}

export function useVideoPlayStatus(): UseVideoPlayStatusResult {
  const [isPlayed, setIsPlayed] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        // console.log("=================>>>>>>>>>>>>>>>>", { homepageVideoOrgViewIncluded, isPlayed, apiError });
        if (hasNewHomePagePermission) {
          const result = await fetchVideoPlayStatus();
          if (result && result.success) {
            const playedValue = result.isPlayed;
            setIsPlayed(playedValue);
            setApiError(false);
          } else {
            setIsPlayed(false);
            setApiError(true);
          }
        }
      } catch (error) {
        setIsPlayed(false);
        setApiError(true);
        console.log(error);
      }
    })();
  }, []);

  return { isPlayed, apiError };
}
