import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";

const MainPanelView: () => JSX.Element = () => (
  <Grid>
    <GridItem className="teacher-panel-container">
      <WelcomeUser />
      <StaffTimeTableView />
      <TakeRegisterView />
    </GridItem>
  </Grid>
);

export default MainPanelView;
