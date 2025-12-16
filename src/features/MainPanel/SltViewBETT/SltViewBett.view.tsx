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
