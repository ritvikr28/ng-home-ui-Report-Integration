import React, { useEffect, useState } from "react";
import "./style.scss";
import { EventCard, EventCardStatus } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { FetchStaffTimeTableEventsData } from "../../../../../shared/services/schoolDomain/schoolServices";
import { EventContainerView } from "./EventContainer.view";
import { IStaffTimeTableEventsResponse} from "../../../../../shared/model/SchoolDomain/responsemodels";
import { getBackgroundColor } from "../../../../../shared/utils/colors";

const EventContainer: React.FC = () => {
  type TogglePanelFunction = (externalId: string) => void;
  type FormatEventTimeDataFunction =(eventTimeData: IStaffTimeTableEventsResponse)=> string;
  type FetchStaffTimeTableEventsFunction = () => Promise<void>;

  const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [schoolEventsData, setSchoolEventsData]:[IStaffTimeTableEventsResponse[],React.Dispatch<React.SetStateAction<IStaffTimeTableEventsResponse[]>>] = useState<IStaffTimeTableEventsResponse[]>([]);
  const [selectedItem, setSelectedItem]:[string,React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [status, setStatus]:[number,React.Dispatch<React.SetStateAction<number>>]= useState<number>(0);  
  const [isOpen, setIsOpen]:[Record<string, boolean>,React.Dispatch<React.SetStateAction<Record<string, boolean>>>] = useState<Record<string, boolean>>({});

  const togglePanel:TogglePanelFunction = (externalId: string) => {
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
    const fetchStaffTimeTableEvents:FetchStaffTimeTableEventsFunction = async () => {
      try {
        const { status: responseStatus, responseData }:{status:any,responseData:IStaffTimeTableEventsResponse[]} =
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
    const desc:string = eventTitleData?.group?.shortName ?? "";
    const code:string = eventTitleData?.levelCode ?? "";
    const subjectName:string = eventTitleData?.subject?.name ?? "";
    const details:string =
      (desc  !== "" || code !== "") && subjectName !== ""
        ? `| ${subjectName}`
        : subjectName;
    return `${desc} ${code} ${details}`;
  };


  const formateventPeriodNum = (eventTimeData: IStaffTimeTableEventsResponse):string => {
 
        if (eventTimeData.eventDescription && eventTimeData.eventDescription.split(":")[1] !== undefined) {
          return eventTimeData.eventDescription.split(":")[1];
        }

        if (eventTimeData.eventTypeCode === "AttendanceSession") {
          return eventTimeData.eventDescription;
        }
    return "";
  };
  
  

  const formatEventTimeData:FormatEventTimeDataFunction = (eventTimeData: IStaffTimeTableEventsResponse) => {
    const day:string  = dayjs(eventTimeData.eventStart).format("ddd");
    const starttime:string  = dayjs(eventTimeData.eventStart).format("HH:mm");
    const endtime:string  = dayjs(eventTimeData.eventEnd).format("HH:mm");
    const eventPeriodNum:string  =  formateventPeriodNum(eventTimeData);
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
