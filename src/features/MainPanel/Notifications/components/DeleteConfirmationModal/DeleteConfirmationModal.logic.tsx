import { DeleteConfirmationModalProps } from "./DeleteConfirmationModal.props";
import DeleteConfirmationModalView from "./DeleteConfirmationModal.view";

const DeleteConfirmationModalLogic: (props: DeleteConfirmationModalProps) => JSX.Element = (props: DeleteConfirmationModalProps) =>
(
    <DeleteConfirmationModalView {...props} />
);

export default DeleteConfirmationModalLogic;

