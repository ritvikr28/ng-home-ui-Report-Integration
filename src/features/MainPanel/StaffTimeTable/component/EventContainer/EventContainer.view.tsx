import "./style.scss";
import { EventCard, useMediaQuery } from "@essnextgen/ui-kit";
import { IEventContainerProps } from "./EventContainerProps";
import { RightSidePanel } from "../../../RightSidePanel/RightSidePanel.logic";

export const EventContainerView: (
  props: IEventContainerProps
) => JSX.Element = (props: IEventContainerProps) => {
  const {
    SchoolEventexternalId,
    EventTitle,
    EventTime,
    RoomCode,
    EventStartDate,
    EventEndDate,
    GroupExternalId,
    EventPeriodNum,
    togglePanel,
    isOpen,
    GroupDescription,
    StaffName,
    index,
    EventCardColor,
    EventTypeCode,
    ClassPeriodExternalId,
    EventInstanceExternalId,
    SelectedItem,
    isOpenPanel
    
  }: IEventContainerProps = props;
  const isMiniMobileView = useMediaQuery('(min-width:350px) and (max-width: 767.9px)');

  const isMobileView = useMediaQuery('(min-width:768px) and (max-width: 1023.9px)');

  const isTabletView = useMediaQuery('(min-width:1024px) and (max-width: 1439.9px)');
  return (
    <>
          <EventCard
        key={SchoolEventexternalId}

        id={`elementid-${index}`} 
        
          onClick={() => togglePanel(SchoolEventexternalId)}
          primaryText={EventTime}
          secondaryText={RoomCode}
          isTextTruncate
          status={EventCardColor}
          title={EventTitle}
            /* eslint-disable */
          inputWidth={!isMobileView?(isTabletView? (isOpen? 166 : 145) :(isMiniMobileView? 358:166)):166}
          inputHeight={67}
          dataTestId={`eventid${index}`}
          className={
            SelectedItem === SchoolEventexternalId
              ? index === 0 
                ? isOpen? `dynamiceventcard isopen event-primary-text event-highlight-0`:
                `dynamiceventcard isclose event-primary-text event-highlight-0`
                : isOpen? `dynamiceventcard isopen event-primary-text event-${EventCardColor}-1`:
                `dynamiceventcard isclose event-primary-text event-${EventCardColor}-1`
              : isOpen? `dynamiceventcard isopen event-primary-text`:
              `dynamiceventcard isclose event-primary-text`
          }
          /* eslint-enable  */
        />
    
      <div>
        {isOpenPanel && (
          <RightSidePanel
            SchoolEventexternalId={SchoolEventexternalId}
            EventTitle={EventTitle}
            RoomCode={RoomCode}
            EventStart={EventStartDate}
            EventEnd={EventEndDate}
            GroupExternalId={GroupExternalId}
            EventPeriodNo={EventPeriodNum}
            togglePanel={() => togglePanel(SchoolEventexternalId)}
            isOpen={isOpenPanel}
            GroupDescription={GroupDescription}
            StaffName={StaffName}
            data-testid={`right-panel-${index}`}
            EventTypeCode={EventTypeCode}
            ClassPeriodExternalId={ClassPeriodExternalId}
            EventInstanceExternalId={EventInstanceExternalId}
          />
        )}
      </div>
    </>
  );
};

export default EventContainerView;