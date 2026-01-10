import { NotificationSidePanelViewProps } from "../NotificationSidePanel.props";

describe('NotificationSidePanelViewProps', () => {
    it('should allow creation of a valid object', () => {
        const mockSetSideIsOpen = jest.fn();
        const notification = {
            id: '1',
            receivedDate: "new Date()",
            status: false,
            title: 'Test notification',
            body: 'This is a test notification body'
        };
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: true,
            setSideIsOpen: mockSetSideIsOpen,
            selectedItem: notification,
            setSelectedItem: jest.fn(),
            notificationIdSelected: "1"
        };
        expect(props.sideIsOpen).toBe(true);
        expect(props.setSideIsOpen).toBe(mockSetSideIsOpen);
        expect(Array.isArray(props.selectedItem)).toBe(false);
        expect(props.selectedItem).toMatchObject({
            id: '1',
            status: false,
            title: 'Test notification',
            body: 'This is a test notification body'
        });
    });

    it('should require sideIsOpen as boolean', () => {
        const mockSetSideIsOpen = jest.fn();
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: false,
            setSideIsOpen: mockSetSideIsOpen
        };
        expect(typeof props.sideIsOpen).toBe('boolean');
    });

    it('should require setSideIsOpen as a function', () => {
        const mockSetSideIsOpen = jest.fn();
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: true,
            setSideIsOpen: mockSetSideIsOpen
        };
        expect(typeof props.setSideIsOpen).toBe('function');
        props.setSideIsOpen(false);
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(false);
    });

    it('should allow selectedItem to be undefined', () => {
        const mockSetSideIsOpen = jest.fn();
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: true,
            setSideIsOpen: mockSetSideIsOpen
        };
        expect(props.selectedItem).toBeUndefined();
    });

    it('should allow selectedItem to be an array of notification objects', () => {
        const mockSetSideIsOpen = jest.fn();
        // const items: { id: string; receivedDate: string; status: string; title: string; body: string } =
        //     { id: '1', receivedDate: "", status: 'unread', title: 'First', body: 'First notification body' }


        const props: NotificationSidePanelViewProps = {
            sideIsOpen: false,
            setSideIsOpen: mockSetSideIsOpen,
            selectedItem: { id: '1', receivedDate: "", status: false, title: 'First', body: 'First notification body' },
            setSelectedItem: jest.fn(),
            notificationIdSelected: "1"
        };
        expect(props.selectedItem).toBeDefined();
    });
});