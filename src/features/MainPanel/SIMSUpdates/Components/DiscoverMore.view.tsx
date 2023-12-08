import {
  Button,
  ButtonSize,
  Link,
  ButtonColor,
  ActionCard
} from "@essnextgen/ui-kit";
import gtmAnalytics from "../../../../shared/utils/analytics";

const DiscoverMoreView: () => JSX.Element = () => {
  const onButtonClick: () => void = () => {
    gtmAnalytics.pushEvent({
      event: "click",
      elementType: "button",
      elementTextOrLabel: "Discover more with SIMS Next Gen",
      elementLocation: "Find out more about SIMS Next Gen section"
    });
    window.location.href = "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1"
  };

  interface RelType {
    rel: string;
  }

  const  rel:RelType={rel:"noopener noreferrer"};
  const onCardClick: (typeValue: number) => void = (typeValue: number) => {
    const label = typeValue === 1 ? "What's new": "The SIMS Next Gen roadmap";
    gtmAnalytics.pushEvent({
      event: "click",
      elementType: "tile",
      elementTextOrLabel: label,
      elementLocation: "Find out more about SIMS Next Gen section"
    });
  };
  return (
    <>
      <div className="sims-link-container">
        <span className="sims-updates">Find out more about SIMS Next Gen </span>
        <span className="sims-link-url ">
          <Button
            className="base-class"
            color={ButtonColor.Secondary}
            dataTestId="btn-save"
            onClick={onButtonClick}
            size={ButtonSize.Small}
          >
            Discover more with SIMS Next Gen
          </Button>
        </span>
      </div>
      <div className="action-card-container sims-ng">
        <span className=" what-new ">
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
              onClickActionCard={() => onCardClick(1)}
              primaryText="What's new?"
              secondaryText="Get the latest on SIMS Next Gen - new releases, sign up for early access, and find out what's new."
            />
          </Link>
        </span>
        <span className=" what-new action-card">
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
              onClickActionCard={() => onCardClick(2)}
              primaryText="The SIMS Next Gen roadmap"
              secondaryText="Discover what's on the horizon and how we are enhancing SIMS on the Next Gen roadmap"
            />
          </Link>
        </span>
      </div>
    </>
  );
};
export default DiscoverMoreView;
