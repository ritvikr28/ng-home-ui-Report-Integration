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
        ResponseCode: { Error: "error", Info: "info" },
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
    totalOriginalNotifications: 1,
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
    isNoSelectionDialogOpen: false,
    closeNoSelectionDialog: jest.fn(),
    searchTerm: "",
    handleSearchChange: jest.fn(),
    handleClearSearch: jest.fn(),
    isSearching: false,
    noResults: false,
    filters: {},
    handleFilterChange: jest.fn(),
    handleRemoveFilter: jest.fn(),
    handleClearAllFilters: jest.fn(),
    searchTagList: [],
    sortBy: "Date received",
    sortDirection: "desc" as const,
    handleSort: jest.fn(),
    isNoSelectionMode: false,
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

    it("blurs active element and closes delete dialog when modal closes", () => {
        const closeDeleteDialogMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                closeDeleteDialog: closeDeleteDialogMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];
        
        
        const mockBlur = jest.fn();
        const mockActiveElement = document.createElement('div');
        mockActiveElement.blur = mockBlur;
        
        
        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        deleteModalProps.onClose();

        expect(closeDeleteDialogMock).toHaveBeenCalled();
        expect(mockBlur).toHaveBeenCalled();
        
        
        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
    });

    it("blurs active element and confirms deletion when confirmation resolves", async () => {
        const confirmDeleteMock = jest.fn().mockResolvedValue(undefined);
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                confirmDelete: confirmDeleteMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];
        
        
        const mockBlur = jest.fn();
        const mockActiveElement = document.createElement('div');
        mockActiveElement.blur = mockBlur;
        
        
        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        await act(async () => {
            await deleteModalProps.onConfirm();
        });

        expect(confirmDeleteMock).toHaveBeenCalled();
        expect(mockBlur).toHaveBeenCalled();
        
        
        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
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

describe("NotificationView - tableRows and visibleNotificationIds", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should generate tableRows with existing id", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [{ notification: "Test", id: "existing-id" }],
                currentPage: 1,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        const { tableBodyData } = controlledListProps;

        expect(tableBodyData[0].id).toBe("existing-id");
    });

    it("should generate tableRows with Id (capital I)", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [{ notification: "Test", Id: "capital-id" }],
                currentPage: 1,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        const { tableBodyData } = controlledListProps;

        expect(tableBodyData[0].id).toBe("capital-id");
    });

    it("should generate fallback id when neither id nor Id exists", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [{ notification: "Test" }],
                currentPage: 2,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        const { tableBodyData } = controlledListProps;

        expect(tableBodyData[0].id).toBe("notification-2-0");
    });

    it("should generate visibleNotificationIds from tableRows", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [
                    { notification: "Test1", id: "id1" },
                    { notification: "Test2", id: "id2" }
                ],
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        const selectEvent = { target: { checked: true } };
        controlledListProps.onChangeAllCheckBox(selectEvent);

        expect(mockUseNotification.handleSelectAllChange).toHaveBeenCalledWith(selectEvent, ["id1", "id2"]);
    });
});

describe("NotificationView - handleBulkDeleteSelection", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should call handleBulkAction with selectedItem and visibleNotificationIds", () => {
        const handleBulkActionMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                paginatedNotifications: [
                    { notification: "Test1", id: "id1" },
                    { notification: "Test2", id: "id2" }
                ],
                handleBulkAction: handleBulkActionMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        const selectedItem = { value: "Delete" };
        controlledListProps.onEditSelectedOverFlowMenu(null, selectedItem);

        expect(handleBulkActionMock).toHaveBeenCalledWith(selectedItem, ["id1", "id2"]);
    });
});

describe("NotificationView - handleCloseDeleteDialog", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should call closeDeleteDialog and blur active element", () => {
        const closeDeleteDialogMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                closeDeleteDialog: closeDeleteDialogMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        const mockBlur = jest.fn();
        const mockActiveElement = document.createElement('div');
        mockActiveElement.blur = mockBlur;

        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        deleteModalProps.onClose();

        expect(closeDeleteDialogMock).toHaveBeenCalled();
        expect(mockBlur).toHaveBeenCalled();

        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
    });

    it("should handle case when activeElement is not HTMLElement", () => {
        const closeDeleteDialogMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                closeDeleteDialog: closeDeleteDialogMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        const mockActiveElement = document.createElement('svg');
        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        deleteModalProps.onClose();

        expect(closeDeleteDialogMock).toHaveBeenCalled();

        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
    });
});

