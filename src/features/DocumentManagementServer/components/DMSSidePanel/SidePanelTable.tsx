import React, { useState } from "react";
import { ControlledList, DialogTemplate, CheckBoxSelectedState } from "@essnextgen/ui-kit";
import { tableBodyData, useSidePanelTableSelection, tableHeadersData, filterDDLOptions } from "./sidePanelTable.logic";

export const SidePanelTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tableBodyData.length / itemsPerPage);

  const paginatedData = tableBodyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const {
    setSelectedIds,
    handleRowCheckboxChange,
    handleOnChangeAllCheckBox,
    handlePrevSelectedDocs,
    setExcludedCheckBoxIds
  } = useSidePanelTableSelection(tableBodyData);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <ControlledList
      id="sidepanel-table"
      dataTestId="sidepanel-table"
      tableHeadersData={tableHeadersData}
      tableBodyData={paginatedData}
      totalRecords={tableBodyData.length}
      isPagination={true}
      paginationCount={totalPages}
      paginationPage={currentPage}
      paginationOnChange={handlePageChange}
      paginationMinCountToHideNextPreviousBtn={1}
      editSelectedBtnTitle="Actions"
      editSelectedOptions={[
        { text: "Make public", value: "Public", disabled: false, isSelected: false },
        { text: "Make confidential", value: "Confidential", disabled: false, isSelected: false },
        { text: "Delete", value: "Delete", disabled: false, isSelected: false }
      ]}
      onEditSelectedBtnClick={() => {}}
      onEditSelectedOverFlowMenu={(event, option) => {
        alert(`Selected: ${option.value}`);
      }}
      isSorting={true}
      onClickOverflowItem={() => {}}
      emptyStateMsg="No documents found"
      emptybtnTitle="Add Document"
      filterDDLlabel="Added By"
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
  );
};