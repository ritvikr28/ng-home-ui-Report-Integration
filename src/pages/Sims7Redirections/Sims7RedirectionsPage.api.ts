
import { service } from "../../shared/utils/api-service";
import { envConfig } from "../../shared/utils/constants";
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";

export const fetchSims7Redirections = async (): Promise<Sims7RedirectionsTableRow[]> => {
    const response = await service.get("/v1/sims7-redirection/GetSims7Records", envConfig.BASE_URL);
    // Assuming the API returns an array of Sims7RedirectionsTableRow objects in response.data
    return response.data || [];
};
