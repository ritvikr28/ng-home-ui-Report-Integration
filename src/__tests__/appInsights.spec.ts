
const OLD_ENV = process.env;

jest.mock("@microsoft/applicationinsights-web", () => {
    const actual = jest.requireActual("@microsoft/applicationinsights-web");
    return {
        ...actual,
        ApplicationInsights: jest.fn().mockImplementation((configObj) => ({
            config: configObj.config,
            loadAppInsights: jest.fn(),
        })),
        DistributedTracingModes: { W3C: "W3C" },
    };
});

describe("appInsights.ts", () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterEach(() => {
        process.env = OLD_ENV;
        jest.clearAllMocks();
    });

    // it("should instantiate ApplicationInsights with correct config from env vars", async () => {
    //     process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "test-conn-string";
    //     process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "test-key";
    //     await import("../appInsights");
    //     expect(ApplicationInsights).toHaveBeenCalledWith({
    //         config: {
    //             connectionString: "test-conn-string",
    //             instrumentationKey: "test-key",
    //             correlationHeaderExcludedDomains: [
    //                 "fast.wistia.com",
    //                 "fast.wistia.net",
    //                 "pipedream.wistia.com",
    //                 "pipedream.wistia.net"
    //             ],
    //             disableCorrelationHeaders: false,
    //             enableCorsCorrelation: true,
    //             distributedTracingMode: "W3C",
    //             disableAjaxTracking: false,
    //             disableFetchTracking: false,
    //             enableRequestHeaderTracking: false,
    //             enableResponseHeaderTracking: false
    //         }
    //     });
    // });

    // it("should fallback to empty string if env vars are missing", async () => {
    //     delete process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING;
    //     delete process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY;
    //     await import("../appInsights");
    //     expect(ApplicationInsights).toHaveBeenCalled();
    //     expect(ApplicationInsights).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             config: expect.objectContaining({
    //                 connectionString: "",
    //                 instrumentationKey: ""
    //             })
    //         })
    //     );
    // });

    // it("should call loadAppInsights once during initialization", async () => {
    //     const module = await import("../appInsights");
    //     const instance = (ApplicationInsights as jest.Mock).mock.results[0].value;
    //     expect(instance.loadAppInsights).toHaveBeenCalledTimes(1);
    // });

    // it("should export the appInsights instance", async () => {
    //     const module = await import("../appInsights");
    //     const instance = (ApplicationInsights as jest.Mock).mock.results[0].value;
    //     expect(module.appInsights).toBe(instance);
    // });

    // it("should set all config options correctly", async () => {
    //     process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "abc";
    //     process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "def";
    //     await import("../appInsights");
    //     const config = (ApplicationInsights as jest.Mock).mock.calls[0][0].config;
    //     expect(config.correlationHeaderExcludedDomains).toEqual([
    //         "fast.wistia.com",
    //         "fast.wistia.net",
    //         "pipedream.wistia.com",
    //         "pipedream.wistia.net"
    //     ]);
    //     expect(config.disableCorrelationHeaders).toBe(false);
    //     expect(config.enableCorsCorrelation).toBe(true);
    //     expect(config.distributedTracingMode).toBe("W3C");
    //     expect(config.disableAjaxTracking).toBe(false);
    //     expect(config.disableFetchTracking).toBe(false);
    //     expect(config.enableRequestHeaderTracking).toBe(false);
    //     expect(config.enableResponseHeaderTracking).toBe(false);
    // });

    // it("should not call ApplicationInsights if required env vars are undefined and config falls back to empty", async () => {
    //     delete process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING;
    //     delete process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY;
    //     await import("../appInsights");
    //     expect(ApplicationInsights).toHaveBeenCalledTimes(1);
    //     const config = (ApplicationInsights as jest.Mock).mock.calls[0][0].config;
    //     expect(config.connectionString).toBe("");
    //     expect(config.instrumentationKey).toBe("");
    // });

    // it("should use only connection string if instrumentation key is missing", async () => {
    //     process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "only-conn-string";
    //     delete process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY;
    //     await import("../appInsights");
    //     const config = (ApplicationInsights as jest.Mock).mock.calls[0][0].config;
    //     expect(config.connectionString).toBe("only-conn-string");
    //     expect(config.instrumentationKey).toBe("");
    // });

    // it("should use only instrumentation key if connection string is missing", async () => {
    //     delete process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING;
    //     process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "only-key";
    //     await import("../appInsights");
    //     const config = (ApplicationInsights as jest.Mock).mock.calls[0][0].config;
    //     expect(config.connectionString).toBe("");
    //     expect(config.instrumentationKey).toBe("only-key");
    // });

    it("should not mutate process.env after initialization", async () => {
        process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING = "immutable";
        process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY = "immutable-key";
        await import("../appInsights");
        expect(process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING).toBe("immutable");
        expect(process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY).toBe("immutable-key");
    });
});