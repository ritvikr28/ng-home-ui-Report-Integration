import  "./style.scss";
import {TimeTableView} from "./StaffTimeTable/TimeTableWidget.view"

export const WidgetView= () => (
    <div className="widgetcontainer">
        <TimeTableView/>
    </div>
  );

  export default WidgetView;