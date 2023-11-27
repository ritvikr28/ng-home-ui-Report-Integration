import React, { useEffect, useState } from "react";
import "./style.scss";
import { EventCard, EventCardStatus } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { FetchStaffTimeTableEventsData } from "../../../../../shared/services/schoolDomain/schoolServices";
import { EventContainerView } from "./EventContainer.view";
import { IStaffTimeTableEventsResponse } from "../../../../../shared/model/SchoolDomain/responsemodels";
import { getBackgroundColor } from "../../../../../shared/utils/colors";

const EventContainer: React.FC = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [schoolEventsData, setSchoolEventsData] = useState<
    IStaffTimeTableEventsResponse[]
  >([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [status, setStatus] = useState(0);  
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});

  const togglePanel = (externalId: string) => {
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [externalId]: !prevIsOpen[externalId],
    }));
    if(!isOpen || isOpen[externalId])
    {
      setSelectedItem(schoolEventsData[0].externalId);
    }
    else
    {
      setSelectedItem(externalId);      
    }
  };

  useEffect(() => {
    const fetchStaffTimeTableEvents = async () => {
      try {
        const { status: responseStatus, responseData } =
          await FetchStaffTimeTableEventsData();
        setStatus(responseStatus);
        setSchoolEventsData(responseData);
        setIsError(false);
        if (responseData.length > 0) {          
          setSelectedItem(responseData[0].externalId);
        }
      } catch (error) {
        console.error("Error while fetching data:", error);
        setIsError(true);
      }
    };

    fetchStaffTimeTableEvents();
  }, []);

  const formatEventTitleData = (eventTitleData: any) => {
    const desc = eventTitleData?.group?.shortName ?? "";
    const code = eventTitleData?.levelCode ?? "";
    const subjectName = eventTitleData?.subject?.name ?? "";
    const details =
      (desc !== "" || code !== "") && subjectName !== ""
        ? `| ${subjectName}`
        : subjectName;
    return `${desc} ${code} ${details}`;
  };


  const formateventPeriodNum = (eventTimeData: any) => {
 
        if (eventTimeData.eventDescription && eventTimeData.eventDescription.split(":")[1] !== undefined) {
          return eventTimeData.eventDescription.split(":")[1];
        }

        if (eventTimeData.eventTypeCode === "AttendanceSession") {
          return eventTimeData.eventDescription;
        }
    return "";
  };
  
  

  const formatEventTimeData = (eventTimeData: any) => {
    const day = dayjs(eventTimeData.eventStart).format("ddd");
    const starttime = dayjs(eventTimeData.eventStart).format("HH:mm");
    const endtime = dayjs(eventTimeData.eventEnd).format("HH:mm");
    const eventPeriodNum =  formateventPeriodNum(eventTimeData);
    return (eventTimeData.eventTypeCode==="AttendanceSession") ?`${eventPeriodNum} | ${starttime} ${endtime}`: `${day} ${eventPeriodNum} | ${starttime} ${endtime}`;
  };

  if (isError || (status !== 200 && status !== 204)) {
    return null;
  }

  if (status === 204 && (!schoolEventsData || schoolEventsData.length === 0)) {
    return (
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
  }

  return (
    <div>
      {schoolEventsData.map((item, index) => (
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
          />
        </div>
      ))}
      {schoolEventsData.length < 6 && (
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
