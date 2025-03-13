import "./style.scss";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { useMediaQuery } from "@essnextgen/ui-kit";
import { UseTranslationResponse, useTranslation } from "@essnextgen/ui-intl-kit";
import { IWelcomeUserViewProps } from "./WelcomeUserProps";
import WhatsNewBanner from "../../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import { envConfig } from "../../../shared/utils";

const WelcomeUserView: (props: IWelcomeUserViewProps) => JSX.Element = (
  props: IWelcomeUserViewProps
) => {
  const { fullName }: IWelcomeUserViewProps = props
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
      <div className="" data-testid="subparent-element">
      {(!isMobileView && ClassViewNotificationBanner) && (<WhatsNewBanner />)}
        <span className="new-user-name-text">
        {t("welcomePage.himsg")} <span className="new-user-name">{fullName}</span>, {t("welcomePage.welcomemsg")}
        </span>
      </div>
    </>
  )
}

export default WelcomeUserView
