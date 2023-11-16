import "./style.scss";
import { Link } from "@essnextgen/ui-kit";
import { envConfig } from "../../../../../shared/utils";

const StaffTimeTableLinkview: () => JSX.Element = () => (
  <div className="timetable-link-conatiner">
    <span className="timetable-link-lable">Your upcoming schedule</span>
    <span className="timetable-link-url register-link">
      <Link
        data-testid="link"
        href={`${envConfig.SCHOOL_BASE_URL}/staff-timetable`}
        target="_self"
      >
        View full timetable
      </Link>
    </span>
  </div>
);

export default StaffTimeTableLinkview;
