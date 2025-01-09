/* istanbul ignore file */
import React, { useEffect, useState } from "react";
import { ISchoolInsightsResponse } from "../../../../../../shared/model/SchoolInsightsDomain/responseModels";
import { FetchSchoolInsights } from "../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";

const PupilDemographics = () => {
  const [data, setData]: [
    ISchoolInsightsResponse | null,
    React.Dispatch<React.SetStateAction<ISchoolInsightsResponse | null>>
  ] = useState<ISchoolInsightsResponse | null>(null);

  const [loading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);
  const [error, setError]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(null);

  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
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