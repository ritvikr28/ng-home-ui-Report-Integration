import React, { useState, useEffect, useRef } from "react";
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
  TableStatus
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";
import { useHistory } from "react-router-dom";
import { activateEmailAlert, fetchEmailAlertStatus } from "./SystemStatusService";
import NotifyExceptionView from "./NotifyException.view";

interface Alert {
  id: string;
  status: "Green" | "Red" | "Yellow";
  alertName: string;
  information: string;
  emailSubscribed: boolean;
  latestSSMHostVersion: string;
  currentSSMHostVersion: string;
  isErrorResponse?: boolean;
}
export const getClassNameToHandleOverFlowPostion = (
  index: number,
  length: number
): string => {
  if (index === length - 1) {
    return "template-menu-popover overflow-menu-top";
  }
  return "template-menu-popover";
};
const SystemStatusAlertsView: React.FC = () => {
  const [sidePanelIsOpen, setSidePanelOpen] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [errorNote, setErrorNote] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [overflowMenuIndex, setOverflowMenuIndex] = useState<string>("");
  const overflowMenuRef = useRef<HTMLSpanElement>(null);
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  const [enableNotification, setEnableNotification] = useState<boolean>(false);

  const history = useHistory();
  const handleException = () => {
    setEnableNotification(true);
  };
  const fetchAlerts = async () => {
    setLoading(true);
    setErrorText(null);

    try {
      const response = await fetchEmailAlertStatus(handleException, history);

      if (response) {
        const { listenerData, ssmHostData } = response;

        const apiAlerts: Alert[] = [
          {
            id: "1",
            status: listenerData.listenerStatus === "Live" ? "Green" : "Red",
            alertName: t("SystemStatus_T.DataSyncAlertName"),
            information:
              listenerData.listenerStatus === "Live"
                ? t("SystemStatus_T.DataSyncLiveInfo")
                : t("SystemStatus_T.DataSyncNotLiveInfo"),
            emailSubscribed: listenerData.eMailAlert,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
            isErrorResponse: false,
          },
          {
            id: "2",
            status: ssmHostData.ssmHostStatus === "Live" ? "Green" : "Red",
            alertName: t("SystemStatus_T.SSMPackage"),
            information:
              ssmHostData.ssmHostStatus === "Live"
                ? t("SystemStatus_T.SSMLiveInfo")
                : t("SystemStatus_T.SSMNotLiveInfo"),
            emailSubscribed: ssmHostData.eMailAlert,
            latestSSMHostVersion: ssmHostData.latestSSMHostVersion,
            currentSSMHostVersion: ssmHostData.currentSSMHostVersion,
            isErrorResponse: false,
          }
        ];

        setAlerts(apiAlerts);
      }
      else {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(event.target as Node)
      ) {
        setOverflowMenuIndex("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: string, alert: Alert) => {
    if (action === "Activate Email" || action === "Deactivate Email") {
      const emailSubscribed = action === "Deactivate Email";
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

        }
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
          onClickClose={() => setSuccessMessage(null)}
        />
      )}

      {errorNote && (
        <Notification
          status={NotificationStatus.WARNING}
          title={errorNote}
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
        let content;

        if (loading) {
          content = <div className="loading">Loading...</div>;
        } else if (alerts.length > 0) {
          content = (
            <TableComponent
              alerts={alerts}
              overflowMenuIndex={overflowMenuIndex}
              setOverflowMenuIndex={setOverflowMenuIndex}
              overflowMenuRef={overflowMenuRef}
              handleActionClick={handleActionClick}
              t={t}

            />
          );
        } else {
          content = <div>No results found.</div>;
        }

        return content;
      })()}

      <SidePanel
        dataTestId="side-panel"
        title={selectedAlert ? selectedAlert.alertName : "Alert Details"}
        isOpen={sidePanelIsOpen}
        onClose={() => setSidePanelOpen(false)}
        showConfirmDialog
      >
        {sidePanelIsOpen && selectedAlert && (
          <>
            <SidePanelContent>
              <div className="alert-panel-content">
                {selectedAlert.isErrorResponse ? (
                  <Notification
                    status={NotificationStatus.WARNING}
                    title={t("SystemStatus_T.WarningMessage")}
                    hideCloseButton
                  />
                ) : (
                  <Notification
                    dataTestId={`notification-${selectedAlert.status.toLowerCase()}`}
                    escapeExits
                    id={`notification-${selectedAlert.status.toLowerCase()}-id`}
                    onClickClose={() => setSidePanelOpen(false)}
                    status={
                      selectedAlert.status === "Green"
                        ? NotificationStatus.SUCCESS
                        : NotificationStatus.ERROR
                    }
                    title={selectedAlert.information}
                    hideCloseButton
                  />
                )}
                {selectedAlert.status === "Red" && (
                  <div className="alert-description">
                    {selectedAlert.id === "1" &&
                      (
                        <>
                          <p>
                            {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content1")}
                          </p>
                          <p>
                            <strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content2")}</strong>
                          </p>
                          <ul>
                            <li>
                              <strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content3")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content8")} <strong><a
                                href="https://help.parentpaygroup.com/csm?id=copy_of_kb_article_view_1&sysparm_article=KB0012954"
                                target="_blank"
                                rel="noopener noreferrer"
                              >{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content4")}</a></strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content7")}
                            </li>
                            <li>
                              <strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content5")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content9")}
                            </li>
                            <li>
                              <strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content6")}</strong> {t("SystemStatus_T.moduleBlock.ErrorMessagesDataSync.content10")}
                            </li>
                          </ul>
                        </>
                      )}

                    {selectedAlert.id === "2" ?
                      (
                        <>
                          <p>
                            {t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content1")}
                          </p>
                          <p><strong>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content2")}</strong></p>
                          <ul>
                            <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content3")} {selectedAlert.latestSSMHostVersion}</li>
                            <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content4")} {selectedAlert.currentSSMHostVersion}</li>
                          </ul>
                          <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content5")}</p>
                          <ul>
                            <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content6")}</li>
                            <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content7")}</li>
                            <li>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content8")}</li>
                          </ul>
                          <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content9")}{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content10")} <strong>
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
                      ) : (
                        <p />
                      )}
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

const TableComponent: React.FC<{
  alerts: Alert[];
  overflowMenuIndex: string;
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>;
  overflowMenuRef: React.RefObject<HTMLSpanElement>;
  handleActionClick: (action: string, alert: Alert) => void;
  t: (key: string) => string;
}> = ({
  alerts,
  overflowMenuIndex,
  setOverflowMenuIndex,
  overflowMenuRef,
  handleActionClick,
  t
}) => {
    const getTableStatus = (status: string): TableStatus => {
      if (status === "Yellow") return TableStatus.WARNING;
      if (status === "Red") return TableStatus.CRITICAL;
      return TableStatus.SUCCESS;
    };

    const getStatusLabel = (status: string): string => {
      if (status === "Yellow") return t("SystemStatus_T.NoData");
      if (status === "Green") return t("SystemStatus_T.Live");
      return t("SystemStatus_T.Fail");
    };

    const getEmailSubscriptionText = (alert: Alert): string => {
      if (alert.isErrorResponse) {
        return "-";
      }
      return alert.emailSubscribed ? t("SystemStatus_T.Yes") : t("SystemStatus_T.No");
    };
    return (

      <TableWrapper

      >
        <div className="responsive-table-container">
          <Table isStatus className="status-table">
            <TableHead>
              <TableRow>
                <TableCell header className="status-table-cell">{t("SystemStatus_T.Status")}</TableCell>
                <TableCell header>{t("SystemStatus_T.Alert")}</TableCell>
                <TableCell header>{t("SystemStatus_T.Information")}</TableCell>
                <TableCell header>{t("SystemStatus_T.EmailAlerts")}</TableCell>
                <TableCell header />
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert, index) => {
                const status = getTableStatus(alert.status);
                const statusLabel = getStatusLabel(alert.status);
                const statusClass = alert.status === "Green" ? "Live" : "Fail";

                return (
                  <TableRow key={alert.id}>
                    <TableCell status={status} className="status-table-cell">
                      <span className={`status-pill ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </TableCell>
                    <TableCell>{alert.alertName}</TableCell>
                    <TableCell
                      className={alert.isErrorResponse ? "information-column-error" : ""}
                    >
                      {alert.isErrorResponse ? (
                        <div className="warning--alt">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.8999 13.8C14.8999 13.9 14.6999 14 14.4999 14H1.4999C1.2999 14 1.1999 13.9 1.0999 13.8C0.999902 13.6 0.999902 13.5 1.0999 13.3L7.5999 1.30002C7.6999 1.00002 7.9999 0.900024 8.1999 1.10002C8.2999 1.10002 8.3999 1.20002 8.3999 1.30002L14.8999 13.3C14.9999 13.5 14.9999 13.6 14.8999 13.8ZM8.52412 5.5H7.52412V9H8.52412V5.5ZM7.22412 11.1C7.22412 10.6 7.62412 10.3 8.02412 10.3C8.42412 10.3 8.82412 10.6 8.82412 11.1C8.82412 11.6 8.42412 11.9 8.02412 11.9C7.52412 11.9 7.22412 11.6 7.22412 11.1ZM13.5999 13H2.2999L7.9999 2.50002L13.5999 13Z" fill="#A86500" />
                          </svg>
                          <span > {t("SystemStatus_T.WarningMessage")}</span>
                        </div>
                      ) : (
                        alert.information
                      )}
                    </TableCell>
                    <TableCell>
                      {getEmailSubscriptionText(alert)}
                    </TableCell>
                    <TableCell>
                      <span className="action-table-cell">
                        {alert.isErrorResponse ? (
                          <button
                            type="button"
                            onClick={() => handleActionClick("View", alert)}
                            className="view-link-as-button"
                          >
                            {t("SystemStatus_T.View")}
                          </button>
                        ) : (
                          <Button
                            size={ButtonSize.Small}
                            color={
                              overflowMenuIndex === `overflow-${index}`
                                ? ButtonColor.Primary
                                : ButtonColor.Utility
                            }
                            onClick={() =>
                              overflowMenuIndex === `overflow-${index}`
                                ? setOverflowMenuIndex("")
                                : setOverflowMenuIndex(`overflow-${index}`)
                            }
                            iconName="overflow-menu--horizontal"
                            ariaLabel="Overflow menu"
                          />
                        )}
                        {overflowMenuIndex === `overflow-${index}` && (
                          <span ref={overflowMenuRef}>
                            <OverflowMenu
                              dataTestId="childcare-overflow-menu"
                              id={`childcare-overflow-menu-${index}`}
                              onClick={(e, selectedValue) =>
                                handleActionClick(
                                  (selectedValue as { value: string }).value,
                                  alert
                                )
                              }
                              className={getClassNameToHandleOverFlowPostion(
                                index,
                                alerts.length
                              )}
                            >
                              <OverflowMenuItem value="View">
                                {t("SystemStatus_T.View")}
                              </OverflowMenuItem>
                              <OverflowMenuItem
                                value={
                                  alert.emailSubscribed
                                    ? "Deactivate Email"
                                    : "Activate Email"
                                }
                              >
                                {alert.emailSubscribed
                                  ? t("SystemStatus_T.Deactivateemail")
                                  : t("SystemStatus_T.Activateemail")}
                              </OverflowMenuItem>
                            </OverflowMenu>
                          </span>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TableWrapper>
    );
  };


export default SystemStatusAlertsView;



