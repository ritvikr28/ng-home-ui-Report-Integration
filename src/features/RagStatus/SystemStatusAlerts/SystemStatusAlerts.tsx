import { HeadingSubHeading } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";

const SystemStatusAlerts: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
  <>
    <div className="admin-heading heading-text-up admin-heading-psas1334f">
      <HeadingSubHeading
        headingText={t("RagStatus_T.headingTitle")}
        subHeadingText={t("RagStatus_T.description")}
        isShowHeading
        isShowSubHeading
      />
    </div>
  </>
)};

export default SystemStatusAlerts;
