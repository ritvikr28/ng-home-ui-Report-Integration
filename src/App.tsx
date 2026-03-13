import React, { useEffect, useState } from "react";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import FeatureFlagsProvider, { IResponse } from "@essnextgen/ui-flagr";
import { uiAppKitTranslation } from "@essnextgen/ui-application-kit";
import { uiKitTranslation } from "@essnextgen/ui-kit";
import { useDispatch } from "react-redux";
import { ILayoutProps, Layout } from "./Layout";
import { reactPlugin } from "./shared/components/AppInsights";
import ErrorBoundary from "./shared/components/ErrorBoundary/Index";
import translationEn from "./locales/en/translation.json";
import translationCy from "./locales/cy/translation.json";
import "./style.scss";
import { envConfig, service } from "./shared/utils";
import gtmAnalytics from "./shared/utils/analytics";
import { useVideoPlayStatus } from "./shared/hook/useVideoPlayStatus";
import { setVideoPlayStatus, setApiError } from "./redux/storeActions";

export const hasNewHomePagePermission: boolean = authService.isAuthorised(
  [{ Securable: "NG.Homepage.Access", Operation: "View" }],
  MatchPermissions.all
);

const App: (props: ILayoutProps) => JSX.Element | null = ({
  isStandaloneApp,
  baseRouteName
}: ILayoutProps) => {

  const [initialized, setInitialized]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

  // Priority: dropdown (localStorage) → browser → fallback
  const getInitialLang = () =>
    localStorage.getItem("i18nextLng") ||
    navigator.language.split("-")[0] ||
    "en";

  const [langCode]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>(getInitialLang);

  useEffect(() => {
    const initI18n: () => Promise<void> = async () => {
      try {
        console.log("[Lang Change] Setting i18nextLng in localStorage:", langCode);
        // Always persist chosen lang in localStorage
        localStorage.setItem("i18nextLng", langCode);
        console.log("[i18n Init] Initializing IntlProvider with lang:", langCode);
        await IntlProvider.init({
          translation: {
            en: {
              ...uiKitTranslation.en,
              ...uiAppKitTranslation.en,
              ...translationEn
            },
            cy: {
              ...uiKitTranslation.cy,
              ...uiAppKitTranslation.cy,
              ...translationCy
            }
          }
        }).init({ lng: langCode });
        console.log("[i18n Init] Successfully initialized with lang:", langCode);
        setInitialized(true);
      } catch (err) {
        console.error("Error initializing i18n:", err);
        setInitialized(true);
      }
    };

    initI18n();
  }, [langCode]);

  /* istanbul ignore next */
  const getFeatureFlags: () => Promise<IResponse> = () =>
    service.get("v1/features");

  const dispatch = useDispatch();
  
  /* istanbul ignore next */
  const fetchFeatureFlags: (() => Promise<IResponse>) | undefined =
    authService.isAuthenticated() ? getFeatureFlags : undefined;

  gtmAnalytics.pushLogInEvent();

  const { isPlayed, apiError }: { isPlayed: boolean; apiError: boolean } = useVideoPlayStatus();

  useEffect(() => {
    if (hasNewHomePagePermission) {
      dispatch(setVideoPlayStatus(isPlayed));
      dispatch(setApiError(apiError));
      if (isPlayed === false && apiError === false) {
        console.log("isPlayed apiError", { isPlayed, apiError });
        gtmAnalytics.showVideoEvent();
      }
    }
  }, [isPlayed, apiError])

  if (!initialized) return null;

  return (
    <FeatureFlagsProvider
      fetchFeatures={fetchFeatureFlags}
      applicationName={`${envConfig.APPLICATION}`}
    >
      {/* <Provider store={configureStore()}> */}
      <ErrorBoundary>
        <Layout
          isStandaloneApp={isStandaloneApp}
          baseRouteName={baseRouteName}
        />
      </ErrorBoundary>
      {/* </Provider> */}
    </FeatureFlagsProvider>
  );
};

export default withAITracking(reactPlugin, App);
