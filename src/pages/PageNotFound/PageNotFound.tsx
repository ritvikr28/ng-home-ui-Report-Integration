import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

import "./style.scss";

export const PageNotFound: ({}) => JSX.Element = ({}: any) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  return (
    <section id="page-not-found-wrapper-1144534sdw">
      <span className="page-heading-1144534sdw">{t("pageNotFound.headingTitle")}</span>
      <span className="body-text">{t("pageNotFound.bodyText.text")}</span>
      <ul>
        <li>{t("pageNotFound.bodyText.linkText1")}</li>
        <li>{t("pageNotFound.bodyText.linkText2")}</li>
      </ul>
    </section>
  );
};

export default PageNotFound;
