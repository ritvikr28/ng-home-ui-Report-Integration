/* eslint-disable no-useless-escape, array-callback-return, dot-notation */
import { ApplicationConfig } from "@essnextgen/ui-application-kit";
import { service, UpdateEnvConfig } from "../shared/utils";

declare global {
  interface Window {
    REACT_API_URL: string;
    AppInsightsConnectionString: string;
    REACT_GA_TRACKING_ID: string;
  }
}

export const fetchConfigData = async () => {
  const response = await service.get(
    "config.js",
    ApplicationConfig.buildApplicationUrl([
      { env: "dev", url: "https://dev-mfe.home.sims.co.uk" },
      { env: "qa", url: "https://qa.home.sims.co.uk" },
      { env: "prod", url: "https://www.home.sims.co.uk" },
      { env: "perf", url: "https://perf.home.sims.co.uk" }
    ])
  );
  const configKeyValues = response.data.split("\n");
  const configItem: any = {};
  configKeyValues.forEach((keyValue: string) => {
    const keyValueSplit = keyValue.split("= ");
    const key = keyValueSplit[0].replace("window.", "").replace('"', "").trim();
    const value = keyValueSplit[1]
      ? keyValueSplit[1].trim().substr(1, keyValueSplit[1].length - 1)
      : "";
    configItem[key] = value.replace('"', "");
  });
  return configItem;
};

export const SetupEnvConfig:(data:any)=>void = async (data:any) => {
  try {
    const configData: any = data;

    window.REACT_API_URL = configData.REACT_API_URL;
    window.AppInsightsConnectionString = configData.AppInsightsConnectionString;
    window.REACT_GA_TRACKING_ID = configData.REACT_GA_TRACKING_ID;

    UpdateEnvConfig({
      REACT_API_URL: window.REACT_API_URL,
      AppInsightsConnectionString: window.AppInsightsConnectionString,
      REACT_GA_TRACKING_ID: window.REACT_GA_TRACKING_ID
    });
  } catch (ex) {
    console.log(ex);
    window.REACT_API_URL = "";
    window.AppInsightsConnectionString = "";
  }
};

export default { SetupEnvConfig };

/* eslint-enable no-useless-escape, array-callback-return, dot-notation */
