import React from "react";
import { ISelectedItem } from "@essnextgen/ui-kit";
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";
import { mapSims7RedirectionsItem } from "./Sims7RedirectionsMapper";
import { fetchSims7Redirections } from "./Sims7RedirectionsPage.api";
import { SuggestionGroup } from "./Sims7RedirectionsPage.view.helpers";

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

function rowMatchesValue(row: Sims7RedirectionsTableRow, value: string): boolean {
    return Object.values(row).some(
        val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase())
    );
}

function getSuggestionValue(item: { text?: string; id?: string }): string {
    return item.text || item.id || '';
}

export function handleSuggestionItemClick(
    item: { text?: string; id?: string } | null,
    originalTableData: Sims7RedirectionsTableRow[],
    setFilteredData: React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>,
    setActiveSearchValue?: React.Dispatch<React.SetStateAction<string>>
): void {
    if (!item) return;
    const value = getSuggestionValue(item);
    if (setActiveSearchValue) setActiveSearchValue(value);
    setFilteredData(originalTableData.filter(row => rowMatchesValue(row, value)));
}

function isApiFailureEmpty(apiFailed: boolean, paginatedTableData: Sims7RedirectionsTableRow[]): boolean {
    return apiFailed && paginatedTableData.length === 0;
}

function isSuggestionError(paginatedTableData: Sims7RedirectionsTableRow[], suggestionItems: SuggestionGroup[]): boolean {
    return paginatedTableData.length === 0 && suggestionItems.length > 0 && suggestionItems[0].name === 'error';
}

export function getEmptyRowProps(
    apiFailed: boolean,
    paginatedTableData: Sims7RedirectionsTableRow[],
    suggestionItems: SuggestionGroup[],
    t: (key: string) => string
): Record<string, unknown> {
    if (isApiFailureEmpty(apiFailed, paginatedTableData)) {
        return {
            emptyRowType: "Error",
            emptyRowResponseCode: "Error",
            emptyRowResponseMessage: t("SIMS7Redirects.apiFailureEmptyRowResponseMessage")
        };
    }
    if (isSuggestionError(paginatedTableData, suggestionItems)) {
        return { emptyRowResponseMessage: suggestionItems[0].values[0].text };
    }
    return { emptyRowResponseMessage: t("SIMS7Redirects.emptyRowResponseMessage") };
}

export interface OnSaveSuccessArgs {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sortColumn: string;
    sortOrder: "asc" | "desc";
    currentPage: number;
    pageSize: number;
    searchTagList: ISelectedItem[];
    setOriginalTableData: React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>;
    setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}

export async function handleSaveSuccess(args: OnSaveSuccessArgs): Promise<Sims7RedirectionsTableRow[]> {
    args.setLoading(true);
    try {
        const payload = await fetchSims7Redirections({
            SortColumnName: args.sortColumn,
            SortOrder: args.sortOrder ? args.sortOrder.toUpperCase() as 'ASC' | 'DESC' : undefined,
            PageNumber: args.currentPage,
            PageSize: args.pageSize,
            SearchFilter: args.searchTagList.map(item => item.value).filter((v): v is string => typeof v === 'string')
        });
        const mappedRows: Sims7RedirectionsTableRow[] = (payload.items || []).map(mapSims7RedirectionsItem);
        args.setOriginalTableData(mappedRows);
        args.setTotalItems(payload.totalItems || (payload.items ? payload.items.length : 0));
        return mappedRows;
    } finally {
        args.setLoading(false);
    }
}
