import "./style.scss";
import {
  EventCard,
  Tooltip,
  TooltipAlign,
  TooltipPosition
} from "@essnextgen/ui-kit";
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
    CoverStaffName,
    index,
    EventCardColor,
    EventTypeCode,
    EventDescription,
    ClassPeriodExternalId,
    EventInstanceExternalId,
    SelectedItem,
    isOpenPanel
  }: IEventContainerProps = props;

  const { truncated, full }: { truncated: string; full: string } = EventTime;

  return (
    <>
      <EventCard
        key={SchoolEventexternalId}
        id={`elementid-${index}`}
        onClick={() => togglePanel(SchoolEventexternalId)}
        primaryText={
          EventTime.truncated.length > EventTime.full.length ? (
            <Tooltip
              dataTestId={`tooltip-eventtime-${index}`}
              content={full}
              align={TooltipAlign.Center}
              position={TooltipPosition.Bottom}
            >
              <span>{truncated}</span>
            </Tooltip>
          ) : (
            <span>{full}</span>
          )
        }
        secondaryText={RoomCode}
        // isTextTruncate
        status={EventCardColor}
        title={
          EventTitle.length > 18
            ? `${EventTitle.substring(0, 18)}...`
            : EventTitle
        }
        inputHeight={67}
        dataTestId={`eventid${index}`}
        /* eslint-disable  */
        /* istanbul ignore next */
        className={
          SelectedItem === SchoolEventexternalId
            ? index === 0
              ? isOpen
                ? `event-primary-text event-highlight-0`
                : `event-primary-text event-highlight-0`
              : isOpen
              ? `event-primary-text event-${EventCardColor}-1`
              : `event-primary-text event-${EventCardColor}-1`
            : isOpen
            ? `event-primary-text`
            : `event-primary-text`
        }
        /* eslint-enable  */
      />

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
          CoverStaffName={CoverStaffName}
          data-testid={`right-panel-${index}`}
          EventTypeCode={EventTypeCode}
          EventDescription={EventDescription}
          ClassPeriodExternalId={ClassPeriodExternalId}
          EventInstanceExternalId={EventInstanceExternalId}
        />
      )}
    </>
  );
};

export default EventContainerView;
