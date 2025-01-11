/* istanbul ignore file */
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

  return (
    <Grid>
      <GridItem sm={12} md={11} lg={11}>
        <div>
          <Accordion defaultExpanded>
            <AccordionHeader dataTestId="pupils-accordion-header-test-id">
              <span className="essui-global-typography-default-subtitle">
                Pupil Demographics
              </span>
            </AccordionHeader>
            <AccordionPanel
              id="analytics-accordion-content"
              dataTestId="analytics-insights-accordion-panel-test-id"
            >
              <div className="tile-card-container">
                {loading && (
                  <Loader
                    loaderText="Please wait..."
                    loaderType={LoaderType.Circular}
                  />
                )}

                {!loading && error && (
                  <TileCard
                    primaryText={
                      <ValidationText
                        text="Pupils on roll insights unavailable"
                        textLevel={ValidationTextLevel.Warning}
                        dataTestId="pupils-on-roll-error"
                      />
                    }
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}

                {!loading && !error && data?.payload.pupilOnRoll !== null && (
                  <TileCard
                    heading="Pupils on roll"
                    primaryText={data?.payload.pupilOnRoll.toString()}
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}

                {!loading && error && (
                  <TileCard
                    primaryText={
                      <ValidationText
                        text="Pupil premium insight unavailable"
                        textLevel={ValidationTextLevel.Warning}
                        dataTestId="pupil-premium-error"
                      />
                    }
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}

                {!loading &&
                  !error &&
                  data?.payload.pupilPremiumPercentage !== null && (
                    <TileCard
                      heading="Pupil premium (PP)"
                      primaryText={`${data?.payload.pupilPremiumPercentage}% (${data?.payload.totalPupilPremium})`}
                      status={TileCardColor.HIGHLIGHT}
                    />
                  )}

                {!loading && error && (
                  <TileCard
                    primaryText={
                      <ValidationText
                        text="FSM insight unavailable"
                        textLevel={ValidationTextLevel.Warning}
                        dataTestId="fsm-error"
                      />
                    }
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}

                {!loading &&
                  !error &&
                  data?.payload.fsmePercentage !== null && (
                    <TileCard
                      heading="Free school meals (FSM)"
                      primaryText={`${data?.payload.fsmePercentage}% (${data?.payload.totalPupilFsme})`}
                      status={TileCardColor.HIGHLIGHT}
                    />
                  )}
              </div>
            </AccordionPanel>
          </Accordion>
        </div>
      </GridItem>
    </Grid>
  );
};

export default PupilDemographicsView;