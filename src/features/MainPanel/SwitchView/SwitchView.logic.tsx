import SwitchView from "./SwitchView.view";
import "./style.scss";
import { ISwitchViewProps } from "./SwitchView.props";

const SwitchViewLogic:(props: ISwitchViewProps) => JSX.Element = (
  props: ISwitchViewProps
) => {
  const {
    isApiError,
    organisationName
  }: ISwitchViewProps = props;

  return (
    <div className="switch-view">
      <SwitchView 
      organisationName={organisationName}
      isApiError={isApiError} />
    </div>
  );
};

export default SwitchViewLogic;
