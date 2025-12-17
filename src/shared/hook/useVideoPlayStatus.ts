import { useState, useEffect } from "react";
import { fetchVideoPlayStatus } from "../services/videoPlayStatus";

export interface UseVideoPlayStatusResult {
  isPlayed: boolean;
  apiError: boolean;
}

export function useVideoPlayStatus(): UseVideoPlayStatusResult {
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    async function videoPlayStaus() {
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
    videoPlayStaus();
  }, [isPlayed, apiError]);

  return { isPlayed, apiError };
}
