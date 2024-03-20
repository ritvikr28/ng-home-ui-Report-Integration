import React from 'react';
import { Grid, GridItem } from "@essnextgen/ui-kit";
import DiscoverMoreView from "./Components/DiscoverMore.view";
import styles from "./DiscoverStyle.module.scss";
/* eslint-disable */
interface SIMSupdatesViewProps {
  isOpen?: boolean;
}

export const SIMSupdatesView: React.FC<SIMSupdatesViewProps> = ({ isOpen }) =>{
  return (
  <Grid>
    <GridItem className={isOpen? `${styles["sims-container"]} ${styles["sims-open"]}`:styles["sims-container"]}>
      <DiscoverMoreView isOpen={isOpen}/>
    </GridItem>
  </Grid>
)};
/* eslint-enable */
export default SIMSupdatesView;
