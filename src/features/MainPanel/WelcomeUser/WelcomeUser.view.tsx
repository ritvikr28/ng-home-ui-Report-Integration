import "./style.scss";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { IWelcomeUserViewProps } from "./WelcomeUserProps";
import WhatsNewBanner from "../../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import { envConfig } from "../../../shared/utils";


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

  const ClassViewNotificationBanner: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "ClassViewNotificationBanner"
  ); 
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();

  return (
    <>
    <Grid className={`welcome-parent ${parentClassName}`} >
      <GridItem lg ={10}  className={isOpen ? " " : "weclome-res"} >
      {(!isMobileView && ClassViewNotificationBanner) && (<WhatsNewBanner />)}

     {/* eslint-disable */}
        {!isMobileView? (isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
              <div>
                {t("welcomePage.himsg")} <strong>{fullName}</strong>,
              </div>
              <span>{t("welcomePage.welcomemsg")}</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
            {t("welcomePage.himsg")} <strong>{fullName}</strong>, {t("welcomePage.welcomemsg")}
          </div>
        )): 
        (
          <div className={`subparent ${subparentClassName}`} data-testid="subparent-element">
            {t("welcomePage.himsg")} <span className="mobilefullname"><strong>{fullName},</strong></span>
             <div>{t("welcomePage.welcomemsg")}</div> 
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

