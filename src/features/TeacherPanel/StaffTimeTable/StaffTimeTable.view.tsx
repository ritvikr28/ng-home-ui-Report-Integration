import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import StaffTimeTableLinkview from "./component/StaffTimeTableLink/StaffTimeTableLink.view";
import EventContainer from "./component/EventContainer/EventContainer.logic";

export const StaffTimeTableView: () => JSX.Element = () => (
  <Grid>
  <GridItem  lg ={12}md = {8} sm = {4} className="upcoming-schedule-conatiner">
    <StaffTimeTableLinkview />
    <EventContainer />
  </GridItem>
 </Grid>
);

export default StaffTimeTableView;
