import "./style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

import EventContainer from "./component/EventContainer/EventContainer.logic";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";
import { envConfig } from "../../../shared/utils";

/* eslint-disable */
export interface StaffTimeTableProps {
  isOpen?: boolean;
}

export const StaffTimeTableView: React.FC<StaffTimeTableProps> = ({
  isOpen
}) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    <>
      <SectionTitle
        title={t("staffTimetable.stafftimetablelink")}
        hasLink={true}
        linkText={t("staffTimetable.stafftimetablelinktext")}
        linkhref={envConfig.SCHOOL_BASE_URL}
        path="staff-timetable"
      />
      <EventContainer isOpen={isOpen} />
    </>
  );
};
/* eslint-enable */
export default StaffTimeTableView;
