/* eslint-disable no-useless-escape, array-callback-return, dot-notation */
import { ApplicationConfig } from "@essnextgen/ui-application-kit";
import { service, UpdateEnvConfig } from "../shared/utils";

declare global {
  interface Window {
    REACT_API_URL: string;
    AppInsightsConnectionString: string;
    REACT_GA_TRACKING_ID: string;
    IS_NEWHOMEPAGE_ACCESSIBLE: boolean;
    SCHOOL_BASE_URL:string;
    REGISTER_BASE_URL: string;    
    LEARNER_UI_URL: string;
    LEARNER_API_URL: string;
    REACT_ENVIRONMENT:string;
    APPLICATION:string;
  }
}

export const fetchConfigData = async () => {
  const response = await service.get(
    "config.js",
    ApplicationConfig.buildApplicationUrl([
      { env: "dev", url: "https://dev-mfe.home.sims.co.uk" },
      { env: "qa", url: "https://qa-mfe.home.sims.co.uk" },
      { env: "prod", url: "https://live-mfe.home.sims.co.uk" },
      { env: "perf", url: "https://pf-mfe.home.sims.co.uk" }
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
    window.IS_NEWHOMEPAGE_ACCESSIBLE = configData.IS_NEWHOMEPAGE_ACCESSIBLE;
    window.SCHOOL_BASE_URL = configData.SCHOOL_BASE_URL;
    window.REGISTER_BASE_URL = configData.REGISTER_BASE_URL;    
    window.LEARNER_UI_URL = configData.LEARNER_UI_URL;
    window.LEARNER_API_URL=configData.LEARNER_API_URL;
    window.REACT_ENVIRONMENT=configData.ASPNETCORE_ENVIRONMENT;
    window.APPLICATION=configData.APPLICATION;

    UpdateEnvConfig({
      REACT_API_URL: window.REACT_API_URL,
      AppInsightsConnectionString: window.AppInsightsConnectionString,
      REACT_GA_TRACKING_ID: window.REACT_GA_TRACKING_ID,
      IS_NEWHOMEPAGE_ACCESSIBLE: window.IS_NEWHOMEPAGE_ACCESSIBLE,
      SCHOOL_BASE_URL:window.SCHOOL_BASE_URL,
      REGISTER_BASE_URL: window.REGISTER_BASE_URL,      
      LEARNER_UI_URL: window.LEARNER_UI_URL,
      LEARNER_API_URL:window.LEARNER_API_URL,
      REACT_ENVIRONMENT:window.REACT_ENVIRONMENT,
      APPLICATION:window.APPLICATION
    });
  } catch (ex) {
    console.log(ex);
    window.REACT_API_URL = "";
    window.AppInsightsConnectionString = "";
  }
};

export default { SetupEnvConfig };

/* eslint-enable no-useless-escape, array-callback-return, dot-notation */
