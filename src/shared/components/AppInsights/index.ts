import {
  ApplicationInsights,
  ITelemetryItem,
  SeverityLevel
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { BrowserHistory, createBrowserHistory } from "history";
import { envConfig } from "../../utils/constants";

const browserHistory = createBrowserHistory({}) as BrowserHistory;
const reactPlugin = new ReactPlugin();
const ai = new ApplicationInsights({
  config: {
    connectionString: envConfig.AppInsightsConnectionString,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory }
    },
    autoTrackPageVisitTime: true,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    loggingLevelTelemetry: Number(process.env.LOG_LEVEL) as unknown as number
  }
});

if (
  envConfig.AppInsightsConnectionString === undefined ||
  envConfig.AppInsightsConnectionString === ""
)
  ai.config.disableTelemetry = true;
else {
  ai.loadAppInsights();
  const telemetryInitializer: (envelope: ITelemetryItem) => void = (
    envelope: ITelemetryItem
  ) => {
    const customParams: ITelemetryItem = envelope;
    customParams.data = { ApplicationName: process.env.APP_NAME };
  };
  ai.addTelemetryInitializer(telemetryInitializer);
  ai.trackPageView();
}
export { reactPlugin };

type loggerType = {
  error: ({
    error,
    code,
    endpoint
  }: {
    error: string;
    code?: string;
    endpoint?: string;
  }) => void;
  info: (message: string) => void;
};

export const logger: loggerType = {
  error: ({ error, code, endpoint = "" }) => {
    if (ai === null) {
      return;
    }
    ai.trackException(
      { exception: new Error(error) },
      { code, endpoint, pathName: window.location.pathname }
    );
  },
  info: (message = "") => {
    if (ai === null) {
      return;
    }
    ai.trackTrace(
      {
        message: `Home UI Logs - ${message}`,
        severityLevel: SeverityLevel.Information
      },
      { pathName: window.location.pathname }
    );
  }
};
