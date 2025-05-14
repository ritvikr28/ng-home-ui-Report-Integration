import React, { SyntheticEvent, useState, useEffect, useRef } from "react";
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
  status: "Green" | "Red" | "No Data";
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

  useEffect(() => {
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
              alertName: "Data Sync",
              information:
                listenerData.listenerStatus === "Live"
                  ? "Data is syncing between SIMS 7 and SIMS Next Gen."
                  : "Data is not currently syncing between SIMS 7 and SIMS Next Gen.",
              emailSubscribed: listenerData.eMailAlert,
              latestSSMHostVersion: "",
              currentSSMHostVersion: "",
            },
            {
              id: "2",
              status: ssmHostData.ssmHostStatus === "Live" ? "Green" : "Red",
              alertName: "SSM Package",
              information:
                listenerData.listenerStatus === "Live"
                  ? "Your system is using the most up-to-date SSM package."
                  : "Your SSM package isn't the latest version.",
              emailSubscribed: ssmHostData.eMailAlert,
              latestSSMHostVersion: ssmHostData.latestSSMHostVersion,
              currentSSMHostVersion: ssmHostData.currentSSMHostVersion,
            }
          ];

          setAlerts(apiAlerts);
        }
      } catch (fetchError) {
        setAlerts([
          {
            id: "1",
            status: "No Data",
            alertName: "Data Sync",
            information: "Connection Error",
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
          },
          {
            id: "2",
            status: "No Data",
            alertName: "SSM Package",
            information: "Connection Error",
            emailSubscribed: false,
            latestSSMHostVersion: "",
            currentSSMHostVersion: "",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [history]);

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
          setSuccessMessage("Changes Saved.");
          setAlerts((prevAlerts) =>
            prevAlerts.map((a) =>
              a.id === alert.id ? { ...a, emailSubscribed: !emailSubscribed } : a
            )
          );
          setLoading1(false);
        },
        (msg) => {
          setLoading1(false);
          setErrorNote(msg || "Failed to update email alert.");
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

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <TableComponent
          alerts={alerts}
          overflowMenuIndex={overflowMenuIndex}
          setOverflowMenuIndex={setOverflowMenuIndex}
          overflowMenuRef={overflowMenuRef}
          handleActionClick={handleActionClick}
        />
      )}

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
                            We’ve identified a potential issue that might be preventing data from syncing between SIMS Next Gen and SIMS 7. The most common cause is a problem with your SSM server. A restart of the SSM service will often resolve this.
                          </p>
                          <p><strong>What to do next:</strong></p>
                          <ul>
                            <li>
                              Restart your SSM server: Instructions on restarting your SSM server can be found here <strong>KB0055528 - Troubleshooting issues</strong>. Your IT or SIMS support provider can assist if required.
                            </li>
                            <li>
                              Check that the SSM server is running. If the server is operational, then please check the sync status.
                            </li>
                            <li>
                              Check the sync status. After 24 hours, check that data is now synchronising. If the issue persists, then please log a case with your SIMS support provider.
                            </li>
                          </ul>
                        </>
                      )}

                    {selectedAlert.id === "2" ?
                      (
                        <>
                          <p>
                            Your school’s SSM host package hasn’t yet been updated to the latest version, which was released over 24 hours ago. To keep your system secure, efficient, and up to date, we recommend upgrading at your earliest opportunity.
                          </p>
                          <p><strong>What’s New:</strong></p>
                          <ul>
                            <li><strong>Latest Version:</strong> { selectedAlert.latestSSMHostVersion }</li>
                            <li><strong>Your Current Version:</strong> { selectedAlert.currentSSMHostVersion }</li>
                          </ul>
                          <p>Updating to this new version will bring:</p>
                          <ul>
                            <li>Improved performance</li>
                            <li>Bug fixes</li>
                            <li>Enhanced security features</li>
                          </ul>
                          <p><strong>How to Upgrade:</strong> For step-by-step guidance, please refer to the attached knowledge base article: <strong>SIMS - Preparing SSM (SIMS Services Manager) for Next Gen | ParentPay Group</strong>.</p>
                          <p>Please contact your IT or SIMS support provider should you need assistance with this.</p>
                        </>
                      ) : (
                        <p>An unknown issue has occurred. Please contact your support team for further assistance.</p>
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
                Close
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
}> = ({
  alerts,
  overflowMenuIndex,
  setOverflowMenuIndex,
  overflowMenuRef,
  handleActionClick
}) => (
    <TableWrapper className="system-status-table-wrapper" >
      <Table className="system-status-table" >
        <TableHead>
          <TableRow>
            <TableCell header>Status</TableCell>
            <TableCell header>Alert</TableCell>
            <TableCell header>Information</TableCell>
            <TableCell header>Email Alerts</TableCell>
            <TableCell header />
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert, index) => (
            <TableRow key={alert.id}>
              <TableCell
                status={alert.status === "Red" ? TableStatus.CRITICAL : TableStatus.SUCCESS}
              >
                <span className={`status-pill ${alert.status === "Green" ? "live" : "Fail"}`}>
                  {alert.status === "Green" ? "Live" : "Fail"}

                </span>
              </TableCell>
              <TableCell>{alert.alertName}</TableCell>
              <TableCell>{alert.information}</TableCell>
              <TableCell>{alert.emailSubscribed ? "Yes" : "No"}</TableCell>
              <TableCell>
                <span className="action-table-cell">
                  {overflowMenuIndex === `overflow-${index}` && (
                    <span ref={overflowMenuRef}>
                      <OverflowMenu
                        dataTestId="overflow-menu"
                        id={`overflow-${index}`}
                        onClick={(
                          e: SyntheticEvent<Element, Event>,
                          selectedValue: object
                        ) => {
                          handleActionClick((selectedValue as { value: string }).value, alert);
                        }}
                      >
                        <OverflowMenuItem
                          value="View"

                        >View
                        </OverflowMenuItem>
                        <OverflowMenuItem
                          value={alert.emailSubscribed ? "Deactivate Email" : "Activate Email"}

                        >{alert.emailSubscribed ? "Deactivate Email" : "Activate Email"}</OverflowMenuItem>
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
                  />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );

export default SystemStatusAlertsView;