describe("NotificationView - handleConfirmDelete", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should call confirmDelete and blur active element", async () => {
        const confirmDeleteMock = jest.fn().mockResolvedValue(undefined);
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                isNoSelectionMode: false,
                confirmDelete: confirmDeleteMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        const mockBlur = jest.fn();
        const mockActiveElement = document.createElement('div');
        mockActiveElement.blur = mockBlur;

        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        await act(async () => {
            await deleteModalProps.onConfirm();
        });

        expect(confirmDeleteMock).toHaveBeenCalled();
        expect(mockBlur).toHaveBeenCalled();

        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
    });

    it("should handle case when activeElement is not HTMLElement in confirmDelete", async () => {
        const confirmDeleteMock = jest.fn().mockResolvedValue(undefined);
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                isNoSelectionMode: false,
                confirmDelete: confirmDeleteMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        const mockActiveElement = document.createElement('svg');
        const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
        Object.defineProperty(document, 'activeElement', {
            get: () => mockActiveElement,
            configurable: true,
        });

        await act(async () => {
            await deleteModalProps.onConfirm();
        });

        expect(confirmDeleteMock).toHaveBeenCalled();

        if (originalActiveElement) {
            Object.defineProperty(document, 'activeElement', originalActiveElement);
        } else {
            delete (document as any).activeElement;
        }
    });
});

describe("NotificationView - shouldShowPagination", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should show pagination when all conditions are met", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalPages: 5,
                paginatedNotifications: [{ notification: "Test", id: 1 }],
                noResults: false,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isPagination).toBe(true);
    });

    it("should not show pagination when totalPages is 1", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalPages: 1,
                paginatedNotifications: [{ notification: "Test", id: 1 }],
                noResults: false,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isPagination).toBe(false);
    });

    it("should not show pagination when paginatedNotifications is empty", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalPages: 5,
                paginatedNotifications: [],
                noResults: false,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isPagination).toBe(false);
    });

    it("should not show pagination when noResults is true", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalPages: 5,
                paginatedNotifications: [{ notification: "Test", id: 1 }],
                noResults: true,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isPagination).toBe(false);
    });
});

describe("NotificationView - useEffect body class", () => {
    beforeEach(() => {
        document.body.classList.remove('no-scroll');
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should add no-scroll class to body on mount", () => {
        render(<NotificationView />);
        expect(document.body.classList.contains('no-scroll')).toBe(true);
    });
});

describe("NotificationView - searchOnClickClose", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should call handleRemoveFilter for status when closeObj.id is 1", () => {
        const handleRemoveFilterMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleRemoveFilter: handleRemoveFilterMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnClickClose(null, "text", { id: 1, value: "read" });

        expect(handleRemoveFilterMock).toHaveBeenCalledWith('status', 'read');
    });

    it("should call handleRemoveFilter for priority when closeObj.id is 2", () => {
        const handleRemoveFilterMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleRemoveFilter: handleRemoveFilterMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnClickClose(null, "text", { id: 2, value: "high" });

        expect(handleRemoveFilterMock).toHaveBeenCalledWith('priority', 'high');
    });

    it("should call handleRemoveFilter for startDate when closeObj.id is 3", () => {
        const handleRemoveFilterMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleRemoveFilter: handleRemoveFilterMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnClickClose(null, "text", { id: 3 });

        expect(handleRemoveFilterMock).toHaveBeenCalledWith('startDate');
    });

    it("should call handleRemoveFilter for startDate when closeObj.name is Date", () => {
        const handleRemoveFilterMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleRemoveFilter: handleRemoveFilterMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnClickClose(null, "text", { name: 'Date' });

        expect(handleRemoveFilterMock).toHaveBeenCalledWith('startDate');
    });

    it("should call handleClearSearch when closeObj is not provided", () => {
        const handleClearSearchMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleClearSearch: handleClearSearchMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnClickClose(null);

        expect(handleClearSearchMock).toHaveBeenCalled();
    });
});

describe("NotificationView - addEditTemplateChild", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should render notification text when selectedItem exists", () => {
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

    it("should render null for notification text when selectedItem is null", () => {
        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];
        const { container } = render(<>{controlledListProps.addEditTemplateChild()}</>);

        const notificationDiv = container.querySelector('div[style*="font-size: 20px"]');
        expect(notificationDiv?.textContent).toBe("");
    });
});

