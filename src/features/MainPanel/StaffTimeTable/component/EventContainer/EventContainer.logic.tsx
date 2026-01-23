import React, { useState } from "react";
import "./style.scss";
import {
  EventCard,
  EventCardStatus,
  Grid,
  GridItem,
  Loader,
  LoaderType,
  useMediaQuery
} from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import {
  TFunction,
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { useStaffTimetableAndRegisterDetails } from "../../../../../shared/context/StaffTimetableAndRegisterDetailsContext";
import { EventContainerView } from "./EventContainer.view";
import { IStaffTimeTableEventsResponse } from "../../../../../shared/model/SchoolDomain/responsemodels";
import { getBackgroundColor } from "../../../../../shared/utils/colors";
import gtmAnalytics from "../../../../../shared/utils/analytics";
import { fetchStaffDetails } from "../../../../../shared/services/staffDomain/staffServices";
import { envConfig } from "../../../../../shared/utils";


// Helper: filter and sort today's events
const getTodayEvents: (events: IStaffTimeTableEventsResponse[]) => IStaffTimeTableEventsResponse[] = (events: IStaffTimeTableEventsResponse[]): IStaffTimeTableEventsResponse[] => {
  const now = new Date();
  return events
    .filter(event => {
      const eventStart = new Date(event.eventStart);
      const eventEnd = new Date(event.eventEnd);
      return (
        eventStart.getFullYear() === now.getFullYear() &&
        eventStart.getMonth() === now.getMonth() &&
        eventStart.getDate() === now.getDate() &&
        eventEnd >= now
      );
    })
    .sort((a, b) => new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime())
    .slice(0, 6);
};

// Helper: handle conditional rendering
// ==================== Conditional Content ====================
const getConditionalContent:(isError: boolean, isLoading: boolean, data: any, t: TFunction<"translation", undefined>) => React.ReactNode = (
  isError: boolean,
  isLoading: boolean,
  data: any,
  t: TFunction<"translation", undefined>
): React.ReactNode => {
  if (isError || (data && data.status !== 200 && data.status !== 204 && data.status !== 0)) {
    return null; // explicitly return null for error
  }

  if (
    data &&
    data.status === 204 &&
    (!data.payload?.staffTimetableEventsResponse ||
      data.payload.staffTimetableEventsResponse.length === 0)
  ) {
    return renderNoEventsCard(t);
  }

  if (isLoading) {
    return (
      <Loader
        dataTestId="staff-data-loader"
        className="reg-loader loader-margin loader-size reg-loader-margin"
        loaderText="Loading..."
        loaderType={LoaderType.Circular}
      />
    );
  }

  return null; // instead of undefined, return null explicitly
};


const EventContainer: React.FC<{ isOpen: boolean }> = ({ isOpen }): JSX.Element | null => {
  const { data, isLoading, isError }: { data: any; isLoading: boolean; isError: boolean } = useStaffTimetableAndRegisterDetails();
  const [selectedItem, setSelectedItem]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [isOpenPanel, setIsOpenPanel]: [Record<string, boolean>, React.Dispatch<React.SetStateAction<Record<string, boolean>>>] = useState<Record<string, boolean>>({});
  const [staffNames, setStaffNames]: [Record<string, string>, React.Dispatch<React.SetStateAction<Record<string, string>>>] = useState<Record<string, string>>({});
  const [coverStaffNames, setCoverStaffNames]: [Record<string, string>, React.Dispatch<React.SetStateAction<Record<string, string>>>] = useState<Record<string, string>>({});
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1117px)"
  );
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

  React.useEffect(() => {
    if (data && data.status && data.payload?.staffTimetableEventsResponse) {
      const responseData: IStaffTimeTableEventsResponse[] = data.payload.staffTimetableEventsResponse;
      if (responseData.length > 0) {
        setSelectedItem(responseData[0].externalId);
      }
      const staffNamePromises: Promise<string>[] = responseData.map(
        (eventData: IStaffTimeTableEventsResponse) => formatStaffName(eventData)
      );
      const coverStaffNamePromises: Promise<string>[] = responseData.map(
        (eventData: IStaffTimeTableEventsResponse) => formatCoverStaffName(eventData)
      );
      Promise.all(staffNamePromises).then((resolvedStaffNames) => {
        const staffNamesMap: Record<string, string> = {};
        responseData.forEach((eventData, index) => {
          staffNamesMap[eventData.externalId] = resolvedStaffNames[index];
        });
        setStaffNames(staffNamesMap);
      });
      Promise.all(coverStaffNamePromises).then((resolvedCoverStaffNames) => {
        const coverStaffNamesMap: Record<string, string> = {};
        responseData.forEach((eventData, index) => {
          coverStaffNamesMap[eventData.externalId] = resolvedCoverStaffNames[index];
        });
        setCoverStaffNames(coverStaffNamesMap);
      });
    }
  }, [data]);

  // Use helper for conditional rendering
  const conditionalContent: React.ReactNode = getConditionalContent(isError, isLoading, data, t);
  if (conditionalContent) {
    return <>{conditionalContent}</>;
  }

  // Use helper for event filtering/sorting
  const schoolEventsData: IStaffTimeTableEventsResponse[] = getTodayEvents(data?.payload?.staffTimetableEventsResponse || []);

  return (
    <>
      {returnEventContainer({
        schoolEventsData,
        isOpen,
        isOpenPanel,
        selectedItem,
        isLoader: isLoading,
        setIsOpenPanel,
        setSelectedItem,
        staffNames,
        coverStaffNames,
        isMobileView,
        t
      })}
    </>
  );
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

