import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import TakeRegisterEvent from "./component/EventContainer/TakeRegisterEvent.logic";
import TakeRegistersLinkview from "./component/TakeRegisterLink/TakeRegisterLink.view";

export const TakeRegisterView: () => JSX.Element = () => (
  <Grid>
<GridItem  lg ={12}md = {2} sm = {2} className="register-container">
<TakeRegistersLinkview />
<TakeRegisterEvent/>
</GridItem>
</Grid>
);

export default TakeRegisterView;
