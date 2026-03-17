import React, { useState } from "react";
import { ShowValAs } from "@essnextgen/ui-kit";
import { EllipsisWithTooltip } from "../EllipsisWithTooltip";

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
      console.log(value, "Document column value");
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


// export const fetchTableBodyData = async (pageNumber: number, pageSize: number, userId: string): Promise<any[]> => {
//   const response = await fetchPrivateDocumentDetails({ pageNumber, pageSize, userId });
//   return (response?.data ?? []).map((item: SinglePrivateDocumentDetail) => ({
//     id: item.fileId,
//     document: item.documentInfo?.fileName || item.document,
//     relatedTo: (item.relatedTo ?? []).map((entry: any) => ({
//       name: typeof entry === "string"
//         ? entry
//         : [entry?.preferredForename, entry?.preferredSurname].filter(Boolean).join(" ") || entry?.legalName || ""
//     })),
//     addedBy: item.addedBy,
//     dateAdded: item.dateAdded,
//   }));
// };

// export const tableBodyData: any[] = [
//   { id: "1", document: "PDFSample", relatedTo: [{ name: "Ramesh" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "2", document: "Long name of document with multiple words", relatedTo: [{ name: "Suresh" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "3", document: "Welsh Translation", relatedTo: [{ name: "Ganga" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "4", document: "Marathi Kadambari", relatedTo: [{ name: "Yash" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "5", document: "Hindi Ka paper", relatedTo: [{ name: "Saroj" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "6", document: "Text Document", relatedTo: [{ name: "Virat" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "7", document: "Detention Letter", relatedTo: [{ name: "James" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "8", document: "Name what you want", relatedTo: [{ name: "Thala" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "9", document: "Dhurandhar", relatedTo: [{ name: "Doval" }], addedBy: "Toony", dateAdded: "23 Jan 2025" },
//   { id: "10", document: "Tenth Document", relatedTo: [{ name: "Tenth description" }], addedBy: "Toony", dateAdded: "23 Jan 2025" }
// ];

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