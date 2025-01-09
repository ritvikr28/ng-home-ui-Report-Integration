/* istanbul ignore file */
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  Button,
  ButtonColor,
  ButtonSize,
  CheckBox,
  CheckboxLabelPosition,
  CheckBoxSelectedState,
  Grid,
  GridItem
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import { ISchoolInsightsResponse } from "../../../../../../shared/model/SchoolInsightsDomain/responseModels";
import { FetchSchoolInsights } from "../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";

const AttendanceOverview: () => JSX.Element = () => {
  const [data, setData]: [
    ISchoolInsightsResponse | null,
    React.Dispatch<React.SetStateAction<ISchoolInsightsResponse | null>>
  ] = useState<ISchoolInsightsResponse | null>(null);
  const [loading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);
  const [error, setError]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(null);

  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
      const result: ISchoolInsightsResponse | null = await FetchSchoolInsights(true);
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
        <div className="attendance-overview">
          <Accordion defaultExpanded>
            <AccordionHeader dataTestId="pupils-accordion-header-test-id">
              <span className="essui-global-typography-default-subtitle">
                Attendance Overview
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
                  data?.payload.attendanceInsights.attendanceNationalAverage
                    ? CheckBoxSelectedState.Selected
                    : CheckBoxSelectedState.DeSelected
                }
              />
              <Button
                className="insights-redirect-button"
                dataTestId="insights-button"
                size={ButtonSize.Small}
                color={ButtonColor.Secondary}
                // onClick={handleButtonClick} // Uncomment and implement the button click handler as needed
              >
                More attendance insights
              </Button>
              <div>
                <h3>Overall Absence</h3>
                <p>
                  Current Year Attendance:{" "}
                  {data?.payload.attendanceInsights.attendanceCurrentYear ??
                    "N/A"}
                </p>
                <p>
                  Previous Year Attendance:{" "}
                  {data?.payload.attendanceInsights.attendancePreviousYear ??
                    "N/A"}
                </p>
                <p>
                  National Average Attendance:{" "}
                  {data?.payload.attendanceInsights.attendanceNationalAverage}
                </p>
                <h3>Persistent Absentees</h3>
                <p>
                  Current Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .persistentAbsenteeCurrentYear ?? "N/A"}
                </p>
                <p>
                  Previous Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .persistentAbsenteePreviousYear ?? "N/A"}
                </p>
                <p>
                  National Average Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .persistentAbsenteesNationalAverage ?? "N/A"}
                </p>
                <h3>Authorised Absence</h3>
                <p>
                  Current Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .authorisedAbsentCurrentYear ?? "N/A"}
                </p>
                <p>
                  Previous Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .authorisedAbsentPreviousYear ?? "N/A"}
                </p>
                <p>
                  National Average Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .authorisedAbsentNationalAverage ?? "N/A"}
                </p>
                <h3>Unauthorised Absence</h3>
                <p>
                  Current Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .unauthorisedAbsentCurrentYear ?? "N/A"}
                </p>
                <p>
                  Previous Year Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .unauthorisedAbsentPreviousYear ?? "N/A"}
                </p>
                <p>
                  National Average Attendance:{" "}
                  {data?.payload.attendanceInsights
                    .unauthorisedAbsentNationalAverage ?? "N/A"}
                </p>
              </div>
            </AccordionPanel>
          </Accordion>
        </div>
      </GridItem>
    </Grid>
  );
};

export default AttendanceOverview;
