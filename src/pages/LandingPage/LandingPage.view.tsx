import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { Grid, GridItem, Loader, LoaderType } from "@essnextgen/ui-kit";

import { IAppModule } from "../../types/AppPermission";
import "./style.scss";
import gtmAnalytics from "../../shared/utils/analytics";

interface IProps {
  data: Array<IAppModule>;
}

const LandingPageView: ({}: IProps) => JSX.Element = ({
  data
}: IProps): JSX.Element => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  gtmAnalytics.pushPageViewEvent();
  const renderModule: (x: IAppModule, i: number) => JSX.Element | null = (
    x: IAppModule,
    i: number
  ) => {
    if (!x.canView) return null;

    return (
      <div className="module-block" key={`module-block-${i}`}>
        <h4>{x.title}</h4>
        {x.description}{" "}
        {x.link !== "" ? (
          <a href={x.link} rel="noopener noreferrer">
            {x.linkText}
          </a>
        ) : (
          ""
        )}
        <a
          className="essui-button essui-button--primary essui-button--small app-link"
          href={x.appUrl}          
          rel="noopener noreferrer"
          key={`module-link-${i}`}
        >
          {x.code === "NewHomePage"? t("homePage.newHomepagebtnText"): t("homePage.btnText")}          
        </a>
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <Loader
        className="loader-wrapper"
        loaderText={t("homePage.fetchingDataText")}
        loaderType={LoaderType.Circular}
      />
    );
  }

  return (
    <Grid
      align="flex-start"
      dataTestId="LandingPageTestId"
      id="app-module-wrapper"
      className="landing-page"
    >
      <GridItem sm={12}>
        <span className="page-heading">{t("homePage.headerTitle")}</span>
        <span className="page-subheading">{t("homePage.headerSubTitle")}</span>
        <br />
        {data.map(renderModule)}
      </GridItem>
    </Grid>
  );
};

export default LandingPageView;
