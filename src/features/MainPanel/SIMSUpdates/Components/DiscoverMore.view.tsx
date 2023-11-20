import {
  Button,
  ButtonSize,
  Link,
  ButtonColor,
  ActionCard
} from "@essnextgen/ui-kit";

const DiscoverMoreView: () => JSX.Element = () => {
  const onButtonClick = () => {
    window.open(
      "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1",
      "_blank"
    );
  };
  const onCardClick = () => {};
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
        <span>
          <Link
            dataTestId="link1"
            href="https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
            target="_blank"
          >
            <ActionCard
              className="primary-text"
              dataTestId="test-id"
              id="action-card"
              onClickActionCard={onCardClick}
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
          >
            <ActionCard
              className="primary-text"
              dataTestId="test-id"
              id="action-card"
              onClickActionCard={onCardClick}
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
