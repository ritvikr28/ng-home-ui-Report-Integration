import { AxiosResponse } from "axios";
import { envConfig, service } from "../shared/utils";

const getAppModulesPermissions: () => Promise<AxiosResponse<any, any>> = () =>
  service.get(`appmodules/getPermissions`, envConfig.BASE_URL);

export default getAppModulesPermissions;
