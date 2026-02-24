

import type { AxiosResponse } from "axios";
import { service } from "../../shared/utils/api-service";
import { envConfig } from "../../shared/utils/constants";
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";

export const fetchSims7Redirections = async (): Promise<Sims7RedirectionsTableRow[]> => {

    type Sims7RedirectionsApiResponse = {
        payload?: {
            items?: Sims7RedirectionsTableRow[];
        };
    };
    const response: AxiosResponse<Sims7RedirectionsApiResponse> = await service.get("/v1/sims7-redirection/GetSims7Records", envConfig.BASE_URL);
    // Axios puts the actual response body in response.data
    if (response && response.data && response.data.payload && Array.isArray(response.data.payload.items)) {
        return response.data.payload.items;
    }
    return [];
};
