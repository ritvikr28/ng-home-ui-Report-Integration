import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  EventCard,
  EventCardStatus,
  Loader,
  LoaderType
} from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { FetchStaffTimeTableEventsData } from "../../../../../shared/services/schoolDomain/schoolServices";
import { EventContainerView } from "./EventContainer.view";
import { IStaffTimeTableEventsResponse } from "../../../../../shared/model/SchoolDomain/responsemodels";
import { getBackgroundColor } from "../../../../../shared/utils/colors";
import gtmAnalytics from "../../../../../shared/utils/analytics";
import { fetchStaffDetails } from "../../../../../shared/services/staffDomain/staffServices";

const EventContainer: ({ isOpen }: any) => JSX.Element | null = ({
  isOpen
}: any) => {
  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [schoolEventsData, setSchoolEventsData]: [
    IStaffTimeTableEventsResponse[],
    React.Dispatch<React.SetStateAction<IStaffTimeTableEventsResponse[]>>
  ] = useState<IStaffTimeTableEventsResponse[]>([]);
  const [selectedItem, setSelectedItem]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("");
  const [status, setStatus]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(0);
  const [isOpenPanel, setIsOpenPanel]: [
    Record<string, boolean>,
    React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ] = useState<Record<string, boolean>>({});
  const [isLoader, setLoader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);
  const [staffNames, setStaffNames] = useState<Record<string, string>>({});
  const [coverStaffNames, setCoverStaffNames] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchStaffTimeTableEvents: () => Promise<void> = async () => {
      /* istanbul ignore next */
      try {
        const {
          status: responseStatus,
          responseData
        }: {
          status: number | null;
          responseData: IStaffTimeTableEventsResponse[] | null;
        } = (await FetchStaffTimeTableEventsData()) ?? {
          status: null,
          responseData: null
        };
        if (
          /* istanbul ignore next */
          responseStatus !== undefined &&
          responseStatus !== null &&
          responseData !== undefined &&
          responseData !== null
        ) {
          /* istanbul ignore next */
          setStatus(responseStatus);
          setIsError(false);

          setSchoolEventsData(responseData);
          setLoader(false);

          if (responseData.length > 0) {
            setSelectedItem(responseData[0].externalId);
          }

          const staffNamePromises = responseData.map((eventData) =>
            formatStaffName(eventData)
          );
          const coverStaffNamePromises = responseData.map((eventData) =>
            formatCoverStaffName(eventData)
          );

          const resolvedStaffNames = await Promise.all(staffNamePromises);
          const resolvedCoverStaffNames = await Promise.all(
            coverStaffNamePromises
          );

          const staffNamesMap: Record<string, string> = {};
          const coverStaffNamesMap: Record<string, string> = {};

          responseData.forEach((eventData, index) => {
            staffNamesMap[eventData.externalId] = resolvedStaffNames[index];
            coverStaffNamesMap[eventData.externalId] =
              resolvedCoverStaffNames[index];
          });

          setStaffNames(staffNamesMap);
          setCoverStaffNames(coverStaffNamesMap);
        }
      } catch (error) {
        setIsError(true);
        setLoader(true);
      }
    };
    setLoader(true);

    fetchStaffTimeTableEvents();
  }, []);

  if (isError || (status !== 200 && status !== 204 && status !== 0)) {
    return null;
  }

  if (status === 204 && (!schoolEventsData || schoolEventsData.length === 0)) {
    return renderNoEventsCard();
  }

  if (isLoader) {
    return (
      <div style={{ height: "110px" }}>
        <Loader
          dataTestId="staff-data-loader"
          className="reg-loader loader-margin loader-size reg-loader-margin"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
        />
      </div>
    );
  }
  return returnEventContainer({
    schoolEventsData,
    // togglePanel,
    isOpen,
    isOpenPanel,
    selectedItem,
    isLoader,
    setIsOpenPanel,
    setSelectedItem,
    staffNames,
    coverStaffNames
  });
};

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
  const details: string =
    subjectName && (desc || code) ? `| ${subjectName}` : subjectName;

  return `${desc} ${code} ${details}`;
};

const formatEventTimeData: (
  eventTimeData: IStaffTimeTableEventsResponse
) => string = (eventTimeData: IStaffTimeTableEventsResponse) => {
  const day: string = dayjs(eventTimeData.eventStart).format("ddd");
  const starttime: string = dayjs(eventTimeData.eventStart).format("HH:mm");
  const endtime: string = dayjs(eventTimeData.eventEnd).format("HH:mm");
  const eventPeriodNum: string = formateventPeriodNum(eventTimeData);
  return eventTimeData.eventTypeCode === "AttendanceSession"
    ? `${eventPeriodNum} | ${starttime} - ${endtime}`
    : `${day} ${eventPeriodNum} | ${starttime} - ${endtime}`;
};

