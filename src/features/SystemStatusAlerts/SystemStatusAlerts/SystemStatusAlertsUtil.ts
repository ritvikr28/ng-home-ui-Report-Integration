import { Dispatch } from "react";
import { Alert } from "../interface";

// Group all handlers and utilities into a single object
export interface ActionHandlers {
  setSelectedAlert: React.Dispatch<React.SetStateAction<Alert | null>>;
  setLoading1: React.Dispatch<React.SetStateAction<boolean>>;
  activateEmailAlert: (
    id: string,
    emailSubscribed: boolean,
    onSuccess: () => void,
    onError: (msg?: string) => void,
    emailType: "SYNC" | "SSM"
  ) => void;
  fetchAlerts: () => void;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setErrorNote: React.Dispatch<React.SetStateAction<string | null>>;
  setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>;
  t: (key: string) => string;
}

// Helper function to handle email activation/deactivation
const handleEmailAction = (
  alert: Alert,
  action: string,
  handlers: Pick<ActionHandlers, "setSelectedAlert" | "setLoading1" | "activateEmailAlert" | "fetchAlerts" | "setSuccessMessage" | "setErrorNote" | "t">
) => {
  const emailSubscribed = action === "Deactivate Email";
  const emailType: "SYNC" | "SSM" = alert.id === "1" ? "SYNC" : "SSM";
  handlers.setSelectedAlert(alert);
  handlers.setLoading1(true);

  handlers.activateEmailAlert(
    alert.id,
    emailSubscribed,
    () => {
      handlers.setSuccessMessage(handlers.t("SystemStatus_T.Changessaved"));
      handlers.fetchAlerts();
      handlers.setLoading1(false);
    },
    (msg) => {
      handlers.setLoading1(false);
      handlers.setErrorNote(msg || handlers.t("SystemStatus_T.FailedAlert"));
    },
    emailType
  );
};

// Export the refactored handleActionClick function
export const handleActionClick = (
  action: string,
  alert: Alert,
  handlers: ActionHandlers
): void => {
  if (action === "Activate Email" || action === "Deactivate Email") {
    handleEmailAction(
      alert,
      action,
      handlers
    );
  } else if (action === "View") {
    handlers.setSelectedAlert(alert);
    handlers.setSidePanelOpen(true);
  }

  handlers.setOverflowMenuIndex("");
};