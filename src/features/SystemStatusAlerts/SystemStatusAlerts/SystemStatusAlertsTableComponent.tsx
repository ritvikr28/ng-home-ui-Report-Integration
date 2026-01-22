import React, { useState, useRef } from "react";
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
  TableStatus,
  Icon,
  IconColor
} from "@essnextgen/ui-kit";
import "../style.scss";
import { Alert } from "../interface";
import { getClassNameToHandleOverFlowPostion } from "./SystemStatusAlerts.view";
import SystemStatusTableCellActions from "./SystemStatusTableCellActions";

const SystemStatusAlertsTableComponent: React.FC<{
  alerts: Alert[];
  overflowMenuIndex: string;
  setOverflowMenuIndex: React.Dispatch<React.SetStateAction<string>>;
  overflowMenuRef: React.RefObject<HTMLSpanElement>;
  handleActionClick: (action: string, alert: Alert) => void;
  t: (key: string) => string;
  canUpdateSystemStatus: boolean;
  
}> = ({
  alerts,
  overflowMenuIndex,
  setOverflowMenuIndex,
  overflowMenuRef,
  handleActionClick,
  t,
  canUpdateSystemStatus
  
}) => {
      const systemStatusOverFlowBtnRef : React.RefObject<(HTMLButtonElement | null)[]> = useRef<(HTMLButtonElement | null)[]>([]);
        const [systemStatusOverflowPosition, setSystemStatusOverflowPosition]: [{ left: number; top: number } | null, React.Dispatch<React.SetStateAction<{ left: number; top: number } | null>>] = useState<{
          left: number;
          top: number;
        } | null>(null);
    
        const getTableStatus : (status: string) => TableStatus = (status: string): TableStatus => {
          if (status === "Yellow" || status === "Connection error") return TableStatus.WARNING;
          if (status === "Red") return TableStatus.CRITICAL;
          return TableStatus.SUCCESS;
        };
    
        const getStatusLabel : (status: string) => string = (status: string): string => {
          if (status === "Connection error") return t("SystemStatus_T.WarningMessage");
          if (status === "Yellow") return t("SystemStatus_T.NoData");
          if (status === "Green") return t("SystemStatus_T.Live");
          return t("SystemStatus_T.Fail");
        };
    
        const getEmailSubscriptionText : (alert: Alert) => string = (alert: Alert): string => {
          if (alert?.isErrorResponse || alert?.status === "Connection error") {
            return "-";
          }
          return alert?.emailSubscribed ? t("SystemStatus_T.Yes") : t("SystemStatus_T.No");
        };
    
    
        const handleOverflowMenuClick : (index: number) => void = (index: number) => {
          if (overflowMenuIndex === `overflow-${index}`) {
            setOverflowMenuIndex("");
            setSystemStatusOverflowPosition(null);
          } else {
            const rect: DOMRect | undefined | null  =
            systemStatusOverFlowBtnRef && systemStatusOverFlowBtnRef.current &&  systemStatusOverFlowBtnRef.current[index]?.getBoundingClientRect();
            if (rect) {
              setSystemStatusOverflowPosition({
                left: rect.left,
                top: rect.bottom
              });
            }
            setOverflowMenuIndex(`overflow-${index}`);
          }
        };
  return (
    <TableWrapper className="system-status-table-wrapper">
           <Table className="status-table" isStatus>
             <TableHead>
               <TableRow>
                 <TableCell header className="status-table-cell">
                   {t("SystemStatus_T.Status")}
                 </TableCell>
                 <TableCell header>{t("SystemStatus_T.Alert")}</TableCell>
                 <TableCell header>{t("SystemStatus_T.Information")}</TableCell>
                 <TableCell header>{t("SystemStatus_T.EmailAlerts")}</TableCell>
                 <TableCell header className="last-cell-header" />
               </TableRow>
             </TableHead>
             <TableBody>
               {alerts.map((alert, index) => {
                 const status: TableStatus = getTableStatus(alert.status);
                 const statusLabel : string = getStatusLabel(alert.status);
                 return (
                   <TableRow key={alert?.id}>
                     <TableCell status={status}>{statusLabel}</TableCell>
                     <TableCell>{alert?.alertName}</TableCell>
                     <TableCell
                       className={
                         alert.isErrorResponse ? "information-column-error" : ""
                       }
                     >
                       {alert.isErrorResponse ? (
                         <div className="warning--alt">
                           <Icon
                             color={IconColor.Warning300}
                             dataTestId="btn-90"
                             id="variable-2"
                             name="warning--alt"
                             size={16}
                           />
                           <span> {t("SystemStatus_T.WarningMessage")}</span>
                         </div>
                       ) : (
                         alert?.information
                       )}
                     </TableCell>
                     <TableCell>{getEmailSubscriptionText(alert)}</TableCell>
                     
                     <TableCell>
                       <SystemStatusTableCellActions
                         alert={alert}
                         index={index}
                         canUpdateSystemStatus={canUpdateSystemStatus}
                         handleActionClick={handleActionClick}
                         t={t}
                         overflowMenuIndex={overflowMenuIndex}
                         setOverflowMenuIndex={setOverflowMenuIndex}
                         overflowMenuRef={overflowMenuRef}
                         systemStatusOverFlowBtnRef={systemStatusOverFlowBtnRef}
                         systemStatusOverflowPosition={systemStatusOverflowPosition}
                         setSystemStatusOverflowPosition={setSystemStatusOverflowPosition}
                         getClassNameToHandleOverFlowPostion={getClassNameToHandleOverFlowPostion}
                         alertsLength={alerts.length}
                       />
                     </TableCell>
   
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
         </TableWrapper>
  )
}

export default SystemStatusAlertsTableComponent