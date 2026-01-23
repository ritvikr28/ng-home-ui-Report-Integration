import { SidePanel, IconColor, SidePanelContent, SidePanelFooter, Button, ButtonColor, ButtonSize, Loader, LoaderType } from "@essnextgen/ui-kit";
import React, { useEffect, useState } from "react";
import { NotificationSidePanelViewProps } from "./NotificationSidePanel.props";
import { getViewData, markAsRead } from "../../../../../shared/services/notification/api";
import { formattedDate } from "../../useNotification";
import "./style.scss";
import InformationUnavailableBanner from "./InformationUnavailableBanner";

function useSidePanelData(sideIsOpen: boolean, notificationIdSelected: string | undefined, selectedItem: any, setSelectedItem: (item: any) => void): { loading: boolean; apiError: any } {
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true);
    const [apiError, setApiError]: [any, React.Dispatch<React.SetStateAction<any>>] = useState<any>(false);

    useEffect(() => {
        if (!sideIsOpen) return;

        setLoading(true);
        setApiError(false);

        getViewData(notificationIdSelected).then((data) => {
            if (!data.error) {
                setSelectedItem(data.payload);
                setLoading(false);
            } else {
                setApiError(data.error);
                setLoading(false);
            }
        });

        const item: any = typeof selectedItem === "string" ? JSON.parse(selectedItem) : selectedItem;
        if (item?.Status === "Unread" && notificationIdSelected) {
            markAsRead(notificationIdSelected).then((data) => {
                if (data.error) setApiError(data.error);
            });
        }
    }, [sideIsOpen, notificationIdSelected]);

    return { loading, apiError };
}

function renderPanelContent(apiError: boolean, loading: boolean, selectedItem: any): React.ReactElement {
    if (apiError) return <InformationUnavailableBanner />;
    if (loading) return <Loader loaderType={LoaderType.Circular} />;
    return (
        <>
            <div className="sidepanel-title-body">
                <div className="notification-text" data-testid="notification-text">{selectedItem?.title}</div>
                <div className="static-message" data-testid="static-message">{selectedItem?.body}</div>
            </div>
            <div className="sidepanel-date-atbottom">
                {selectedItem && formattedDate(selectedItem.receivedDate)}
            </div>
        </>
    );
}

const NotificationSidePanelView: React.FC<NotificationSidePanelViewProps> = ({
    sideIsOpen,
    setSideIsOpen,
    selectedItem,
    setSelectedItem,
    notificationIdSelected
}) => {
    const { loading, apiError }: { loading: boolean; apiError: any } = useSidePanelData(sideIsOpen, notificationIdSelected, selectedItem, setSelectedItem || (() => { }));

    const handleClose: () => void = () => {
        if (setSelectedItem) {
            setSelectedItem(null);
        }
        setSideIsOpen(false);
    };

    return (
        <SidePanel
            alignHeading
            dataTestId="test-id"
            headerIconColor={IconColor.Neutral700}
            headerIconName="information"
            id="element-id"
            isOnClose
            onClose={handleClose}
            title="Notification"
            isOpen={sideIsOpen}
        >
            <SidePanelContent>
                {renderPanelContent(apiError, loading, selectedItem)}
            </SidePanelContent>
            <SidePanelFooter>
                <Button
                    data-testid="close-side-panel-btn"
                    className="btn-full-width"
                    color={ButtonColor.Secondary}
                    size={ButtonSize.Large}
                    onClick={handleClose}
                >
                    Close
                </Button>
            </SidePanelFooter>
        </SidePanel>
    );
};

export default NotificationSidePanelView;