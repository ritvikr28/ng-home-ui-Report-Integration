import "./style.scss";
import EventContainer from "./component/EventContainer/EventContainer.logic";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";
import { envConfig } from "../../../shared/utils";

/* eslint-disable */
export interface StaffTimeTableProps {
  isOpen?: boolean;
}

export const StaffTimeTableView: React.FC<StaffTimeTableProps> = ({
  isOpen,
}) => {
  return (
    <>
      <SectionTitle
        title={"Your upcoming schedule"}
        hasLink={true}
        linkText={"View full timetable"}
        linkhref={envConfig.SCHOOL_BASE_URL}
        path="staff-timetable"
      />
      <EventContainer isOpen={isOpen} />
    </>
  );
};
/* eslint-enable */
export default StaffTimeTableView;
