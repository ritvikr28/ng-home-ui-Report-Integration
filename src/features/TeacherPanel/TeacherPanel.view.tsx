import "./style.scss";
import { StaffTimeTableView } from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";

const TeacherPanelView: () => JSX.Element = () => (
  <div className="teacher-panel-container">
    <StaffTimeTableView />
    <TakeRegisterView />
  </div>
);

export default TeacherPanelView;
