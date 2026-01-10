import { SidePanel, IconColor, SidePanelContent, SidePanelFooter, Button, ButtonColor, ButtonSize, Loader, LoaderType } from "@essnextgen/ui-kit"
import React, { useEffect } from "react"
import { NotificationSidePanelViewProps } from "./NotificationSidePanel.props"
import { getViewData, markAsRead } from "../../../../../shared/services/notification/api";
import { formattedDate } from "../../useNotification";
import "./style.scss";
import InformationUnavailableBanner from "./InformationUnavailableBanner";

const NotificationSidePanelView: React.FC<NotificationSidePanelViewProps> = ({ sideIsOpen, setSideIsOpen, selectedItem, setSelectedItem, notificationIdSelected }) => {
    const [sidePanelDataLoading, setSidePanelDataLoading] = React.useState(true);
    const [sidePanelAPIError, setSidePanelAPIError] = React.useState<any>(false);

    useEffect(() => {
        if (sideIsOpen) {
            setSidePanelDataLoading(true);
            getViewData(notificationIdSelected).then((data => {
                if (!data.error) {
                    if (setSelectedItem) setSelectedItem(data.payload);
                    setSidePanelDataLoading(false);
                } else {
                    setSidePanelAPIError(data.error);
                }
            }));
            const item = typeof selectedItem === "string" ? JSON.parse(selectedItem) : selectedItem
            if (item?.Status === "Unread" && notificationIdSelected) {
                markAsRead(notificationIdSelected).then((data) => {
                    if (data.error) {
                        setSidePanelAPIError(data.error);
                    }
                });
            }
        }

    }, [sideIsOpen]);

    return (
        <>
            <SidePanel
                alignHeading
                dataTestId="test-id"
                headerIconColor={IconColor.Neutral700}
                headerIconName="information"
                id="element-id"
                isOnClose
                onClose={() => setSideIsOpen(false)}
                title="Notification"
                isOpen={sideIsOpen}
            >
                <SidePanelContent>
                    <>
                        {sidePanelAPIError && <InformationUnavailableBanner />}

                        {!sidePanelAPIError && sidePanelDataLoading ? <Loader loaderType={LoaderType.Circular} /> : (
                            <>
                                <div className="sidepanel-title-body">
                                    <div className="notification-text" data-testid="notification-text">{selectedItem ? selectedItem.title : null}</div>
                                    <div className="static-message" data-testid="static-message">{selectedItem ? selectedItem.body : null}</div>
                                </div>
                                <div className="sidepanel-date-atbottom">
                                    {selectedItem && formattedDate(selectedItem.receivedDate)}
                                </div>
                            </>
                        )}
                    </>
                </SidePanelContent>
                <SidePanelFooter>
                    <Button
                        data-testid="close-side-panel-btn"
                        className="btn-full-width"
                        color={ButtonColor.Secondary}
                        size={ButtonSize.Large}
                        onClick={() => {
                            if (setSelectedItem) setSelectedItem(null);
                            setSideIsOpen(false)
                        }}
                    >
                        Close
                    </Button>
                </SidePanelFooter>
            </SidePanel >
        </>
    )
};


export default NotificationSidePanelView;