const formatEventTimeData: (eventTimeData: IStaffTimeTableEventsResponse) => {
  truncated: string;
  full: string;
} = (eventTimeData: IStaffTimeTableEventsResponse) => {
  // const day: string = dayjs(eventTimeData.eventStart).format("ddd");
  const starttime: string = dayjs(eventTimeData.eventStart).format("HH:mm");
  const endtime: string = dayjs(eventTimeData.eventEnd).format("HH:mm");
  const eventPeriodNum: string = formateventPeriodNum(eventTimeData);

  const eventDescription: string =
    eventTimeData.eventTypeCode === "AttendanceSession"
      ? `${eventPeriodNum}`
      : `${eventPeriodNum}`;

  const truncatedDescription: string =
    eventDescription.length > 7
      ? `${eventDescription.substring(0, 7)}...`
      : eventDescription;

  return {
    truncated: `${truncatedDescription} | ${starttime} - ${endtime}`,
    full: `${eventDescription} | ${starttime} - ${endtime}`
  };
};

const hasStaffTimeTableV2: boolean = hasFeaturePermission(
  `${envConfig.APPLICATION}`,
  "IsStaffV2"
);

const formatRoomCode: (
  staffTimeTableEventData: IStaffTimeTableEventsResponse
) => string = (staffTimeTableEventData: IStaffTimeTableEventsResponse) => {
  const roomCode: string = hasStaffTimeTableV2 ? staffTimeTableEventData?.roomCover?.roomCode || staffTimeTableEventData?.room?.roomCode : staffTimeTableEventData?.room?.roomCode;
  return roomCode;
};

export const formatStaffName = async (
  eventTimeData: IStaffTimeTableEventsResponse
): Promise<string> => {
  const {
    originalStaffExternalID,
    coveringStaffExternalID,
    isCovered,
    isCovering,
    supervisors
  }: IStaffTimeTableEventsResponse = eventTimeData;

  if (
    originalStaffExternalID &&
    coveringStaffExternalID &&
    !isCovered &&
    isCovering
  ) {
    const staffDetails: any = await fetchStaffDetails([
      originalStaffExternalID
    ]);
    const originalStaffDetail: any = staffDetails?.payload?.find(
      (x: any) =>
        x.externalId.toUpperCase() === originalStaffExternalID.toUpperCase()
    );
    if (!originalStaffDetail) {
      return "";
    }
    return `${originalStaffDetail.forename} ${originalStaffDetail.surname}`;
  }
  return `${supervisors[0].forename} ${supervisors[0].surname}`;
};