const formatStaffName = async (
  eventTimeData: IStaffTimeTableEventsResponse
): Promise<string> => {
  const {
    originalStaffExternalID,
    coveringStaffExternalID,
    isCovered,
    isCovering,
    supervisors,
  } = eventTimeData;

  if (originalStaffExternalID && coveringStaffExternalID && !isCovered && isCovering) {
    const staffDetails = await fetchStaffDetails([originalStaffExternalID]);
    const originalStaffDetail = staffDetails?.payload?.find(
      (x) => x.externalId.toUpperCase() === originalStaffExternalID.toUpperCase()
    );
    return `${originalStaffDetail?.forename} ${originalStaffDetail?.surname}`;
  }

  return `${supervisors[0].forename} ${supervisors[0].surname}`;
};

const formatCoverStaffName = async (
  eventTimeData: IStaffTimeTableEventsResponse
): Promise<string> => {
  const {
    originalStaffExternalID,
    coveringStaffExternalID,
    isCovered,
    isCovering,
    supervisors,
  } = eventTimeData;

  if (originalStaffExternalID && coveringStaffExternalID) {
    if (isCovered && !isCovering) {
      const coveringStaffIds = coveringStaffExternalID
        .split(',')
        .map((id) => id.toUpperCase().trim());

      if (coveringStaffIds.length > 0) {
        const staffDetails = await fetchStaffDetails(coveringStaffIds);
        const coverStaffNames = staffDetails?.payload
          ?.filter((detail) => coveringStaffIds.includes(detail.externalId.toUpperCase()))
          .map((detail) => `${detail.forename} ${detail.surname}`)
          .join(', ');

        return coverStaffNames || '';
      }
    } else if (!isCovered && isCovering) {
      return `${supervisors[0].forename} ${supervisors[0].surname}`;
    }
  }

  return '';
};

const formateventPeriodNum = (
  eventTimeData: IStaffTimeTableEventsResponse
): string => {
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
const renderNoEventsCard: () => JSX.Element = () => (
  <EventCard
    dataTestId="no-events-today"
    id="no-events-today-id"
    primaryText=""
    secondaryText=""
    status={EventCardStatus.DEFAULT}
    title="No events today"
    // inputWidth={166}
    inputHeight={67}
    className="dynamiceventcard event-primary-text no-events no-events-staff"
  />
);

const returnEventContainer = ({
  schoolEventsData,
  // togglePanel,
  isOpen,
  isOpenPanel,
  selectedItem,
  isLoader,
  setIsOpenPanel,
  setSelectedItem,
  staffNames,
  coverStaffNames

}: any) => {
  const togglePanel: (externalId: string) => void = (externalId: string) => {
    if (!isOpenPanel[externalId]) {
      gtmAnalytics.pushEvent({
        event: "interact_click",
        elementType: "card",
        elementTextOrLabel: "[RemovedEventName]",
        elementLocation: "body"
      });
    }
    setIsOpenPanel((prevIsOpen: any) => ({
      ...prevIsOpen,
      [externalId]: !prevIsOpen[externalId]
    }));
    setSelectedItem(
      !isOpenPanel || isOpenPanel[externalId]
        ? schoolEventsData[0].externalId
        : externalId
    );
  };
  return (
    <div className={isOpen? "parent-event-container open-con": "parent-event-container"}>
      {schoolEventsData.map((item: any, index: any) => (
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
            isOpen={isOpen}
            isOpenPanel={isOpenPanel[item.externalId]}
            GroupDescription={item?.group?.shortName ?? ""}
            StaffName={staffNames[item.externalId] ?? ""}
            CoverStaffName={coverStaffNames[item.externalId] ?? ""}
            index={index}
            EventCardColor={getBackgroundColor(item)}
            EventTypeCode={item.eventTypeCode}
            ClassPeriodExternalId={item.classPeriodExternalId}
            EventInstanceExternalId={item.eventInstanceExternalId}
            SelectedItem={selectedItem}
            isLoader={isLoader}
          />
        </div>
      ))}
      {schoolEventsData.length < 6 && !isLoader && (
        <EventCard
          dataTestId="no-events-to-display"
          id="no-events-to-display-id"
          primaryText=""
          secondaryText=""
          status={EventCardStatus.DEFAULT}
          title="No more events"
          // inputWidth={166}
          inputHeight={67}
          className={
            isOpen
              ? `dynamiceventcard isopen event-primary-text no-events no-events-staff`
              : `dynamiceventcard isclose event-primary-text no-events no-events-staff`
          }
        />
      )}
    </div>
  );
};

export default EventContainer;
