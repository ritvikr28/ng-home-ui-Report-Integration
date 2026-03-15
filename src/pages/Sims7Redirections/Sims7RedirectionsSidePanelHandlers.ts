import React from "react";
import { handleRedirectToNextGenChange } from "./Sims7RedirectionsSidePanelRedirect.logic";
import { handleDateChange, handleValidateDate, getDateParts as getDatePartsLogic } from "./Sims7RedirectionsSidePanelDate.logic";
import { handleCancel, handleCancelConfirm, handleCancelDialogClose } from "./Sims7RedirectionsSidePanelCancel.logic";
import { validateReason } from "./Sims7RedirectionsSaveValidate.logic";
import { requiresReason } from "./Sims7RedirectionsStatusHelpers";

export function getSetReasonForChanges(
  setReasonForChangesRaw: (val: string) => void,
  selectedRow: any,
  redirectToNextGen: any,
  setReasonError: (msg: string) => void
): (val: string) => void {
  return (val: string) => {
    setReasonForChangesRaw(val);
    validateReason({
      requiresReason,
      selectedRow,
      redirectToNextGen,
      reasonForChanges: val,
      setReasonError
    });
  };
}

interface OnRedirectToNextGenChangeOptions {
  selectedRow: any;
  setRedirectToNextGen: any;
  setEffectiveDate: any;
  setDateParts: any;
  setIsDirty: any;
  effectiveDate: any;
  reasonForChanges: any;
  setDateError: any;
}

export function getOnRedirectToNextGenChange(options: OnRedirectToNextGenChangeOptions): (e: React.SyntheticEvent<Element, Event>, value: string | number) => void {
  return (_e: React.SyntheticEvent<Element, Event>, value: string | number) => {
    handleRedirectToNextGenChange({
      event: _e,
      value,
      ...options
    });
  };
}

interface OnDateChangeOptions {
  t: any;
  setDateParts: any;
  setEffectiveDate: any;
  setDateError: any;
  setIsDirty: any;
  selectedRow: any;
  redirectToNextGen: any;
  reasonForChanges: any;
}

export function getOnDateChange(options: OnDateChangeOptions): (arg1: any, arg2?: any, arg3?: any) => void {
  return (arg1: any, arg2?: any, arg3?: any) => {
    handleDateChange({
      t: options.t,
      arg1,
      arg2,
      arg3,
      setDateParts: options.setDateParts,
      setEffectiveDate: options.setEffectiveDate,
      setDateError: options.setDateError,
      setIsDirty: options.setIsDirty,
      selectedRow: options.selectedRow,
      redirectToNextGen: options.redirectToNextGen,
      reasonForChanges: options.reasonForChanges
    });
  };
}

export function getOnValidateDate(
  setDateError: any,
  t: any
): (date: Date) => void {
  return (date: Date) => {
    handleValidateDate(date, setDateError, t);
  };
}

export function getGetDateParts(
  dateParts: any
): () => any {
  return () => getDatePartsLogic(dateParts);
}

export function getOnCancel(
  isDirty: any,
  setShowCancelDialog: any,
  onClose: any
): () => void {
  return () => {
    handleCancel(isDirty, setShowCancelDialog, onClose);
  };
}

export function getOnCancelConfirm(
  setIsDirty: any,
  setShowCancelDialog: any,
  setReasonForChanges: any,
  selectedRow: any,
  setReasonError: any,
  setDateError: any,
  onClose: any
): () => void {
  return () => {
    handleCancelConfirm({
      setIsDirty,
      setShowCancelDialog,
      setReasonForChanges,
      selectedRow,
      setReasonError,
      setDateError,
      onClose
    });
  };
}

export function getOnCancelDialogClose(
  setShowCancelDialog: any
): () => void {
  return () => {
    handleCancelDialogClose(setShowCancelDialog);
  };
}
