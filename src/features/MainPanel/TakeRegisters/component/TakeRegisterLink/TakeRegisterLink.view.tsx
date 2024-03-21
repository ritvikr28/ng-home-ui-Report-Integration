import "../../../style.scss";
import { Link } from "@essnextgen/ui-kit";
import { envConfig } from "../../../../../shared/utils";
import gtmAnalytics from "../../../../../shared/utils/analytics";

 
const TakeRegistersLinkview: () => JSX.Element = () => (
  <div className="register-link-container">
    <span className="your-registers-tr-5567f">Your registers </span>
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
       View all registers
       </span>
      </Link>
    </span>
  </div>
);
 
export default TakeRegistersLinkview;
 