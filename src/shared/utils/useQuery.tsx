import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const useQuery: any = () => {
  const { search }: any = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export default useQuery;