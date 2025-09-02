import { useEffect, useState } from "react";
import { fetchLinks } from "./useSIMSNextGenLinks";

export function useSimsConnectedBanner(): [boolean, boolean] {
  const [isRenderSimsConnectedBanner, setRenderSimsConnectedBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimsConnectedLink = async () => {
      setIsLoading(true);
      try {
        const responseapidata = await fetchLinks();
        setRenderSimsConnectedBanner(!!responseapidata);
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
