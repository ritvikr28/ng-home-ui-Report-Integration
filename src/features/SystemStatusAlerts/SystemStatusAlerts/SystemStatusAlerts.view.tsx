import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonSize,
  ButtonColor,
  SidePanel,
  SidePanelFooter,
  HeadingSubHeading,
  Notification,
  NotificationStatus,
  Loader,
  LoaderType
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";
import { useHistory } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { activateEmailAlert, fetchEmailAlertStatus, systemStatusOverflowMenuOutSideClickHandler } from "./SystemStatusService";
import { fetchAlertsUtil } from "./SystemStatusAlertsUtil";
import NotifyExceptionView from "./NotifyException.view";
import SystemStatusAlertPanelContent from "./SystemStatusAlertPanelContent";
import { Alert } from "../interface";
import SystemStatusAlertsTableComponent from "./SystemStatusAlertsTableComponent";

 type AlertsState = [Alert[], React.Dispatch<React.SetStateAction<Alert[]>>];
interface SystemStatusAlertsContentProps {
  loading: boolean;
  alerts: Alert[];
  overflowMenuIndex: string;
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>;
  overflowMenuRef: React.RefObject<HTMLSpanElement>;
  handleActionClick: (action: string, alert: Alert) => void;
  t: (key: string) => string;
  canUpdateSystemStatus: boolean;
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


// Helper function to render notifications and error/success banners
function renderNotification({ enableNotification, setEnableNotification, errorText, successMessage, setSuccessMessage, errorNote, setErrorNote, selectedAlert, t }: any) {
  return <>
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
                : "subscribing to the email alert"
            })}
          </span>
        }
        onClickClose={() => setErrorNote(null)}
      />
    )}
  </>;
}

// Helper function to handle email alert actions
function handleEmailAction({ alert, action, t, setSelectedAlert, setLoading1, setSuccessMessage, fetchAlerts, setErrorNote }: any) {
  const emailSubscribed = action === "Deactivate Email";
  const emailType: "SYNC" | "SSM" = alert.id === "1" ? "SYNC" : "SSM";
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
    (msg: string) => {
      setLoading1(false);
      setErrorNote(msg || t("SystemStatus_T.FailedAlert"));
    },
    emailType
  );
}

const requiredSystemStatusUpdatePermission: Permission[] = [
  { Securable: "NG.AlertEmails.List", Operation: "Update" },
  { Securable: "NG.AlertEmails.List", Operation: "Write" }
];


const SystemStatusAlertsContent: React.FC<SystemStatusAlertsContentProps> = ({
  loading,
  alerts,
  overflowMenuIndex,
  setOverflowMenuIndex,
  overflowMenuRef,
  handleActionClick,
  t,
  canUpdateSystemStatus
}) => {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (alerts.length > 0) {
    return (
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
  }
  return <div>No results found.</div>;
};
const SystemStatusAlertsView: React.FC = () => {
  const canUpdateSystemStatus: boolean = authService.isAuthorised(
    requiredSystemStatusUpdatePermission,
    MatchPermissions.any
  );
  const [sidePanelIsOpen, setSidePanelOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert]: [Alert | null, React.Dispatch<React.SetStateAction<Alert | null>>] = useState<Alert | null>(null);
  const [alerts, setAlerts]: AlertsState = useState<Alert[]>([]);
  const [loading, setLoading]: any = useState<boolean>(true);
  const [loading1, setLoading1]: any = useState<boolean>(false);
  const [errorText, setErrorText]: any = useState<string | null>(null);
  const [errorNote, setErrorNote]: any = useState<string | null>(null);
  const [successMessage, setSuccessMessage]: any = useState<string | null>(null);
  const [overflowMenuIndex, setOverflowMenuIndex]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const overflowMenuRef: React.RefObject<HTMLSpanElement> = useRef<HTMLSpanElement>(null);
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  const [enableNotification, setEnableNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const history: ReturnType<typeof useHistory> = useHistory();
  const handleException: () => void = () => setEnableNotification(true);

  const fetchAlerts = async () => {
    await fetchAlertsUtil(
      setLoading,
      setErrorText,
      setAlerts,
      fetchEmailAlertStatus,
      handleException,
      history,
      t
    );
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

  const handleActionClick = (action: string, alert: Alert) => {
    if (action === "Activate Email" || action === "Deactivate Email") {
      handleEmailAction({
        alert,
        action,
        t,
        setSelectedAlert,
        setLoading1,
        setSuccessMessage,
        fetchAlerts,
        setErrorNote
      });
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

      {renderNotification({
        enableNotification,
        setEnableNotification,
        errorText,
        successMessage,
        setSuccessMessage,
        errorNote,
        setErrorNote,
        selectedAlert,
        t
      })}

      {loading1 && (
        <Loader
          className="loader-wrapper"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
          isLoaderModal
        />
      )}
      <SystemStatusAlertsContent
        loading={loading}
        alerts={alerts}
        overflowMenuIndex={overflowMenuIndex}
        setOverflowMenuIndex={setOverflowMenuIndex}
        overflowMenuRef={overflowMenuRef}
        handleActionClick={handleActionClick}
        t={t}
        canUpdateSystemStatus={canUpdateSystemStatus}
      />

      <SidePanel
        dataTestId="side-panel"
        title={selectedAlert ? selectedAlert?.alertName : "Alert Details"}
        isOpen={sidePanelIsOpen}
        onClose={() => setSidePanelOpen(false)}
        showConfirmDialog
      >
        {sidePanelIsOpen && selectedAlert && (
          <>
            <SystemStatusAlertPanelContent
              selectedAlert={selectedAlert}
              setSidePanelOpen={setSidePanelOpen}
              t={t}
            />

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



