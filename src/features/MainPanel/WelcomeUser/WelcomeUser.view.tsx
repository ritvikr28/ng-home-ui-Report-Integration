import "./style.scss";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import { IWelcomeUserViewProps } from "./WelcomeUserProps";
import WhatsNewBanner from "../../../shared/components/Notification-menu/ClassViewWhatsNewBanner";

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
    isOpen,
    isSchoolNameToBeDisplayed
  }: IWelcomeUserViewProps = props;
  const isMobileView : boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  return (
    <>
    <div className="banner">
      <WhatsNewBanner />
    </div>
    <Grid className={`welcome-parent ${parentClassName}`} >
      <GridItem lg ={10}  className={isOpen ? " " : "weclome-res"} >
     {/* eslint-disable */}
        {!isMobileView? (isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
              <div>
                Hi <strong>{fullName}</strong>,
              </div>
              <span>welcome back!</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
            Hi <strong>{fullName}</strong>, welcome back!
          </div>
        )): 
        (
          <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
            Hi <span className="mobilefullname"><strong>{fullName},</strong></span>
            <div>welcome back!</div> 
          </div>
        )}
        {/* eslint-enable */}
      </GridItem>
       {isSchoolNameToBeDisplayed && <GridItem>
        <div className={`schoolname ${isOpen ? "" : "schoolname-res"}`}> 
          {" "}
          {isApiError === false ? organisationName : ""}
        </div>
      </GridItem>}
    </Grid>
    </>
  );
};

export default WelcomeUserView;

