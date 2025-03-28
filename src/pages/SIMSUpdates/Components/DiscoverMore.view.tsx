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
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

/* eslint-disable */
const DiscoverMoreView: ({ isOpen }: any) => JSX.Element = ({ isOpen }) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );
  /* eslint-enable */
  const onButtonClick: () => void = () => {
    const url =
      "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1";
    window.open(url, "_blank");
  };

  interface RelType {
    rel: string;
  }

  const rel: RelType = { rel: "noopener noreferrer" };
  const onCardClick: () => void = () => {};

  return (
    <>
      <div
        className={
          isOpen ? "sims-link-container-open" : "sims-link-container-closeview"
        }
      >
        <span className="sims-updates">
          {" "}
          {isMobileView
            ? t("discoverMore.simsupdatetext")
            : t("discoverMore.simsupdatemoretext")}{" "}
        </span>

        <span className="sims-link-url ">
          <Button
            className="base-class-more"
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            {isMobileView
              ? t("discoverMore.mobilesimsupdatetext")
              : t("discoverMore.mobilesimsupdatemoretext")}
          </Button>
        </span>
      </div>
      <Grid
        className={
          isOpen
            ? "action-card-container-open sims-ng"
            : "action-card-container-closeview sims-ng"
        }
      >
        <GridItem
          className={
            isOpen ? "what-new-sims what-new-sims-isopen" : "what-new-sims"
          }
        >
          <Link
            dataTestId="link1"
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className="primary-text"
              dataTestId="what-new-test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText={t("discoverMore.primarytext")}
              secondaryText={t("discoverMore.secondarytext")}
            />
          </Link>
        </GridItem>
        <GridItem
          className={
            isOpen
              ? "what-new-sims action-card what-new-sims-isopen"
              : "what-new-sims action-card"
          }
        >
          <Link
            dataTestId="link2"
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053850&sys_kb_id=cdd557f91b3db550408d8557d34bcb61&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className="primary-text"
              dataTestId="test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText={t("discoverMore.primarytextsimsnextgen")}
              secondaryText={t("discoverMore.secondarytextsimsnextgen")}
            />
          </Link>
        </GridItem>
      </Grid>
    </>
  );
};
export default DiscoverMoreView;
