import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import {
  ErrorPage,
  ErrorActionList,
  ErrorActionListItem
} from "@essnextgen/ui-kit";

const UnAuthorisedAccess: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  return (
    <div className="error-page-home">
      <ErrorPage
        dataTestId="page-not-found-1144534sdw"
        id="element-id"
        title={t("unAuthorisedAccess.headingTitle")}
      >
        <p>{t("unAuthorisedAccess.bodyText.text")}</p>
        <ul>
          <li>{t("unAuthorisedAccess.bodyText.linkText1")}</li>
          <li>{t("unAuthorisedAccess.bodyText.linkText2")}</li>
        </ul>
        <ErrorActionList
          description={t("unAuthorisedAccess.moduleBlock.heading")}
        >
          <ErrorActionListItem
            iconName="information"
            title={t("unAuthorisedAccess.moduleBlock.item1.title")}
          >
            {t("unAuthorisedAccess.moduleBlock.item1.content")}
          </ErrorActionListItem>
          <ErrorActionListItem
            iconName="information"
            title={t("unAuthorisedAccess.moduleBlock.item2.title")}
          >
            {t("unAuthorisedAccess.moduleBlock.item2.content")}
            <a href="https://customer.support-ess.com/csm">
              {t("unAuthorisedAccess.moduleBlock.item2.linktext")}
            </a>
          </ErrorActionListItem>
          <ErrorActionListItem
            iconName="information"
            title={t("unAuthorisedAccess.moduleBlock.item3.title")}
          >
            {t("unAuthorisedAccess.moduleBlock.item3.content")}
            <a href="https://www.home.sims.co.uk/">
              {t("unAuthorisedAccess.moduleBlock.item3.content1")}
            </a>
            {t("unAuthorisedAccess.moduleBlock.item3.content2")}
          </ErrorActionListItem>
        </ErrorActionList>
      </ErrorPage>
    </div>
  );
};

export default UnAuthorisedAccess;
