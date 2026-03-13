import React from "react";
import { ISelectedItem } from "@essnextgen/ui-kit";
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";

export function handleSorting({ columnMapping, sortColumn, sortOrder, setSortColumn, setSortOrder }: {
    columnMapping: Record<string, string>;
    sortColumn: string;
    sortOrder: "asc" | "desc";
    setSortColumn: (col: string) => void;
    setSortOrder: (order: "asc" | "desc") => void;
}, _event: React.SyntheticEvent, columnName: string): void {
    const backendColumn = columnMapping[columnName] || columnName;
    let newOrder: "asc" | "desc";
    if (sortColumn === backendColumn) {
        newOrder = sortOrder === "desc" ? "asc" : "desc";
    } else {
        newOrder = "desc";
    }
    setSortOrder(newOrder);
    if (sortColumn !== backendColumn) setSortColumn(backendColumn);
}

export function handleViewClick({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }: {
    setSelectedRow: (row: Sims7RedirectionsTableRow) => void;
    setSidePanelMode: (mode: "view" | "edit") => void;
    setIsSidePanelOpen: (open: boolean) => void;
}, rowData: Sims7RedirectionsTableRow): void {
    setSelectedRow(rowData);
    setSidePanelMode("view");
    setIsSidePanelOpen(true);
}

export function handleEditClick({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }: {
    setSelectedRow: (row: Sims7RedirectionsTableRow) => void;
    setSidePanelMode: (mode: "view" | "edit") => void;
    setIsSidePanelOpen: (open: boolean) => void;
}, rowData: Sims7RedirectionsTableRow): void {
    setSelectedRow(rowData);
    setSidePanelMode("edit");
    setIsSidePanelOpen(true);
}

export function handleOpenDialog({ setSelectedItems, searchTagList, setIsDialogOpen }: {
    setSelectedItems: (items: ISelectedItem[]) => void;
    searchTagList: ISelectedItem[];
    setIsDialogOpen: (open: boolean) => void;
}): void {
    setSelectedItems(searchTagList);
    setIsDialogOpen(true);
}

export function handleCloseDialog({ setIsDialogOpen }: { setIsDialogOpen: (open: boolean) => void; }): void {
    setIsDialogOpen(false);
}

export function handleClearAll({ setIsDialogOpen, setSelectedItems }: {
    setIsDialogOpen: (open: boolean) => void;
    setSelectedItems: (items: ISelectedItem[]) => void;
}): void {
    setIsDialogOpen(true);
    setSelectedItems([]);
}

export function handleApplyDialog(
    { setSearchTagList, selectedItems, setIsDialogOpen }: {
        setSearchTagList: (items: ISelectedItem[]) => void;
        selectedItems: ISelectedItem[];
        setIsDialogOpen: (open: boolean) => void;
    }
): void {
    setSearchTagList(selectedItems.map(item => ({ ...item, text: item.text ?? "" })));
    setIsDialogOpen(false);
}

// eslint-disable-next-line no-shadow
export function handlePaginationChange(
    // eslint-disable-next-line
    { setCurrentPage }: { setCurrentPage: (pageNum: number) => void },
    _event: React.ChangeEvent<unknown>,
    pageNum: number
): void {
    setCurrentPage(pageNum);
}
