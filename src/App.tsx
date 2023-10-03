import { Provider } from "react-redux";
import { IntlProvider } from "@essnextgen/ui-intl-kit";
import { withAITracking } from "@microsoft/applicationinsights-react-js";

import { ILayoutProps, Layout } from "./Layout";
import { reactPlugin } from "./shared/components/AppInsights";
import ErrorBoundary from "./shared/components/ErrorBoundary/Index";
import configureStore from "./redux/store";

import translationEn from "./locales/en/translation.json";
import translationCy from "./locales/cy/translation.json";
import "./style.scss";

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

  return (
    <Provider store={configureStore()}>
      <ErrorBoundary>
        <Layout
          isStandaloneApp={isStandaloneApp}
          baseRouteName={baseRouteName}
        />
      </ErrorBoundary>
    </Provider>
  );
};

export default withAITracking(reactPlugin, App);
