import { authService } from "@essnextgen/auth-ui";
import getAppModulesPermissions from "../queries";
// import { clearQueries } from "../../../jest-config/__mocks__/mocks";
import { envConfig, service } from "../../shared/utils";

service.get = jest.fn();
service.init = jest.fn();

authService.saveAuthTokens({
  accessToken: "accessToken",
  expiresIn: 3600,
  idToken: "id_token"
});
beforeAll(() => {
  // clearQueries();
});
afterEach(() => jest.clearAllMocks());

test("searchByAll should return search groups", async () => {
  (service.get as jest.Mock).mockResolvedValue([]);
  getAppModulesPermissions();

  expect(service.get).toHaveBeenCalledWith(
    "appmodules/getPermissions",
    envConfig.BASE_URL
  );
});