export const formatCoverStaffName = async (
  eventTimeData: IStaffTimeTableEventsResponse
): Promise<string> => {
  const {
    originalStaffExternalID,
    coveringStaffExternalID,
    isCovered,
    isCovering,
    supervisors
  }: IStaffTimeTableEventsResponse = eventTimeData;

  if (originalStaffExternalID && coveringStaffExternalID) {
    if (isCovered && !isCovering) {
      const coveringStaffIds: string[] = coveringStaffExternalID
        .split(",")
        .map((id) => id.toUpperCase().trim());

      if (coveringStaffIds.length > 0) {
        const staffDetails: any = await fetchStaffDetails(coveringStaffIds);
        const coverStaffNames: string = staffDetails?.payload
          ?.filter((detail: any) =>
            coveringStaffIds.includes(detail.externalId.toUpperCase())
          )
          .map((detail: any) => `${detail.forename} ${detail.surname}`)
          .join(", ");

        return coverStaffNames || "";
      }
    } else if (!isCovered && isCovering) {
      return `${supervisors[0].forename} ${supervisors[0].surname}`;
    }
  }
  return "";
};

const formateventPeriodNum = (
  eventTimeData: IStaffTimeTableEventsResponse
): string => {
  /* istanbul ignore next */
  if (eventTimeData.eventDescription) {
    return eventTimeData.eventDescription;
  }

  if (eventTimeData.eventTypeCode === "AttendanceSession") {
    /* istanbul ignore next */
    return eventTimeData.eventDescription || "";
  }
  return "";
};

const renderNoEventsCard: (t?: TFunction<"translation", undefined>) => JSX.Element = (t) => (
    <Grid>
      <GridItem
        key="no-events" // Ensure unique key for each item
        sm
        md={2}
        lg={2}
        className="c-clear-padding"
      >
        <div className="new-event-card-box">
          <EventCard
            dataTestId="no-events-today"
            id="no-events-today-id"
            primaryText=""
            secondaryText=""
            status={EventCardStatus.DEFAULT}
            title={t && t("stafftimetable.noeventdisplay") || "No events to display"}
            inputHeight={67}
            className="dynamiceventcard event-primary-text no-events no-events-staff"
          />
        </div>
      </GridItem>
    </Grid>
  );

const returnEventContainer: React.FC<{
  schoolEventsData: IStaffTimeTableEventsResponse[];
  isOpen: boolean;
  isOpenPanel: Record<string, boolean>;
  selectedItem: string;
  isLoader: boolean;
  setIsOpenPanel: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  staffNames: Record<string, string>;
  coverStaffNames: Record<string, string>;
  isMobileView?: boolean;
  t: any
}> = ({
  schoolEventsData,
  isOpen,
  isOpenPanel,
  selectedItem,
  isLoader,
  setIsOpenPanel,
  setSelectedItem,
  staffNames,
  coverStaffNames,
  isMobileView,
  t
}) => {
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

    const baseValue: number = schoolEventsData.length < 5 ? 3 : 2;
    const finalValue: number = isOpen && !isMobileView ? 2 : 3;
    const cardCol: number = isOpen ? finalValue : baseValue;

    return (
      <div>
        <Grid>
          {schoolEventsData.map((item: any, index: number) => (
            <GridItem
              key={item.externalId} // Ensure unique key for each item
              sm={4}
              md={2}
              lg={cardCol}
              className="c-clear-padding"
            >
              <div className="new-event-card-box">
                <EventContainerView
                  SchoolEventexternalId={item.externalId}
                  EventTitle={formatEventTitleData(item)}
                  EventTime={formatEventTimeData(item)}
                  RoomCode={formatRoomCode(item)}
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
                  EventDescription={item.eventDescription}
                  ClassPeriodExternalId={item.classPeriodExternalId}
                  EventInstanceExternalId={item.eventInstanceExternalId}
                  SelectedItem={selectedItem}
                  isLoader={isLoader}
                />
              </div>
            </GridItem>
          ))}

          {/* Show "No More Events" only ONCE when schoolEventsData.length < 6 */}
          {schoolEventsData.length < 6 && !isLoader && (
            <GridItem sm={4} md={2} lg={cardCol} className="c-clear-padding">
              <div className="new-event-card-box">
                <EventCard
                  dataTestId="no-events-to-display"
                  id="no-events-to-display-id"
                  primaryText=""
                  secondaryText=""
                  status={EventCardStatus.DEFAULT}
                  title= {t("stafftimetable.nomoreevent")} 
                  inputHeight={67}
                />
              </div>
            </GridItem>
          )}
        </Grid>
      </div>
    );
  };

export default EventContainer;
