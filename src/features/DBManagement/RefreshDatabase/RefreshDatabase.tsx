import { HeadingSubHeading } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";

const RefreshDatabase: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

  return (
    <>
      <div className="essui-global-typography-default-h3">
        {t("RefreshDB_T.headingTitle")}
      </div>
      
      <div className="refresh-db-scroll-wrapper">
        <div className="admin-heading heading-text-up admin-heading-psas1334f">
          <HeadingSubHeading
            subHeadingText={t("RefreshDB_T.description")}
            isShowHeading
            isShowSubHeading
          />
        </div>
      </div>
    </>
  );
};

export default RefreshDatabase;
