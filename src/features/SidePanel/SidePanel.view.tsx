import React, { useState } from "react";
import {
  Icon,
  IconColor,
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
import {
  UseTranslationResponse,
  useTranslation
} from "@essnextgen/ui-intl-kit";
import { SidePanelProps, QuickLinkSidePanel } from "./SidePanelProps";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import gtmAnalytics from "../../shared/utils/analytics";
import { envConfig } from "../../shared/utils";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";

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
  isLoader = false,
  isSIMSIDAdmin = false
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
  const loginFullname: string = getLoginFullName(fullName);
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const handleStarClick: (
    id: number,
    favorite: boolean,
    name: string
  ) => Promise<void> = async (
    id: number,
    favorite: boolean,
    name: string
  ): Promise<void> => {
    try {
      await handleStarClickAsync(id, favorite, name, setQuickLinkData);
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <div className={`side-view-panel ${getSideViewClass(isOpen)}`}>
      {isOpen &&
        renderSideNavigationPanel({
          isMobileView,
          loginFullname,
          togglePanel,
          closePanel,
          isSIMSIDAdmin,
          isPermissionquicklink,
          isError,
          quicklinkData,
          handleStarClick,
          showQuickLinkView,
          isLoader,
          isOpen
        })}
    </div>
  );
};

// Helper Functions

const getLoginFullName: (fullName: string | null) => string = (
  fullName: string | null
): string => (fullName === null ? "" : fullName.split(" ")[0]);

const getSideViewClass: (isOpen: boolean) => string = (
  isOpen: boolean
): string => (isOpen ? "open-sideview open-panel-view" : "side-view-closed");

const handleStarClickAsync: (
  id: number,
  favorite: boolean,
  name: string,
  setQuickLinkData: React.Dispatch<React.SetStateAction<any>>
) => Promise<void> = async (
  id: number,
  favorite: boolean,
  name: string,
  setQuickLinkData: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  const { status }: { status: number } = await FetchQuickLinkpost(id, favorite);
  if (status === 200) {
    const responseapidata:
      | { response: IQuickLinkApiResponse[]; status: boolean }
      | null
      | undefined = await fetchQuickLinkDetails();
    if (responseapidata != null) {
      setQuickLinkData(responseapidata.response);
    }
  }
  /* eslint-disable */
  let elementType: "empty_star" | "filled_star" = favorite
    ? "empty_star"
    : "filled_star";
  gtmAnalytics.pushEvent({
    event: "interact_click",
    elementType,
    elementTextOrLabel: name,
    elementLocation: "sidebar"
  });
};

interface RenderSideNavigationPanelProps {
  isMobileView: boolean;
  loginFullname: string;
  togglePanel: () => void;
  closePanel: () => void;
  isSIMSIDAdmin: boolean;
  isPermissionquicklink: boolean;
  isError: boolean;
  quicklinkData: any;
  handleStarClick: (
    id: number,
    favorite: boolean,
    name: string
  ) => Promise<void>;
  showQuickLinkView: () => void;
  isLoader: boolean;
  isOpen: boolean;
}

const renderSideNavigationPanel: React.FC<RenderSideNavigationPanelProps> = ({
  isMobileView,
  loginFullname,
  togglePanel,
  closePanel,
  isSIMSIDAdmin,
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader,
  isOpen
}: RenderSideNavigationPanelProps) => {
  return isMobileView || !isOpen ? (
    <SideNavigationPanel
      title={getNavigationPanelTitle(loginFullname, isMobileView)}
      isOpen={isOpen}
      onClose={togglePanel}
    >
      <SideNavigationPanelContent>
        <div>
          <div className="user-name-display">
            {isMobileView ? "" : renderCloseIcon(closePanel)}
          </div>
          {isSIMSIDAdmin
            ? simsIdAdminQuickLink()
            : quickLink({
                isPermissionquicklink,
                isError,
                quicklinkData,
                handleStarClick,
                showQuickLinkView,
                isLoader,
                togglePanel,
                isMobileView
              })}
        </div>
      </SideNavigationPanelContent>
    </SideNavigationPanel>
  ) : (
    renderQuickLinkContent({
      loginFullname,
      closePanel,
      isSIMSIDAdmin,
      isPermissionquicklink,
      isError,
      quicklinkData,
      handleStarClick,
      showQuickLinkView,
      isLoader,
      togglePanel,
      isMobileView
    })
  );
};

/* eslint-disable */
const getNavigationPanelTitle: (
  loginFullname: string,
  isMobileView: boolean
) => JSX.Element = (loginFullname: string, isMobileView: boolean) => {
  return loginFullname && loginFullname.length > 24 ? (
    isMobileView ? (
      <Tooltip
        dataTestId="test-id"
        align={TooltipAlign.Center}
        position={TooltipPosition.Bottom}
        content={loginFullname}
      >
        <span className="quick-link-username-tooltip-dertfsg11463f">
          {`${loginFullname.substring(0, 24)}...`}
          {`${loginFullname.substring(0, 24)}...`}
        </span>
      </Tooltip>
    ) : (
      <span className="quick-link-username">
        {`${loginFullname.substring(0, 24)}...`}
      </span>
    )
  ) : isMobileView ? (
    <span className="quick-link-username-tooltip-dertfsg11463f">
      <strong>{loginFullname}</strong>
    </span>
  ) : (
    <span className="quick-link-username">
      <strong>{loginFullname}</strong>
    </span>
  );
};
/* eslint-enable */
const renderCloseIcon: (closePanel: () => void) => JSX.Element = (
  closePanel: () => void
): JSX.Element => (
  <span className="close-btn">
    <Icon
      color={IconColor.Primary500}
      dataTestId="btn-90"
      id="variable-2"
      name="close"
      className="left-side-close-btn"
      onClick={closePanel}
      size={24}
    />
  </span>
);

interface RenderQuickLinkContentProps {
  loginFullname: string;
  closePanel: () => void;
  isSIMSIDAdmin: boolean;
  isPermissionquicklink: boolean;
  isError: boolean;
  quicklinkData: any;
  handleStarClick: (
    id: number,
    favorite: boolean,
    name: string
  ) => Promise<void>;
  showQuickLinkView: () => void;
  isLoader: boolean;
  togglePanel: () => void;
  isMobileView: boolean;
}

const renderQuickLinkContent: React.FC<RenderQuickLinkContentProps> = ({
  loginFullname,
  closePanel,
  isSIMSIDAdmin,
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader,
  togglePanel,
  isMobileView
}: RenderQuickLinkContentProps) => (
  <div>
    <div className="user-name-display">
      {getNavigationPanelTitle(loginFullname, isMobileView)}
      {renderCloseIcon(closePanel)}
    </div>
    {isSIMSIDAdmin
      ? simsIdAdminQuickLink()
      : quickLink({
          isPermissionquicklink,
          isError,
          quicklinkData,
          handleStarClick,
          showQuickLinkView,
          isLoader,
          togglePanel,
          isMobileView
        })}
  </div>
);

const simsIdAdminQuickLink: () => JSX.Element = () => (
  <div className="left-sidepanel-home113">
    <div className="quick-link-title">Quick Links</div>
    <div className="quick-link-section">
      <div
        className="quick-link-panel-item label-css"
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
//  const getUsernameTooltip :(loginFullname: any) => JSX.Element= (loginFullname) => (
const quickLink: (props: QuickLinkSidePanel) => JSX.Element | null = ({
  isPermissionquicklink,
  isError,
  quicklinkData,
  handleStarClick,
  showQuickLinkView,
  isLoader,
  togglePanel,
  isMobileView
}: QuickLinkSidePanel): JSX.Element | null => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    isPermissionquicklink && (
      <div className="left-sidepanel-home113">
        <div className="quick-link-title"> {t("quickLink.headingTitle")}</div>
        <div className="quick-link-section">
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
            quicklinkData && (
              <>
                <div
                  className="quick-link-panel-item"
                  onClick={() => {
                    const classViewLink = quicklinkData.find(
                      (link: any) => link.name === t("quickLink.classview")
                    )?.link;
                    if (classViewLink) {
                      window.location.href = classViewLink;
                      gtmAnalytics.pushEvent({
                        event: "click",
                        linkText: "Class View",
                        linkUrl: classViewLink,
                        clickType: "link",
                        clickLocation: "sidebar"
                      });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {t("quickLink.classview")}
                </div>

                {quicklinkData
                  .filter(
                    (sidelink: any) =>
                      sidelink.name !== t("quickLink.classview")
                  )
                  .slice(0, 6)
                  .map((sidelink: any) => (
                    <div
                      className="quick-link-panel-item"
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
                          handleStarClick(
                            sidelink.id,
                            !sidelink.favourite,
                            sidelink.name
                          );
                        }}
                      />
                    </div>
                  ))}
              </>
            )
          )}

          {/*
eslint-disable jsx-a11y/anchor-is-valid,
no-script-url
*/}
          <a
            href="javascript:void(0)"
            className="see-all-dertfsg11463f"
            onClick={() => {
              isMobileView ? togglePanel() : "";
              showQuickLinkView();
            }}
            /* eslint-enable */
          >
            {t("quickLink.quicklinkseeall")}
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
