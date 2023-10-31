import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import StaffTimeTableLinkview from "./component/StaffTimeTableLink/StaffTimeTableLink.view";
import EventContainerView from "./component/EventContainer/EventContainer.view";

export const StaffTimeTableView: () => JSX.Element = () => (
  <Grid>
  <GridItem  lg ={12}md = {8} sm = {4} className="upcoming-schedule-conatiner">
    <StaffTimeTableLinkview />
    <EventContainerView />
  </GridItem>
 </Grid>
);

export default StaffTimeTableView;
