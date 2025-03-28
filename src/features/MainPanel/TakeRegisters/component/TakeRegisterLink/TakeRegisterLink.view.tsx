import "../../../style.scss";
import { Link } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { envConfig } from "../../../../../shared/utils";
import gtmAnalytics from "../../../../../shared/utils/analytics";

 
const TakeRegistersLinkview: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
    return ( <div className="register-link-container">
      <span className="your-registers-tr-5567f">{t("takeRegister.takeregisterlink")} </span>
      <span className="register-link-url">
        <Link
          data-testid="link"
          href={`${envConfig.REGISTER_BASE_URL}`}      
          target="_self"
        >
          <span data-testid="link-id" onClick={() =>  
              gtmAnalytics.pushEvent({
                event: "click",
                linkText: "View all registers",
                linkUrl: envConfig.REGISTER_BASE_URL,
                clickType: "link",
                clickLocation: "body"
              })
            }>
         {t("takeRegister.takeregistertext")}
         </span>
        </Link>
      </span>
    </div>)
 
          };
 
export default TakeRegistersLinkview;
 