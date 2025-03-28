import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { Icon, IconColor, Grid, GridItem, ErrorPage, ErrorActionList, ErrorActionListItem } from "@essnextgen/ui-kit";

import "./style.scss";
import { INoAccessProps } from "./NoAccessProps";

const NoAccessView: (
  props: INoAccessProps
) => JSX.Element = (props: INoAccessProps) => {

  const {
    IsAuthzAdmin
  }: INoAccessProps = props;

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

    return <div
    id="no-access-page"
    >
      {IsAuthzAdmin? (
      <>
        <ErrorPage
          dataTestId="no-access-admin"
          id="element-id"
          title={t("noAccessForAuthzAdmin.headingTitle")}
        >
          <ErrorActionList description={t("noAccessForAuthzAdmin.moduleBlock.heading")}
          >
            <ErrorActionListItem
              iconName="information"
              title={t("noAccessForAuthzAdmin.moduleBlock.item1.title")}
            >
                 {t("noAccessForAuthzAdmin.moduleBlock.item1.content")}
                 {t("noAccessForAuthzAdmin.moduleBlock.item1.content1")}
                <b> {t("noAccessForAuthzAdmin.moduleBlock.item1.content2")}</b>
                 {t("noAccessForAuthzAdmin.moduleBlock.item1.content3")}
            </ErrorActionListItem>
            <ErrorActionListItem
              iconName="information"  
              title={t("noAccessForAuthzAdmin.moduleBlock.item2.title")}
            >
                  {t("noAccessForAuthzAdmin.moduleBlock.item2.content")}
                  {t("noAccessForAuthzAdmin.moduleBlock.item2.content1")}
                  {t("noAccessForAuthzAdmin.moduleBlock.item2.content2")}
            </ErrorActionListItem>
          </ErrorActionList>
        </ErrorPage>
      </>
    ):

    (
      <div id="no-access-wrapper"
      data-testid="no-access-non-admin">
      <Grid
        align="flex-start"
        dataTestId="NoAccessPageTestId"
      >
        <GridItem sm={12}>
          <span className="page-heading">{t("noAccess.headingTitle")}</span>
          <span className="body-text">{t("noAccess.bodyText.text")}</span>
          <ul>
            <li>{t("noAccess.bodyText.point1")}</li>
            <li>{t("noAccess.bodyText.point2")}</li>
          </ul>
          <div className="module-block">
            <h4>{t("noAccess.moduleBlock.heading")}</h4>
            <div className="list-item">
              <div className="item-icon">
                <Icon name="information" color={IconColor.Neutral400} />{" "}
              </div>
              <div className="item-content">
                <h5>{t("noAccess.moduleBlock.item1.title")}</h5>
                {t("noAccess.moduleBlock.item1.content")}
                <a href="mailto: nextgeninterest@sims-mis.com">
                  {t("noAccess.moduleBlock.item1.content1")}
                </a>
                {t("noAccess.moduleBlock.item1.content2")}
              </div>
            </div>
            <div className="item-separator" />
            <div className="list-item">
              <div className="item-icon">
                <Icon name="information" color={IconColor.Neutral400} />{" "}
              </div>
              <div className="item-content">
                <h5>{t("noAccess.moduleBlock.item2.title")}</h5>
                {t("noAccess.moduleBlock.item2.content")}
              </div>
            </div>
            <div className="item-separator" />
            <div className="list-item">
              <div className="item-icon">
                <Icon name="information" color={IconColor.Neutral400} />{" "}
              </div>
              <div className="item-content">
                <h5 style={{ paddingTop: "5px" }}>
                  {t("noAccess.moduleBlock.item3.title")}
                </h5>
                {t("noAccess.moduleBlock.item3.content")}
                <a href="https://customer.support-ess.com/csm" target="blank">
                  {t("noAccess.moduleBlock.item3.content1")}
                </a>
              </div>
            </div>
          </div>
        </GridItem>
      </Grid>
      </div>
    )
  }
    </div>
};

export default NoAccessView;
