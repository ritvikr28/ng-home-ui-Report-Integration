import React, { useEffect, useState } from "react";
import "./style.scss";
import { EventCard, EventCardStatus, Loader, LoaderType } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { FetchStaffTimeTableEventsData } from "../../../../../shared/services/schoolDomain/schoolServices";
import { EventContainerView } from "./EventContainer.view";
import { IStaffTimeTableEventsResponse} from "../../../../../shared/model/SchoolDomain/responsemodels";
import { getBackgroundColor } from "../../../../../shared/utils/colors";
import gtmAnalytics from "../../../../../shared/utils/analytics";

const EventContainer: React.FC = () => {
  const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [schoolEventsData, setSchoolEventsData]:[IStaffTimeTableEventsResponse[],React.Dispatch<React.SetStateAction<IStaffTimeTableEventsResponse[]>>] = useState<IStaffTimeTableEventsResponse[]>([]);
  const [selectedItem, setSelectedItem]:[string,React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [status, setStatus]:[number,React.Dispatch<React.SetStateAction<number>>]= useState<number>(0);  
  const [isOpen, setIsOpen]:[Record<string, boolean>,React.Dispatch<React.SetStateAction<Record<string, boolean>>>] = useState<Record<string, boolean>>({});
  const [isLoader, setLoader]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);

  const togglePanel:(externalId: string) => void = (externalId: string) => {
    gtmAnalytics.pushEvent({
      event: "interact_click",
      elementType: "card",
      elementTextOrLabel: "[RemovedEventName]",
      elementLocation: "body"
    });
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [externalId]: !prevIsOpen[externalId]
    }));
    setSelectedItem((!isOpen || isOpen[externalId]) ? schoolEventsData[0].externalId : externalId);
  };

  useEffect(() => {
    const fetchStaffTimeTableEvents: () => Promise<void> = async () => {
      try {
        const {
          status: responseStatus,
          responseData
        }: {
          status: number | null;
          responseData: IStaffTimeTableEventsResponse[] | null;
        } =  (await FetchStaffTimeTableEventsData()) ?? {
          status: null,
          responseData: null
        };
        if (
          responseStatus !== undefined &&
          responseStatus !== null &&
          responseData !== undefined &&
          responseData !== null
        ) {
          setStatus(responseStatus);
          setIsError(false);

          setSchoolEventsData(responseData);
          setLoader(false);
          
          if (responseData.length > 0) {
            setSelectedItem(responseData[0].externalId);
            
          }
        }
      } catch (error) {
        setIsError(true);
        setLoader(true);
      } 
    };
    setLoader(true);
     
    fetchStaffTimeTableEvents();
  }, []);


  
  const formatEventTitleData = (eventTitleData: any) => {
     /* istanbul ignore next */
    const { group, levelCode, subject } = eventTitleData || {};
     /* istanbul ignore next */
    const desc = group?.shortName || "";
     /* istanbul ignore next */
    const code = levelCode || "";
     /* istanbul ignore next */
    const subjectName = subject?.name || "";
     /* istanbul ignore next */
    const details:string = (subjectName && (desc || code)) ? `| ${subjectName}` : subjectName;

    return `${desc} ${code} ${details}`;
};
  const formateventPeriodNum = (eventTimeData: IStaffTimeTableEventsResponse): string => {
     /* istanbul ignore next */
    const descriptionParts = eventTimeData.eventDescription?.split(":") || [];
  
    if (descriptionParts.length > 1 && descriptionParts[1]) {
      return descriptionParts[1];
    }
  
    if (eventTimeData.eventTypeCode === "AttendanceSession") {
      /* istanbul ignore next */
      return eventTimeData.eventDescription || "";
    }
  
    return "";
  };
  
  
  const formatEventTimeData:(eventTimeData: IStaffTimeTableEventsResponse)=> string = (eventTimeData: IStaffTimeTableEventsResponse) => {
    const day:string  = dayjs(eventTimeData.eventStart).format("ddd");
    const starttime:string  = dayjs(eventTimeData.eventStart).format("HH:mm");
    const endtime:string  = dayjs(eventTimeData.eventEnd).format("HH:mm");
    const eventPeriodNum:string  =  formateventPeriodNum(eventTimeData);
    return (eventTimeData.eventTypeCode==="AttendanceSession") ?`${eventPeriodNum} | ${starttime} - ${endtime}`: `${day} ${eventPeriodNum} | ${starttime} - ${endtime}`;
  };

  const renderNoEventsCard: () => JSX.Element = () => (
    <EventCard
      dataTestId="no-events-today"
      id="no-events-today-id"
      primaryText=""
      secondaryText=""
      status={EventCardStatus.DEFAULT}
      title="No events today"
      inputWidth={166}
      inputHeight={75}
      className="dynamiceventcard event-primary-text no-events"
    />
  );
  

  if (isError || (status !== 200 && status !== 204)) {
    return null;
  }

  if (status === 204 && (!schoolEventsData || schoolEventsData.length === 0)) {
    return renderNoEventsCard();
  }

if(isLoader)
{
  return (
  <Loader
  data-testid="data-loader"
  className="event-loader"
  loaderText="Loading..."
  loaderType={LoaderType.Circular}
/>)
}
  return (
    <div>
      {
        schoolEventsData.map((item, index) => (
          <div key={item.externalId}>
            <EventContainerView
              SchoolEventexternalId={item.externalId}
              EventTitle={formatEventTitleData(item)}
              EventTime={formatEventTimeData(item)}               
              RoomCode={item?.room?.roomCode}
              EventStartDate={item.eventStart}
              EventEndDate={item.eventEnd}
              GroupExternalId={item.group.externalId}
              EventPeriodNum={formateventPeriodNum(item)}               
              togglePanel={() => togglePanel(item.externalId)}
              isOpen={isOpen[item.externalId]}               
              GroupDescription={item?.group?.shortName ?? ""}
              StaffName={`${item.supervisors[0].forename} ${item.supervisors[0].surname}`}
              index={index}
              EventCardColor={getBackgroundColor(item)}
              EventTypeCode={item.eventTypeCode}
              ClassPeriodExternalId={item.classPeriodExternalId}
              EventInstanceExternalId={item.eventInstanceExternalId}
              SelectedItem={selectedItem}
              isLoader={isLoader}
            />
          </div>
        ))
        }
      {schoolEventsData.length < 6 && !isLoader && (
        <EventCard
          dataTestId="no-events-to-display"
          id="no-events-to-display-id"
          primaryText=""
          secondaryText=""
          status={EventCardStatus.DEFAULT}
          title="No more events"
          inputWidth={166}
          inputHeight={75}
          className="dynamiceventcard event-primary-text no-events"
        />
      )}
    </div>
  );
  };
  
  export default EventContainer;
  