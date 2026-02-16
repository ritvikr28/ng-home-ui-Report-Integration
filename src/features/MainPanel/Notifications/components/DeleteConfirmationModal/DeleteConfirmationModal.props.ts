export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCount: number;
    isLoading?: boolean;
    isNoSelection?: boolean;
}

