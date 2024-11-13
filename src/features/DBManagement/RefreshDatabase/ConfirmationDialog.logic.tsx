import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  ButtonColor
} from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";

interface IProps {
  dataTestId?: string;
  title: string;
  description: string;
  confirmActionButtonText?: string;
  cancelActionButtonText?: string;
  isOpen?: boolean;
  optionalButton?: boolean;
  optionalButtonText?: string;
  onOptionalHandle?: () => void;
  onSubmitHandle: () => void;
  onCloseHandle: () => void;
}

export const handleDocumentBodyOverflow = () => {
  const bodyNoScrollClass = "essui-body--no-scroll";

  if (!document.body.classList.contains(bodyNoScrollClass)) {
    return;
  }

  document.body.classList.remove(bodyNoScrollClass);
};

export const ConfirmDialog: ({}: IProps) => JSX.Element = ({
  title,
  description,
  confirmActionButtonText = "Ok",
  cancelActionButtonText = "Cancel",
  dataTestId = "default-dialog",
  isOpen,
  optionalButton,
  onOptionalHandle,
  onCloseHandle,
  onSubmitHandle
}: IProps): JSX.Element => {
  const { t } = useTranslation();

  const handleOnSubmit = () => {
    handleDocumentBodyOverflow();
    onSubmitHandle();
  };

  const handleOnClose = () => {
    handleDocumentBodyOverflow();
    onCloseHandle();
  };

  return (
    <Dialog
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={handleOnClose}
      title={title}
    >
      <DialogContent>{description}</DialogContent>
      <DialogFooter>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
        >
          {optionalButton && (
            <span style={{ marginLeft: "10px" }}>
              <Button
                dataTestId={`${dataTestId}-close-btn`}
                onClick={handleOnClose}
                color={ButtonColor.Secondary}
              >
                {cancelActionButtonText}
              </Button>
            </span>
          )}
          <Button
            dataTestId={`${dataTestId}-ok-btn`}
            onClick={() => {
              handleOnSubmit();
              handleOnClose();
            }}
            color={ButtonColor.Primary}
          >
            {confirmActionButtonText}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
export default ConfirmDialog;
