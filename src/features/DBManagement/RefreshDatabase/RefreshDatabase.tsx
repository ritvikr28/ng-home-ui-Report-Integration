import { HeadingSubHeading } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";

const RefreshDatabase: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
  <>
    <div className="admin-heading heading-text-up admin-heading-psas1334f">
      <HeadingSubHeading
        headingText={t("RefreshDB_T.headingTitle")}
        subHeadingText={t("RefreshDB_T.description")}
        isShowHeading
        isShowSubHeading
      />
    </div>
  </>
)};

export default RefreshDatabase;
