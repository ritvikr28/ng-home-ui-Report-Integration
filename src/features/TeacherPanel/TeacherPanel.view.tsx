import "./style.scss";
import { StaffTimeTableView } from "./StaffTimeTable/StaffTimeTable.view";

const TeacherPanelView: () => JSX.Element = () => (
  <div className="teacher-panel-container">
    <StaffTimeTableView />
  </div>
);

export default TeacherPanelView;
