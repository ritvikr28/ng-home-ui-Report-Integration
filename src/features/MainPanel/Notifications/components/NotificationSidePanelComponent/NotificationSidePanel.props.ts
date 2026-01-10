export interface NotificationItem {
    id: string;
    receivedDate: string;
    status: boolean;
    title: string;
    body: string;
}

export interface NotificationSidePanelViewProps {
    sideIsOpen: boolean;
    setSideIsOpen: (isOpen: boolean) => void;
    selectedItem?: NotificationItem;
    setSelectedItem?: (item: NotificationItem | null) => void;
    notificationIdSelected?: string;
}