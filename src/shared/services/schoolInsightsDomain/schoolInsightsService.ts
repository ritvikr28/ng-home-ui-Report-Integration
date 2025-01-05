import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import apiUrls from "../../hook/ApiConfig.json";
import { ISchoolInsightsResponse } from "../../model/SchoolInsightsDomain/responseModels";

export const FetchSchoolInsights = async (
  isCompulsoryAgeView: boolean
): Promise<ISchoolInsightsResponse | null> => {
  try {
    const responseData: AxiosResponse<ISchoolInsightsResponse> =
      await service.get(
        `v1/schoolinsights?IsCompulsoryAgeView=${isCompulsoryAgeView}`,
        buildApplicationUrl(apiUrls)
      );

    return responseData.data;
  } catch (error) {
    console.error("Error fetching school insights:", error);
    return null;
  }
};
