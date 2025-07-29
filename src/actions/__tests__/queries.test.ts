import { authService } from "@essnextgen/auth-ui";
import getAppModulesPermissions from "../queries";
// import { clearQueries } from "../../../jest-config/__mocks__/mocks";
import { envConfig, service } from "../../shared/utils";

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    saveAuthTokens: jest.fn(),
  },
}));

service.get = jest.fn();
service.init = jest.fn();

authService.saveAuthTokens({
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  expiresIn: 3600,
  idToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
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
