import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { IWelcomeUserViewProps } from "./props";


const WelcomeUserView: (props: IWelcomeUserViewProps) => JSX.Element = (
  props: IWelcomeUserViewProps
) => {
  const {
    fullName,
    isLongName,
    parentClassName,
    subparentClassName,
    organisationName,
    isApiError
   
  }: IWelcomeUserViewProps = props;

  return (
    <div className={`welcome-parent ${parentClassName}`}>
      <div>
        {isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`}>
              <div>Hi <strong>{fullName}</strong>,</div>
              <span>welcome back!</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`}>
            Hi <strong>{fullName}</strong>, welcome back!
          </div>
        )}
        <Grid>
        <GridItem lg={10}>
          <div className="schoolname"> {isApiError === false ? organisationName : ""}</div>
          </GridItem>
          <GridItem lg={2}>
            {}
          </GridItem>
        
        </Grid>
        
      </div>
    </div>
  );
};

export default WelcomeUserView;
