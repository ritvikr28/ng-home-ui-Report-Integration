import { UpdateEnvConfig, envConfig } from "../constants";

describe("Constants tests", () => {
  test("envConfig is set correctly", () => {
    expect(envConfig.BASE_URL).toBe((window as any).REACT_API_URL);
    expect(envConfig.REACT_CLIENT_ID).toBe((window as any).REACT_CLIENT_ID);
    expect(envConfig.REACT_REDIRECT_URI).toBe(
      (window as any).REACT_REDIRECT_URI
    );
    expect(envConfig.AUTH_ENDPOINT).toBe((window as any).REACT_AUTH_ENDPOINT);
    expect(envConfig.REACT_GA_TRACKING_ID).toBe(
      (window as any).REACT_GA_TRACKING_ID
    );
  });

  test("Updates envConfig correctly", () => {
    const newConfig = {
      REACT_API_URL: "https://new-api-url.com",
      AppInsightsConnectionString: "new-connection-string",
      REACT_GA_TRACKING_ID: "tracking-id"
    };
    UpdateEnvConfig(newConfig);
    expect(envConfig.BASE_URL).toBe(newConfig.REACT_API_URL);
    expect(envConfig.AppInsightsConnectionString).toBe(
      newConfig.AppInsightsConnectionString
    );
    expect(envConfig.REACT_GA_TRACKING_ID).toBe(newConfig.REACT_GA_TRACKING_ID);
  });
});
