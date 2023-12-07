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
    isLoader
  }: IEventContainerProps = props;
  console.log("render stafftimetable view");
  console.log("render loader",isLoader);
  return (
    <>
          <EventCard
          key={SchoolEventexternalId}
          id={`elementid-${index}`}
          onClick={() => togglePanel(SchoolEventexternalId)}
          primaryText={EventTime}
          secondaryText={RoomCode}
          status={EventCardColor}
          title={EventTitle}
          inputWidth={166}
          inputHeight={75}
          dataTestId={`eventid${index}`}
          /* eslint-disable */
          className={
            SelectedItem === SchoolEventexternalId
              ? index === 0
                ? `dynamiceventcard event-primary-text event-highlight-0`
                : `dynamiceventcard event-primary-text event-${EventCardColor}-1`
              : `dynamiceventcard event-primary-text`
          }
          /* eslint-enable  */
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