import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { fetchConfigData, SetupEnvConfig } from "../ConfigHelper";
import { service, envConfig } from "../../shared/utils";

const configResponse = `"window.REACT_API_URL= "https://test.sims.co.uk/api"
window.REACT_CLIENT_ID = "123"
window.REACT_AUTH_ENDPOINT = "https://test.sims.co.uk/connect"
window.REACT_REDIRECT_URI = "https://test.sims.co.uk/auth"
window.AppInsightsConnectionString = "test1"
window.ASPNETCORE_ENVIRONMENT= "Development"
window.LOG_LEVEL = "2"
window.APP_NAME = "Home UI"
"`;
const axiosResponse: AxiosResponse = {
  data: configResponse,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};
describe("fetchConfigData", () => {
  afterEach(() => {
    envConfig.BASE_URL = "";
    envConfig.REACT_CLIENT_ID = "";
    envConfig.REACT_REDIRECT_URI = "";
    envConfig.AUTH_ENDPOINT = "";
    envConfig.REACT_GA_TRACKING_ID = "";
    envConfig.AppInsightsConnectionString = "";
  });

  test("should return the config key/value pairs", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const configData: any = await fetchConfigData();
    await waitFor(() => {
      expect(configData.REACT_API_URL).toBe("https://test.sims.co.uk/api");
      expect(configData.REACT_CLIENT_ID).toBe("123");
      expect(configData.AppInsightsConnectionString).toBe("test1");
    });
  });

  test("should update the envConfig", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
      const configData: any = await fetchConfigData();
    await SetupEnvConfig(configData);
    await waitFor(() => {
      expect(envConfig.BASE_URL).toBe("https://test.sims.co.uk/api");
      expect(envConfig.AppInsightsConnectionString).toBe("test1");
    });
  });
  test("should promise failed", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.reject(new Error("error message")));

    await expect(fetchConfigData()).rejects.toThrow(new Error("error message"));
    expect(envConfig.BASE_URL).toBe("");
    expect(envConfig.AppInsightsConnectionString).toBe("");
  });
  test.skip("should envconfig initialization failed", async () => {  
    jest.spyOn(console, "log").mockImplementation(() => "error message");

    SetupEnvConfig(undefined);
    
    expect(console.log).toHaveBeenCalledTimes(1);    
    expect(envConfig.BASE_URL).toBe("");
    expect(envConfig.AppInsightsConnectionString).toBe("");
  });
});
