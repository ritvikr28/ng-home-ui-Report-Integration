import React from "react";
import { Notification, NotificationStatus, SidePanelContent } from "@essnextgen/ui-kit";
import { Alert } from "../interface";

interface SystemStatusAlertPanelContentProps {
  selectedAlert: Alert;
  setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: (key: string, options?: any) => string;
}

const SystemStatusAlertPanelContent: React.FC<SystemStatusAlertPanelContentProps> = ({
  selectedAlert,
  setSidePanelOpen,
  t
}) => (
  <SidePanelContent>
    <div className="alert-panel-content">
      {(selectedAlert?.isErrorResponse || selectedAlert?.status === "Connection error") ? (
        <Notification
          className="alert-notification-warning"
          dataTestId={`notification-${selectedAlert?.status?.toLowerCase()}`}
          escapeExits
          id={`notification-${selectedAlert?.status?.toLowerCase()}-id`}
          onClickClose={() => setSidePanelOpen(false)}
          status={NotificationStatus.WARNING}
          title={t("SystemStatus_T.moduleBlock.notifyException.content")}
          message={
            <div className="secondary-text-simsid">
              <br />
              <div className="secondary-text-simsid-admin-sec-heading">
                {t("SystemStatus_T.moduleBlock.notifyException.title")}
              </div>
            </div>
          }
          hideCloseButton
        />
      ) : (
        <Notification
          className="alert-notification-success"
          dataTestId={`notification-${selectedAlert?.status?.toLowerCase()}`}
          escapeExits
          id={`notification-${selectedAlert?.status?.toLowerCase()}-id`}
          onClickClose={() => setSidePanelOpen(false)}
          status={
            selectedAlert?.status === "Green"
              ? NotificationStatus.SUCCESS
              : NotificationStatus.ERROR
          }
          title={selectedAlert?.information}
          hideCloseButton
        />
      )}

      {/* Your detailed Red alert content goes here */}
      {selectedAlert?.status === "Red" && (
        <div className="alert-description">
          {selectedAlert?.id === "1" && (
            <>
              <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content1")}</p>
              <p><strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content2")}</strong></p>
              <ul>
                <li>
                  <strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content3")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content8")} <strong><a
                    href="https://help.parentpaygroup.com/csm?id=copy_of_kb_article_view_1&sysparm_article=KB0012954"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content4")}</a></strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content7")}
                </li>
                <li><strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content5")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content9")}</li>
                <li><strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content6")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content10")}</li>
              </ul>
            </>
          )}

          {selectedAlert?.id === "2" ? (
            <>
              <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content1")}</p>
              <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content2")}</p>
              <ul>
                <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content3")} {selectedAlert?.latestSSMHostVersion}</li>
                <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content4")} {selectedAlert?.currentSSMHostVersion}</li>
              </ul>
              <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content5")}</p>
              <ul>
                <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content6")}</li>
                <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content7")}</li>
                <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content8")}</li>
              </ul>
              <p><strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content9")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content10")} <strong>
                <a
                  href="https://help.parentpaygroup.com/csm?id=copy_of_kb_article_view_1&sysparm_article=KB0013199"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content11")}
                </a>
              </strong></p>
              <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content12")}</p>
            </>
          ) : <p />}
        </div>
      )}
    </div>
  </SidePanelContent>
);

export default SystemStatusAlertPanelContent;
