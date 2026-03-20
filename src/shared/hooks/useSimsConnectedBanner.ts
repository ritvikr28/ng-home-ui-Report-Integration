import React, { useEffect, useState } from "react";
import { fetchLinks } from "./useSIMSNextGenLinks";

export function useSimsConnectedBanner(): [boolean] {
  const [isRenderSimsConnectedBanner, setRenderSimsConnectedBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  useEffect(() => {
    const fetchSimsConnectedLink: () => Promise<void> = async () => {
     
      try {
        const isSimsConnectedcached = await fetchLinks();
        setRenderSimsConnectedBanner(!!isSimsConnectedcached);
      } catch (error) {        
        console.log(error);
      } 
    };
    fetchSimsConnectedLink();
  }, []);

  return [isRenderSimsConnectedBanner];
}
