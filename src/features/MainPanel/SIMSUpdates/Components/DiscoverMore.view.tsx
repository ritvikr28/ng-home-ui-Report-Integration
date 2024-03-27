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
import styles from "../DiscoverStyle.module.scss";
/* eslint-disable */
const DiscoverMoreView: ({ isOpen }: any) => JSX.Element = ({ isOpen }) => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );
  /* eslint-disable */
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
        className={`${styles["action-card131424"]} ${
          isOpen
            ? styles["sims-link-container"]
            : styles["sims-link-container-close"]
        }`}
      >
        <span className={styles["sims-updates"]}>
          {isMobileView
            ? "SIMS Next Gen updates"
            : "Find out more about SIMS Next Gen"}{" "}
        </span>
        <span className={styles["sims-link-url"]}>
          <Button
            className={styles["base-class-more"]}
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            {isMobileView ? "More updates" : "Discover more with SIMS Next Gen"}
          </Button>
        </span>
      </div>
      <Grid
        className={
          isOpen
            ? `${styles["action-card-container"]} sims-ng`
            : `${styles["action-card-container-close"]} ${styles[" sims-ng"]}`
        }
      >
        <GridItem
          className={
            isOpen
              ? `${styles["what-new"]} ${styles["what-new-open"]}`
              : `${styles["what-new"]}`
          }
        >
          <Link
            dataTestId="link1"
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={styles["primary-text"]}
              dataTestId="what-new-test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText="What's new?"
              secondaryText="Get the latest on SIMS Next Gen - new releases, sign up for early access, and find out what's new."
            />
          </Link>
        </GridItem>
        <GridItem
          className={
            isOpen
              ? `${styles["action-card-link2"]} ${styles["onecard"]} ${styles["onecard-open"]}`
              : `${styles["action-card-link2"]} ${styles["onecard"]}`
          }
        >
          <Link
            dataTestId="link2"
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053850&sys_kb_id=cdd557f91b3db550408d8557d34bcb61&spa=1"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className={styles["primary-text"]}
              dataTestId="test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText="The SIMS Next Gen roadmap"
              secondaryText="Discover what's on the horizon and how we are enhancing SIMS on the Next Gen roadmap."
            />
          </Link>
        </GridItem>
      </Grid>
    </>
  );
};
export default DiscoverMoreView;
