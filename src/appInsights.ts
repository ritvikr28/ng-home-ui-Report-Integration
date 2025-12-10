import { ApplicationInsights, DistributedTracingModes } from "@microsoft/applicationinsights-web";
// Create the AI instance
const appInsights = new ApplicationInsights({
  config: {
    // Prefer connection string (recommended) or instrumentationKey
    connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING ?? "",
    instrumentationKey: process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATION_KEY ?? "",
    // ---- Correlation header controls ----
    // Exclude Wistia domains so AI does NOT add traceparent/request-id/etc.
    correlationHeaderExcludedDomains: [
      "fast.wistia.com",
      "fast.wistia.net",
      "pipedream.wistia.com",
      "pipedream.wistia.net"     // optional but safe
    ],
    // Optional: keep distributed tracing for your own APIs
    disableCorrelationHeaders: false,       // allow headers generally
    enableCorsCorrelation: true,            // include on cross-origin calls (except excluded domains)
    distributedTracingMode: DistributedTracingModes.W3C, // emits W3C traceparent for allowed domains
    // Other common settings (optional)
    disableAjaxTracking: false,
    disableFetchTracking: false,
    enableRequestHeaderTracking: false,
    enableResponseHeaderTracking: false
  }
});
// Initialize early in app startup
appInsights.loadAppInsights();
// Export for use in your app (React plugin optional)
export { appInsights };
 