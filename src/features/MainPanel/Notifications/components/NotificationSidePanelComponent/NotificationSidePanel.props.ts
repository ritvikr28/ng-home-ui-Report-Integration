export interface NotificationSidePanelViewProps {
    sideIsOpen: boolean;
    setSideIsOpen: (isOpen: boolean) => void;
    selectedItem?: { notification: string }[];
}