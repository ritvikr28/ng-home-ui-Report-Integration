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
          {/* eslint-disable-next-line */}       
          <a className="link-color" href="javascript:void(0)">            
            Switch view here
          </a>
          {/* eslint-enable-next-line */}
        </div>
      </GridItem>
    </Grid>
  );
};

export default SwitchView;
