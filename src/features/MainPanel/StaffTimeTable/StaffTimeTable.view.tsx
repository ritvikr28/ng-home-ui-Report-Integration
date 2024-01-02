import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import StaffTimeTableLinkview from "./component/StaffTimeTableLink/StaffTimeTableLink.view";
import EventContainer from "./component/EventContainer/EventContainer.logic";

/* eslint-disable */
export interface StaffTimeTableProps {
  isOpen?: boolean;
}

export const StaffTimeTableView: (
  props: StaffTimeTableProps
) => JSX.Element = ({ isOpen }: StaffTimeTableProps) => (
  <Grid>
  <GridItem  lg ={12}md = {8} sm = {4} className={isOpen ? "container-width" : " upcoming-schedule-conatiner"}>
    <StaffTimeTableLinkview />
    <EventContainer />
  </GridItem>
 </Grid>
);
/* eslint-enable */

export default StaffTimeTableView;
