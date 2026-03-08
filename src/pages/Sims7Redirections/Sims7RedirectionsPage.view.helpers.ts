import React from 'react';
import { fetchSims7Redirections } from './Sims7RedirectionsPage.api';
import { mapSims7RedirectionsItem } from './Sims7RedirectionsMapper';
import { LoadSims7RedirectionsDataArgs } from './Sims7RedirectionsPage.view';

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
  args.setOriginalTableData(payload.items.map(mapSims7RedirectionsItem));
  args.setTotalItems(payload.totalItems);
}
export function handleApiFailure(args: LoadSims7RedirectionsDataArgs, error: unknown): void {
  args.setApiFailed(true);
  args.setOriginalTableData([]);
  args.setTotalItems(0);
  console.error("Sims7Redirections API failed:", error);
}
