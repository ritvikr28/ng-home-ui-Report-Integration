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
}

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
            status: listenerData.listenerStatus === (t("SystemStatus_T.Live")) ? "Green" : "Red",
            alertName: (t("SystemStatus_T.DataSyncAlertName")),
            information:
              listenerData.listenerStatus === (t("SystemStatus_T.Live"))
                ? (t("SystemStatus_T.DataSyncLiveInfo"))
                : (t("SystemStatus_T.DataSyncNotLiveInfo")),
            emailSubscribed: listenerData.eMailAlert,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
          },
          {
            id: "2",
            status: ssmHostData.ssmHostStatus === (t("SystemStatus_T.Live")) ? "Green" : "Red",
            alertName: (t("SystemStatus_T.SSMPackage")),
            information:
              ssmHostData.ssmHostStatus === (t("SystemStatus_T.Live"))
                ? (t("SystemStatus_T.SSMLiveInfo"))
                : (t("SystemStatus_T.SSMNotLiveInfo")),
            emailSubscribed: ssmHostData.eMailAlert,
            latestSSMHostVersion: ssmHostData.latestSSMHostVersion,
            currentSSMHostVersion: ssmHostData.currentSSMHostVersion,
          }
        ];

        setAlerts(apiAlerts);
      }
      else {
        setAlerts([
          {
            id: "1",
            status: "Yellow",
            alertName: (t("SystemStatus_T.DataSyncAlertName")),
            information: (t("SystemStatus_T.WarningMessage")),
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
          },
          {
            id: "2",
            status: "Yellow",
            alertName: (t("SystemStatus_T.SSMPackage")),
            information: (t("SystemStatus_T.WarningMessage")),
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
          }
        ]);
      }

    } catch (fetchError) {
      setAlerts([
        {
          id: "1",
          status: "Yellow",
          alertName: (t("SystemStatus_T.DataSyncAlertName")),
          information: (t("SystemStatus_T.WarningMessage")),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
        },
        {
          id: "2",
          status: "Yellow",
          alertName: (t("SystemStatus_T.SSMPackage")),
          information: (t("SystemStatus_T.WarningMessage")),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
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
    if (action === (t("SystemStatus_T.Activateemail")) || action === (t("SystemStatus_T.Deactivateemail"))) {
      const emailSubscribed = action === (t("SystemStatus_T.Deactivateemail"));
      setLoading1(true);

      activateEmailAlert(
        alert.id,
        emailSubscribed,
        () => {
          setSuccessMessage((t("SystemStatus_T.Changessaved")));
          fetchAlerts();
          setLoading1(false);
        },
        (msg) => {
          setLoading1(false);
          setErrorNote(msg || (t("SystemStatus_T.FailedAlert")));
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
                          <p>{t("SystemStatus_T.moduleBlock.ErrorMessagesSSMPackage.content2")}</p>
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


    return (
      <TableWrapper className="system-status-table-wrapper-systam_alert_table">
        <Table >
          <TableHead>
            <TableRow>
              <TableCell header>{t("SystemStatus_T.Status")}</TableCell>
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
                  <TableCell status={status}>
                    <span className={`status-pill ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </TableCell>
                  <TableCell>{alert.alertName}</TableCell>
                  <TableCell>{alert.information}</TableCell>
                  <TableCell>{alert.emailSubscribed ? t("SystemStatus_T.Yes") : t("SystemStatus_T.No")}</TableCell>
                  <TableCell>
                    <span className="action-table-cell">
                      {overflowMenuIndex === `overflow-${index}` && (
                        <span ref={overflowMenuRef}>
                          <OverflowMenu
                            dataTestId="overflow-menu"
                            id={`overflow-${index}`}
                            onClick={(e, selectedValue) =>
                              handleActionClick(
                                (selectedValue as { value: string }).value,
                                alert
                              )
                            }
                          >
                            <OverflowMenuItem value="View"> {t("SystemStatus_T.View")}</OverflowMenuItem>
                            <OverflowMenuItem
                              value={
                                alert.emailSubscribed
                                  ? "Deactivate Email"
                                  : "Activate Email"
                              }
                            >
                              {alert.emailSubscribed
                                ? (t("SystemStatus_T.Deactivateemail"))
                                : (t("SystemStatus_T.Activateemail"))}
                            </OverflowMenuItem>
                          </OverflowMenu>
                        </span>
                      )}
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
                        disabled={alert.status === "Yellow"}
                      />

                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableWrapper>
    );
  };


export default SystemStatusAlertsView;



