import "./style.scss";
import TakeRegistersLinkview from "./component/TakeRegisterLink/TakeRegisterLink.view";

export const TakeRegisterView: () => JSX.Element = () => (
  <div className="register-container">
    <TakeRegistersLinkview />
    
  </div>
);

export default TakeRegisterView;
