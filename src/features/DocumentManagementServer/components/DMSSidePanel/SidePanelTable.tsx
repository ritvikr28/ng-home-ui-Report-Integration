import React, { useState, useEffect } from "react";
import { ControlledList, DialogTemplate, CheckBoxSelectedState, ResponseCode } from "@essnextgen/ui-kit";
import { useSidePanelTableSelection, createTableHeadersData, filterDDLOptions, createHandleDocumentClick, createHandleSorting } from "./sidePanelTable.logic";
import { pageSizeNumber } from "../../../../../public/Constants";
import { useScrollToTopOnPageChange } from "../../hooks/useDocumentManagementEffects";

interface SidePanelTableProps {
  tableBodyData: any[];
  onSortChange: (columnName: string) => void;
  onDownloadError: (hasError: boolean) => void;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isPrivateDocError: boolean;
}

export const SidePanelTable: React.FC<SidePanelTableProps> = ({
  tableBodyData,
  onSortChange,
  onDownloadError,
  totalRecords,
  onPageChange,
  isLoading,
  isPrivateDocError,
}) => {
  const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
  const [isInitialLoad, setIsInitialLoad]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true);

  useScrollToTopOnPageChange(currentPage, '.essui-side-panel-content');

  useEffect(() => {
    setIsInitialLoad(false);
  }, [tableBodyData]);
  
  const totalPages = Math.ceil(totalRecords / pageSizeNumber);

  const handleDocumentClick = createHandleDocumentClick(onDownloadError);

  const tableHeadersData: any = createTableHeadersData(handleDocumentClick);

  const {
    setSelectedIds,
    handleRowCheckboxChange,
    handleOnChangeAllCheckBox,
    handlePrevSelectedDocs,
    setExcludedCheckBoxIds
  }: any = useSidePanelTableSelection(tableBodyData);


  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number): void => {
    setCurrentPage(page);
    onPageChange(page);
  };
  const handleSorting = createHandleSorting(setIsInitialLoad, onSortChange, setCurrentPage);

  return (
    <div className="manage-documents-side-panel-table">
    <ControlledList
      id="sidepanel-table"
      dataTestId="sidepanel-table"
      tableHeadersData={tableHeadersData}
      tableBodyData={tableBodyData}
      totalRecords={totalRecords}
      isPagination={!isLoading}
      paginationCount={totalPages}
      paginationPage={currentPage}
      paginationOnChange={handlePageChange}
      paginationMinCountToHideNextPreviousBtn={1}
      editSelectedBtnTitle="Actions"
      editSelectedOptions={[
        { text: "Make standard", value: "Standard", disabled: false, isSelected: false },
        { text: "Make confidential", value: "Confidential", disabled: false, isSelected: false },
        { text: "Delete", value: "Delete", disabled: false, isSelected: false, isShowDivider: true }
      ]}
      onEditSelectedBtnClick={() => {}}
      onEditSelectedOverFlowMenu={(event, option) => {
        alert(`Selected: ${option.value}`);
      }}
      isSorting={false}
      sortAscFirst={!isInitialLoad}
      sortByDefault={false}
      sortingOnClickEvent={handleSorting}
      dynamicTableLoader={isLoading}
      isIconRightAligned={true}
      onClickOverflowItem={() => {}}
      dynamictableIconName={isPrivateDocError ? "warning--alt" : "information"}
      emptyRowResponseCode={isPrivateDocError ? ResponseCode.Error : ResponseCode.Info}
      emptybtnTitle="Add Document"
      filterDDLlabel="Added by"
      filterDDLOptions={filterDDLOptions}
      filterDDLselectedItem={{ text: 'All', value: 'All' }}
      filterDDLinputWidth={200}
      filterDDLisScrollbarVisible={true}
      isShowEmptyAddBtn={false}
      titleConfirmation=""
      isOpenConfirmationDialog={false}
      templatePropsConfirmation={{
        contentText: "",
        okText: "",
        cancelText: "",
        onCancel: () => {},
        onConfirm: () => {},
        template: DialogTemplate.Confirmation,
        isNotificationanner: false,
        notificationTitle: "",
        notificationStatus: undefined
      }}
      isShowFirstElement={false}
      isShowOverflowMenuCol={false}
      globalNotificationMsgBannerObject={undefined}
      isBreadCrumbEnable={false}
      selectedCheckboxIds={setSelectedIds}
      onChangeListCheckBox={handleRowCheckboxChange}
      isAllSelectedAcrossPagination={true}
      prevselectedCheckboxIds={handlePrevSelectedDocs}
      setExcludedCheckBoxIds={setExcludedCheckBoxIds}
      onChangeAllCheckBox={handleOnChangeAllCheckBox}
      selectHeaderCheckbox={CheckBoxSelectedState.DeSelected}
    />
    </div>
  );
};