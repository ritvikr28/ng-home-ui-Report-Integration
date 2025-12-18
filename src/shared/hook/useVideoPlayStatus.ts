import { useState, useEffect } from "react";
import { fetchVideoPlayStatus } from "../services/videoPlayStatus";
import { homepageVideoOrgViewIncluded } from "../../Layout";

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
        console.log("=================>>>>>>>>>>>>>>>>", { homepageVideoOrgViewIncluded, isPlayed, apiError });
        if (homepageVideoOrgViewIncluded) {
          const result = await fetchVideoPlayStatus();
          console.log("response api-------------------", {result})
          if (result && result.success ) {
            const playedValue = result.isPlayed;
            console.log("played value-------------------", {type: typeof isPlayed,result});
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
