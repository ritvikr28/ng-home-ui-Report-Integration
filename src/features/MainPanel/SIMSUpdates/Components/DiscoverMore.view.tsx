import React from 'react';
import {
  Button,
  ButtonSize,
  Link,
  ButtonColor,
  ActionCard,
  GridItem,
  Grid
} from "@essnextgen/ui-kit";

/* eslint-disable */
interface DiscoverMoreViewProps {
  isOpen?: boolean;
}
const DiscoverMoreView: React.FC<DiscoverMoreViewProps> = ({ isOpen = false }) => {
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
      <Grid className="sims-link-container">
        <GridItem className="sims-updates"lg={8} md={6}>Find out more about SIMS Next Gen </GridItem>
        <GridItem  className={`sims-link-url  ${
            isOpen ? "discover-btn-res btn-res-main" : "btn-res-close"
          } `}
          lg={4}
          md={2}>
          <Button
            className="base-class"
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            Discover more with SIMS Next Gen
          </Button>
        </GridItem>
      </Grid>
      <Grid className="action-card-container sims-ng">
        <GridItem lg ={6} className=" what-new ">
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
        <GridItem lg ={6} className=" what-new action-card">
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
              secondaryText="Discover what's on the horizon and how we are enhancing SIMS on the Next Gen roadmap"
            />
          </Link>
        </GridItem>
      </Grid>
    </>
  );
};
/* eslint-enable */
export default DiscoverMoreView;
