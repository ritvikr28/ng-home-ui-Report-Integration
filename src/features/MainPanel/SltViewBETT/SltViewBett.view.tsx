import { Grid, GridItem, HeadingSubHeading } from "@essnextgen/ui-kit";
import AttendanceOverview from "./Components/Accordions/AttendanceOverview/AttendanceOverview.view";
import PupilDemographics from "./Components/Accordions/PupilDemographics/PupilDemographics.view";

const SltViewBettView: () => JSX.Element = () => (
  <Grid>
    <GridItem sm={12} md={12} lg={12}>
      <div className="">
        <HeadingSubHeading
          headingText="School headlines"
          isShowHeading={true}
          isShowSubHeading={false}
        />
      </div>
      <AttendanceOverview />
      <PupilDemographics />
    </GridItem>
  </Grid>
);

export default SltViewBettView;
