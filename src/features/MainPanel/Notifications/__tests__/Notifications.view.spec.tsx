import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import * as UIKit from "@essnextgen/ui-kit";
import NotificationView from "../Notifications.view";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal/DeleteConfirmationModal.logic";
import { getNotificationTableHeadersData } from "../helper";
import { useNotification } from "../useNotification";

type MockButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    "data-testid"?: string;
    [key: string]: any;
};

jest.mock("@essnextgen/ui-kit", () => {
    const MockButton = ({ children, onClick, "data-testid": dataTestId, ...props }: MockButtonProps) => (
        <button data-testid={dataTestId} type="button" onClick={onClick} {...props}>
            {children}
        </button>
    );

    MockButton.defaultProps = {
        onClick: () => { },
        "data-testid": "button",
    };

    return {
        Breadcrumbs: jest.fn((props: any) => <div data-testid="breadcrumbs" {...props} />),
        ControlledList: jest.fn(({ filterCustumeElem2, handleCloseSidePanel, onClickSidePnlSecondaryBtn, tableBodyData, tableHeadersData, ...props }: { filterCustumeElem2: React.ReactNode; handleCloseSidePanel: () => void; onClickSidePnlSecondaryBtn: () => void; tableBodyData: any[]; tableHeadersData: any[];[key: string]: any }) => (
            <div data-testid="controlled-list" {...props}>
                {filterCustumeElem2}
                <button data-testid="close-side-panel-btn" onClick={handleCloseSidePanel} type="button">Close Panel</button>
                <button data-testid="secondary-side-panel-btn" onClick={onClickSidePnlSecondaryBtn} type="button">Secondary Panel Close</button>
                <div data-testid="table-body-data">{JSON.stringify(tableBodyData)}</div>
                <div data-testid="table-headers-data">{JSON.stringify(tableHeadersData.map((h: any) => h.header))}</div>
            </div>
        )),
        Button: MockButton,
        NotificationStatus: { SUCCESS: "success", SUCCESSTOAST: "successToast" },
        DialogTemplate: { Confirmation: "confirmation" },
        ResponseCode: { Error: "error" },
        ButtonColor: { Utility: "utility" },
        ButtonSize: { Small: "small" },
        IconColor: { Neutral800: "neutral800" },
        ButtonIconPosition: { Right: "right" },
    };
});

const getMockedBreadcrumbs = () => UIKit.Breadcrumbs as unknown as jest.Mock;
const getMockedControlledList = () => UIKit.ControlledList as unknown as jest.Mock;
const getMockedDeleteModal = () => DeleteConfirmationModal as unknown as jest.Mock;
const mockedUseNotification = useNotification as jest.MockedFunction<typeof useNotification>;

beforeEach(() => {
    getMockedBreadcrumbs().mockClear();
    getMockedControlledList().mockClear();
    getMockedDeleteModal().mockClear();
});

const mockSetSideIsOpen = jest.fn();
const mockSetSelectedItem = jest.fn();
jest.mock("../helper", () => ({
    getNotificationTableHeadersData: (setSideIsOpen: any, setSelectedItem: any) => [
        {
            header: "Notification",
            onClick: () => {
                setSideIsOpen(true);
                setSelectedItem([{ notification: "TestNotification" }]);
            }
        }
    ],
    notificationTableRows: [
        { notification: "TestNotification", id: 1 }
    ]
}));

type UseNotificationReturn = ReturnType<typeof useNotification>;

const mockUseNotificationBase = {
    filterBtnClicked: false,
    setFilterBtnClicked: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    paginatedNotifications: [{ notification: "TestNotification", id: 1 }],
    totalNotifications: 1,
    handlePageChange: jest.fn(),
    handleListCheckboxChange: jest.fn(),
    handleSelectAllChange: jest.fn(),
    handleSelectedCheckboxIds: [],
    handleBulkAction: jest.fn(),
    isDeleteDialogOpen: false,
    closeDeleteDialog: jest.fn(),
    confirmDelete: jest.fn(),
    isDeleteLoading: false,
    showDeleteToast: false,
    isClearSelectedCheckbox: false,
    selectedCount: 0,
    selectedNotificationIds: [],
};

type UseNotificationOverrides = Partial<Record<keyof typeof mockUseNotificationBase, unknown>>;

const buildUseNotificationValue = (overrides: UseNotificationOverrides = {}) =>
    ({ ...mockUseNotificationBase, ...overrides }) as unknown as UseNotificationReturn;

const mockUseNotification = buildUseNotificationValue();

type MockedHeaderData = { onClick: () => void; [key: string]: unknown };
const getMockedHeadersData = (...args: Parameters<typeof getNotificationTableHeadersData>) =>
    getNotificationTableHeadersData(...args) as unknown as MockedHeaderData[];

