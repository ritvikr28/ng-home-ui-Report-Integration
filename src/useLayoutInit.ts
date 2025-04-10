import React , { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService } from "@essnextgen/auth-ui";
import { IApplicationMenu, IModulePermission } from "@essnextgen/ui-application-kit";
import getAppModulesPermissions from "./actions/queries";
import { getMenus, menuFilterHandler } from "./layoutHelpers";


export const useLayoutInit = (isStandaloneApp: boolean, t: (key: string) => string) => {
  const [isServiceInitiated, setIsServiceInitiated]: [
     boolean,
     React.Dispatch<React.SetStateAction<boolean>>
   ] = useState<boolean>(false);
  const history: any = useHistory();

  useEffect(() => {
    if (!isStandaloneApp) fetchData();
  }, []);

  const fetchData : () => Promise<void> = async () => {
    try {
      const response: any = await getAppModulesPermissions();
      processFetchedData(response.data);
    } catch {
      processFetchedData([]);
    }
  };

  const processFetchedData : (data: IModulePermission[]) => void = (data) => {
    const menusWithPermission: IApplicationMenu[] = getMenus(data, []);
    menuFilterHandler(menusWithPermission, t);
  };

  const onAuthenticated : () => void = (): void => {
    if (authService.isAuthenticated()) {
      setIsServiceInitiated(true);
    } else {
      history.push("/auth");
    }
  };

  return { isServiceInitiated, onAuthenticated };
};