import { AxiosResponse } from "axios";
import { ISearchResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import { envConfig, service } from "../../../../shared/utils";
import { logger } from "../../../../shared/components/AppInsights";

/* eslint-disable */
const fetchSearchResults: (
  query: string,
  onRoleState: string
) => Promise<ISearchResultsApiResponse[]> = (
  query: string,
  onRoleState: string
) =>
  new Promise<ISearchResultsApiResponse[]>(
    async (
      resolve: (
        value:
          | ISearchResultsApiResponse[]
          | PromiseLike<ISearchResultsApiResponse[]>
      ) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await service.get(
          `/search?q=${query}&onRollState=${onRoleState}`,
          envConfig.LEARNER_API_URL
        );
        resolve(response.data.payload);
      } catch (error: any) {
        logger.error({
          error: "Failed to search pupil",
          code: error.name
        });
        reject(error);
      }
    }
  );
/* eslint-enable */
export default fetchSearchResults;
