import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import StaffTimeTableLinkview from "./component/StaffTimeTableLink/StaffTimeTableLink.view";
import EventContainer from "./component/EventContainer/EventContainer.logic";

/* eslint-disable */
export interface StaffTimeTableProps {
  isOpen?: boolean;
}

export const StaffTimeTableView: React.FC<StaffTimeTableProps> = ({ isOpen}) => { 
  return (
  <Grid>
  <GridItem md = {8} sm = {4} >
    <StaffTimeTableLinkview />
    <EventContainer isOpen={isOpen} />
  </GridItem>
 </Grid>
)};
/* eslint-enable */

export default StaffTimeTableView;
