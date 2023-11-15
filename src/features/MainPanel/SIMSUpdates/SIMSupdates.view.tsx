import "./DiscoverStyle.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import DiscoverMoreView from "./Components/DiscoverMore.view";

export const SIMSupdatesView: () => JSX.Element = () => (
  <Grid>
  <GridItem className="sims-container">
    <DiscoverMoreView />
  </GridItem>
  </Grid>
);

export default SIMSupdatesView;
