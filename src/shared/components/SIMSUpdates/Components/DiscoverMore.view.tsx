import {
  Button,
  ButtonSize,
  Link,
  ButtonColor,
  ActionCard,
  Grid,
  GridItem,
  useMediaQuery
} from "@essnextgen/ui-kit";
import { SectionTitle } from "../../SectionTitle/SectionTitle";
/* eslint-disable */
import "../style.scss"
import { UseTranslationResponse, useTranslation } from "@essnextgen/ui-intl-kit";
const DiscoverMoreView: ({ isOpen }: any) => JSX.Element = ({ isOpen }) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();
  const isMobileView: boolean = useMediaQuery(
    "(max-width: 767.9px)"
  );
  /* eslint-disable */
  const onButtonClick: () => void = () => {
    const anchor : HTMLAnchorElement = document.createElement("a");
    anchor.href =
      "https://help.parentpaygroup.com/csm/en/sims-next-gen-videos?id=kb_article_view&sysparm_article=KB0012323";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  };  

  interface RelType {
    rel: string;
  }

  const rel: RelType = { rel: "noopener noreferrer" };
  const onCardClick: () => void = () => { };
  return (
    <>
      <Grid className="new-sims-uppersection new-margin-b-container">
        <GridItem sm lg className="new-sims-title c-clear-padding">
          <SectionTitle title={t("discoverMore.simsupdatetext")} />
        </GridItem>

        <GridItem sm lg className="new-sims-discoverbtn">
          <Button
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            <span className="new-discoverbtn-style">{isMobileView ? t("discoverMore.mobilesimsupdatetext") : t("discoverMore.mobilesimsupdatemoretext")}</span>
          </Button>
        </GridItem>
      </Grid>

      <Grid className={"new-footer-actioncards c-clear-padding"}>
        <GridItem md sm={6} lg className="new-actioncard c-clear-padding-left">
          <Link
            dataTestId="link1"
            href="https://help.parentpaygroup.com/csm?id=ppg_emp_taxonomy_topic_customer&topic_id=6120c5de1b335250dffc2f04b24bcb12&in_context=true"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={"first-actioncard primary-text"}
              dataTestId="what-new-test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText= {t("discoverMore.primarytext")}
              secondaryText= {t("discoverMore.secondarytext")}
            />
          </Link>
        </GridItem>
        <GridItem md sm={6} lg className="new-actioncard c-clear-padding-left">
          <Link
            dataTestId="link2"
            href="https://help.parentpaygroup.com/csm/en/%25short_descr?id=copy_of_kb_article_view_1&sysparm_article=KB0012256"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={"second-actioncard primary-text"}
              dataTestId="test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText= {t("discoverMore.primarytextsimsnextgen")}
              secondaryText={t("discoverMore.secondarytextsimsnextgen")}
            />
          </Link>
        </GridItem>
      </Grid>
    </>
  );
};
export default DiscoverMoreView;
