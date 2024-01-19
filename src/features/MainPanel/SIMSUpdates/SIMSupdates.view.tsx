import React from 'react';
import "./DiscoverStyle.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import DiscoverMoreView from "./Components/DiscoverMore.view";
/* eslint-disable */
interface SIMSupdatesViewProps {
  isOpen?: boolean;
}

export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) =>{
  return (
  <Grid>
    <GridItem className={isOpen?"sims-container sims-open":"sims-container"}>
      <DiscoverMoreView isOpen={isOpen}/>
    </GridItem>
  </Grid>
)};
/* eslint-enable */
export default SIMSupdatesView;
