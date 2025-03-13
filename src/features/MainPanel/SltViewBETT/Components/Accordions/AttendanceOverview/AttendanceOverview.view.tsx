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
  NotificationStatus
} from "@essnextgen/ui-kit";
import "../../../style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import AttendanceOverview from "./AttendanceOverview.logic";





const AttendanceOverviewView: React.FC = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();
  const { data, loading, error }: { data: any; loading: boolean; error: any } = AttendanceOverview();

  const overallAbsenceData: {
    Name: string;
    currentYearAvg: number;
    previousYearAvg: number;
    nationalAvg: number;
  }[] = [
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

  const persistentAbsenteesData: {
    Name: string;
    currentYearAvg: number;
    previousYearAvg: number;
    nationalAvg: number;
  }[] = [
    {
      Name: t("attendanceoverview.persistentabsence"),
      currentYearAvg:
        data?.payload.attendanceInsights.persistentAbsenteeCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.persistentAbsenteePreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.persistentAbsenteesNationalAverage ||
        0
    }
  ];

  const authorisedAbsenceData: {
    Name: string;
    currentYearAvg: number;
    previousYearAvg: number;
    nationalAvg: number;
  }[] = [
    {
      Name: t("attendanceoverview.authorisedabsence"),
      currentYearAvg:
        data?.payload.attendanceInsights.authorisedAbsentCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.authorisedAbsentPreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.authorisedAbsentNationalAverage || 0,
    }
  ];

  const unauthorisedAbsenceData: {
    Name: string;
    currentYearAvg: number;
    previousYearAvg: number;
    nationalAvg: number;
  }[] = [
    {
      Name: t("attendanceoverview.unauthorisedabsence"),
      currentYearAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentCurrentYear || 0,
      previousYearAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentPreviousYear || 0,
      nationalAvg:
        data?.payload.attendanceInsights.unauthorisedAbsentNationalAverage || 0,
    }
  ];

  const barGraphConfig: { label: string; dataKey: string; color: string }[] = [
    {
      label: t("attendanceoverview.currentyearaverage"),
      dataKey: "currentYearAvg",
      color: "#006970",
    },
    {
      label: t("attendanceoverview.previousyearaverage"),
      dataKey: "previousYearAvg",
      color: "#78D5DB",
    },
    {
      label: t("attendanceoverview.nationalaverage"),
      dataKey: "nationalAvg",
      color: "#00A0AA"
    }
  ];

  const handleButtonClick: () => void = () => {
    window.location.href = `${window.location.origin}/reporting`;
  };

  return (
    <Grid>
      <GridItem sm md={12} lg={12} className="c-clear-padding-left">
        <div>
          {error ? (
            <Notification
              className="attendance-error-banner"
              status={NotificationStatus.WARNING}
              title="Data Fetch Error"
              message="There was an error fetching the attendance data. Please try again later."
            />
          ) : (
            <Accordion defaultExpanded className="c-clear-margin">
              <AccordionHeader dataTestId="pupils-accordion-header-test-id">
                <span className="essui-global-typography-default-subtitle">
                  Attendance overview
                </span>
              </AccordionHeader>
              <AccordionPanel
                id="analytics-accordion-content"
                dataTestId="analytics-insights-accordion-panel-test-id"
              >
                <Grid className="new-attendace-overview-row">
                  <GridItem className="c-clear-padding">
                    <Button
                      className="insights-redirect-button"
                      dataTestId="insights-button"
                      size={ButtonSize.Small}
                      color={ButtonColor.Secondary}
                      onClick={handleButtonClick}
                    >
                      More attendance insights
                    </Button>
                  </GridItem>
                </Grid>

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
                        title={t("attendanceoverview.authorisedabsence")}
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
                        title={t("attendanceoverview.unauthorisedabsence")}
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
                        title={t("attendanceoverview.persistentabsence")}
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
