import React from "react";
import { Alert } from "../interface";
import { ISystemStatusAlertResponse } from "../../../shared/model/SystemStatus/responsemodel";

// Utility to fetch alerts and set state, refactored for import
export const fetchAlertsUtil = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorText: React.Dispatch<React.SetStateAction<string | null>>,
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>,
  fetchEmailAlertStatus: (handleException: () => void, history: any) => Promise<ISystemStatusAlertResponse | null>,
  handleException: () => void,
  history: any,
  t: (key: string) => string
) => {
  setLoading(true);
  setErrorText(null);
  try {
    const response: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(handleException, history);
    if (response) {
      const { listenerData, ssmHostData }: ISystemStatusAlertResponse = response;
      let listenerStatus: "Green" | "Connection error" | "Red" = "Red";
      if (listenerData?.listenerStatus === "Live") {
        listenerStatus = "Green";
      } else if (listenerData?.listenerStatus === "Connection error") {
        listenerStatus = "Connection error";
      }
      let listenerInfo = "";
      if (listenerData?.listenerStatus === "Live") {
        listenerInfo = t("SystemStatus_T.DataSyncLiveInfo");
      } else if (listenerData?.listenerStatus === "Connection error") {
        listenerInfo = t("SystemStatus_T.ConnectionError");
      } else {
        listenerInfo = t("SystemStatus_T.DataSyncNotLiveInfo");
      }
      let ssmHostStatus: "Green" | "Connection error" | "Red" = "Red";
      if (ssmHostData?.ssmHostStatus === "Live") {
        ssmHostStatus = "Green";
      } else if (ssmHostData?.ssmHostStatus === "Connection error") {
        ssmHostStatus = "Connection error";
      }
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
          isErrorResponse: false
        },
        {
          id: "2",
          status: ssmHostStatus,
          alertName: t("SystemStatus_T.SSMPackage"),
          information: ssmHostInfo,
          emailSubscribed: ssmHostData?.eMailAlert,
          latestSSMHostVersion: ssmHostData?.latestSSMHostVersion,
          currentSSMHostVersion: ssmHostData?.currentSSMHostVersion,
          isErrorResponse: false
        }
      ];
      setAlerts(apiAlerts);
    } else {
      setAlerts([
        {
          id: "1",
          status: "Yellow",
          alertName: t("SystemStatus_T.DataSyncAlertName"),
          information: t("SystemStatus_T.WarningMessage"),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
          isErrorResponse: true
        },
        {
          id: "2",
          status: "Yellow",
          alertName: t("SystemStatus_T.SSMPackage"),
          information: t("SystemStatus_T.WarningMessage"),
          emailSubscribed: false,
          latestSSMHostVersion: "",
          currentSSMHostVersion: "",
          isErrorResponse: true
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
        isErrorResponse: true
      },
      {
        id: "2",
        status: "Yellow",
        alertName: t("SystemStatus_T.SSMPackage"),
        information: t("SystemStatus_T.WarningMessage"),
        emailSubscribed: false,
        latestSSMHostVersion: "",
        currentSSMHostVersion: "",
        isErrorResponse: true
      }
    ]);
  } finally {
    setLoading(false);
  }
};

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
const handleEmailAction: (alert: Alert, action: string, handlers: Pick<ActionHandlers, "setSelectedAlert" | "setLoading1" | "activateEmailAlert" | "fetchAlerts" | "setSuccessMessage" | "setErrorNote" | "t">) => void = (
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
export const handleActionClick: (action: string, alert: Alert, handlers: ActionHandlers) => void = (
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