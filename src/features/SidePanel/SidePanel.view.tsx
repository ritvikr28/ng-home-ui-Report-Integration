import React from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor
} from "@essnextgen/ui-kit";
import "./style.scss";
import { authService } from "@essnextgen/auth-ui";
import { SidePanelProps } from "./SidePanelProps";

const userFullname: string | null = authService.getUsername();

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  closePanel,
  showQuickLinkView,
}) => (
  <div
    className={`side-view ${isOpen ? "open open-panel" : "side-view-closed"}`}
  >
    {isOpen ? (
      <div>
        <div
          className="quick-lint-display"
          style={{ display: "flex", marginBottom: "24px" }}
        >
          <span className="quick-link-username">
            <strong>{userFullname}</strong>
          </span>
          <span>
            {" "}
            <Icon
              color={IconColor.Primary500}
              dataTestId="btn-90"
              id="variable-2"
              name="close"
              className="close-icon"
              onClick={closePanel}
              size={24}
            />
          </span>
        </div>
        <div>
          <div className="quick-link">Quick links</div>
          <div className="quick-link-padding">
            <div className="quick-panel-cont">
              Take Register{" "}
              <Icon
                color={IconColor.Primary500}
                dataTestId="btn-90"
                id="variable-2"
                name="star--filled"
                size={16}
              />
            </div>
            <div className="quick-panel-cont">
              Pupil Profile
              <Icon
                color={IconColor.Primary500}
                dataTestId="btn-90"
                id="variable-2"
                name="star--filled"
                size={16}
              />
            </div>
            <div className="quick-panel-cont">
              Staff Profile{" "}
              <Icon
                color={IconColor.Primary500}
                dataTestId="btn-90"
                id="variable-2"
                name="star--filled"
                size={16}
              />
            </div>
            <div className="quick-panel-cont">
              Seating Plans{" "}
              <Icon
                color={IconColor.Primary500}
                dataTestId="btn-90"
                id="variable-2"
                name="star--filled"
                size={16}
              />
            </div>
            <div className="quick-panel-cont">
              Staff TimeTable{" "}
              <Icon
                color={IconColor.Neutral800}
                dataTestId="btn-90"
                id="variable-2"
                name="star"
                size={16}
              />
            </div>
            <div className="quick-panel-cont">
              My Markbook{" "}
              <Icon
                color={IconColor.Neutral800}
                dataTestId="btn-90"
                id="variable-2"
                name="star"
                size={16}
              />
            </div>
            <div className="see-all" onClick={showQuickLinkView}>
              See all
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="open-panel essui-open-panel-filled" data-testId="close-panel">
        <Button
          className="base-class"
          color={ButtonColor.Utility}
          dataTestId="btn-collapse"
          iconColor={IconColor.Neutral800}          
          iconName= "open-panel--left--filled"          
          onClick={togglePanel}
          size={ButtonSize.Small}
        />
      </div>
    )}
    <div />
  </div>
);

export default SidePanel;
