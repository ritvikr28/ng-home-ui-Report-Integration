import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor
} from "@essnextgen/ui-kit";
import "./style.scss";

const SidePanel = ({ isOpen, togglePanel, closePanel }: any) => (
    <div
      className={`side-view ${isOpen ? "open open-panel" : "side-view-closed"}`}
    >
      {isOpen ? (
        <div>
          <div className="close-icon">
            <Icon
              color={IconColor.Primary500}
              dataTestId="btn-90"
              id="variable-2"
              name="close"
              onClick={closePanel}
              size={24}
            />
          </div>
        </div>
      ) : (
        <div className="open-panel essui-open-panel-filled" data-testId="close-panel">
          <Button
            className="base-class"
            color={ButtonColor.Utility}
            dataTestId="btn-collapse"
            iconColor={IconColor.Neutral800}
            iconName="open-panel--left--filled"
            onClick={togglePanel}
            size={ButtonSize.Small}
          />
        </div>
      )}
      <div />
    </div>
    );

export default SidePanel;

