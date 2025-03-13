import { Divider } from "@essnextgen/ui-kit";
import AttendanceOverview from "./Components/Accordions/AttendanceOverview/AttendanceOverview.view";
import PupilDemographics from "./Components/Accordions/PupilDemographics/PupilDemographics.view";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";

const SltViewBettView: () => JSX.Element = () => (
  <>
    <SectionTitle title="School headlines" />
    <AttendanceOverview />
    <div className="new-divider-spacing">
      <Divider />
    </div>
    <PupilDemographics />
  </>
);

export default SltViewBettView;
