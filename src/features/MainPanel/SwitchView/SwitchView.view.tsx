import { Grid, GridItem } from "@essnextgen/ui-kit";
import "./style.scss";
import { ISwitchViewProps } from "./SwitchView.props";

const SwitchView: (props: ISwitchViewProps) => JSX.Element = (
  props: ISwitchViewProps
) => {
  const { organisationName, isApiError }: ISwitchViewProps = props;

  return (
    <Grid>      
      <GridItem lg={10}>
      <div>
          You are viewing {isApiError === false ? organisationName : ""} as a Teacher.{" "}
          <a className="link-color" href=" ">            
            Switch view here
          </a>
        </div>
      </GridItem>
    </Grid>
  );
};

export default SwitchView;
