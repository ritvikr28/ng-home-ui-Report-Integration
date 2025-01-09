/* istanbul ignore file */
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  Bargraphs,
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import AttendanceOverview from "./AttendanceOverview.logic";

const AttendanceOverviewView: React.FC = () => {
  const { data, loading, error }: { data: any; loading: boolean; error: any } = AttendanceOverview();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const overallAbsenceData: { Name: string; currentYearAvg: number; previousYearAvg: number; nationalAvg: number }[] = [
    {
      Name: "Overall Absence",
      currentYearAvg:
        data?.payload.attendanceInsights.attendanceCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.attendancePreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.attendanceNationalAverage || 0
    }
  ];

  const persistentAbsenteesData: { Name: string; currentYearAvg: number; previousYearAvg: number; nationalAvg: number }[] = [
    {
      Name: "Persistent Absentees",
      currentYearAvg:
        data?.payload.attendanceInsights.persistentAbsenteeCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.persistentAbsenteePreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.persistentAbsenteesNationalAverage ||
        0
    }
  ];

  const authorisedAbsenceData: { Name: string; currentYearAvg: number; previousYearAvg: number; nationalAvg: number }[] = [
    {
      Name: "Authorised Absence",
      currentYearAvg:
        data?.payload.attendanceInsights.authorisedAbsentCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.authorisedAbsentPreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.authorisedAbsentNationalAverage || 0
    }
  ];

  const unauthorisedAbsenceData: { Name: string; currentYearAvg: number; previousYearAvg: number; nationalAvg: number }[] = [
    {
      Name: "Unauthorised Absence",
      currentYearAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentPreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentNationalAverage || 0
    }
  ];

  const barGraphConfig: { label: string; dataKey: string; color: string }[] = [
    {
      label: "Current Year Average",
      dataKey: "currentYearAvg",
      color: "#006970"
    },
    {
      label: "Previous Year Average",
      dataKey: "previousYearAvg",
      color: "#78D5DB"
    },
    {
      label: "National Average",
      dataKey: "nationalAvg",
      color: "#00A0AA"
    }
  ];

  const handleButtonClick: () => void = () => {
    window.location.href = `${window.location.origin}/reporting`;
  };

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
              <Button
                className="insights-redirect-button"
                dataTestId="insights-button"
                size={ButtonSize.Small}
                color={ButtonColor.Secondary}
                onClick={handleButtonClick}
              >
                More attendance insights
              </Button>

              <div className="bargraphs-container">
                <Bargraphs
                  data={overallAbsenceData}
                  configInfo={barGraphConfig}
                  cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                  title="Overall absence"
                  Name=""
                  CurrentYearAvg={null}
                  PreviousYearAvg={null}
                  NationalAvg={null}
                  isFetchSucessfully
                  unsuccessfullMsg=""
                  firstLabel="Current Year"
                  secondLabel="Previous Year"
                  thirdLabel="National Average"
                  labels={undefined}
                  heading="Overall Absence Overview"
                />
                <Bargraphs
                  data={persistentAbsenteesData}
                  configInfo={barGraphConfig}
                  cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                  title="Persistent absentees"
                  Name=""
                  CurrentYearAvg={null}
                  PreviousYearAvg={null}
                  NationalAvg={null}
                  isFetchSucessfully
                  unsuccessfullMsg=""
                  firstLabel="Current Year"
                  secondLabel="Previous Year"
                  thirdLabel="National Average"
                  labels={undefined}
                  heading="Overall Absence Overview"
                />
                <Bargraphs
                  data={authorisedAbsenceData}
                  configInfo={barGraphConfig}
                  cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                  title="Authorised absence"
                  Name=""
                  CurrentYearAvg={null}
                  PreviousYearAvg={null}
                  NationalAvg={null}
                  isFetchSucessfully
                  unsuccessfullMsg=""
                  firstLabel="Current Year"
                  secondLabel="Previous Year"
                  thirdLabel="National Average"
                  labels={undefined}
                  heading="Overall Absence Overview"
                />
                <Bargraphs
                  data={unauthorisedAbsenceData}
                  configInfo={barGraphConfig}
                  cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                  title="Unauthorised Absence"
                  Name=""
                  CurrentYearAvg={null}
                  PreviousYearAvg={null}
                  NationalAvg={null}
                  isFetchSucessfully
                  unsuccessfullMsg=""
                  firstLabel="Current Year"
                  secondLabel="Previous Year"
                  thirdLabel="National Average"
                  labels={undefined}
                  heading="Overall Absence Overview"
                />
              </div>
            </AccordionPanel>
          </Accordion>
        </div>
      </GridItem>
    </Grid>
  );
};

export default AttendanceOverviewView;
