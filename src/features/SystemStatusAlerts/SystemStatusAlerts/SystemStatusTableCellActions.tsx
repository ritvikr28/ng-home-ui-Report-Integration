import React from "react";
import { Button, ButtonSize, ButtonColor, OverflowMenu, OverflowMenuItem, IconColor } from "@essnextgen/ui-kit";
import { Alert } from "../interface";

interface SystemStatusTableCellActionsProps {
  alert: Alert;
  index: number;
  canUpdateSystemStatus: boolean;
  handleActionClick: (action: string, alert: Alert) => void;
  t: (key: string) => string;
  overflowMenuIndex: string;
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>;
  overflowMenuRef: React.RefObject<HTMLSpanElement>;
  systemStatusOverFlowBtnRef: React.RefObject<(HTMLButtonElement | null)[]>;
  systemStatusOverflowPosition: { left: number; top: number } | null;
  setSystemStatusOverflowPosition: React.Dispatch<React.SetStateAction<{ left: number; top: number } | null>>;
  getClassNameToHandleOverFlowPostion: (index: number, length: number) => string;
  alertsLength: number;
}

const SystemStatusTableCellActions: React.FC<SystemStatusTableCellActionsProps> = ({
  alert,
  index,
  canUpdateSystemStatus,
  handleActionClick,
  t,
  overflowMenuIndex,
  setOverflowMenuIndex,
  overflowMenuRef,
  systemStatusOverFlowBtnRef,
  systemStatusOverflowPosition,
  setSystemStatusOverflowPosition,
  getClassNameToHandleOverFlowPostion,
  alertsLength
}) => {
  const handleOverflowMenuClick = (idx: number) => {
    if (overflowMenuIndex === `overflow-${idx}`) {
      setOverflowMenuIndex("");
      setSystemStatusOverflowPosition(null);
    } else {
      const rect =
        systemStatusOverFlowBtnRef &&
        systemStatusOverFlowBtnRef.current &&
        systemStatusOverFlowBtnRef.current[idx]?.getBoundingClientRect();
      if (rect) {
        setSystemStatusOverflowPosition({
          left: rect.left,
          top: rect.bottom
        });
      }
      setOverflowMenuIndex(`overflow-${idx}`);
    }
  };

  return (
    <div className="system-status-overflow-btn-wrapper">
      {(!canUpdateSystemStatus || alert?.isErrorResponse || alert?.status === "Connection error") ? (
        <button
          type="button"
          onClick={() => handleActionClick("View", alert)}
          className="view-link-as-button"
        >
          {t("SystemStatus_T.View")}
        </button>
      ) : (
        <>
          <Button
            ref={el => {
              if (systemStatusOverFlowBtnRef.current)
                systemStatusOverFlowBtnRef.current[index] = el;
            }}
            size={ButtonSize.Small}
            color={
              overflowMenuIndex === `overflow-${index}`
                ? ButtonColor.Primary
                : ButtonColor.Utility
            }
            onClick={() => handleOverflowMenuClick(index)}
            iconName="overflow-menu--horizontal"
            ariaLabel="Overflow menu"
            className={`btn-option${overflowMenuIndex === `overflow-${index}` ? " system-status-overflow-btn-active" : ""}`}
          />
          {overflowMenuIndex === `overflow-${index}` && (
            <span
              ref={overflowMenuRef}
              style={{
                left: (systemStatusOverflowPosition?.left ?? 0) - 150,
                top: systemStatusOverflowPosition?.top
              }}
              className="overflow-menu-position"
            >
              <OverflowMenu
                dataTestId="childcare-overflow-menu"
                id={`childcare-overflow-menu-${index}`}
                onClick={(e, selectedValue) =>
                  handleActionClick(
                    (selectedValue as { value: string }).value,
                    alert
                  )
                }
                className={`${getClassNameToHandleOverFlowPostion(
                  index,
                  alertsLength
                )} system-status-overflow-menu`}
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
        </>
      )}
    </div>
  );
};

export default SystemStatusTableCellActions;
