import React,{ useEffect, useState } from "react";
import dayjs from "dayjs";
import { IRightSidePanelProps } from "./RightSidePanelProps";
import { FetchGroupMemberDetailsData } from "../../../shared/services/schoolDomain/schoolServices";
import { IGroupMemberDetailsResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { RightSidePanelView } from "./RightSidePanel.View";

export const RightSidePanel: (props: IRightSidePanelProps) => JSX.Element = (
  props: IRightSidePanelProps
) => {
  const {
    SchoolEventexternalId,
    EventTitle,
    RoomCode,
    EventStart,
    EventEnd,
    GroupExternalId,
    EventPeriodNo,
    togglePanel,
    isOpen,
    GroupDescription,
    StaffName,
    EventTypeCode,
    ClassPeriodExternalId,
    EventInstanceExternalId
  }: IRightSidePanelProps = props;

  const [isLoader, setLoader]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [errCodeMessage, setErrCodeMessage]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [pupilDetailErrorCodeMessage, setPupilDetailErrorCodeMessage]:[string,React.Dispatch<React.SetStateAction<string>>] =useState<string>("");
  const [groupMemberDetails, setGroupMemberDetailsData]:[IGroupMemberDetailsResponse[],React.Dispatch<React.SetStateAction<IGroupMemberDetailsResponse[]>>] = useState<IGroupMemberDetailsResponse[]>([]);
  const [isPupilSectionEnable, setPupilSection]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);

  const formatEventTimeData:( EventStartDate: string,EventEndDate: string,EventPeriodNum: string)=> string = (
    EventStartDate: string,
    EventEndDate: string,
    EventPeriodNum: string
  ) => {
    const day:string= dayjs(EventStartDate).format("dddd");
    const starttime:string = dayjs(EventStartDate).format("HH:mm");
    const endtime:string = dayjs(EventEndDate).format("HH:mm");
    const eventPeriodNum:string = EventPeriodNum;
    return (EventTypeCode==="AttendanceSession") ?`${eventPeriodNum} | ${starttime} ${endtime}`: `${day} ${eventPeriodNum} | ${starttime} ${endtime}`;
  };

  const pupilSortLogic:(pupilList: IGroupMemberDetailsResponse[]) => void = (pupilList: IGroupMemberDetailsResponse[]) => {
    const sortedPupilList:IGroupMemberDetailsResponse[] = [...pupilList].sort((a, b) =>
      a.personalInfo.preferredSurname.localeCompare(
        b.personalInfo.preferredSurname
      )
    );
    setGroupMemberDetailsData(sortedPupilList);
  };

  useEffect(() => {
    const FetchGroupMemberDetails:(groupExternalId: string,EventStartDate: string,EventEndDate: string) => Promise<void> = async (
      groupExternalId: string,
      EventStartDate: string,
      EventEndDate: string
    ) => {
      try {
        if (
          EventTypeCode === "TTNTPer" ||
          (EventTypeCode === "TTPeriod" &&
            GroupExternalId === "00000000-0000-0000-0000-000000000000" &&
            (GroupDescription !== "" || GroupDescription !== null))
        ) {
          setErrCodeMessage(false);
          setLoader(false);
          setGroupMemberDetailsData([]);
          setPupilSection(false)
        } else {
          const responseData:IGroupMemberDetailsResponse[] |null = await FetchGroupMemberDetailsData(
            groupExternalId,
            EventStartDate,
            EventEndDate
          );
         if(responseData!==undefined && responseData!==null){ pupilSortLogic(responseData)}
          setErrCodeMessage(false);
          setLoader(false);
          setPupilSection(true);
        }
      } catch (error) {
        setErrCodeMessage(true);
        setLoader(false);
        setPupilDetailErrorCodeMessage(
          "We've experienced a technical issue that's stopped us from showing pupil information for this register. Please check back in a bit."
        );
        setPupilSection(true);
      }
    };

    FetchGroupMemberDetails(GroupExternalId, EventStart, EventEnd);
  }, [GroupExternalId, EventStart, EventEnd]);

  return (
    <div key={SchoolEventexternalId}>
      <RightSidePanelView
        SchoolEventexternalId={SchoolEventexternalId}
        EventTitle={EventTitle}
        EventTime={formatEventTimeData(EventStart, EventEnd, EventPeriodNo)}
        StaffName={StaffName}
        Location={RoomCode}
        GroupMembersData={groupMemberDetails}
        togglePanel={() => togglePanel(SchoolEventexternalId)}
        isOpen={isOpen}
        GroupDescription={GroupDescription}
        isLoader={isLoader}
        errCodeMessage={errCodeMessage}
        pupilDetailErrorCodeMessage={pupilDetailErrorCodeMessage}
        isPupilSectionEnable={isPupilSectionEnable}
        EventTypeCode={EventTypeCode}
        BaseGroupId={GroupExternalId}
        ClassPeriodExternalId={ClassPeriodExternalId}
        EventInstanceExternalId={EventInstanceExternalId}
        EventPeriodNo={EventPeriodNo}
        data-testid="panel-open"
      />
    </div>
  );
};
