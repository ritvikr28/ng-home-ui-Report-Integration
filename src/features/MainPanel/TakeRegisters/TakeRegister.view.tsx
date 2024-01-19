import React from "react";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import TakeRegisterEvent from "./component/EventContainer/TakeRegisterEvent.logic";
import TakeRegistersLinkview from "./component/TakeRegisterLink/TakeRegisterLink.view";
/* eslint-disable */
export interface TakeRegisterProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}


export const TakeRegisterView: React.FC<TakeRegisterProps> = ({ isOpen, setIsOpen }) =>{
  
  return(
  <Grid>
    <GridItem sm={4} className="register-container">
<TakeRegistersLinkview />
      <TakeRegisterEvent isOpen={isOpen} setIsOpen={setIsOpen} />
    </GridItem>
  </Grid>
)};

export default TakeRegisterView;
