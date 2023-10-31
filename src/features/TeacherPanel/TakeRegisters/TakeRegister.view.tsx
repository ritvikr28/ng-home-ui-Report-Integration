import { Grid, GridItem } from "@essnextgen/ui-kit";
import "./style.scss";
import TakeRegistersLinkview from "./component/EventContainer/TakeRegisterLink/TakeRegisterLink.view";

export const TakeRegisterView: () => JSX.Element = () => (
  <Grid>
  <GridItem lg ={12}md = {8} sm = {4} className="upcoming-register-conatiner">
   
   <TakeRegistersLinkview />
  </GridItem>
  </Grid>
);

export default TakeRegisterView;
