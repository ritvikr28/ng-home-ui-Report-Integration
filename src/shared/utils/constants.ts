export const envConfig: any = {
  BASE_URL: (window as any).REACT_API_URL,
  REACT_CLIENT_ID: (window as any).REACT_CLIENT_ID,
  REACT_REDIRECT_URI: (window as any).REACT_REDIRECT_URI,
  AUTH_ENDPOINT: (window as any).REACT_AUTH_ENDPOINT,
  REACT_GA_TRACKING_ID: (window as any).REACT_GA_TRACKING_ID,
  AppInsightsConnectionString: (window as any).AppInsightsConnectionString,
  IS_NEWHOMEPAGE_ACCESSIBLE: (window as any).IS_NEWHOMEPAGE_ACCESSIBLE,
  SCHOOL_BASE_URL: (window as any).SCHOOL_BASE_URL,
  REGISTER_BASE_URL: (window as any).REGISTER_BASE_URL
};

export const UpdateEnvConfig = ({
  REACT_API_URL,
  AppInsightsConnectionString,
  REACT_GA_TRACKING_ID,
  IS_NEWHOMEPAGE_ACCESSIBLE,
  SCHOOL_BASE_URL,
  REGISTER_BASE_URL
}: any) => {
  envConfig.BASE_URL = REACT_API_URL;
  envConfig.AppInsightsConnectionString = AppInsightsConnectionString;
  envConfig.REACT_GA_TRACKING_ID = REACT_GA_TRACKING_ID;
  envConfig.IS_NEWHOMEPAGE_ACCESSIBLE = IS_NEWHOMEPAGE_ACCESSIBLE;
  envConfig.SCHOOL_BASE_URL=SCHOOL_BASE_URL;
  envConfig.REGISTER_BASE_URL = REGISTER_BASE_URL;
};
