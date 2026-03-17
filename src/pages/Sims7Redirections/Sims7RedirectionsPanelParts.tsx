import React from "react";
import { Loader, LoaderType, Notification, NotificationStatus, Dialog, DialogTemplate, Button, ButtonColor, ButtonSize } from "@essnextgen/ui-kit";
import Sims7RedirectionsView from "./Sims7RedirectionsView";
import Sims7RedirectionsEdit from "./Sims7RedirectionsEdit";
import type { Sims7RedirectionViewData } from './Sims7RedirectionsPage.api';
import type { Sims7RedirectionsRow } from './Sims7RedirectionsInterfaces';

interface Sims7RedirectionsPanelContentProps {
  mode: 'view' | 'edit';
  viewLoading: boolean;
  viewData: Sims7RedirectionViewData | null;
  t: (key: string) => string;
  setSidePanelMode: (mode: 'view' | 'edit') => void;
  selectedRow: Sims7RedirectionsRow;
  redirectToNextGen: string;
  effectiveDate: Date | null;
  reasonForChanges: string;
  dateError: string;
  reasonError: string;
  getDateParts: (_date: Date | null) => { day?: number; month?: number; year?: number };
  onRedirectToNextGenChange: (e: React.SyntheticEvent<Element, Event>, value: string | number) => void;
  onDateChange: (arg1: string | number | React.ChangeEvent<HTMLInputElement>, arg2?: string | number | React.ChangeEvent<HTMLInputElement>, arg3?: string | number | React.ChangeEvent<HTMLInputElement>) => void;
  onValidateDate: (date: Date) => void;
  setReasonForChanges: (val: string) => void;
  setIsDirty: (val: boolean) => void;
  isFormDirty: (redirect: string, date: Date | null, reason: string) => boolean;
  showFailureBanner: boolean;
  showSuccessToast: boolean;
  showCancelDialog: boolean;
  onCancelDialogClose: () => void;
  onCancelConfirm: () => void;
}

export function Sims7RedirectionsPanelContent({
  mode,
  viewLoading,
  viewData,
  t,
  setSidePanelMode,
  selectedRow,
  redirectToNextGen,
  effectiveDate,
  reasonForChanges,
  dateError,
  reasonError,
  getDateParts,
  onRedirectToNextGenChange,
  onDateChange,
  onValidateDate,
  setReasonForChanges,
  setIsDirty,
  isFormDirty,
  showFailureBanner,
  showSuccessToast,
  showCancelDialog,
  onCancelDialogClose,
  onCancelConfirm
  }: Sims7RedirectionsPanelContentProps): JSX.Element {
  return (
    <>
      {mode === 'view' && viewLoading && (
        <Loader
          className="loader-wrapper"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
        />
      )}
      {mode === 'view' && !viewLoading && viewData && (
        <Sims7RedirectionsView
          viewData={viewData}
          t={t}
          setSidePanelMode={setSidePanelMode}
        />
      )}
      {mode === 'edit' && selectedRow && (
        <>
          <Sims7RedirectionsEdit
            selectedRow={selectedRow}
            redirectToNextGen={redirectToNextGen}
            effectiveDate={effectiveDate}
            reasonForChanges={reasonForChanges}
            dateError={dateError}
            reasonError={reasonError}
            getDateParts={getDateParts}
            handleRedirectToNextGenChange={onRedirectToNextGenChange}
            handleDateChange={onDateChange}
            handleValidateDate={onValidateDate}
            setReasonForChanges={setReasonForChanges}
            setIsDirty={setIsDirty}
            isFormDirty={isFormDirty}
            t={t}
          />
          {showFailureBanner && (
            <Notification
              status={NotificationStatus.WARNING}
              title={t("SIMS7Redirects.informationUnavailable")}
              message="A technical issue at our end has stopped us from saving your changes. Please try again. We appreciate your patience and understanding during this time."
              onClickClose={onCancelDialogClose}
            />
          )}
        </>
      )}
      {mode === 'view' && showFailureBanner && (
        <Notification
          status={NotificationStatus.WARNING}
          title={t("SIMS7Redirects.apiFailureMessage")}
          message={t("SIMS7Redirects.apiFailureDescription")}
          hideCloseButton={true}
        />
      )}
      {showSuccessToast && (
        <Notification status={NotificationStatus.SUCCESSTOAST} title={t("SIMS7Redirects.changesSave")}/>
      )}
      <Dialog
        isOpen={showCancelDialog}
        onClose={onCancelDialogClose}
        escapeExits={true}
        title={t("SIMS7Redirects.discardChanges")}
        templateProps={{
          template: DialogTemplate.Confirmation,
          contentText: t("SIMS7Redirects.discardChangesDescription"),
          onConfirm: onCancelConfirm,
          onCancel: onCancelDialogClose,
          cancelText: t("SIMS7Redirects.cancelbtn"),
          okText: t("SIMS7Redirects.discardbtn")
        }}
      />
    </>
  );
}

interface Sims7RedirectionsPanelFooterProps {
  mode: 'view' | 'edit';
  t: (key: string) => string;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function Sims7RedirectionsPanelFooter({
  mode,
  t,
  onClose,
  onCancel,
  onSave
  }: Sims7RedirectionsPanelFooterProps): JSX.Element {
  return (
    <>
      {mode === 'view' ? (
        <Button
          size={ButtonSize.Large}
          color={ButtonColor.Secondary}
          className="btn-full-width"
          onClick={onClose}
        >
          {t("SIMS7Redirects.closebtn")}
        </Button>
      ) : (
        <>
          <Button
            size={ButtonSize.Large}
            color={ButtonColor.Secondary}
            className="btn-full-width"
            onClick={onCancel}
          >
            {t("SIMS7Redirects.cancelbtn")}
          </Button>
          <Button
            size={ButtonSize.Large}
            color={ButtonColor.Primary}
            className="btn-full-width"
            onClick={onSave}
          >
            {t("SIMS7Redirects.savebtn")}
          </Button>
        </>
      )}
    </>
  );
}
