import React from "react";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import "./style.scss";
import { ISwitchViewProps } from "./SwitchView.props";
 
const SwitchView: (props: ISwitchViewProps) => JSX.Element = (
  props: ISwitchViewProps
) => {
  const { organisationName, isApiError,path }: ISwitchViewProps = props;
  const handleSwitchViewClick: (event: React.MouseEvent<HTMLAnchorElement>) => void = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();  
    if(path === "/"){
    window.location.href ="/"
    }
    else{
    window.location.href = "/SLTView"
    }
  };
 
  return (
    <Grid>
      <GridItem lg={10}>
        <div>
          You are viewing {isApiError === false ? organisationName : ""} as a
          Teacher. {/* eslint-disable-next-line */}
          <a className="link-color" href=" " onClick={handleSwitchViewClick}>
            Switch view here
          </a>
          {/* eslint-enable-next-line */}
        </div>
      </GridItem>
    </Grid>
  );
};
 
export default SwitchView;