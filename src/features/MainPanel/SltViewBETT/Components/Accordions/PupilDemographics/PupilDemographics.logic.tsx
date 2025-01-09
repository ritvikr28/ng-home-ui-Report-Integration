/* istanbul ignore file */
import { useEffect, useState } from "react";
import { ISchoolInsightsResponse } from "../../../../../../shared/model/SchoolInsightsDomain/responseModels";
import { FetchSchoolInsights } from "../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";

const PupilDemographics = () => {
  const [data, setData] = useState<ISchoolInsightsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result: ISchoolInsightsResponse | null = await FetchSchoolInsights(true);
      if (result) {
        setData(result);
      } else {
        setError("Failed to fetch data");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default PupilDemographics;