import { AxiosResponse } from "axios";

import { ISearchSuggestionsResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import { envConfig, service } from "../../../../shared/utils";

 /* eslint-disable */
const fetchSearchSuggestions: (query: string, n:number) => Promise<ISearchSuggestionsResultsApiResponse[]> = (query: string, n:number) => new Promise<ISearchSuggestionsResultsApiResponse[]>(async (
  resolve: (value: ISearchSuggestionsResultsApiResponse[] | PromiseLike<ISearchSuggestionsResultsApiResponse[]>) => void,
  reject: (reason?: any) => void) => {
  try {
    const response: AxiosResponse<any, any> = await service.get(`/suggestions?q=${query}&n=${n}`,envConfig.LEARNER_API_URL);
    resolve(response.data.payload);
  } catch (error) {
    reject(error);
  }
}
);
 /* eslint-enable */
export default fetchSearchSuggestions;