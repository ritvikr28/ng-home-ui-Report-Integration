import SwitchView from "./SwitchView.view";
import "./style.scss";
import { ISwitchViewProps } from "./SwitchView.props";

const SwitchViewLogic:(props: ISwitchViewProps) => JSX.Element = (
  props: ISwitchViewProps
) => {
  const {
    isApiError,
    organisationName,
    path
  }: ISwitchViewProps = props;

  return (
    <div className="switch-view">
      <SwitchView 
      organisationName={organisationName}
      isApiError={isApiError} 
      path={path}/>
    </div>
  );
};

export default SwitchViewLogic;
