import { Divider } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import AttendanceOverview from "./Components/Accordions/AttendanceOverview/AttendanceOverview.view";
import PupilDemographics from "./Components/Accordions/PupilDemographics/PupilDemographics.view";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";

const SltViewBettView: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    <>
      <SectionTitle title={t("sltviewbelt.schoolheadlines")} />
      <AttendanceOverview />
      <div className="new-divider-spacing">
        <Divider />
      </div>
      <PupilDemographics />
    </>
  );
};

export default SltViewBettView;
