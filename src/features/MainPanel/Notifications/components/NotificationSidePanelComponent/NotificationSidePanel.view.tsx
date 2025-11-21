import { SidePanel, IconColor, SidePanelContent, SidePanelFooter, Button, ButtonColor, ButtonSize } from "@essnextgen/ui-kit"
import React from "react"
import { NotificationSidePanelViewProps } from "./NotificationSidePanel.props"

const NotificationSidePanelView: React.FC<NotificationSidePanelViewProps> = ({ sideIsOpen, setSideIsOpen, selectedItem }) =>
(
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "20px", fontWeight: 400, lineHeight: "24px" }} data-testid="notification-text">{selectedItem ? selectedItem[0].notification : null}</div>
                <div style={{ fontSize: "16px", fontWeight: 400, lineHeight: "24px" }} data-testid="static-message">The role Headteacher has been updated by the Trust and is now ready for use. Historical data will not be affected.Historical data will not be affected.</div>
            </div>
        </SidePanelContent>
        <SidePanelFooter>
            <Button
                data-testid="close-side-panel-btn"
                className="btn-full-width"
                color={ButtonColor.Secondary}
                size={ButtonSize.Large}
                onClick={() => setSideIsOpen(false)}
            >
                Close
            </Button>
        </SidePanelFooter>
    </SidePanel>
)


export default NotificationSidePanelView;