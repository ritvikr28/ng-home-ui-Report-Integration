import React, { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor,
  Link
} from "@essnextgen/ui-kit";
import "./style.scss";
import { authService } from "@essnextgen/auth-ui";
import { SidePanelProps } from "./SidePanelProps";
import QuickLinkResponseComponent from "../../shared/components/QuickLink/Quicklinkresponse";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";

const userFullname: string | null = authService.getUsername();

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  closePanel,
  showQuickLinkView
}) => {
  const [quickLinkData, setQuickLinkData]: [IQuickLinkApiResponse[] | null, React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>] = useState<IQuickLinkApiResponse[] | null>(null);
  
  const [isError, setIsError] = useState<boolean>(false);
  
  return (
  <div
    className={`side-view ${isOpen ? "open open-panel" : "side-view-closed"}`}
  >
    <QuickLinkResponseComponent setQuickLinkData={setQuickLinkData}
          setIsError={setIsError} />

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
            {!isError && quickLinkData && quickLinkData.map((link) => (<div className="quick-panel-cont">
            <Link data-testid="link" href={link.link} target="_self">
                              {link.name}
                            </Link>
              <Icon
                color={link.favourite ? IconColor.Primary500 : IconColor.Neutral800 } 
                dataTestId="btn-90"
                id="variable-2"
                name={link.favourite ? 'star--filled' : 'star'}
                size={16}
              />
            </div>))}
            
            {/*
  eslint-disable jsx-a11y/anchor-is-valid,
  no-script-url
*/}
            <a
              href="javascript:void(0)"
              className="see-all"
              onClick={showQuickLinkView}
            >
              See all
            </a>
            {/*
  eslint-enable jsx-a11y/anchor-is-valid,
  no-script-url
*/}
          </div>
        </div>
      </div>
    ) : (
      <div
        className="open-panel essui-open-panel-filled"
        data-testId="close-panel"
      >
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
  )
};

export default SidePanel;
