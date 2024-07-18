export interface ISIMSIDAdminMainPanelProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export interface ISIMSIDAdminMainPanelViewProps extends ISIMSIDAdminMainPanelProps {
    disableNotification?: boolean;
    setDisableNotification: (disableNotification: boolean) => void;
}
