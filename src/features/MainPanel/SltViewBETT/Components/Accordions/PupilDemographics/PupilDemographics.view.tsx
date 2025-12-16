import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  Grid,
  GridItem,
  Loader,
  LoaderType,
  TileCard,
  TileCardColor,
  ValidationText,
  ValidationTextLevel
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";



interface PupilDemographicsViewProps {
  data: any;
  loading: boolean;
  error: string | null;
}

const PupilDemographicsView: React.FC<PupilDemographicsViewProps> = ({ data, loading, error }) => {
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const renderLoaderTileCard: () => JSX.Element = () => (
      <TileCard
        primaryText={
          <Loader
            loaderText="Please wait..."
            loaderType={LoaderType.Circular}
            className="tilecard-loader"
          />
        }
        status={TileCardColor?.HIGHLIGHT}
      />
    );

  const renderErrorTileCard: (text: string, testId: string) => JSX.Element = (
    text,
    testId
  ) => (
    <TileCard
      primaryText={
        <ValidationText
          text={text}
          textLevel={ValidationTextLevel.Warning}
          dataTestId={testId}
        />
      }
      status={TileCardColor?.HIGHLIGHT}
    />
  );

  const renderDataTileCard: (
    heading: string,
    primaryText: string
  ) => JSX.Element = (heading, primaryText) => (
    <TileCard
      heading={heading}
      primaryText={primaryText}
      status={TileCardColor?.HIGHLIGHT}
    />
  );

  const renderPupilOnRoll = () => {
    if (loading) return renderLoaderTileCard();
    if (error)
      return renderErrorTileCard(
        "Pupils on roll insights unavailable",
        "pupils-on-roll-error"
      );
    if (data?.payload.pupilOnRoll !== null) {
      return renderDataTileCard(
        t("pupildemographics.pupilsonroll"),
        data?.payload.pupilOnRoll.toString()
      );
    }
    return null;
  };

  const renderPupilPremium = () => {
    if (loading) return renderLoaderTileCard();
    if (error)
      return renderErrorTileCard(
        "Pupil premium insight unavailable",
        "pupil-premium-error"
      );
    if (data?.payload.pupilPremiumPercentage !== null) {
      return renderDataTileCard(
        t("pupildemographics.pupilpremium"),
        `${data?.payload.pupilPremiumPercentage}% (${data?.payload.totalPupilPremium})`
      );
    }
    return null;
  };

  const renderFSM = () => {
    if (loading) return renderLoaderTileCard();
    if (error)
      return renderErrorTileCard("FSM insight unavailable", "fsm-error");
    if (data?.payload.fsmePercentage !== null) {
      return renderDataTileCard(
        t("pupildemographics.freeschoolmeals"),
        `${data?.payload.fsmePercentage}% (${data?.payload.totalPupilFsme})`
      );
    }
    return null;
  };

  return (
    <Grid>
      <GridItem sm md={12} lg={12} className="c-clear-padding-left">
        <div className="pupil-demographics">
          <Accordion defaultExpanded className="c-clear-margin">
            <AccordionHeader dataTestId="pupils-accordion-header-test-id">
              <span className="essui-global-typography-default-subtitle">
              {t("pupildemographics.pupildemographicsheading")}
              </span>
            </AccordionHeader>
            <AccordionPanel
              id="analytics-accordion-content"
              dataTestId="analytics-insights-accordion-panel-test-id"
            >
              <div className="tile-card-container">
                {renderPupilOnRoll()}
                {renderPupilPremium()}
                {renderFSM()}
              </div>
            </AccordionPanel>
          </Accordion>
        </div>
      </GridItem>
    </Grid>
  );
};

export default PupilDemographicsView;
