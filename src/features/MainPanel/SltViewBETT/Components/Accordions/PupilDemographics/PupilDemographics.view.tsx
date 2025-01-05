import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  CheckBox,
  CheckboxLabelPosition,
  CheckBoxSelectedState,
  Grid,
  GridItem,
} from "@essnextgen/ui-kit";
import { FetchSchoolInsights } from "../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";
import { ISchoolInsightsResponse } from "../../../../../../shared/model/SchoolInsightsDomain/responseModels";

const PupilDemographicsView: () => JSX.Element = () => {
  const [data, setData] = useState<ISchoolInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await FetchSchoolInsights(true); // Fetch with IsCompulsoryAgeView set to true
      if (result) {
        setData(result);
      } else {
        setError("Failed to fetch data");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid>
      <GridItem sm={12} md={11} lg={11}>
        <div className="">
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
              <CheckBox
                label="Compulsory age group"
                labelPosition={CheckboxLabelPosition.Right}
                isSelected={
                  data?.payload.pupilOnRoll
                    ? CheckBoxSelectedState.Selected
                    : CheckBoxSelectedState.DeSelected
                }
              />
              <div>
                <h3>Pupil Demographics</h3>
                <p>Pupils on Roll: {data?.payload.pupilOnRoll ?? "N/A"}</p>
                <p>
                  Pupil premium (PP):{" "}
                  {data?.payload.pupilPremiumPercentage ?? "N/A"}
                </p>
                <p>
                  Total Pupil Premium:{" "}
                  {data?.payload.totalPupilPremium ?? "N/A"}
                </p>
                <p>
                  Free school meals (FSM) :{" "}
                  {data?.payload.fsmePercentage ?? "N/A"}
                </p>
                <p>Total Pupil FSME: {data?.payload.totalPupilFsme ?? "N/A"}</p>
              </div>
            </AccordionPanel>
          </Accordion>
        </div>
      </GridItem>
    </Grid>
  );
};

export default PupilDemographicsView;
