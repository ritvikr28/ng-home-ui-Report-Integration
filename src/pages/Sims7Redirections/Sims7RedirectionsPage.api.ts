import type { AxiosResponse } from "axios";
import { service } from "../../shared/utils/api-service";
import { envConfig } from "../../shared/utils/constants";
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";


type Sims7RedirectionsApiResponse = {
    payload?: {
        items?: Sims7RedirectionsTableRow[];
        totalItems?: number;
    };
};

export interface Sims7RedirectionsQuery {
    SearchText?: string;
    SearchFilter?: string[];
    SortColumnName?: string;
    SortOrder?: 'ASC' | 'DESC';
    PageNumber?: number;
    PageSize?: number;
}

export const fetchSims7Redirections = async (query?: Sims7RedirectionsQuery): Promise<any> => {
    // Build query string
    const params = new URLSearchParams();
    if (query) {
        if (query.SearchText) params.append('SearchText', query.SearchText);
        if (query.SearchFilter && query.SearchFilter.length) {
            query.SearchFilter.forEach((f: string) => params.append('SearchFilter', f));
        }
        if (query.SortColumnName) params.append('SortColumnName', query.SortColumnName);
        if (query.SortOrder) params.append('SortOrder', query.SortOrder);
        if (query.PageNumber !== undefined) params.append('PageNumber', String(query.PageNumber));
        if (query.PageSize !== undefined) params.append('PageSize', String(query.PageSize));
    }
    const url = `/v1/sims7-redirection/GetSims7Records?${params.toString()}`;
    const response: AxiosResponse<Sims7RedirectionsApiResponse> = await service.get(url, envConfig.BASE_URL);
    if (response && response.data && response.data.payload) {
        const { items, totalItems }: { items?: Sims7RedirectionsTableRow[]; totalItems?: number } = response.data.payload;
        if (!Array.isArray(items)) {
            return { items: [], totalItems: 0 };
        }
        // Always return both items and totalItems, defaulting totalItems to 0 if missing
        return {
            items,
            totalItems: typeof totalItems === 'number' ? totalItems : 0
        };
    }
    return { items: [], totalItems: 0 };
};

export interface Sims7RedirectionViewData {
  moduleId: number;
  organisationId: number;
  dfeNumber: string;
  ngModule: string;
  ngComponent: string;
  sims7Module: string;
  switchToSchool: boolean;
  switchToPPG: boolean;
  effectiveDate: string;
  redirectStatus: string;
  isWritebackProcessed: boolean;
  updatedOn: string;
  updatedBy: string;
}

export async function fetchSims7RedirectionById({
    moduleId
}: {
    moduleId: number | string;
}): Promise<Sims7RedirectionViewData> {
    const moduleIdStr = String(moduleId);
    return (
        await service.get(
            `/v1/sims7-redirection/detailsbyid?Id=${moduleIdStr}`,
            envConfig.BASE_URL
        )
    ).data;
}

// PUT API to update Sims7Redirection
export interface UpdateSims7RedirectionRequest {
    id: string;
    dfeNumber: string;
    ngModule: string;
    ngComponent: string;
    switchToSchool: boolean;
    effectiveDate: string;
    currentStatus: string;
    plannedStatus: string;
    reasonForChange: string;
}

export const updateSims7Redirection: (data: UpdateSims7RedirectionRequest) => Promise<any> = async (
    data: UpdateSims7RedirectionRequest
): Promise<any> => {
    const response: AxiosResponse<any> = await service.put(
        "/v1/sims7-redirection/update",
        data,
        envConfig.BASE_URL
    );
    return response.data;
};

export interface AutoSuggestionsResponse {
    payload: Record<string, string[]>;
}

export const fetchAutoSuggestions = async (searchTerm: string): Promise<AutoSuggestionsResponse> => {
    const url = `/v1/sims7-redirection/auto-suggestions?SearchTerm=${encodeURIComponent(searchTerm)}`;
    const response: AxiosResponse<AutoSuggestionsResponse> = await service.get(url, envConfig.BASE_URL);
    if (response && response.data) {
        return response.data;
    }
    return { payload: {} };
};
