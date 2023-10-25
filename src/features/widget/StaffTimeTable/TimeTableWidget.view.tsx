import "./style.scss";
import {Link} from '@essnextgen/ui-kit';
import { envConfig } from "../../../shared/utils";


export const TimeTableView= () => (
      <div className="upcoming-schedule-conatiner">
            <div className="timetable-link-conatiner">
                <span className="timetable-link-lable">
                    {`Your upcoming schedule `}
                </span>
                <span  className="timetable-link-url">
                <Link
                 data-testid="link"
                href={`${envConfig.SCHOOL_BASE_URL}/staff-timetable`}
                 >View full timetables</Link>
                </span>
            </div>
      </div>
    );
  
  
  export default TimeTableView;