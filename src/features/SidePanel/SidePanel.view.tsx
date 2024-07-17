import React, { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor,
  SideNavigationPanel,
  SideNavigationPanelContent,
  Loader,
  LoaderType,
  Tooltip,
  TooltipAlign,
  TooltipPosition,
  useMediaQuery,
  Orientation,
  Divider
} from "@essnextgen/ui-kit";
import "./style.scss";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { SidePanelProps, QuickLinkSidePanel } from "./SidePanelProps";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import { IFetchQuickLinkDetailsFunctionResponse } from "../../shared/model/quickLink/responsemodels";
import gtmAnalytics from "../../shared/utils/analytics";
import { envConfig } from "../../shared/utils";

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
  isLoader,
  isSIMSIDAdmin
}) => {
  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const isPermissionquicklink: boolean = authService.isAuthorised(
    requiredPermissionsforquicklink,
    MatchPermissions.all
  );
  const fullName: string | null = authService.getUsername();
  const loginFullname: string = (fullName === null) ? "" : fullName.split(" ")[0];
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const handleStarClick: (
    id: number,
    favorite: boolean,
    name: string
  ) => Promise<void> = async (id: number, favorite: boolean, name: string) => {

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

      type ElementType = "empty_star" | "filled_star";
      const elementType: ElementType = favorite ? "empty_star" : "filled_star";

      gtmAnalytics.pushEvent({
        event: "interact_click",
        elementType,
        elementTextOrLabel: name,
        elementLocation: "sidebar"
      });
    } catch (error) {
      setIsError(true);
    }
  };

  /*eslint-disable */
  return (
    <>
      <div
        className={`side-view-dertfsg11463f ${isOpen ? "open-dertfsg11463f open-panel-dertfsg11463f side-view-res-dertfsg11463f" : "side-view-closed-dertfsg11463f"
          }`}
      >
        {isOpen ? (
          isMobileView || !isOpen ? (
            <SideNavigationPanel
              title={
                loginFullname && loginFullname.length > 24 ? (
                  <Tooltip
                    dataTestId="test-id"
                    align={TooltipAlign.Center}
                    position={TooltipPosition.Bottom}
                    content={loginFullname}
                  >
                    <span className="quick-link-username-tooltip-dertfsg11463f">
                      {loginFullname.substring(0, 24) + "..."}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="quick-link-username-tooltip-dertfsg11463f">
                    <strong>{loginFullname}</strong>
                  </span>
                )
              }
              isOpen={isOpen}
              onClose={togglePanel}
            >
              <div className="sidepanel-mobile-divider-dertfsg11463f">
                <Divider
                  as="li"
                  dataTestId="panel-divider"
                  id="panel-divider"
                  orientation={Orientation.HORIZONTAL}
                  role="separator"
                />
              </div>
              <SideNavigationPanelContent>
                <div>
                  <div className="quick-lint-display-dertfsg11463f">
                    {isMobileView ? (
                      ""
                    ) : (
                      <span className="icon-close-dertfsg11463f">
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
                  {isSIMSIDAdmin ? (
                    simsIdAdminQuickLink()
                  ) : (
                    quickLink({
                      isPermissionquicklink,
                      isError,
                      quicklinkData,
                      handleStarClick,
                      showQuickLinkView,
                      isLoader,
                      togglePanel,
                      isMobileView,
                    })
                  )}
                </div>
              </SideNavigationPanelContent>
            </SideNavigationPanel>
          ) : (
            <div>
              <div className="quick-lint-display-dertfsg11463f">
                {loginFullname && loginFullname.length > 24 ? (
                  <Tooltip
                    dataTestId="test-id"
                    align={TooltipAlign.Center}
                    position={TooltipPosition.Bottom}
                    content={<span>{loginFullname}</span>}
                  >
                    <span className="quick-link-username-dertfsg11463f">
                      <strong>{loginFullname}</strong>
                    </span>
                  </Tooltip>
                ) : (
                  <span className="quick-link-username-dertfsg11463f">
                    <strong>{loginFullname}</strong>
                  </span>
                )}

                <span className="icon-close-dertfsg11463f">
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
              {isSIMSIDAdmin ? (
                simsIdAdminQuickLink()
              ) : (
                quickLink({
                  isPermissionquicklink,
                  isError,
                  quicklinkData,
                  handleStarClick,
                  showQuickLinkView,
                  isLoader,
                  togglePanel,
                  isMobileView,
                })
              )}
            </div>
          )
        ) : (
          <div
            className="open-panel-dertfsg11463f essui-open-panel-filled filled-icon-align"
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


const simsIdAdminQuickLink: () => JSX.Element = () => {
  return (
    <div className="left-sidepanel-home113">
      <div className="quick-link-dertfsg11463f">
        Quick links
      </div>
      <div className="quick-link-padding-dertfsg11463f ">
        <div
          className="quick-panel-cont-dertfsg11463f label-css"
          key={1}
          onClick={() => {
            window.location.href = `${envConfig.INVITE_STAFF_URL}`;
          }}
          style={{ cursor: "pointer" }}
        >
          Invite Staff
        </div>
      </div>
    </div>
  );
};
//  const getUsernameTooltip :(loginFullname: any) => JSX.Element= (loginFullname) => (
const quickLink: ({
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader,
  togglePanel,
  isMobileView
}: QuickLinkSidePanel) => JSX.Element = ({
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader,
  togglePanel,
  isMobileView
}) => {
    return (
      isPermissionquicklink && (
        <div className="left-sidepanel-home113">
          <div className="quick-link-dertfsg11463f">Quick links</div>
          <div className="quick-link-padding-dertfsg11463f">
            {/*
eslint-disable
*/}
            {isLoader ? (
              <div>
                <Loader
                  dataTestId="sidepanel-quicklinkerror-loader-dertfsg11463f"
                  className="loader-wrapper loader-sidepanel-quicklink-dertfsg11463f"
                  loaderText="Loading..."
                  loaderType={LoaderType.Circular}
                />
              </div>
            ) : (
              !isError &&
              quicklinkData &&
              quicklinkData.slice(0, 6).map((sidelink: any) => (
                <div
                  className="quick-panel-cont-dertfsg11463f"
                  key={sidelink.id}
                  onClick={() => {
                    window.location.href = sidelink.link;
                    gtmAnalytics.pushEvent({
                      event: "click",
                      linkText: sidelink.name,
                      linkUrl: sidelink.link,
                      clickType: "link",
                      clickLocation: "sidebar"
                    });
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
                    className="icon-margin-dertfsg11463f"
                    dataTestId={`btn-star${sidelink.id}`}
                    id="variable-2"
                    name={sidelink.favourite ? "star--filled" : "star"}
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the div click event from being triggered
                      handleStarClick(sidelink.id, !sidelink.favourite, sidelink.name);
                    }}
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
              className="see-all-dertfsg11463f"
              onClick={() => {
                isMobileView ? togglePanel() : '';
                showQuickLinkView();
              }}
            /* eslint-enable */
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
