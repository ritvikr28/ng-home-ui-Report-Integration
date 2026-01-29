import React, { useEffect, useState } from "react";
import { Divider } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import AttendanceOverview from "./Components/Accordions/AttendanceOverview/AttendanceOverview.view";
import PupilDemographics from "./Components/Accordions/PupilDemographics/PupilDemographics.view";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";
import { ISchoolInsightsResponse } from "../../../shared/model/SchoolInsightsDomain/responseModels";
import { FetchSchoolInsights } from "../../../shared/services/schoolInsightsDomain/schoolInsightsService";

const SltViewBettView: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  const [data, setData]: [ISchoolInsightsResponse | null, React.Dispatch<React.SetStateAction<ISchoolInsightsResponse | null>>] = useState<ISchoolInsightsResponse | null>(null);
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [error, setError]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);

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

  return (
    <>
      <SectionTitle title={t("sltviewbelt.schoolheadlines")} />
      <AttendanceOverview data={data} loading={loading} error={error} />
      <div className="new-divider-spacing">
        <Divider />
      </div>
      <PupilDemographics data={data} loading={loading} error={error} />
    </>
  );
};

export default SltViewBettView;
