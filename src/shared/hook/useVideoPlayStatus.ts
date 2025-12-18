import { useState, useEffect } from "react";
import { fetchVideoPlayStatus } from "../services/videoPlayStatus";
import { homepageVideoOrgViewIncluded } from "../../Layout";

export interface UseVideoPlayStatusResult {
  isPlayed: boolean;
  apiError: boolean;
}

export function useVideoPlayStatus(): UseVideoPlayStatusResult {
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("=================>>>>>>>>>>>>>>>>", { homepageVideoOrgViewIncluded, isPlayed, apiError });
        if (homepageVideoOrgViewIncluded && !isPlayed && !apiError) {
          const result = await fetchVideoPlayStatus();
          if (result && result.success) {
            const playedValue = String(result.isPlayed).toLowerCase() === "true";
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
