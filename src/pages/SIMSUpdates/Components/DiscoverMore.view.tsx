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
const DiscoverMoreView: ({isOpen} : any) => JSX.Element = ({isOpen}) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();
  const isMobileView : boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );
  /* eslint-enable */
  const onButtonClick: () => void = () => {
    const anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = "https://help.parentpaygroup.com/csm/en/sims-next-gen-videos?id=kb_article_view&sysparm_article=KB0012323";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  };

  interface RelType {
    rel: string;
  }

  const  rel:RelType={rel:"noopener noreferrer"};
  const onCardClick: () => void = () => {};
 
 
  return (
  
    <>
      <div className= {isOpen? 'sims-link-container-open':'sims-link-container-closeview'}>
       
        <span className="sims-updates"> {isMobileView ? t("discoverMore.simsupdatetext") : t("discoverMore.simsupdatemoretext")} </span>
       
        <span className="sims-link-url ">
          <Button
            className="base-class-more"
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            {isMobileView ? t("discoverMore.mobilesimsupdatetext") : t("discoverMore.mobilesimsupdatemoretext")}
          </Button>
        </span>
      </div>
      <Grid className={isOpen? "action-card-container-open sims-ng":"action-card-container-closeview sims-ng"}>
        <GridItem className={isOpen?"what-new-sims what-new-sims-isopen":"what-new-sims"}>
          <Link
            dataTestId="link1"
            href="https://help.parentpaygroup.com/csm?id=ppg_emp_taxonomy_topic_customer&topic_id=6120c5de1b335250dffc2f04b24bcb12&in_context=true"
            target="_blank"
            {...rel}
          >
            <ActionCard
              className="primary-text"
              dataTestId="what-new-test-id"
              id="action-card"
              onClickActionCard={() => onCardClick()}
              primaryText={t("discoverMore.primarytext")}
              secondaryText= {t("discoverMore.secondarytext")} 
            />
          </Link>
        </GridItem>
        <GridItem className={isOpen?"what-new-sims action-card what-new-sims-isopen":"what-new-sims action-card"}>
          <Link
            dataTestId="link2"
            href="https://help.parentpaygroup.com/csm/en/%25short_descr?id=copy_of_kb_article_view_1&sysparm_article=KB0012256"
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