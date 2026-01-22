import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableWrapper,
  Button,
  ButtonSize,
  ButtonColor,
  OverflowMenu,
  OverflowMenuItem,
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  HeadingSubHeading,
  Notification,
  NotificationStatus,
  Loader,
  LoaderType,
  TableStatus,
  Icon,
  IconColor
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";
import { useHistory } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { activateEmailAlert, fetchEmailAlertStatus, systemStatusOverflowMenuOutSideClickHandler } from "./SystemStatusService";
import NotifyExceptionView from "./NotifyException.view";
import { ISystemStatusAlertResponse } from "../../../shared/model/SystemStatus/responsemodel";
import { Alert } from "../interface";
import SystemStatusAlertsTableComponent from "./SystemStatusAlertsTableComponent";


export const getClassNameToHandleOverFlowPostion = (
  index: number,
  length: number
): string => {
  if (index === length - 1) {
    return "template-menu-popover overflow-menu-top";
  }
  return "template-menu-popover";
};

type StringStateTuple = [string | null, React.Dispatch<React.SetStateAction<string | null>>];

const requiredSystemStatusUpdatePermission: Permission[] = [
  { Securable: "NG.AlertEmails.List", Operation: "Update" },
  { Securable: "NG.AlertEmails.List", Operation: "Write" }
];
const canUpdateSystemStatus : boolean = authService.isAuthorised(
  requiredSystemStatusUpdatePermission,
  MatchPermissions.any
);
const SystemStatusAlertsView: React.FC = () => {
  const [sidePanelIsOpen, setSidePanelOpen] : [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] : [Alert | null, React.Dispatch<React.SetStateAction<Alert | null>>] = useState<Alert | null>(null);
  const [alerts, setAlerts] : [Alert[], React.Dispatch<React.SetStateAction<Alert[]>>] = useState<Alert[]>([]);
  const [loading, setLoading] : [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [loading1, setLoading1] : [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [errorText, setErrorText]: StringStateTuple = useState<string | null>(null);
  const [errorNote, setErrorNote]: StringStateTuple = useState<string | null>(null);
  const [successMessage, setSuccessMessage]: StringStateTuple = useState<string | null>(null);
  const [overflowMenuIndex, setOverflowMenuIndex] : [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const overflowMenuRef : React.RefObject<HTMLSpanElement> = useRef<HTMLSpanElement>(null);
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  const [enableNotification, setEnableNotification] = useState<boolean>(false);

  const history : ReturnType<typeof useHistory> = useHistory();
  const handleException : () => void = () => {
    setEnableNotification(true);
  };
  const fetchAlerts : () => Promise<void> = async () => {
    setLoading(true);
    setErrorText(null);

    try {
      const response : ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(handleException, history);

      if (response) {
        const { listenerData, ssmHostData } : ISystemStatusAlertResponse = response;

        // Determine listener status
        let listenerStatus: "Green" | "Connection error" | "Red" = "Red";
        if (listenerData?.listenerStatus === "Live") {
          listenerStatus = "Green";
        } else if (listenerData?.listenerStatus === "Connection error") {
          listenerStatus = "Connection error";
        }

        // Determine listener information
        let listenerInfo = "";
        if (listenerData?.listenerStatus === "Live") {
          listenerInfo = t("SystemStatus_T.DataSyncLiveInfo");
        } else if (listenerData?.listenerStatus === "Connection error") {
          listenerInfo = t("SystemStatus_T.ConnectionError");
        } else {
          listenerInfo = t("SystemStatus_T.DataSyncNotLiveInfo");
        }

        // Determine SSM Host status
        let ssmHostStatus: "Green" | "Connection error" | "Red" = "Red";
        if (ssmHostData?.ssmHostStatus === "Live") {
          ssmHostStatus = "Green";
        } else if (ssmHostData?.ssmHostStatus === "Connection error") {
          ssmHostStatus = "Connection error";
        }

        // Determine SSM Host information
        let ssmHostInfo = "";
        if (ssmHostData?.ssmHostStatus === "Live") {
          ssmHostInfo = t("SystemStatus_T.SSMLiveInfo");
        } else if (ssmHostData?.ssmHostStatus === "Connection error") {
          ssmHostInfo = "-";
        } else {
          ssmHostInfo = t("SystemStatus_T.SSMNotLiveInfo");
        }

        const apiAlerts: Alert[] = [
          {
            id: "1",
            status: listenerStatus,
            alertName: t("SystemStatus_T.DataSyncAlertName"),
            information: listenerInfo,
            emailSubscribed: listenerData?.eMailAlert,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
            isErrorResponse: false,
          },
          {
            id: "2",
            status: ssmHostStatus,
            alertName: t("SystemStatus_T.SSMPackage"),
            information: ssmHostInfo,
            emailSubscribed: ssmHostData?.eMailAlert,
            latestSSMHostVersion: ssmHostData?.latestSSMHostVersion,
            currentSSMHostVersion: ssmHostData?.currentSSMHostVersion,
            isErrorResponse: false,
          }
        ];

        setAlerts(apiAlerts);
      } else {
        // Fallback: no response from API → set Yellow alerts
        setAlerts([
          {
            id: "1",
            status: "Yellow",
            alertName: t("SystemStatus_T.DataSyncAlertName"),
            information: t("SystemStatus_T.WarningMessage"),
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
            isErrorResponse: true,
          },
          {
            id: "2",
            status: "Yellow",
            alertName: t("SystemStatus_T.SSMPackage"),
            information: t("SystemStatus_T.WarningMessage"),
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
            isErrorResponse: true,
          }
        ]);
      }
    } catch (fetchError) {
      setAlerts([
        {
          id: "1",
          status: "Yellow",
          alertName: t("SystemStatus_T.DataSyncAlertName"),
          information: t("SystemStatus_T.WarningMessage"),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
          isErrorResponse: true,
        },
        {
          id: "2",
          status: "Yellow",
          alertName: t("SystemStatus_T.SSMPackage"),
          information: t("SystemStatus_T.WarningMessage"),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
          isErrorResponse: true,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {

    systemStatusOverflowMenuOutSideClickHandler(
      overflowMenuIndex,
      setOverflowMenuIndex
    );

  }, [overflowMenuIndex]);



  const handleActionClick : (action: string, alert: Alert) => void = (action: string, alert: Alert) => {
    if (action === "Activate Email" || action === "Deactivate Email") {
      const emailSubscribed = action === "Deactivate Email";
      // Determine emailType based on alert.id
      const emailType : "SYNC" | "SSM" = alert.id === "1" ? "SYNC" : "SSM";
      setSelectedAlert(alert);
      setLoading1(true);
      activateEmailAlert(
        alert.id,
        emailSubscribed,
        () => {
          setSuccessMessage(t("SystemStatus_T.Changessaved"));
          fetchAlerts();
          setLoading1(false);
        },
        (msg) => {
          setLoading1(false);
          setErrorNote(msg || t("SystemStatus_T.FailedAlert"));

        },
        emailType
      );
    } else if (action === "View") {
      setSelectedAlert(alert);
      setSidePanelOpen(true);
    }

    setOverflowMenuIndex("");
  };

  return (
    <div className="system-status-alerts-view" style={{ margin: "0 20px" }}>
      <div className="admin-heading heading-text-up admin-heading-psas1334f">
        <HeadingSubHeading
          headingText={t("SystemStatus_T.headingTitle")}
          subHeadingText={t("SystemStatus_T.description")}
          isShowHeading
          isShowSubHeading
        />
      </div>

      {enableNotification && (
        <NotifyExceptionView setDisableNotification={setEnableNotification} />
      )}

      {errorText && (
        <div className="error-banner">
          <strong>No data:</strong> {errorText}
        </div>
      )}

      {successMessage && (
        <Notification
          status={NotificationStatus.SUCCESSTOAST}
          title={successMessage}
          autoclose
          escapeExits
          onClickClose={() => setSuccessMessage(null)}
          onAutoClose={() => setSuccessMessage(null)}
        />
      )}

      {errorNote && (
        <Notification
          status={NotificationStatus.WARNING}
          title={
            selectedAlert?.emailSubscribed
              ? t("SystemStatus_T.FailedAlertTitleDeactivate")
              : t("SystemStatus_T.FailedAlertTitleActivate")
          }
          message={
            <span>
              {t("SystemStatus_T.FailedAlertMessage", {
                action: selectedAlert?.emailSubscribed
                  ? "unsubscribing to the email alert"
                  : "subscribing to the email alert",
              })}
            </span>
            }
          onClickClose={() => setErrorNote(null)}
        />
      )}

      {loading1 && (
        <Loader
          className="loader-wrapper"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
          isLoaderModal
        />
      )}
      {(() => {
        let content : React.ReactNode;

        if (loading) {
          content = <div className="loading">Loading...</div>;
        } else if (alerts.length > 0) {
          content = (
            <SystemStatusAlertsTableComponent
              alerts={alerts}
              overflowMenuIndex={overflowMenuIndex}
              setOverflowMenuIndex={setOverflowMenuIndex}
              overflowMenuRef={overflowMenuRef}
              handleActionClick={handleActionClick}
              t={t}
            canUpdateSystemStatus={canUpdateSystemStatus}
            />
          );
        } else {
          content = <div>No results found.</div>;
        }

        return content;
      })()}

      <SidePanel
        dataTestId="side-panel"
        title={selectedAlert ? selectedAlert?.alertName : "Alert Details"}
        isOpen={sidePanelIsOpen}
        onClose={() => setSidePanelOpen(false)}
        showConfirmDialog
      >
        {sidePanelIsOpen && selectedAlert && (
          <>
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

            <SidePanelFooter className="editable-side-panel-footer">
              <Button
                className="btn-full-width"
                color={ButtonColor.Primary}
                dataTestId="btn-close"
                size={ButtonSize.Medium}
                onClick={() => setSidePanelOpen(false)}
              >
                {t("SystemStatus_T.Close")}
              </Button>
            </SidePanelFooter>
          </>
        )}
      </SidePanel>
    </div>
  );
};

export default SystemStatusAlertsView;



