/* istanbul ignore file */
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  Grid,
  GridItem,
  TileCard,
  TileCardColor
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import PupilDemographics from "./PupilDemographics.logic";

const PupilDemographicsView: React.FC = () => {
  const { data, loading, error } = PupilDemographics();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                {data?.payload.pupilOnRoll !== null && (
                  <TileCard
                    heading="Pupils on Roll"
                    primaryText={data?.payload.pupilOnRoll.toString()}
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}
                {data?.payload.pupilPremiumPercentage !== null && (
                  <TileCard
                    heading="Pupil Premium (PP)"
                    primaryText={`${data?.payload.pupilPremiumPercentage}% (${data?.payload.totalPupilPremium})`}
                    secondaryText="National average: 23.6%"
                    status={TileCardColor.HIGHLIGHT}
                  />
                )}
                {data?.payload.fsmePercentage !== null && (
                  <TileCard
                    heading="Free School Meals (FSM)"
                    primaryText={`${data?.payload.fsmePercentage}% (${data?.payload.totalPupilFsme})`}
                    secondaryText="National average: 23.6%"
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