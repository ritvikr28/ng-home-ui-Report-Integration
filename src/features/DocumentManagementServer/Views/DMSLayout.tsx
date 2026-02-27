import React from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import { GridItem, Breadcrumbs, Notification, NotificationStatus, Button, ButtonColor, ButtonSize, IconColor, NotificationActionElement } from "@essnextgen/ui-kit";
import { onBreadcrumbClick } from "../logic/DocumentManagementServer.logic";
import { WelcomeBannerUrl } from "../../../../public/Constants";

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

export const getBannerMessageWithLink: (message: string, linkText: string) => React.ReactNode = (
  message,
  linkText
): React.ReactNode => {
  const [before, after = ""]: string[] = message.split("<link>");
  const [firstLine, secondLine = ""]: string[] = before.split("\n");
  return (
    <span className="document-management-banner">
      {firstLine}
      <br />
      {secondLine}
        <a
          href={WelcomeBannerUrl}
          className="banner-link"
          target="_blank"
          aria-label={linkText}
          rel="noopener noreferrer"
          id="banner-link-id"
        >
          {linkText}
        </a>
      
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

export const PrivateDocumentsBanner: React.FC<{ t: any }> = ({
  t
}) => (
  <Notification
    status={NotificationStatus.WARNING}
    title={t("DocumentManagementServer.privateFilesBannerTitle")}
    message={t("DocumentManagementServer.privateFilesBannerDescription")}
    autoclose={false}
    actionLabel={t("DocumentManagementServer.learnMore")}
    actionElement={NotificationActionElement.Button}

  />
);

