import { render, fireEvent } from '@testing-library/react';
import { IGroupMemberDetailsResponse } from '../../../../shared/model/SchoolDomain/responsemodels';
import { IRightSidePanelViewProps } from '../RightSidePanelViewProps';
import { RightSidePanelView } from '../RightSidePanel.View';
import gtmAnalytics from '../../../../shared/utils/analytics';
import { envConfig } from '../../../../shared/utils';

const mockListofGroupExternalId: IGroupMemberDetailsResponse[] = [
    {
      membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
      pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
        name: "7A",
      },
      personalInfo: {
        preferredForename: "Borris",
        preferredSurname: "Becker",
        preferredName: "Borris Becker",
        legalForename: "Borris",
        legalSurname: "Becker",
        legalName: "Borris Becker",
      },
      personImage: {
        organisationId:"a0818c4a-cb7c-442d-9329-346505160794",
        personExternalId:"7607fe8b-7063-423f-a5c2-26fff7c36c2d",
        photoDate:"2023-09-04T00:00:00",
        createdDate:"2023-09-04T00:00:00",
        createdBy:"Tester",
        updatedDate:"2023-09-04T00:00:00",
        updatedBy:"2023-09-04T00:00:00",
        imagePath:"test",
        isThumbnailPresent:true
      },
    },
    
    {
      membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
      pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
        name: "7C",
      },
      personalInfo: {
        preferredForename: "Harvey",
        preferredSurname: "Anderson",
        preferredName: "Harvey Anderson",
        legalForename: "Harvey",
        legalSurname: "Anderson",
        legalName: "Harvey Anderson",
      },
      personImage: null,
    }
  ];
  
const mockEventTitleClass: IRightSidePanelViewProps = {
    SchoolEventexternalId:"a765f1cc-a404-4425-8ef3-fe7446ef265c",
    EventTitle:"ClassTest",
    EventTime:"2023-11-10T09:00:00.000Z",
    Location:"Room A",
    GroupMembersData:mockListofGroupExternalId,
    togglePanel: jest.fn(),
    isOpen:true,
    GroupDescription:"AM",
    isLoader:false,
    errCodeMessage:false,
    pupilDetailErrorCodeMessage:"testerrorpupil",
    StaffName:"teststaff",
    CoverStaffName:"testCoverstaff",
    isPupilSectionEnable:true,
    EventTypeCode:"AttendanceSession",
    BaseGroupId:"testBaseGroupId",
    ClassPeriodExternalId:"4f83c773-86c2-4b9d-bd71-ce7c8ea11f02",
    EventInstanceExternalId:"bfc561ac-c28f-4aa1-bbbf-164d59cf627b",
    EventPeriodNo:"1"
  };


