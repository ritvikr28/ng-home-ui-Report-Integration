import React, { useEffect, useState } from "react";

// import { fetchLinks } from "./useSIMSNextGenLinks";
// import { getCachedData } from "./cacheHelperFile";
// import { fetchLinks } from "./useSIMSNextGenLinks";
import { fetchLinks } from "./useSIMSNextGenLinks";

export function useSimsConnectedBanner(): [boolean, boolean] {
  const [isRenderSimsConnectedBanner, setRenderSimsConnectedBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isLoading, setIsLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimsConnectedLink: () => Promise<void> = async () => {
      setIsLoading(true);
      try {
        const isSimsConnectedcached = await fetchLinks();
        setRenderSimsConnectedBanner(!!isSimsConnectedcached);
      } catch (error) {
        // Optionally handle error
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSimsConnectedLink();
  }, []);

  return [isRenderSimsConnectedBanner, isLoading];
}