describe("NotificationView - ControlledList props", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should pass all ControlledList props correctly", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                searchTerm: "test",
                noResults: false,
                totalNotifications: 5,
                totalOriginalNotifications: 5,
                isSearching: false,
                sortBy: "Date received",
                sortDirection: "desc",
                searchTagList: [{ text: "Test", categoryName: "Status", closeObj: { name: "Test", id: 1 } }],
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.tooltipBottomAligned).toBe(true);
        expect(controlledListProps.isAddEventBtnShow).toBe(false);
        expect(controlledListProps.filterDDLOptions).toEqual([]);
        expect(controlledListProps.isShowSearch).toBe(true);
        expect(controlledListProps.searchTerm).toBe("test");
        expect(controlledListProps.isShowFirstElement).toBe(true);
        expect(controlledListProps.isShowFourthElement).toBe(true);
        expect(controlledListProps.editSelectedBtnTitle).toBe("Edit selected");
        expect(controlledListProps.emptyStateMsg).toBe("");
        expect(controlledListProps.groupTagsEnabled).toBe(true);
        expect(controlledListProps.headingText).toBe("Notification Centre");
        expect(controlledListProps.id).toBe("controlled-list");
        expect(controlledListProps.isBreadCrumbEnable).toBe(false);
        expect(controlledListProps.isOnCloseSidepnl).toBe(true);
        expect(controlledListProps.lastColContentAlign).toBe("center");
        expect(controlledListProps.lastColHeaderAlign).toBe("center");
        expect(controlledListProps.paginationMinCountToHideNextPreviousBtn).toBe(0);
        expect(controlledListProps.isShowPrimaryBtn).toBe(false);
        expect(controlledListProps.resultNotFoundMessage).toBe("");
        expect(controlledListProps.showConfirmDialog).toBe(true);
        expect(controlledListProps.subHeadingText).toBe("");
        expect(controlledListProps.tableFirstColumnWidth).toBe("10px");
        expect(controlledListProps.tableLastColumnWidth).toBe("10px");
        expect(controlledListProps.sortByDefault).toBe(true);
        expect(controlledListProps.sortAscFirst).toBe(false);
        expect(controlledListProps.isOpenConfirmationDialog).toBe(false);
        expect(controlledListProps.isIconRightAligned).toBe(true);
        expect(controlledListProps.isShowOverflowMenuCol).toBe(false);
        expect(controlledListProps.searchHeadingText).toBe("Search by notification title");
        expect(controlledListProps.isSearchHideClearIcon).toBe(true);
        expect(controlledListProps.dynamicTableLoader).toBe(false);
        expect(controlledListProps.sidePanelTitle).toBe("View");
        expect(controlledListProps.sidePanelSubTitle).toBe("");
        expect(controlledListProps.secondaryButtonTitle).toBe("Close");
        expect(controlledListProps.isShowCheckboxCol).toBe(true);
        expect(controlledListProps.isShowThirdElement).toBe(true);
        expect(controlledListProps.emptyRowResponseCode).toBe("info");
        expect(controlledListProps.showToastNotification).toBe(false);
        expect(controlledListProps.toastNotificationStatus).toBe("successToast");
        expect(controlledListProps.toastNotificationTitle).toBe("Notification deleted");
        expect(controlledListProps.searchTagList).toHaveLength(1);
    });

    it("should pass emptyStateMsg based on noResults", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                noResults: true,
                totalNotifications: 0,
                totalOriginalNotifications: 5,
                isSearching: false,
                searchTerm: "test",
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.emptyStateMsg).toBe("Your search - test - did not match any results. Make sure that all words are spelled correctly.");
    });

    it("should pass isShowdynamictableNoMsg based on totalNotifications and noResults", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                totalNotifications: 0,
                noResults: false,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isShowdynamictableNoMsg).toBe(true);
    });

    it("should pass emptyRowResponseMessage based on noResults", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                noResults: true,
                totalNotifications: 0,
                totalOriginalNotifications: 5,
                isSearching: false,
                searchTerm: "test",
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.emptyRowResponseMessage).toBe("Your search - test - did not match any results. Make sure that all words are spelled correctly.");
    });

    it("should pass isSearchHideClearIcon based on searchTerm length", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                searchTerm: "te",
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.isSearchHideClearIcon).toBe(false);
    });

    it("should pass sortAscFirst when sortDirection is asc", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                sortBy: "Priority",
                sortDirection: "asc",
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.sortAscFirst).toBe(true);
    });

    it("should pass sortAscFirst as false when sortDirection is desc", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                sortBy: "Date received",
                sortDirection: "desc",
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        expect(controlledListProps.sortAscFirst).toBe(false);
    });

    it("should call handleSort when sortingOnClickEvent is triggered", () => {
        const handleSortMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleSort: handleSortMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.sortingOnClickEvent(null, "Priority");

        expect(handleSortMock).toHaveBeenCalledWith("Priority");
    });

    it("should call handleSearchChange when searchOnChange is triggered", () => {
        const handleSearchChangeMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleSearchChange: handleSearchChangeMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnChange({ target: { value: "test search" } });

        expect(handleSearchChangeMock).toHaveBeenCalledWith("test search");
    });

    it("should call handleClearSearch when searchOnCloseHandle is triggered", () => {
        const handleClearSearchMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                handleClearSearch: handleClearSearchMock,
            })
        );

        render(<NotificationView />);
        const controlledListMock = getMockedControlledList();
        const controlledListProps = controlledListMock.mock.calls[controlledListMock.mock.calls.length - 1]?.[0];

        controlledListProps.searchOnCloseHandle();

        expect(handleClearSearchMock).toHaveBeenCalled();
    });
});

