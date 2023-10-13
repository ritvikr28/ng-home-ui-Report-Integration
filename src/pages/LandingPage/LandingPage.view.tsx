import {
  useTranslation,
  UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import {
  Button,
  ButtonSize,
  Grid,
  GridItem,
  Loader,
  LoaderType } from "@essnextgen/ui-kit";
import "./style.scss";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { useHistory } from "react-router-dom";
import { IAppModule } from "../../types/AppPermission";
import { envConfig } from "../../shared/utils";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",
    Operation: "View"
  }
];
interface IProps {
  data: Array<IAppModule>
}

const LandingPageView: ({}: IProps) => JSX.Element = ({
  data,
}: IProps): JSX.Element => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const history = useHistory();
  const createEventButton =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True" ? (
      <Button
        size={ButtonSize.Small}
        dataTestId="create-event-button"
        onClick={() => history.push("/new-home")}
      >
        New Homepage
      </Button>
    ) : null;

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
          {t("homePage.btnText")}
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
    <>
      <div className="newhomepagemar">
        <Grid
          align="flex-start"
          dataTestId="LandingPageTestId1"
          id="app-module-wrapper1"
          className="landing-page"
        >
          <span className="newhomepagespan">
            <GridItem sm={10}>{}</GridItem>
          </span>
          <span className="gridhomepagespan">
            <GridItem sm={2}>{createEventButton}</GridItem>
          </span>
        </Grid>

        <Grid
          align="flex-start"
          dataTestId="LandingPageTestId"
          id="app-module-wrapper"
          className="landing-page"
        >
          <GridItem sm={12}>
            <span className="page-heading">{t("homePage.headerTitle")}</span>
            <span className="page-subheading">
              {t("homePage.headerSubTitle")}
            </span>
            <br />
            {data.map(renderModule)}
          </GridItem>
        </Grid>
      </div>
    </>
  );
};

export default LandingPageView;
