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
  /* eslint-disable */
const DiscoverMoreView: ({isOpen} : any) => JSX.Element = ({isOpen}) => {
  const isMobileView : boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );
    /* eslint-disable */
  const onButtonClick: () => void = () => {
   const url = "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1"
  window.open(url,"_blank");
  };

  interface RelType {
    rel: string;
  }

  const  rel:RelType={rel:"noopener noreferrer"};
  const onCardClick: () => void = () => {};
  return (
    <>
      <div className= {isOpen? 'sims-link-container':'sims-link-container-close'}>
        <span className="sims-updates">{isMobileView ? 'SIMS Next Gen updates' : 'Find out more about SIMS Next Gen'} </span>
        <span className="sims-link-url ">
          <Button
            className="base-class-more"
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
           {isMobileView ? 'More updates' : 'Discover more with SIMS Next Gen'}
          </Button>
        </span>
      </div>
      <Grid className={isOpen? "action-card-container sims-ng":"action-card-container-close sims-ng"}>
        <GridItem className={isOpen?"what-new what-new-open ":"what-new"}>
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
              primaryText="What's new?"
              secondaryText="Get the latest on SIMS Next Gen - new releases, sign up for early access, and find out what's new."
            />
          </Link>
        </GridItem>
        <GridItem className={isOpen?"action-card onecard onecard-open":"action-card onecard"}>
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