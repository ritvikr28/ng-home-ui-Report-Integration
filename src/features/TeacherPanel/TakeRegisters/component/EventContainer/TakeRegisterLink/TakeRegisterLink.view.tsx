import "../../../style.scss";
import { Link } from "@essnextgen/ui-kit";
import { envConfig } from "../../../../../../shared/utils";

 
const TakeRegistersLinkview: () => JSX.Element = () => (
  <div className="register-link-container">
    <span className="register-link-lable">Your registers </span>
    <span className="register-link-url">
      <Link
        data-testid="link"
        href={`${envConfig.REGISTER_BASE_URL}/takes-registers`}      
        target="_self"
      >
       View all registers
      </Link>
    </span>
  </div>
);
 
export default TakeRegistersLinkview;
 