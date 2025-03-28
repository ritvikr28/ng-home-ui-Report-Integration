import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import { ISchoolInsightsResponse } from "../../model/SchoolInsightsDomain/responseModels";
import { envConfig } from "../../utils";

export const FetchSchoolInsights: (
  isCompulsoryAgeView: boolean
) => Promise<ISchoolInsightsResponse | null> = async (isCompulsoryAgeView) => {
  try {
    const responseData: AxiosResponse<ISchoolInsightsResponse> =
      await service.get(
        `${envConfig.BASE_URL}/v1/schoolinsights?IsCompulsoryAgeView=${isCompulsoryAgeView}`
        
      );

    return responseData.data;
  } catch (error) {
    console.error("Error fetching school insights:", error);
    return null;
  }
};
