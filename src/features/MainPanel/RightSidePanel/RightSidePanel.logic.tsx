import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { IRightSidePanelProps } from "./RightSidePanelProps";
import { FetchGroupMemberDetailsData } from "../../../shared/services/schoolDomain/schoolServices";
import { IGroupMemberDetailsResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { RightSidePanelView } from './RightSidePanel.View';


export const RightSidePanel: (props: IRightSidePanelProps) => JSX.Element = (props: IRightSidePanelProps) => {
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
        StaffName
        }: IRightSidePanelProps = props;

        const [isLoader, setLoader] = useState(true);
        const [errCodeMessage, setErrCodeMessage] = useState(true);
        const [pupilDetailErrorCodeMessage, setPupilDetailErrorCodeMessage] =useState('');
        const [groupMemberDetails, setGroupMemberDetailsData] = useState<IGroupMemberDetailsResponse[]>([]);




        const formatEventTimeData = (EventStartDate:string,EventEndDate:string,EventPeriodNum:string) => {
            const day = dayjs(EventStartDate).format('dddd');
            const starttime = dayjs(EventStartDate).format('HH:mm');
            const endtime = dayjs(EventEndDate).format('HH:mm');
            const eventPeriodNum = EventPeriodNum;  
            return `${day} ${eventPeriodNum} | ${starttime} ${endtime}`;
          }; 

          const pupilSortLogic = (pupilList: IGroupMemberDetailsResponse[]) => {
            const sortedPupilList = [...pupilList].sort((a, b) => a.personalInfo.preferredSurname.localeCompare(b.personalInfo.preferredSurname));
            setGroupMemberDetailsData(sortedPupilList);
        };
        
          useEffect(() => {
            const FetchGroupMemberDetails = async (groupExternalId:string,EventStartDate:string,EventEndDate:string) => {
                try {
                  if(groupExternalId==="00000000-0000-0000-0000-000000000000" ||EventTitle.toLocaleLowerCase()==="break" ||EventTitle.toLocaleLowerCase()==="meeting")
                  {
                    setErrCodeMessage(false);
                    setLoader(false); 
                     setGroupMemberDetailsData([]);  
                  }
                  else{                                      
                  const responseData  = await FetchGroupMemberDetailsData(groupExternalId,EventStartDate,EventEndDate);
                  pupilSortLogic(responseData);
                  setErrCodeMessage(false);
                  setLoader(false); 
                  }

   
                } catch (error) {
                  
                  setErrCodeMessage(true);
                  setLoader(true);
                  setPupilDetailErrorCodeMessage(
                    'The pupil register service is currently unavailable. Please try again in a bit.'
                  );
                }
              }; 
            
              FetchGroupMemberDetails(GroupExternalId,EventStart,EventEnd);
          },[GroupExternalId,EventStart,EventEnd]);


    return(
        <div  key={SchoolEventexternalId}>
            <RightSidePanelView
            SchoolEventexternalId={SchoolEventexternalId}
            EventTitle={EventTitle}
            EventTime={formatEventTimeData(EventStart,EventEnd,EventPeriodNo)}
            StaffName={StaffName}
            Location={RoomCode}
            GroupMembersData={groupMemberDetails}
            togglePanel={() => togglePanel(SchoolEventexternalId)}
            isOpen={isOpen}
            GroupDescription={GroupDescription}
            isLoader={isLoader}
            errCodeMessage={errCodeMessage}
            pupilDetailErrorCodeMessage={pupilDetailErrorCodeMessage}            
            data-testid="panel-open"  
            />
        </div>
    )
}
