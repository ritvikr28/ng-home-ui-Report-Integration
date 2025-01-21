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
  GridItem,
  Loader,
  LoaderType,
  Notification,
  NotificationStatus,
  useMediaQuery
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import AttendanceOverview from "./AttendanceOverview.logic";

const AttendanceOverviewView: React.FC = ({ isOpen }: any) => {
  const { data, loading, error }: { data: any; loading: boolean; error: any } = AttendanceOverview();

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
      label: "Current year average",
      dataKey: "currentYearAvg",
      color: "#006970"
    },
    {
      label: "Previous year average",
      dataKey: "previousYearAvg",
      color: "#78D5DB"
    },
    {
      label: "National average",
      dataKey: "nationalAvg",
      color: "#00A0AA"
    }
  ];

  const handleButtonClick: () => void = () => {
    window.location.href = `${window.location.origin}/reporting`;
  };

   const isDesktopView: boolean = useMediaQuery(
     "(min-width:1024px) and (max-width: 3900px)"
   );

   let className = "";
   if (isOpen && isDesktopView) {
     className = "welcome-parent parent1-open";
   } else if (isDesktopView) {
     className = "welcome-parent parent1";
   }
   
  return (
    <Grid
      className={className}>
      <GridItem sm={12} md={11} lg={11}>
        <div className="attendance-overview">
          {error ? (
            <Notification
              className="attendance-error-banner"
              status={NotificationStatus.WARNING}
              title="Data Fetch Error"
              message="There was an error fetching the attendance data. Please try again later."
            />
          ) : (
            <Accordion defaultExpanded>
              <AccordionHeader dataTestId="pupils-accordion-header-test-id">
                <span className="essui-global-typography-default-subtitle">
                  Attendance overview
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
                  {loading ? (
                    <Loader
                      loaderText="Please wait..."
                      loaderType={LoaderType.Circular}
                    />
                  ) : (
                    <>
                      <Bargraphs
                        data={overallAbsenceData}
                        configInfo={barGraphConfig}
                        cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                        title="Overall attendance"
                        Name=""
                        CurrentYearAvg={null}
                        PreviousYearAvg={null}
                        NationalAvg={null}
                        isFetchSucessfully
                        unsuccessfullMsg=""
                        firstLabel="Current year"
                        secondLabel="Previous year"
                        thirdLabel="National average"
                        labels={undefined}
                        heading=""
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
                        firstLabel="Current year"
                        secondLabel="Previous year"
                        thirdLabel="National average"
                        labels={undefined}
                        heading=""
                      />
                      <Bargraphs
                        data={unauthorisedAbsenceData}
                        configInfo={barGraphConfig}
                        cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                        title="Unauthorised absence"
                        Name=""
                        CurrentYearAvg={null}
                        PreviousYearAvg={null}
                        NationalAvg={null}
                        isFetchSucessfully
                        unsuccessfullMsg=""
                        firstLabel="Current year"
                        secondLabel="Previous year"
                        thirdLabel="National average"
                        labels={undefined}
                        heading=""
                      />
                      <Bargraphs
                        data={persistentAbsenteesData}
                        configInfo={barGraphConfig}
                        cols={{ xxl: 12, xl: 12, lg: 12, md: 8, sm: 4 }}
                        title="Persistent absence"
                        Name=""
                        CurrentYearAvg={null}
                        PreviousYearAvg={null}
                        NationalAvg={null}
                        isFetchSucessfully
                        unsuccessfullMsg=""
                        firstLabel="Current year"
                        secondLabel="Previous year"
                        thirdLabel="National average"
                        labels={undefined}
                        heading=""
                      />
                    </>
                  )}
                </div>
              </AccordionPanel>
            </Accordion>
          )}
        </div>
      </GridItem>
    </Grid>
  );
};

export default AttendanceOverviewView;
