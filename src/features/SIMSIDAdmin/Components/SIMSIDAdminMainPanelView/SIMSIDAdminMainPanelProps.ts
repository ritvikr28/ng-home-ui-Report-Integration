export interface ISIMSIDAdminMainPanelProps {
    isOpen?: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export interface ISIMSIDAdminMainPanelViewProps extends ISIMSIDAdminMainPanelProps {
    enableNotification?: boolean;
    setDisableNotification: (disableNotification: boolean) => void;
}
