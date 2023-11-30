import { Provider } from "react-redux";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { authService } from "@essnextgen/auth-ui";
import FeatureFlagsProvider, { IResponse } from "@essnextgen/ui-flagr";
import { ILayoutProps, Layout } from "./Layout";
import { reactPlugin } from "./shared/components/AppInsights";
import ErrorBoundary from "./shared/components/ErrorBoundary/Index";
import configureStore from "./redux/store";
import translationEn from "./locales/en/translation.json";
import translationCy from "./locales/cy/translation.json";
import "./style.scss";
import { service } from "./shared/utils";


export interface IAppProps extends ILayoutProps {}

const App: (props: IAppProps) => JSX.Element = ({
  isStandaloneApp,
  baseRouteName
}: IAppProps) => {
  IntlProvider.init({
    translation: {
      en: translationEn,
      cy: translationCy
    }
  });
  const getFeatureFlags: () => Promise<IResponse> = () =>
  service.get('v1/feature?EntityType=Home');

const fetchFeatureFlags: (() => Promise<IResponse>) | undefined =
  authService.isAuthenticated() ? getFeatureFlags : undefined;
  return (
    <FeatureFlagsProvider fetchFeatures={fetchFeatureFlags}>
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
