import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { ErrorPage, ErrorActionList, ErrorActionListItem ,ErrorReasonList,ErrorReasonListItem} from "@essnextgen/ui-kit";

const PageNotFound: () => JSX.Element = () => {
     const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

 return( <div className="error-page-home">
   <ErrorPage
          dataTestId="page-not-found-1144534sdw"
          id="element-id"
          title={t("pageNotFound.headingTitle")}
        >
           <ErrorReasonList description={t(`pageNotFound.bodyText.text`)}>
           <ErrorReasonListItem key={1}>
          {t("pageNotFound.bodyText.linkText1")}
        </ErrorReasonListItem>
        <ErrorReasonListItem key={1}>
          {t("pageNotFound.bodyText.linkText2")}
        </ErrorReasonListItem>
        </ErrorReasonList>
          <ErrorActionList description={t("pageNotFound.moduleBlock.heading")}
          >
            <ErrorActionListItem
              iconName="information"
              title={t("pageNotFound.moduleBlock.item1.title")}
            >
                 {t("pageNotFound.moduleBlock.item1.content")}
                 
            </ErrorActionListItem>
            <ErrorActionListItem
              iconName="information"  
              title={t("pageNotFound.moduleBlock.item2.title")}
            >
                  {t("pageNotFound.moduleBlock.item2.content")}
                <a target="_blank" href="/">{t("pageNotFound.moduleBlock.item2.content1")}</a>
                {t("pageNotFound.moduleBlock.item2.content2")}
            </ErrorActionListItem>
          </ErrorActionList>
        </ErrorPage>
  </div>);
}

export default PageNotFound;
