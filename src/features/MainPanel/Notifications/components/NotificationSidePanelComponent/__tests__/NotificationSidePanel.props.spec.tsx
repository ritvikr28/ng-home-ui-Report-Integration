import { NotificationSidePanelViewProps } from "../NotificationSidePanel.props";

describe('NotificationSidePanelViewProps', () => {
    it('should allow creation of a valid object', () => {
        const mockSetSideIsOpen = jest.fn();
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: true,
            setSideIsOpen: mockSetSideIsOpen,
            selectedItem: [{ notification: 'Test notification' }]
        };
        expect(props.sideIsOpen).toBe(true);
        expect(props.setSideIsOpen).toBe(mockSetSideIsOpen);
        expect(props.selectedItem).toEqual([{ notification: 'Test notification' }]);
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
        const items = [
            { notification: 'First' },
            { notification: 'Second' }
        ];
        const props: NotificationSidePanelViewProps = {
            sideIsOpen: false,
            setSideIsOpen: mockSetSideIsOpen,
            selectedItem: items
        };
        expect(Array.isArray(props.selectedItem)).toBe(true);
        expect(props.selectedItem?.[0].notification).toBe('First');
        expect(props.selectedItem?.[1].notification).toBe('Second');
    });
});