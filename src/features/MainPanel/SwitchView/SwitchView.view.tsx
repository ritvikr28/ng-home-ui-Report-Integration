import React from "react";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import "./style.scss";
import { ISwitchViewProps } from "./SwitchView.props";
import { getUserOrganisation } from "../../../shared/utils/auth-helper";


const organisationId = [ "4b4eb751-c3f1-4a95-aade-d762b6c70693",
"29a88689-e51f-4928-aead-1a92402c1a09",
"54dbb8a7-9a07-48c5-92a3-014f13519f1d",
"133ba2ce-a183-4ef9-8db3-f073d7941660",
"d1ac710d-a8a4-4097-b30d-622c311dc535",
"e6795699-4584-4829-89dd-41c67a1b1bbf",
"ecb01589-7a16-44e3-8089-ebcdd9bc2458",
"b8fd9320-6b94-40e5-bbcc-88efd5974951",
"8e42af99-d37f-455b-bccd-20dffd8946ac",
"6f039714-5c4a-4ab4-ad2e-f22e1145fcce",
"ba8937a9-e63e-43ff-ada2-05a4eda64a6f",
"f1d00baf-1bc3-4e43-a3fd-ba8cd59465d3",
"c365ab78-ebba-4956-a2fa-11a967fb2cc6",
"cff91875-22fc-463c-be4c-cec9e86b5752",
"430c0edc-6482-476d-ae18-2eac23e57621",
"cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe",
"6607c902-d51d-4200-9740-f230bb1bc8c1",
"58df2bbd-1d47-4ea0-9613-aee79c442991",
"4b4eb751-c3f1-4a95-aade-d762b6c70693",
"ba8937a9-e63e-43ff-ada2-05a4eda64a6f"];
 
const SwitchView: (props: ISwitchViewProps) => JSX.Element = (
  props: ISwitchViewProps
) => {
  const { organisationName, isApiError,path }: ISwitchViewProps = props;
  const handleSwitchViewClick: (event: React.MouseEvent<HTMLAnchorElement>) => void = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();  
    if(path === "/"){
    window.location.href ="/"
    }
    else if(path ==="/slt-view"){
    window.location.href = "/"
    }  
    else{
      window.location.href = "/slt-view"
    }
  };
  const userRoleText: string =
    path === "/slt-view" ? "Head Teacher" : "Teacher";


  return (
     <Grid>
      <GridItem lg={10}>
        <div>
          You are viewing {isApiError === false ? organisationName : ""} as a {userRoleText}. {/* eslint-disable-next-line */}
          {organisationId.includes(getUserOrganisation()) && (
            <a className="link-color" href=" " onClick={handleSwitchViewClick}>
              Switch view here
            </a>
          )}
          {/* eslint-enable-next-line */}
        </div>
      </GridItem>
    </Grid>
  );
};
 
export default SwitchView;