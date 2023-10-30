import "./style.scss";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor
} from "@essnextgen/ui-kit";
import { ISidePanelViewProps } from "./props";

const SidePanelView: (props: ISidePanelViewProps) => JSX.Element = (
  props: ISidePanelViewProps
) => {
  const { isOpen, closePanel, togglePanel }: ISidePanelViewProps = props;

  return (
    <div className={`side-view ${isOpen ? "open" : "side-view-closed"}`}>
      {isOpen ? (
        <div>
          <div>
            <Icon
              color={IconColor.Primary500}
              dataTestId="btn-90"
              id="variable-2"
              name="close"
              onClick={closePanel}
              size={16}
            />
          </div>
        </div>
      ) : (
        <div className="open-panel">
          <Button
            className="base-class"
            color={ButtonColor.Utility}
            dataTestId="btn-save"
            iconColor={IconColor.Neutral800}
            iconName={isOpen ? "close" : "open-panel--left--filled"}
            onClick={isOpen ? closePanel : togglePanel}
            size={ButtonSize.Small}
          />
        </div>
      )}
      <div />
    </div>
  );
};

export default SidePanelView;
