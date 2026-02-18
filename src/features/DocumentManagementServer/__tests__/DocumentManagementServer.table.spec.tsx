import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DmsControlledList from "../components/DocumentManagementServer.table";

jest.mock("../../../shared/components/Filter/Filter", () => () => <div data-testid="filter-dialog">FilterDialog</div>);
jest.mock("@essnextgen/ui-kit", () => {
  const original = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...original,
    ControlledList: ({
      editSelectedBtnTitle,
      onClickSidePnlSecondaryBtn,
      handleCloseDialogConfirmation,
      filterCustumeElem2
    }: any) => (
      <div data-testid="controlled-list-mock">
        {editSelectedBtnTitle}
        <button
          data-testid="secondary-btn"
          type="button"
          onClick={onClickSidePnlSecondaryBtn}
        >
          Secondary
        </button>
        <button
          data-testid="close-dialog-btn"
          type="button"
          onClick={handleCloseDialogConfirmation}
        >
          CloseDialog
        </button>
        <div data-testid="filter-custom-elem">{filterCustumeElem2}</div>
      </div>
    )
  };
});

const t = (key: string) => key;
const baseProps = {
	t,
	tableKey: 1,
	tableData: [],
	totalPage: 1,
	currentPage: 1,
	isInitialLoad: false,
	searchInput: "",
	searchTerm: "",
	filteredSuggestions: [],
	isSearchLoading: false,
	issearchDataLoading: false,
	showErrorBanner: false,
	showSearchError: false,
	isSearchTriggered: false,
	NotificationMsgBannerObject: {},
	resultNotFoundMSG: "No results",
	searchTagListRaw: [],
	onPageChange: jest.fn(),
	handleSorting: jest.fn(),
	isClearSelectedCheckbox: false,
	setSelectedCheckBoxIds: jest.fn(),
	setExcludedCheckBoxIds: jest.fn(),
	onChangeListCheckBox: jest.fn(),
	onEditSelectedOverFlowMenu: jest.fn(),
	handleSearchClose: jest.fn(),
	handleTagClose: jest.fn(),
	handleSearchChange: jest.fn(),
	handleSuggestionClick: jest.fn(),
	isFilterDialogOpen: false,
	setIsFilterDialogOpen: jest.fn(),
	isFilterLoading: false,
	selectedCategories: [],
	setSelectedCategories: jest.fn(),
	selectedDateRange: {},
	setSelectedDateRange: jest.fn(),
	isDateError: false,
	setIsDateError: jest.fn(),
	setDocumentRelatedTo: jest.fn(),
	selectedRelatedTo: undefined,
	setSelectedRelatedTo: jest.fn(),
	tagListArray: [],
	setTagListArray: jest.fn(),
	handleApplyWrapper: jest.fn(),
	handleFilterOnClick: jest.fn(),
	isSidePanelOpen: false,
	availableFileCount: 0,
	handleCloseSidePanel: jest.fn(),
	isDialogLoading: false,
	isGlobalLoaderModel: false,
	getTitleConfirmation: jest.fn(() => "Title"),
	dialogConfig: {},
	dialogType: "",
	docData: { totalRecords: 0 },
	hasDMSDeletePermissions: false,
	hasCompletedFiles: false,
	setShowConfirmDialog: jest.fn(),
	setDialogType: jest.fn(),
	setIsSidePanelOpen: jest.fn(),
	showConfirmDialog: false,
	setIsHeaderBoxChecked: jest.fn(),
	setAllSelectedDocs: jest.fn(),
	setTableKey: jest.fn(),
	setIsInitialLoad: jest.fn(),
	setSelectedFormats: jest.fn(),
	setSelectedEntities: jest.fn(),
	setSearchTerm: jest.fn(),
	setSearchText: jest.fn(),
	setSearchRefExternalId: jest.fn(),
	setIsSearchTriggered: jest.fn(),
	setPrevSelectedDocs: jest.fn(),
	setIsClearSelectedCheckbox: jest.fn(),
	searchText: "",
	setDateRange: jest.fn(),
	isSidePanelLoader: false,
	addEditTemplateChild: null,
};
const notImplemented = function notImplemented() {
  throw new Error("Function not implemented.");
};

describe("DmsControlledList", () => {
	it("renders ControlledList with correct props", () => {
		render(
  <DmsControlledList
    setSortBy={notImplemented}
    setSortDirection={notImplemented}
    setSearchInput={notImplemented}
    {...baseProps}
  />
);
		expect(screen.getByTestId("controlled-list-mock")).toBeInTheDocument();
		expect(screen.getByText("DocumentManagementServer.editSelectedBtnTitle")).toBeInTheDocument();
	});

	it("calls onClickSidePnlSecondaryBtn when secondary button is clicked", () => {
		const setDialogType = jest.fn();
		const setShowConfirmDialog = jest.fn();
		const setIsSidePanelOpen = jest.fn();
		
			render(
			<DmsControlledList
				setSortBy={notImplemented}
				setSortDirection={notImplemented}
				setSearchInput={notImplemented}
				{...baseProps}
				hasCompletedFiles={true}
				setDialogType={setDialogType}
				setIsSidePanelOpen={setIsSidePanelOpen}			/>
		);
		fireEvent.click(screen.getByTestId("secondary-btn"));
		expect(setDialogType).toHaveBeenCalledWith("clearAll");
		expect(setShowConfirmDialog).toHaveBeenCalledWith(true);
	});

	it("calls setIsSidePanelOpen(false) when secondary button is clicked and no completed files", () => {
		const setIsSidePanelOpen = jest.fn();
		render(
			<DmsControlledList
			setSortBy={notImplemented}
			setSortDirection={notImplemented}
			setSearchInput={notImplemented}
			{...baseProps}
			hasCompletedFiles={false}
			setIsSidePanelOpen={setIsSidePanelOpen}			/>
		);
		fireEvent.click(screen.getByTestId("secondary-btn"));
		expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
	});

	it("calls handleCloseDialogConfirmation when close dialog button is clicked", () => {
		const setShowConfirmDialog = jest.fn();
		render(
			<DmsControlledList
			setSortBy={notImplemented}
			setSortDirection={notImplemented}
			setSearchInput={notImplemented}
			{...baseProps}
			setShowConfirmDialog={setShowConfirmDialog}			/>
		);
		fireEvent.click(screen.getByTestId("close-dialog-btn"));
		expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
	});

	it("renders filter custom element and filter dialog", () => {
		render(<DmsControlledList setSortBy={notImplemented}
			setSortDirection={notImplemented}
			setSearchInput={notImplemented}
			{...baseProps} />);
		expect(screen.getByTestId("filter-custom-elem")).toBeInTheDocument();
		expect(screen.getByTestId("filter-dialog")).toBeInTheDocument();
	});
});
