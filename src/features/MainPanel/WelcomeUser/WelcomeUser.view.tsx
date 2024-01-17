import "./style.scss";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import { IWelcomeUserViewProps } from "./WelcomeUserProps";

const WelcomeUserView: (props: IWelcomeUserViewProps) => JSX.Element = (
  props: IWelcomeUserViewProps
) => {
  const {
    fullName,
    isLongName,
    parentClassName,
    subparentClassName,
    organisationName,
    isApiError,
    isOpen
  }: IWelcomeUserViewProps = props;
  const isMobileView : boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );
  return (
    <Grid className={`welcome-parent ${parentClassName}`}>
      <GridItem lg ={10}  className={isOpen ? " " : "weclome-res"} >
     {/* eslint-disable */}
        {!isMobileView? (isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`}>
              <div>
                Hi <strong>{fullName}</strong>,
              </div>
              <span>welcome back!</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`}>
            Hi <strong>{fullName}</strong>, welcome back!
          </div>
        )): 
        (
          <div className={`subparent ${subparentClassName}`}>
            Hi <span className="mobilefullname"><strong>{fullName},</strong></span>
            <div>welcome back!</div> 
          </div>
        )}
        {/* eslint-enable */}
      </GridItem>
      <GridItem lg={10}>
        <div className={`schoolname ${isOpen ? "" : "schoolname-res"}`}>
          {" "}
          {isApiError === false ? organisationName : ""}
        </div>
      </GridItem>
    </Grid>
  );
};

export default WelcomeUserView;

