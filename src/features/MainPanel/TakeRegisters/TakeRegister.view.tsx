import React from "react";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import TakeRegisterEvent from "./component/EventContainer/TakeRegisterEvent.logic";

/* eslint-disable */
export interface TakeRegisterProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const TakeRegisterView: React.FC<TakeRegisterProps> = ({ isOpen, setIsOpen }) =>{
  return(
  <Grid>
    <GridItem lg={12} md={2} sm={2} className="register-container">
      <TakeRegisterEvent isOpen={isOpen} setIsOpen={setIsOpen} />
    </GridItem>
  </Grid>
)};

export default TakeRegisterView;
