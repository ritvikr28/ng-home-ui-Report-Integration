import React, { useState } from "react";
import { ControlledList, DialogTemplate, CheckBoxSelectedState } from "@essnextgen/ui-kit";
import { tableBodyData, useSidePanelTableSelection, tableHeadersData, filterDDLOptions } from "./sidePanelTable.logic";

export const SidePanelTable: React.FC = () => {
  const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tableBodyData.length / itemsPerPage);

  const paginatedData: any[] = tableBodyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const {
    setSelectedIds,
    handleRowCheckboxChange,
    handleOnChangeAllCheckBox,
    handlePrevSelectedDocs,
    setExcludedCheckBoxIds
  }: any = useSidePanelTableSelection(tableBodyData);

  const handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="manage-documents-side-panel-table">
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
        { text: "Make standard", value: "Standard", disabled: false, isSelected: false },
        { text: "Make confidential", value: "Confidential", disabled: false, isSelected: false },
        { text: "Delete", value: "Delete", disabled: false, isSelected: false, isShowDivider: true }
      ]}
      onEditSelectedBtnClick={() => {}}
      onEditSelectedOverFlowMenu={(event, option) => {
        alert(`Selected: ${option.value}`);
      }}
      isSorting={true}
      isIconRightAligned={true}
      onClickOverflowItem={() => {}}
      emptyStateMsg="No documents found"
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