import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { StaffTimeTableView } from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";

const TeacherPanelView: () => JSX.Element = () => (
  <Grid>
    <GridItem className="teacher-panel-container">
      <StaffTimeTableView />
      <TakeRegisterView />
    </GridItem>
  </Grid>
);

export default TeacherPanelView;
