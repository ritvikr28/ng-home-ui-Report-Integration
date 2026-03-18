import React from 'react';
import { fetchSims7Redirections, fetchAutoSuggestions, AutoSuggestionsResponse } from './Sims7RedirectionsPage.api';
import { mapSims7RedirectionsItem } from './Sims7RedirectionsMapper';
import { LoadSims7RedirectionsDataArgs } from './Sims7RedirectionsPage.view';

export interface SuggestionItem {
    text: string;
}

export interface SuggestionGroup {
    name: string;
    values: SuggestionItem[];
}

export interface FetchSuggestionsArgs {
    searchTerm: string;
    setSuggestionItems: React.Dispatch<React.SetStateAction<SuggestionGroup[]>>;
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
    setApiFailed: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    originalTableData: any[];
    t: (key: string) => string;
    ignoreRef: { current: boolean };
}

function buildErrorSuggestion(searchTerm: string, t: (key: string) => string): SuggestionGroup[] {
    return [
        {
            name: 'error',
            values: [{ text: `${t("SIMS7Redirects.searchPart1")}${searchTerm}${t("SIMS7Redirects.searchPart2")}` }]
        }
    ];
}

function isAllEmpty(payload: Record<string, string[]>): boolean {
    return Object.values(payload).every(arr => arr.length === 0);
}

function handleNoResults(args: FetchSuggestionsArgs): void {
    args.setSuggestionItems(buildErrorSuggestion(args.searchTerm, args.t));
    args.setFilteredData([]);
}

function handleSuggestionSuccess(
    payload: Record<string, string[]>,
    args: FetchSuggestionsArgs
): void {
    const groups: SuggestionGroup[] = Object.entries(payload).map(([name, values]) => ({
        name,
        values: values.map((text: string) => ({ text }))
    }));
    if (!args.ignoreRef.current) args.setSuggestionItems(groups);
}

function handleSuggestionApiError(args: FetchSuggestionsArgs): void {
    args.setApiFailed(true);
    args.setSuggestionItems(buildErrorSuggestion(args.searchTerm, args.t));
    args.setFilteredData([]);
}

async function processSuggestionResponse(args: FetchSuggestionsArgs): Promise<void> {
    const apiRes: AutoSuggestionsResponse = await fetchAutoSuggestions(args.searchTerm);
    if (!apiRes.payload) {
        if (!args.ignoreRef.current) args.setSuggestionItems([]);
        return;
    }
    if (isAllEmpty(apiRes.payload)) {
        handleNoResults(args);
    } else {
        handleSuggestionSuccess(apiRes.payload, args);
    }
}

export async function fetchSuggestionsForSearch(args: FetchSuggestionsArgs): Promise<void> {
    if (args.searchTerm.length < 3) {
        args.setSuggestionItems([]);
        args.setFilteredData(args.originalTableData);
        return;
    }
    args.setSearchIsLoading(true);
    try {
        await processSuggestionResponse(args);
    } catch (error) {
        handleSuggestionApiError(args);
    } finally {
        args.setSearchIsLoading(false);
    }
}

export function setLoadingTrue(setLoading: React.Dispatch<React.SetStateAction<boolean>>): void { setLoading(true); }
export function setLoadingFalse(setLoading: React.Dispatch<React.SetStateAction<boolean>>): void { setLoading(false); }
export async function fetchRedirections(args: LoadSims7RedirectionsDataArgs): Promise<any> {
  return fetchSims7Redirections({
    SortColumnName: args.sortColumn || undefined,
    SortOrder: args.sortOrder === "asc" ? "ASC" : "DESC",
    PageNumber: args.currentPage,
    PageSize: args.pageSize,
    SearchFilter: args.searchTagList.map(item => item.value).filter((value): value is string => typeof value === "string")
  });
}
export function handleApiSuccess(payload: any, args: LoadSims7RedirectionsDataArgs): void {
  args.setApiFailed(false);
  args.setOriginalTableData(payload.items.map((item: unknown, idx: number) => mapSims7RedirectionsItem(item, idx, args.t)));
  args.setTotalItems(payload.totalItems);
}
export function handleApiFailure(args: LoadSims7RedirectionsDataArgs, error: unknown): void {
  args.setApiFailed(true);
  args.setOriginalTableData([]);
  args.setTotalItems(0);
  console.error("Sims7Redirections API failed:", error);
}
