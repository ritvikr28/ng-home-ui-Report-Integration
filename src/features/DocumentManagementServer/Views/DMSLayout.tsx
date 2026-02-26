import React from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import { GridItem, Breadcrumbs, Notification, NotificationStatus, Button, ButtonColor, ButtonSize, IconColor, Link } from "@essnextgen/ui-kit";
import { onBreadcrumbClick } from "../logic/DocumentManagementServer.logic";

export const DeleteSuccessToast: React.FC<{ show: boolean; availableFileCount: number; t: any }> = ({
  show,
  availableFileCount,
  t
}) => (
  <div className="clc-dms-delete-toast">
    {show && (
      <Notification
        status={NotificationStatus.SUCCESSTOAST}
        title={
          availableFileCount === 1
            ? t("DocumentManagementServer.documentDeleted")
            : t("DocumentManagementServer.documentsDeleted")
        }
        autoclose
        hideCloseButton
      />
    )}
  </div>
);

// interface BannerMessageWithLinkProps {
//   message: string;
//   linkText: string;
//   url: string;
// }

export const getBannerMessageWithLink = (
  message: string,
  linkText: string,
  url?: string
): React.ReactNode => {
  const [before, after = ""] = message.split("<link>");
  const [firstLine, secondLine = ""] = before.split("\n");

  return (
    <span>
      {firstLine}
      <br />
      {secondLine}
      {url ? (
        <Link
          href={url}
          className="get-in-touch-link"
          target="_blank"
          aria-label={linkText}
          dataTestId="banner-link"
          id="banner-link-id"
        >
          {linkText}
        </Link>
      ) : (
        <span className="get-in-touch-link" aria-label={linkText}>
          {linkText}
        </span>
      )}
      {after}
    </span>
  );
};
 

export const SideNavigation: React.FC<{
  isOpen: boolean;
  isMobileView: boolean;
  visibleBreadcrumbs: any[];
  handleButtonClick: () => void;
  setIsOpen: (isOpen: boolean) => void;
  t: any;
}> = ({
  isOpen,
  isMobileView,
  visibleBreadcrumbs,
  handleButtonClick,
  setIsOpen,
  t
}) => (
  <GridItem className={!isMobileView ? "side-width" : "no-side-width"}>
    {!isOpen && (
      <Button
        className="base-class"
        color={ButtonColor.Utility}
        dataTestId="btn-collapse"
        iconColor={IconColor.Neutral800}
        iconName="open-panel--left--filled"
        onClick={handleButtonClick}
        size={ButtonSize.Small}
      />
    )}

    <LocalisedMenu
      customHeight={100}
      menuHeading={t("DocumentManagementServer.adminconsole")}
      onCloseSideNavigationPanel={() => setIsOpen(false)}
      isOpenSideNavigation={isOpen}
      defaultSelectedMenu={{
        text: "Documents",
        value: window.location.href
      }}
    />

    {isMobileView && (
      <Breadcrumbs
        breadcrumbActions={visibleBreadcrumbs}
        className="essui-Breadcrumbs"
        dataTestId="breadcrumb-test-id"
        id="element-id"
        onItemClick={onBreadcrumbClick}
      />
    )}
  </GridItem>
);

export const MainContent: React.FC<{
  isMobileView: boolean;
  isOpen: boolean;
  visibleBreadcrumbs: any[];
  children: React.ReactNode;
}> = ({
  isMobileView,
  isOpen,
  visibleBreadcrumbs,
  children
}) => (
  <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
    <div style={{ marginBottom: 16, width: "100%" }}>
      {!isMobileView && (
        <Breadcrumbs
          breadcrumbActions={visibleBreadcrumbs}
          className="essui-Breadcrumbs"
          dataTestId="breadcrumb-test-id"
          id="element-id"
          onItemClick={onBreadcrumbClick}
        />
      )}
      <div className="grid-wrapper">{children}</div>
    </div>
  </GridItem>
);