import "./style.scss";
import { Link } from "@essnextgen/ui-kit";
import { envConfig } from "../../../../../shared/utils";
import gtmAnalytics from "../../../../../shared/utils/analytics";

const StaffTimeTableLinkview: () => JSX.Element = () => (
  <div className="timetable-link-conatiner">
    <span className="timetable-link-lable">Your upcoming schedule</span>
    <span className="timetable-link-url register-link">
      <Link
        data-testid="link"
        href={`${envConfig.SCHOOL_BASE_URL}/staff-timetable`}
        target="_self"
      >
        <span data-testid="link-staffid" onClick={() => gtmAnalytics.pushEvent({
                                  event: "interact_click",
                                  elementType: "link",
                                  elementTextOrLabel: "View full timetable",
                                  elementLocation: "Home page main panel"
                                })}>
        View full timetable
        </span>
      </Link>
    </span>
  </div>
);

export default StaffTimeTableLinkview;
