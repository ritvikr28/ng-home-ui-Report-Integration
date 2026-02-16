export interface DeleteConfirmationModalProps {
    t: (key: string) => string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCount: number;
    isLoading?: boolean;
    isNoSelection?: boolean;
}

