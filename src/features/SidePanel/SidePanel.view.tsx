import React, { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Divider,
  Icon,
  IconColor,
  Orientation,
  SideNavigationPanel,
  SideNavigationPanelContent,
  Loader,
  LoaderType,
  Tooltip,
  TooltipAlign,
  TooltipPosition,
  useMediaQuery
} from "@essnextgen/ui-kit";
import "./style.scss";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { SidePanelProps, QuickLinkSidePanel } from "./SidePanelProps";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import { IFetchQuickLinkDetailsFunctionResponse } from "../../shared/model/quickLink/responsemodels";

const requiredPermissionsforquicklink: Permission[] = [
  {
    Securable: "NG.Homepage.QuickLink",
    Operation: "View"
  }
];

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  closePanel,
  showQuickLinkView,
  quicklinkData,
  setQuickLinkData,
  isLoader
}) => {
  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const isPermissionquicklink: boolean = authService.isAuthorised(
    requiredPermissionsforquicklink,
    MatchPermissions.all
  );
  const loginFullname: string | null = authService.getUsername();
  const isMobileView : boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const handleStarClick: (
    id: number,
    favorite: boolean
  ) => Promise<void> = async (id: number, favorite: boolean) => {
   
    try {
      const { status }: { status: number } = await FetchQuickLinkpost(
        id,
        favorite
      );
      if (status === 200) {
        const responseapidata:
          | IFetchQuickLinkDetailsFunctionResponse
          | null
          | undefined = await fetchQuickLinkDetails();
        if (responseapidata != null) {
          setQuickLinkData(responseapidata.response);
          
        }
      }
    } catch (error) {
      setIsError(true);
    }
  };
 
  /*eslint-disable */
  return (
    <>
      <div
        className={`side-view ${
          isOpen ? "open open-panel side-view-res" : "side-view-closed"
        }`}
      >
        {isOpen ? (
          isMobileView ? (
            <SideNavigationPanel
              title={
                loginFullname && loginFullname.length > 24 ? (
                  <Tooltip
                    dataTestId="test-id"
                    align={TooltipAlign.Center}
                    position={TooltipPosition.Bottom}
                    content={loginFullname}
                  >
                    <span className="quick-link-username-tooltip">
                      {loginFullname.substring(0, 24) + "..."}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="quick-link-username-tooltip">
                    <strong>{loginFullname}</strong>
                  </span>
                )
              }
              isOpen={isOpen}
              onClose={togglePanel}
            >
              <Divider
                as="li"
                dataTestId="panel-divider"
                id="panel-divider"
                orientation={Orientation.HORIZONTAL}
                role="separator"
              />
              <SideNavigationPanelContent>
                <div>
                  <div className="quick-lint-display">
                    {isMobileView ? (
                      ""
                    ) : (
                      <span className="icon-close">
                        {" "}
                        <Icon
                          color={IconColor.Primary500}
                          dataTestId="btn-90"
                          id="variable-2"
                          name="close"
                          onClick={closePanel}
                          size={24}
                        />
                      </span>
                    )}
                  </div>
                  {quickLink({
                    isPermissionquicklink,
                    isError,
                    quicklinkData,
                    handleStarClick,
                    showQuickLinkView,
                    isLoader
                  })}
                </div>
              </SideNavigationPanelContent>
            </SideNavigationPanel>
          ) : (
            <div>
              <div className="quick-lint-display">
                {loginFullname && loginFullname.length > 24 ? (
                  <Tooltip
                    dataTestId="test-id"
                    align={TooltipAlign.Center}
                    position={TooltipPosition.Bottom}
                    content={<span>{loginFullname}</span>}
                  >
                    <span className="quick-link-username">
                      <strong>{loginFullname}</strong>
                    </span>
                  </Tooltip>
                ) : (
                  <span className="quick-link-username">
                    <strong>{loginFullname}</strong>
                  </span>
                )}

                <span className="icon-close">
                  {" "}
                  <Icon
                    color={IconColor.Primary500}
                    dataTestId="btn-90"
                    id="variable-2"
                    name="close"
                    onClick={closePanel}
                    size={24}
                  />
                </span>
              </div>
              {quickLink({
                isPermissionquicklink,
                isError,
                quicklinkData,
                handleStarClick,
                showQuickLinkView,
                isLoader
              })}
            </div>
          )
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
    </>
  );
};


//  const getUsernameTooltip :(loginFullname: any) => JSX.Element= (loginFullname) => (
const quickLink :({
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader
}:QuickLinkSidePanel) => JSX.Element=({
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader
}) =>{
  return (
    isPermissionquicklink && (
      <div>
        <div className="quick-link">Quick links</div>
        <div className="quick-link-padding">
          {/*
eslint-disable
*/}
                  {isLoader  ? (
                    <div>
                      <Loader
                        dataTestId="sidepanel-quicklinkerror-loader"
                        className="loader-wrapper loader-sidepanel-quicklink"
                        loaderText="Loading..."
                        loaderType={LoaderType.Circular}
                      />
                    </div>
                  ) : (
                    !isError &&
                    quicklinkData &&
                    quicklinkData.slice(0, 6).map((sidelink: any) => (
                      <div
                        className="quick-panel-cont"
                        key={sidelink.id}
                        onClick={() => {
                          window.location.href = sidelink.link;
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {sidelink.name}
                        <Icon
                          color={
                            sidelink.favourite
                              ? IconColor.Primary500
                              : IconColor.Neutral800
                          }
                          className="icon-margin"
                          dataTestId={`btn-star${sidelink.id}`}
                          id="variable-2"
                          name={sidelink.favourite ? "star--filled" : "star"}
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the div click event from being triggered
                            handleStarClick(sidelink.id, !sidelink.favourite);
                          }}
                          /* eslint-enable */
                        />
                      </div>
                    ))
                  )}

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
    )
  );
};

/* eslint-enable */
export default SidePanel;
