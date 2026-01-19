/* eslint-disable */
import { ApplicationInsights, DistributedTracingModes } from "@microsoft/applicationinsights-web";
import * as appInsightsModule from "./appInsights";

describe("appInsights.ts", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("initializes ApplicationInsights with correct config", () => {
    process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "test-conn-string";
    process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "test-key";
    const instance = new ApplicationInsights({
      config: {
        connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING,
        instrumentationKey: process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY,
      }
    });
    expect(instance.config.connectionString).toBe("test-conn-string");
    expect(instance.config.instrumentationKey).toBe("test-key");
  });

  it("excludes Wistia domains from correlation headers", () => {
    const { appInsights } = appInsightsModule;
    expect(appInsights.config.correlationHeaderExcludedDomains).toEqual(
      expect.arrayContaining([
        "fast.wistia.com",
        "fast.wistia.net",
        "pipedream.wistia.com",
        "pipedream.wistia.net"
      ])
    );
  });

  it("sets distributed tracing mode to W3C", () => {
    const { appInsights } = appInsightsModule;
    expect(appInsights.config.distributedTracingMode).toBe(DistributedTracingModes.W3C);
  });

  it("exports appInsights instance", () => {
    const { appInsights } = appInsightsModule;
    expect(appInsights).toBeInstanceOf(ApplicationInsights);
  });
});