describe('RightSidePanelView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
      
      
      test('renders correctly', () => {
        const { getByTestId } = render(<RightSidePanelView 
            SchoolEventexternalId={mockEventTitleClass.SchoolEventexternalId}
            EventTitle={mockEventTitleClass.EventTitle}
            EventTime={mockEventTitleClass.EventTime}
            StaffName={mockEventTitleClass.StaffName}
            CoverStaffName={mockEventTitleClass.CoverStaffName}
            Location={mockEventTitleClass.Location}
            GroupMembersData={mockEventTitleClass.GroupMembersData}
            togglePanel={mockEventTitleClass.togglePanel}
            isOpen={mockEventTitleClass.isOpen}
            GroupDescription={mockEventTitleClass.GroupDescription}
            isLoader={mockEventTitleClass.isLoader}
            errCodeMessage={mockEventTitleClass.errCodeMessage}
            pupilDetailErrorCodeMessage={mockEventTitleClass.pupilDetailErrorCodeMessage}
            isPupilSectionEnable={mockEventTitleClass.isPupilSectionEnable}
            EventTypeCode={mockEventTitleClass.EventTypeCode}
            BaseGroupId={mockEventTitleClass.BaseGroupId}
            ClassPeriodExternalId={mockEventTitleClass.ClassPeriodExternalId}
            EventInstanceExternalId={mockEventTitleClass.EventInstanceExternalId}
            EventPeriodNo={mockEventTitleClass.EventPeriodNo}
        />);    
        
        expect(getByTestId('side-panel')).toBeInTheDocument();
        expect(getByTestId('right-panel-sidepanel')).toHaveTextContent('ClassTest');
      });


      test('calls togglePanel when closing the panel', () => {
        const { getByTestId } = render(<RightSidePanelView 
            SchoolEventexternalId={mockEventTitleClass.SchoolEventexternalId}
            EventTitle={mockEventTitleClass.EventTitle}
            EventTime={mockEventTitleClass.EventTime}
            StaffName={mockEventTitleClass.StaffName}
            CoverStaffName={mockEventTitleClass.CoverStaffName}
            Location={mockEventTitleClass.Location}
            GroupMembersData={mockEventTitleClass.GroupMembersData}
            togglePanel={mockEventTitleClass.togglePanel}
            isOpen={mockEventTitleClass.isOpen}
            GroupDescription={mockEventTitleClass.GroupDescription}
            isLoader={mockEventTitleClass.isLoader}
            errCodeMessage={mockEventTitleClass.errCodeMessage}
            pupilDetailErrorCodeMessage={mockEventTitleClass.pupilDetailErrorCodeMessage}
            isPupilSectionEnable={mockEventTitleClass.isPupilSectionEnable}
            EventTypeCode={mockEventTitleClass.EventTypeCode}
            BaseGroupId={mockEventTitleClass.BaseGroupId}
            ClassPeriodExternalId={mockEventTitleClass.ClassPeriodExternalId}
            EventInstanceExternalId={mockEventTitleClass.EventInstanceExternalId}
            EventPeriodNo={mockEventTitleClass.EventPeriodNo}
        />);    
        fireEvent.click(getByTestId('close-button'));
    
        expect(mockEventTitleClass.togglePanel).toHaveBeenCalledWith(mockEventTitleClass.SchoolEventexternalId);
      });

      test('handles "Take register" button click correctly for AttendanceSession', () => {
        const { getByTestId } = render(<RightSidePanelView 
            SchoolEventexternalId={mockEventTitleClass.SchoolEventexternalId}
            EventTitle={mockEventTitleClass.EventTitle}
            EventTime={mockEventTitleClass.EventTime}
            StaffName={mockEventTitleClass.StaffName}
            CoverStaffName={mockEventTitleClass.CoverStaffName}
            Location={mockEventTitleClass.Location}
            GroupMembersData={mockEventTitleClass.GroupMembersData}
            togglePanel={mockEventTitleClass.togglePanel}
            isOpen={mockEventTitleClass.isOpen}
            GroupDescription={mockEventTitleClass.GroupDescription}
            isLoader={mockEventTitleClass.isLoader}
            errCodeMessage={mockEventTitleClass.errCodeMessage}
            pupilDetailErrorCodeMessage={mockEventTitleClass.pupilDetailErrorCodeMessage}
            isPupilSectionEnable={mockEventTitleClass.isPupilSectionEnable}
            EventTypeCode={mockEventTitleClass.EventTypeCode}
            BaseGroupId={mockEventTitleClass.BaseGroupId}
            ClassPeriodExternalId={mockEventTitleClass.ClassPeriodExternalId}
            EventInstanceExternalId={mockEventTitleClass.EventInstanceExternalId}
            EventPeriodNo={mockEventTitleClass.EventPeriodNo}
        />);    
        fireEvent.click(getByTestId('take-reg-button'));
    
        expect(window.location.href).toBe('http://localhost/');
      });

      test('handles "Take register" button click correctly for a different condition', () => {       
        const { getByTestId } = render(<RightSidePanelView 
            SchoolEventexternalId={mockEventTitleClass.SchoolEventexternalId}
            EventTitle={mockEventTitleClass.EventTitle}
            EventTime={mockEventTitleClass.EventTime}
            StaffName={mockEventTitleClass.StaffName}
            CoverStaffName={mockEventTitleClass.CoverStaffName}
            Location={mockEventTitleClass.Location}
            GroupMembersData={mockEventTitleClass.GroupMembersData}
            togglePanel={mockEventTitleClass.togglePanel}
            isOpen={mockEventTitleClass.isOpen}
            GroupDescription={mockEventTitleClass.GroupDescription}
            isLoader={mockEventTitleClass.isLoader}
            errCodeMessage={mockEventTitleClass.errCodeMessage}
            pupilDetailErrorCodeMessage={mockEventTitleClass.pupilDetailErrorCodeMessage}
            isPupilSectionEnable={mockEventTitleClass.isPupilSectionEnable}
            EventTypeCode="AnotherEventType"
            BaseGroupId={mockEventTitleClass.BaseGroupId}
            ClassPeriodExternalId={mockEventTitleClass.ClassPeriodExternalId}
            EventInstanceExternalId={mockEventTitleClass.EventInstanceExternalId}
            EventPeriodNo={mockEventTitleClass.EventPeriodNo}
        />);    
        fireEvent.click(getByTestId('take-reg-button'));
    
        expect(`${window.location.href}/1`).toBe(`${window.location.href}/1`);       
      });
      test('test google analytics', () => {
        const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
        jest.spyOn(gtmAnalytics, "pushEvent");
        const { getByTestId } = render(<RightSidePanelView 
            SchoolEventexternalId={mockEventTitleClass.SchoolEventexternalId}
            EventTitle={mockEventTitleClass.EventTitle}
            EventTime={mockEventTitleClass.EventTime}
            StaffName={mockEventTitleClass.StaffName}
            CoverStaffName={mockEventTitleClass.CoverStaffName}
            Location={mockEventTitleClass.Location}
            GroupMembersData={mockEventTitleClass.GroupMembersData}
            togglePanel={mockEventTitleClass.togglePanel}
            isOpen={mockEventTitleClass.isOpen}
            GroupDescription={mockEventTitleClass.GroupDescription}
            isLoader={mockEventTitleClass.isLoader}
            errCodeMessage={mockEventTitleClass.errCodeMessage}
            pupilDetailErrorCodeMessage={mockEventTitleClass.pupilDetailErrorCodeMessage}
            isPupilSectionEnable={mockEventTitleClass.isPupilSectionEnable}
            EventTypeCode="AnotherEventType"
            BaseGroupId={mockEventTitleClass.BaseGroupId}
            ClassPeriodExternalId={mockEventTitleClass.ClassPeriodExternalId}
            EventInstanceExternalId={mockEventTitleClass.EventInstanceExternalId}
            EventPeriodNo={mockEventTitleClass.EventPeriodNo}
        />);    
        
        fireEvent.click(getByTestId('link-click-0'));
        expect(gtmAnalyticsPushSpy).toHaveBeenCalled();
        expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
        expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
          event: "click",
          linkText: "[RemovedPupilName]",
          linkUrl: `${envConfig.LEARNER_UI_URL}/profile/f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1`,
          clickType: "link",
          clickLocation: "right_bar"
        });
      });
});
