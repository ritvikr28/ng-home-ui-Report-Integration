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
        <div className="open-panel essui-open-panel-filled">
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

export default SidePanel;

