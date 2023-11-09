import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import TakeRegisterEvent from "./component/EventContainer/TakeRegisterEvent.logic";

export const TakeRegisterView: () => JSX.Element = () => (
  <Grid>
<GridItem  lg ={12}md = {8} sm = {4} className="register-container">
<TakeRegisterEvent/>
</GridItem>
</Grid>

);

export default TakeRegisterView;