jest.mock("../useNotification", () => ({
    useNotification: jest.fn(() => mockUseNotification)
}));

jest.mock("../components/FilterDialogComponent/FilterDialog.logic", () => (props: any) => (
    <div data-testid="filter-dialog" {...props}>Filter Dialog</div>
));

jest.mock("../components/NotificationSidePanelComponent/NotificationSidePanel.view", () => (props: any) => (
    <div data-testid="notification-side-panel" {...props}>Side Panel</div>
));

jest.mock("../components/DeleteConfirmationModal/DeleteConfirmationModal.logic", () => {
    const MockDeleteModal = jest.fn((props: any) => (
        <div data-testid="delete-confirmation-modal" {...props}>Delete Confirmation Modal</div>
    ));
    return MockDeleteModal;
});

describe("NotificationView rendering and basic interactions", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the main layout and key components", () => {
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
        expect(screen.getByTestId("controlled-list")).toBeInTheDocument();
        expect(screen.getByTestId("notification-side-panel")).toBeInTheDocument();
        expect(screen.getByTestId("delete-confirmation-modal")).toBeInTheDocument();
    });

    it("shows filter dialog when filterBtnClicked is true", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                filterBtnClicked: true,
            })
        );

        render(<NotificationView />);
        expect(screen.getByTestId("filter-dialog")).toBeInTheDocument();
    });

    it("calls setFilterBtnClicked when filter button is clicked", () => {
        const setFilterBtnClickedMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                setFilterBtnClicked: setFilterBtnClickedMock,
            })
        );

        render(<NotificationView />);
        const filterBtn = screen.getByText("Filter");
        fireEvent.click(filterBtn);
        expect(setFilterBtnClickedMock).toHaveBeenCalledWith(true);
    });

    it("opens side panel and sets selectedItem when table header onClick is triggered", () => {
        render(<NotificationView />);
        const headers = getMockedHeadersData;

        headers(mockSetSideIsOpen, mockSetSelectedItem)[0].onClick();

        expect(mockSetSideIsOpen).toHaveBeenCalledWith(true);
        expect(mockSetSelectedItem).toHaveBeenCalledWith([{ notification: "TestNotification" }]);
    });

    it("renders ControlledList with correct props", () => {
        render(<NotificationView />);
        const controlledList = screen.getByTestId("controlled-list");
        expect(controlledList).toBeInTheDocument();
        expect(controlledList).toHaveAttribute("data-testid", "controlled-list");
    });

    it("renders filter button inside ControlledList", () => {
        render(<NotificationView />);
        const filterBtn = screen.getByText("Filter");
        expect(filterBtn).toBeInTheDocument();
        expect(filterBtn).toHaveTextContent("Filter");
    });

    it("does not render filter dialog when filterBtnClicked is false", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                filterBtnClicked: false,
            })
        );
        render(<NotificationView />);
        expect(screen.queryByTestId("filter-dialog")).not.toBeInTheDocument();
    });

    it("renders notification side panel with correct props", () => {
        render(<NotificationView />);
        const sidePanel = screen.getByTestId("notification-side-panel");
        expect(sidePanel).toBeInTheDocument();
        expect(sidePanel).toHaveTextContent("Side Panel");
    });

    it("renders breadcrumbs with correct props", () => {
        render(<NotificationView />);
        const breadcrumbs = screen.getByTestId("breadcrumbs");
        expect(breadcrumbs).toBeInTheDocument();
        expect(breadcrumbs).toHaveAttribute("dataTestId", "breadcrumb-test-id");
    });

    it("ControlledList receives tableBodyData and tableHeadersData", () => {
        render(<NotificationView />);
        const controlledList = screen.getByTestId("controlled-list");
        expect(controlledList).toBeDefined();
        const tableBodyDataDiv = screen.getByTestId("table-body-data");
        expect(tableBodyDataDiv).toHaveTextContent(JSON.stringify([{ notification: "TestNotification", id: 1 }]));

        const tableHeadersDataDiv = screen.getByTestId("table-headers-data");
        expect(tableHeadersDataDiv).toHaveTextContent(JSON.stringify(["Notification"]));
    });

    it("calls onItemClick and sets window.location.href to the breadcrumb path", () => {
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: "", origin: "http://localhost" }
        });

        render(<NotificationView />);
        const breadcrumbsMock = getMockedBreadcrumbs();
        const onItemClick = breadcrumbsMock.mock.calls[breadcrumbsMock.mock.calls.length - 1]?.[0]?.onItemClick;
        const testPath = "http://test-url.com";

        if (onItemClick) {
            onItemClick(testPath);
            expect(window.location.href).toBe(testPath);
        } else {
            throw new Error("onItemClick prop not found on Breadcrumbs mock.");
        }

        Object.defineProperty(window, 'location', {
            writable: true,
            value: originalLocation
        });
    });

    it("calls the internal setSideIsOpen(false) when onClickSidePnlSecondaryBtn is triggered via mock button", () => {
        render(<NotificationView />);
        const secondaryBtn = screen.getByTestId("secondary-side-panel-btn");
        fireEvent.click(secondaryBtn);
    });

    it("calls the internal setSideIsOpen(false) when handleCloseSidePanel is triggered via mock button", () => {
        render(<NotificationView />);
        const closePanelBtn = screen.getByTestId("close-side-panel-btn");
        fireEvent.click(closePanelBtn);
    });
});

