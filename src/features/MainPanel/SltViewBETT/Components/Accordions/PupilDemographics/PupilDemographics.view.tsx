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
import PupilDemographics from "./PupilDemographics.logic";

const PupilDemographicsView: React.FC = () => {
  const {
    data,
    loading,
    error
  }: { data: any; loading: boolean; error: string | null } =
    PupilDemographics();

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

  const renderErrorTileCard: (text: string, testId: string) => JSX.Element = (text, testId) => (
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

  const renderDataTileCard: (heading: string, primaryText: string) => JSX.Element = (heading, primaryText) => (
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
        "Pupils on roll",
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
        "Pupil premium (PP)",
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
        "Free school meals (FSM)",
        `${data?.payload.fsmePercentage}% (${data?.payload.totalPupilFsme})`
      );
    }
    return null;
  };

  return (
    <Grid>
      <GridItem sm={12} md={11} lg={11}>
        <div className="pupil-demographics">
          <Accordion defaultExpanded>
            <AccordionHeader dataTestId="pupils-accordion-header-test-id">
              <span className="essui-global-typography-default-subtitle">
                Pupil demographics
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
