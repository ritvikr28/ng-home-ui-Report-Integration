import "./style.scss";
import { EventCard, EventCardStatus } from "@essnextgen/ui-kit";
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
  }: IEventContainerProps = props;

  return (
    <>
      <EventCard
        key={SchoolEventexternalId}
        id={`elementid-${index}`}
        onClick={() => togglePanel(SchoolEventexternalId)}
        primaryText={EventTime}
        secondaryText={RoomCode}
        status={EventCardStatus.HIGHLIGHT}
        title={EventTitle}
        inputWidth={166}
        dataTestId={`eventid${index}`}
        className="dynamiceventcard event-primary-text"
      />

      <div>
        {isOpen && (
          <RightSidePanel
            SchoolEventexternalId={SchoolEventexternalId}
            EventTitle={EventTitle}
            RoomCode={RoomCode}
            EventStart={EventStartDate}
            EventEnd={EventEndDate}
            GroupExternalId={GroupExternalId}
            EventPeriodNo={EventPeriodNum}
            togglePanel={() => togglePanel(SchoolEventexternalId)}
            isOpen={isOpen}
            GroupDescription={GroupDescription}
            StaffName={StaffName}
            data-testid={`right-panel-${index}`}
          />
        )}
      </div>
    </>
  );
};

export default EventContainerView;
