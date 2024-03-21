import "./style.scss";
import { EventCard } from "@essnextgen/ui-kit";
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

  return (
    <>
    <div className="staff-homepage-564f">

    
      <EventCard
        key={SchoolEventexternalId}
        id={`elementid-${index}`}
        onClick={() => togglePanel(SchoolEventexternalId)}
        primaryText={EventTime}
        secondaryText={RoomCode}
        // isTextTruncate
        status={EventCardColor}
        title={EventTitle.length>18?`${EventTitle.substring(0,18)}...` : EventTitle}
        // inputWidth={isOpen ? 166 : 145}
        inputHeight={67}
        dataTestId={`eventid${index}`}
         /* eslint-disable  */
        /* istanbul ignore next */
        className={
          SelectedItem === SchoolEventexternalId
            ? index === 0
              ? isOpen
                ? `dynamiceventcard isopen event-primary-text event-highlight-0`
                : `dynamiceventcard isclose event-primary-text event-highlight-0`
              : isOpen
              ? `dynamiceventcard isopen event-primary-text event-${EventCardColor}-1`
              : `dynamiceventcard isclose event-primary-text event-${EventCardColor}-1`
            : isOpen
            ? `dynamiceventcard isopen event-primary-text`
            : `dynamiceventcard isclose event-primary-text`
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
      </div>
    </>
  );
};

export default EventContainerView;
