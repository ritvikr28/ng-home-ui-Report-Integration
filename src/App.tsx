import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { authService } from "@essnextgen/auth-ui";
import FeatureFlagsProvider, { IResponse } from "@essnextgen/ui-flagr";
import {
  uiAppKitTranslation
} from "@essnextgen/ui-application-kit";
import { uiKitTranslation } from "@essnextgen/ui-kit";
import { ILayoutProps, Layout } from "./Layout";
import { reactPlugin } from "./shared/components/AppInsights";
import ErrorBoundary from "./shared/components/ErrorBoundary/Index";
import configureStore from "./redux/store";
import translationEn from "./locales/en/translation.json";
import translationCy from "./locales/cy/translation.json";
import "./style.scss";
import { envConfig, service } from "./shared/utils";
import gtmAnalytics from "./shared/utils/analytics";
import { fetchPreferredLanguage } from "./shared/services/localisationDomain/localisationPreferences";

const App: (props: ILayoutProps) => JSX.Element | null = ({
  isStandaloneApp,
  baseRouteName
}: ILayoutProps) => {
  const [initialized, setInitialized] = useState(false);
 
 useEffect(() => {
  const initI18n = async () => {
    try {
      const preferred = await fetchPreferredLanguage();
      const browserLang = navigator.language.startsWith("cy") ? "cy" : "en";
      const langCode = preferred?.languageCode || browserLang;
 
      localStorage.setItem("i18nextLng", langCode);
 
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
 
      setInitialized(true);
    } catch (err) {
      console.error("Error initializing i18n:", err);
      setInitialized(true);
    }
  };
 
  initI18n();
}, []);
 
 
  /* istanbul ignore next */
  const getFeatureFlags: () => Promise<IResponse> = () =>
    service.get("v1/features");
 
  /* istanbul ignore next */
  const fetchFeatureFlags: (() => Promise<IResponse>) | undefined =
    authService.isAuthenticated() ? getFeatureFlags : undefined;
 
  gtmAnalytics.pushLogInEvent();
 
  // Don’t render app until i18n is ready
  if (!initialized) return null;
 
  return (
    <FeatureFlagsProvider
      fetchFeatures={fetchFeatureFlags}
      applicationName={`${envConfig.APPLICATION}`}
    >
      <Provider store={configureStore()}>
        <ErrorBoundary>
          <Layout
            isStandaloneApp={isStandaloneApp}
            baseRouteName={baseRouteName}
          />
        </ErrorBoundary>
      </Provider>
    </FeatureFlagsProvider>
  );
};
 
export default withAITracking(reactPlugin, App);
