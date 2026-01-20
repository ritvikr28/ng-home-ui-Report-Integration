// Helper function to handle email activation/deactivation
const handleEmailAction = (
  alert: Alert,
  action: string,
  setSelectedAlert: React.Dispatch<React.SetStateAction<Alert | null>>,
  setLoading1: React.Dispatch<React.SetStateAction<boolean>>,
  activateEmailAlert: (
    id: string,
    emailSubscribed: boolean,
    onSuccess: () => void,
    onError: (msg?: string) => void,
    emailType: "SYNC" | "SSM"
  ) => void,
  fetchAlerts: () => void,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setErrorNote: React.Dispatch<React.SetStateAction<string | null>>,
  t: (key: string) => string
) => {
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
    (msg) => {
      setLoading1(false);
      setErrorNote(msg || t("SystemStatus_T.FailedAlert"));
    },
    emailType
  );
};

// Export the refactored handleActionClick function
export const handleActionClick = (
  action: string,
  alert: Alert,
  setSelectedAlert: React.Dispatch<React.SetStateAction<Alert | null>>,
  setLoading1: React.Dispatch<React.SetStateAction<boolean>>,
  activateEmailAlert: (
    id: string,
    emailSubscribed: boolean,
    onSuccess: () => void,
    onError: (msg?: string) => void,
    emailType: "SYNC" | "SSM"
  ) => void,
  fetchAlerts: () => void,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setErrorNote: React.Dispatch<React.SetStateAction<string | null>>,
  setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>,
  t: (key: string) => string
): void => {
  if (action === "Activate Email" || action === "Deactivate Email") {
    handleEmailAction(
      alert,
      action,
      setSelectedAlert,
      setLoading1,
      activateEmailAlert,
      fetchAlerts,
      setSuccessMessage,
      setErrorNote,
      t
    );
  } else if (action === "View") {
    setSelectedAlert(alert);
    setSidePanelOpen(true);
  }

  setOverflowMenuIndex("");
};