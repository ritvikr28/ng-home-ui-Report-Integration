import React, { useState } from "react";
import { ShowValAs, Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { EllipsisWithTooltip } from "../EllipsisWithTooltip";
import { fileDownloadById } from "../../logic/DocumentManagementServer.logic";
import { getBannerMessageWithLink } from "../../Views/DMSLayout";

export const PrivateDocErrorNotification: React.FC<{ t: any }> = ({ t }) => (
  <Notification
    status={NotificationStatus.WARNING}
    title={t("DocumentManagementServer.informationUnavailable")}
    message={getBannerMessageWithLink(t("DocumentManagementServer.privateDocTechnicalIssue"), t("DocumentManagementServer.contactSupport"))}
    autoclose={false}
    hideCloseButton={true}
  />
);

export const DownloadErrorNotification: React.FC<{ t: any }> = ({ t }) => (
  <Notification
    status={NotificationStatus.WARNING}
    title={t("DocumentManagementServer.privateDocDownloadFailureTitle")}
    message={getBannerMessageWithLink(t("DocumentManagementServer.privateDocDownloadFailureMessage"), t("DocumentManagementServer.contactSupport"))}
    autoclose={false}
    hideCloseButton={true}
  />
);

 type DocumentCell = { name: string; fileId: string; blobName: string; application: string; sectionName: string };
export const createTableHeadersData = (onDocumentClick: (doc: DocumentCell) => void): any[] => [
  {
    text: "Id",
    isShow: false,
    showValAs: ShowValAs.Text,
    columnWidth: "10px"
  },
  {
    text: "Document",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "100px",
    isColumnSorting: true,
    anyComponent: (value: DocumentCell[]) => {
      const doc: DocumentCell = value[0];
      return (
        <button
          type="button"
          onClick={() => onDocumentClick(doc)}
          className="document-link"
          style={{ textDecoration: "underline", color: "#1976d2", cursor: "pointer", background: "none", border: "none", padding: 0 }}
        >
          <EllipsisWithTooltip
            text={doc?.name}
            className="relatedto-main"
            isTooltipNeeded={true}
            totalItems={[doc?.name]}
            colName="document"
          />
        </button>
      );
    }
  },
  {
    text: "Related to",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "120px",
    isColumnSorting: false,
    anyComponent: (value: any) => {
      const related: any = Array.isArray(value) ? value[0] : value;
      return (
        <span className="relatedto-flex-row">
          <EllipsisWithTooltip
            text={related}
            className="relatedto-main"
            isTooltipNeeded={true}
            totalItems={Array.isArray(value) ? value : [value]}
            colName="relatedTo"
          />
        </span>
      );
    }
  },
  {
    text: "Added by",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "120px",
    isColumnSorting: true,
    anyComponent: (value: string) => (
      <EllipsisWithTooltip
        text={value}
        className="relatedto-main"
        isTooltipNeeded={true}
        totalItems={[value]}
        colName="addedBy"
      />
    )
  },
  {
    text: "Date added",
    isShow: true,
    showValAs: ShowValAs.Text,
    columnWidth: "120px",
    isColumnSorting: true,
    isColumnSortByDefault: true
  }
];

export const createHandleDocumentClick = (
  onDownloadError: (hasError: boolean) => void
) => async (doc: DocumentCell): Promise<void> => {
  try {
    onDownloadError(false);
    await fileDownloadById(doc.fileId, doc.name);
  } catch {
    onDownloadError(true);
  }
};

export const getPaginatedData = <T extends unknown>(data: T[], currentPage: number, itemsPerPage: number): T[] =>
  data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

export const createHandlePageChange = (
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => (_: React.ChangeEvent<unknown>, page: number): void => {
  setCurrentPage(page);
};

export const createHandleSorting = (
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>,
  onSortChange: (columnName: string) => void,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => (_e: React.ChangeEvent<unknown>, columnName: string): void => {
  setIsInitialLoad(true);
  onSortChange(columnName);
  setCurrentPage(1);
};


export const filterDDLOptions: any[] = [
  { id: "1", text: "All", value: "All" },
  { id: "2", text: "James", value: "Category A" },
  { id: "3", text: "Suresh", value: "Category B" }
  // Add more as needed
];

export interface SidePanelTableSelection {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  prevSelectedDocs: string[];
  handlePrevSelectedDocs: (ids: string[]) => void;
  excludedCheckBoxIds: string[];
  setExcludedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleRowCheckboxChange: (index: number, id: string) => void;
  handleOnChangeAllCheckBox: (event: React.ChangeEvent<unknown>) => void;
}

export function useSidePanelTableSelection(tableBodyDatas: any[]): SidePanelTableSelection {
  const [selectedIds, setSelectedIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [prevSelectedDocs, setPrevSelectedDocs]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [excludedCheckBoxIds, setExcludedCheckBoxIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);

  const handleRowCheckboxChange: (index: number, id: string) => void = (index: number, id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  console.log(selectedIds, "selectedIds in logic");

  const handleOnChangeAllCheckBox: (event: React.ChangeEvent<unknown>) => void = (event: React.ChangeEvent<unknown>) => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const isChecked: boolean = target.checked;
    if (isChecked) {
      setSelectedIds(tableBodyDatas.map(row => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handlePrevSelectedDocs: (ids: string[]) => void = (ids: string[]) => {
    const uniqueNewIds: string[] = ids.filter(id => !prevSelectedDocs.includes(id));
    setPrevSelectedDocs([...prevSelectedDocs, ...uniqueNewIds]);
  };

  return {
    selectedIds,
    setSelectedIds,
    prevSelectedDocs,
    handlePrevSelectedDocs,
    excludedCheckBoxIds,
    setExcludedCheckBoxIds,
    handleRowCheckboxChange,
    handleOnChangeAllCheckBox
  };
}