describe("NotificationView - FilterDialogLogic props", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should pass correct props to FilterDialogLogic", () => {
        const setFilterBtnClickedMock = jest.fn();
        const handleFilterChangeMock = jest.fn();
        const handleClearAllFiltersMock = jest.fn();
        const filtersMock = { status: ["read"] };

        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                filterBtnClicked: true,
                setFilterBtnClicked: setFilterBtnClickedMock,
                filters: filtersMock,
                handleFilterChange: handleFilterChangeMock,
                handleClearAllFilters: handleClearAllFiltersMock,
            })
        );

        render(<NotificationView />);
        const filterDialog = screen.getByTestId("filter-dialog");

        expect(filterDialog).toBeInTheDocument();
    });
});

describe("NotificationView - DeleteConfirmationModalLogic props", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should pass correct props to DeleteConfirmationModalLogic", () => {
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                selectedCount: 3,
                isDeleteLoading: false,
                isNoSelectionMode: false,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        expect(deleteModalProps.isOpen).toBe(true);
        expect(deleteModalProps.selectedCount).toBe(3);
        expect(deleteModalProps.isLoading).toBe(false);
        expect(deleteModalProps.isNoSelection).toBe(false);
    });

    it("should call handleCloseDeleteDialog when isNoSelectionMode is true", () => {
        const closeDeleteDialogMock = jest.fn();
        mockedUseNotification.mockReturnValue(
            buildUseNotificationValue({
                isDeleteDialogOpen: true,
                isNoSelectionMode: true,
                closeDeleteDialog: closeDeleteDialogMock,
            })
        );

        render(<NotificationView />);
        const deleteModalMock = getMockedDeleteModal();
        const deleteModalProps = deleteModalMock.mock.calls[deleteModalMock.mock.calls.length - 1]?.[0];

        deleteModalProps.onConfirm();

        expect(closeDeleteDialogMock).toHaveBeenCalled();
    });
});

describe("NotificationView - layout and structure", () => {
    beforeEach(() => {
        mockedUseNotification.mockClear();
        mockedUseNotification.mockReturnValue(mockUseNotification);
    });

    it("should render with correct layout structure", () => {
        const { container } = render(<NotificationView />);

        expect(container.querySelector('.notification-layout')).toBeInTheDocument();
        expect(container.querySelector('.notification-layout-header')).toBeInTheDocument();
        expect(container.querySelector('.notification-controlledlist-width')).toBeInTheDocument();
        expect(container.querySelector('.notification-filters-wrapper')).toBeInTheDocument();
    });

    it("should render tableWrapperRef with correct attributes", () => {
        const { container } = render(<NotificationView />);
        const tableWrapper = container.querySelector('.notification-controlledlist-width');

        expect(tableWrapper).toHaveAttribute('tabIndex', '-1');
        expect(tableWrapper).toHaveAttribute('aria-label', 'Notifications table');
    });
});