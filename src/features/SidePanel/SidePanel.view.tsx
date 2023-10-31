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
  const { isOpen, togglePanel }: ISidePanelViewProps = props;

  return (
    <div
      data-testid="toggle-button"
      className={`side-view ${isOpen ? "open" : "side-view-closed"} `}
    >
      {isOpen ? (
        <div>
          <div>
            <Icon
              color={IconColor.Primary500}
              id="variable-2"
              name="close"
              onClick={togglePanel}
              size={16}
            />
          </div>
        </div>
      ) : (
        <div className="open-panel" data-testid="toggle-button">
          <Button
            className="base-class"
            color={ButtonColor.Utility}
            data-testid="side-panel-view"
            iconColor={IconColor.Neutral800}
            iconName="open-panel--left--filled"
            onClick={togglePanel}
            size={ButtonSize.Small}
          />
        </div>
      )}
    </div>
  );
};

export default SidePanelView;
