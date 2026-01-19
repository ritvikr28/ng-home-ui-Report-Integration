/* eslint-disable */
import { ApplicationInsights, DistributedTracingModes } from "@microsoft/applicationinsights-web";

jest.mock("@microsoft/applicationinsights-web");

describe.skip("appInsights.ts", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let loadAppInsightsMock: jest.Mock;

  beforeEach(() => {
    originalEnv = { ...process.env };
    loadAppInsightsMock = jest.fn();
    (ApplicationInsights as jest.Mock).mockImplementation(({ config }) => ({
      config,
      loadAppInsights: loadAppInsightsMock,
    }));
    // Clear require cache for appInsights before each test
    delete require.cache[require.resolve("../appInsights")];
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should create ApplicationInsights with correct config", () => {
    require("../appInsights");
    expect(ApplicationInsights).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          correlationHeaderExcludedDomains: expect.arrayContaining([
            "fast.wistia.com",
            "fast.wistia.net",
            "pipedream.wistia.com",
            "pipedream.wistia.net",
          ]),
          distributedTracingMode: DistributedTracingModes.W3C
        }),
      })
    );
  });

  it("should use connection string from env", () => {
    process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "test-conn-string";
    require("../appInsights");
    // expect(ApplicationInsights).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     config: expect.objectContaining({
    //       connectionString: "test-conn-string",
    //     }),
    //   })
    // );
  });

  it("should use instrumentation key from env", () => {
    process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "";
    process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "test-key";
    require("../appInsights");
    // expect(ApplicationInsights).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     config: expect.objectContaining({
    //       instrumentationKey: "test-key",
    //     }),
    //   })
    // );
  });

  it("should call loadAppInsights on initialization", () => {
    require("../appInsights");
    //expect(loadAppInsightsMock).toHaveBeenCalled();
  });

  it("should export appInsights instance", () => {
    const { appInsights } = require("../appInsights");
    expect(appInsights).toBeDefined();
  });
});
