import "./style.scss";
import { Link } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { envConfig } from "../../../../../shared/utils";
import gtmAnalytics from "../../../../../shared/utils/analytics";


const StaffTimeTableLinkview: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

  return (
    <div className="timetable-link-container">
      <span className="timetable-link-label">
        {t("staffTimetable.stafftimetablelink")}
      </span>
      <span className="timetable-link-url register-link">
        <Link
          data-testid="link"
          href={`${envConfig.SCHOOL_BASE_URL}/staff-timetable`}
          target="_self"
        >
          <span
            data-testid="link-staffid"
            className="link-full-timetable"
            onClick={() =>
              gtmAnalytics.pushEvent({
                event: "click",
                linkText: "View full timetable",
                linkUrl: `${envConfig.SCHOOL_BASE_URL}/staff-timetable`,
                clickType: "link",
                clickLocation: "body"
              })
            }
          >
            {t("staffTimetable.stafftimetablelinktext")}
          </span>
        </Link>
      </span>
    </div>
  );
};

export default StaffTimeTableLinkview;
