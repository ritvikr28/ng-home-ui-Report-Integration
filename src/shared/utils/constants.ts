export const envConfig: any = {
  BASE_URL: (window as any).REACT_API_URL,
  REACT_CLIENT_ID: (window as any).REACT_CLIENT_ID,
  REACT_REDIRECT_URI: (window as any).REACT_REDIRECT_URI,
  AUTH_ENDPOINT: (window as any).REACT_AUTH_ENDPOINT,
  REACT_GA_TRACKING_ID: (window as any).REACT_GA_TRACKING_ID,
  AppInsightsConnectionString: (window as any).AppInsightsConnectionString
};

export const UpdateEnvConfig = ({
  REACT_API_URL,
  AppInsightsConnectionString,
  REACT_GA_TRACKING_ID
}: any) => {
  envConfig.BASE_URL = REACT_API_URL;
  envConfig.AppInsightsConnectionString = AppInsightsConnectionString;
  envConfig.REACT_GA_TRACKING_ID = REACT_GA_TRACKING_ID;
};
