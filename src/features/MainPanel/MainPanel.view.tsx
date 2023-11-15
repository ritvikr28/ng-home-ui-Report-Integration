import { Grid, GridItem } from "@essnextgen/ui-kit";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import SIMSupdatesView from "./SIMSUpdates/SIMSupdates.view";
import "./style.scss";

const MainPanelView: () => JSX.Element = () => (
  <Grid>
    <GridItem className="teacher-panel-container">
      <WelcomeUser />
      <StaffTimeTableView />
      <TakeRegisterView />
      <div className="divider-container"/>            
      <SIMSupdatesView/>
    </GridItem>
  </Grid>
);

export default MainPanelView;
