import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { Loader, LoaderType } from "@essnextgen/ui-kit";

import { IAppModule, AppPermissionState } from "../../types/AppPermission";
import LandingPageView from "./LandingPage.view";

const LandingPage: () => JSX.Element = (): JSX.Element => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const { modules, isLoaded }: AppPermissionState = useSelector(
    (state: any) => state.appPermission
  );

  if (!isLoaded) {
    return (
      <Loader
        className="loader-wrapper"
        loaderText={t("homePage.fetchingDataText")}
        loaderType={LoaderType.Circular}
      />
    );
  }

  const hasActiveModules =
    modules && modules.some((x: IAppModule) => x.canView || x.code === "Home");
  if (isLoaded && !hasActiveModules) {
    return <Redirect to="/noAccess" />;
  }

  return (
    <LandingPageView
      data={modules.filter((x: IAppModule) => x.code !== "Home")}
    />
  );
};

export default LandingPage;
