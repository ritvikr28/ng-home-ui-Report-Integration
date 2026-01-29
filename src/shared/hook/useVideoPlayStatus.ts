import React, { useState, useEffect } from "react";

import { fetchVideoPlayStatus, IVideoPlayStatusResult } from "../services/videoPlayStatus";
import { hasNewHomePagePermission } from "../../App";

export interface UseVideoPlayStatusResult {
  isPlayed: boolean;
  apiError: boolean;
}

export function useVideoPlayStatus(): UseVideoPlayStatusResult {
  const [isPlayed, setIsPlayed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [apiError, setApiError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        if (hasNewHomePagePermission) {
          const result: IVideoPlayStatusResult = await fetchVideoPlayStatus();
          if (result && result.success) {
            const playedValue: boolean = result.isPlayed;
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
