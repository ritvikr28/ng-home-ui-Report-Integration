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
      "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1";
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
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={"first-actioncard"}
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
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053850&sys_kb_id=cdd557f91b3db550408d8557d34bcb61&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={"second-actioncard"}
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
