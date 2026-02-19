import React from "react";
import { Suggestion } from "./Notifications.props";

export type UseNotificationReturn = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    paginatedNotifications: any[];
    totalNotifications: number;
    totalOriginalNotifications: any[];
    handlePageChange: (event: any, page: number) => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleSearchChange: (value: string) => void;
    handleClearSearch?: () => void;
    filters: {
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    };
    handleFilterChange: (newFilters: {
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    }) => void;
    // handleRemoveFilter: (
    //     filterType: "status" | "priority" | "startDate" | "endDate",
    //     value?: string
    // ) => void;
    handleClearAllFilters: () => void;
    // searchTagList: {
    //     text: string;
    //     categoryName: string;
    //     closeObj: {
    //         name: string;
    //         id: number;
    //         value?: string;
    //     };
    // }[];
    isSearching: boolean;
    noResults: boolean;
    // handleListCheckboxChange: (_index: number, id: string) => void;
    // handleSelectAllChange: (event: any, visibleIds: string[]) => void;
    handleSelectedCheckboxIds: (ids: string[]) => void;
    // handleBulkAction: (
    //     selectedItem: { value?: string } | null,
    //     visibleIds?: string[]
    // ) => void;
    isDeleteDialogOpen: boolean;
    closeDeleteDialog: () => void;
    // confirmDelete: () => Promise<void>;
    isDeleteLoading: boolean;
    showDeleteToast: boolean;
    isClearSelectedCheckbox: boolean;
    selectedCount: number;
    selectedNotificationIds: string[];
    isNoSelectionMode: boolean;
    sortBy: string;
    sortDirection: boolean;
    handleSort: (columnName: string) => void;
    setNoResults: React.Dispatch<React.SetStateAction<boolean>>;
    // handleSearchChangeWithAutoSuggest: (value: string) => void;
    // handleSearchKeyPressed: (inputValue: string) => void;
    isAutoSuggestVisible: boolean;
    setIsAutoSuggestVisible: React.Dispatch<React.SetStateAction<boolean>>;
    suggestionLoader: boolean;
    setSuggestionLoader: React.Dispatch<React.SetStateAction<boolean>>;
    searchSuggestions: Suggestion[];
    setSearchSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;

};