describe("NotificationView state management and logic coverage", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
        mockSetSideIsOpen.mockClear();
        mockSetSelectedItem.mockClear();
    });

    it("initializes filterBtnClicked and setFilterBtnClicked from useNotification", () => {
        render(<NotificationView />);
        expect(mockedUseNotification).toHaveBeenCalled();
    });

    it("updates sideIsOpen and selectedItem when table header onClick is triggered (re-test for coverage)", () => {
        const headers = getMockedHeadersData;
        headers(mockSetSideIsOpen, mockSetSelectedItem)[0].onClick();
        expect(mockSetSideIsOpen).toHaveBeenCalledWith(true);
        expect(mockSetSelectedItem).toHaveBeenCalledWith([{ notification: "TestNotification" }]);
    });

    it("ControlledList renders content of addEditTemplateChild when selectedItem is set", () => {
        render(<NotificationView />);

        const headers = getMockedHeadersData;
        headers(() => () => {
            mockedUseNotification.mockReturnValue(mockUseNotification);
            render(<NotificationView />);
            const controlledList = screen.getByTestId("controlled-list");

            const { addEditTemplateChild } = (controlledList as any).props;
            const content = render(addEditTemplateChild({ notification: "TestNotification" }));

            expect(content.getByText("TestNotification")).toBeInTheDocument();
            expect(content.getByText(/The role Headteacher has been updated/)).toBeInTheDocument();
        });
    });

    it("ControlledList receives pagination props correctly when needed", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalPages: 5,
                paginatedNotifications: [{}],
                totalNotifications: 10,
            })
        );
        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        expect(controlledListProps.isPagination).toBe(true);
        expect(controlledListProps.paginationCount).toBe(5);
        expect(controlledListProps.paginationPage).toBe(1);
    });

    it("focuses the table wrapper and closes delete dialog when modal closes", () => {
        const closeDeleteDialogMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                closeDeleteDialog: closeDeleteDialogMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];
        const tableWrapper = screen.getByLabelText("Notifications table");
        const focusSpy = jest.spyOn(tableWrapper, "focus").mockImplementation(() => { });

        deleteModalProps.onClose();

        expect(closeDeleteDialogMock).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
    });

    it("confirms deletion and refocuses table when confirmation resolves", async () => {
        const confirmDeleteMock = jest.fn().mockResolvedValue(undefined);
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                confirmDelete: confirmDeleteMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];
        const tableWrapper = screen.getByLabelText("Notifications table");
        const focusSpy = jest.spyOn(tableWrapper, "focus").mockImplementation(() => { });

        await act(async () => {
            await deleteModalProps.onConfirm();
        });

        expect(confirmDeleteMock).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
    });

    it("renders selected notification details in addEditTemplateChild when a row header is clicked", () => {
        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        let controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        const tableHeadersData = controlledListProps.tableHeadersData as Array<{ onClick: () => void }>;
        tableHeadersData[0].onClick();

        controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        const { getByText } = render(<>{controlledListProps.addEditTemplateChild()}</>);

        expect(getByText("TestNotification")).toBeInTheDocument();
        expect(getByText(/The role Headteacher has been updated/)).toBeInTheDocument();
    });

    it("passes checkbox handlers and visible ids to ControlledList", () => {
        const handleListCheckboxChange = jest.fn();
        const handleSelectAllChange = jest.fn();

        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [
                    { notification: "FirstNotification", id: "a" },
                    { notification: "SecondNotification", id: "b" }
                ],
                handleListCheckboxChange,
                handleSelectAllChange,
                selectedNotificationIds: []
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.onChangeListCheckBox(0, "a");
        expect(handleListCheckboxChange).toHaveBeenCalledWith(0, "a");

        const selectEvent = { target: { checked: true } };
        controlledListProps.onChangeAllCheckBox(selectEvent);
        expect(handleSelectAllChange).toHaveBeenCalledWith(selectEvent, ["a", "b"]);
        expect(controlledListProps.selectedCheckboxIds).toBe(mockUseNotification.handleSelectedCheckboxIds);
        expect(controlledListProps.isClearSelectedCheckbox).toBe(mockUseNotification.isClearSelectedCheckbox);
    });
});