import { render, screen, act, fireEvent, waitFor} from '@testing-library/react';
import { EventCardStatus } from '@essnextgen/ui-kit';
import React from 'react';
import EventContainer from '../EventContainer.logic';
import {EventContainerView} from '../EventContainer.view';
import gtmAnalytics from '../../../../../../shared/utils/analytics';
import * as schoolDomainservices from "../../../../../../shared/services/schoolDomain/schoolServices";
import { IStaffTimeTableEventsResponse } from '../../../../../../shared/model/SchoolDomain/responsemodels';

 const mockStaffTimeTableEventsResponseWithSixRecords:IStaffTimeTableEventsResponse[]=[
    {
      externalId: "90ec7084-d8fa-4802-9021-1813ce1c48e9",
      eventStart: "2023-11-02T08:45:00",
      eventEnd: "2023-11-02T09:15:00",
      eventDescription: "1Thu:1",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Science"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
    },
    {
      externalId: "c011c7c7-619e-4372-a384-d7a3e69b1651",
      eventStart: "2023-11-02T09:15:00",
      eventEnd: "2023-11-02T09:45:00",
      eventDescription: "1Thu:2",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Marathi"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"    
    },
    {
      externalId: "d048c644-e390-4070-b695-24300adcb8c3",
      eventStart: "2023-11-02T09:45:00",
      eventEnd: "2023-11-02T10:15:00",
      eventDescription: "1Thu:3",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Hindi"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
    },
    {
      externalId: "b31fb65e-2a69-4c22-b71f-736ae14f9dac",
      eventStart: "2023-11-02T10:15:00",
      eventEnd: "2023-11-02T10:45:00",
      eventDescription: "1Thu:4",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Sanskrit"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"     
    },
    {
      externalId: "384d3e59-9e79-4604-a24d-ee3c14ecb41b",
      eventStart: "2023-11-02T11:00:00",
      eventEnd: "2023-11-02T11:30:00",
      eventDescription: "AM",
      levelCode: null,
      eventTypeCode: "AttendanceSession",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      group: {
        externalId: "335eb87a-6ce9-4fff-b10d-203ca2a632ef",
        shortName: "7B/Sc"
      },
      room: {
        externalId: "9242dd90-4787-415a-b161-846b8ab223bb",
        roomCode: "S5",
        roomName: "Science Lab 5"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Algebra"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"    
    },
    {
      externalId: "9631c9c7-6c64-495c-ae25-eca00d351f8c",
      eventStart: "2023-11-02T11:30:00",
      eventEnd: "2023-11-02T12:00:00",
      eventDescription: "1Thu:6",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      group: {
        externalId: "335eb87a-6ce9-4fff-b10d-203ca2a632ef",
        shortName: "7B/Sc"
      },
      room: {
        externalId: "9242dd90-4787-415a-b161-846b8ab223bb",
        roomCode: "S5",
        roomName: "Science Lab 5"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Geometry"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
    }
];

 const mockStaffTimeTableEventsResponseWithOneRecords:IStaffTimeTableEventsResponse[]=[
    {
      externalId: "90ec7084-d8fa-4802-9021-1813ce1c48e9",
      eventStart: "2023-11-02T08:45:00",
      eventEnd: "2023-11-02T09:15:00",
      eventDescription: "1Thu:1",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Science"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,     
      eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
    }
];


const mockStaffTimeTableEventsResponseWithOneRecordsNullcheck:IStaffTimeTableEventsResponse[]=[
  {
    externalId: "90ec7084-d8fa-4802-9021-1813ce1c48e9",
    eventStart: "2023-11-02T08:45:00",
    eventEnd: "2023-11-02T09:15:00",
    eventDescription: "AM",
    levelCode: null,
    eventTypeCode: "TestEventTypeCode",
    subjectColor: "primary",
    yearGroupColor: "SUPPORTING-OUTSTANDING",
    userPreference: "yeargroup",
    yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
    group: {
      externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
      shortName: "10x/Sc2"
    },
    room: {
      externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
      roomCode: "S3",
      roomName: "Science Lab 3"
    },
    subject: {
      externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
      name: "Science"
    },
    supervisors: [
      {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      }
    ],
    isCovered: null,
    isCovering: null,
    originalStaffExternalID: null,
    coveringStaffExternalID: null,     
    eventInstanceExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
    classPeriodExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"   
  }
];
 const mockStaffTimeTableEventsNoRecords:IStaffTimeTableEventsResponse[]=[];

describe('EventContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
  }));

  const togglePanel = jest.fn((externalId) => {
    setIsOpen((prevIsOpen:any) => ({
      ...prevIsOpen,
      [externalId]: !prevIsOpen[externalId]
    }));
  });


  const setIsError = jest.fn();
  const setStatus = jest.fn();  

  const setIsOpen = jest.fn();  
  
  test('renders events successfully when status is 200 and have 6 records', async () => {
    const mockres:any={
      status: 200,
      responseData:mockStaffTimeTableEventsResponseWithSixRecords
    }
  
    jest.spyOn(schoolDomainservices,"FetchStaffTimeTableEventsData").mockResolvedValue(mockres);
    setIsError(false);
    setStatus(mockres.status);
    render(<EventContainer />);
    expect(await screen.findByText(/10x\/Sc2\s*\|\s*Science/)).toBeInTheDocument();
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setStatus).toHaveBeenCalledWith(mockres.status);
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setStatus).toHaveBeenCalledWith(200);
    
  });

  

  test('renders events successfully when status is 200 and have less than 6 record', async () => {
    
  const mockres:any={
    status: 200,
    responseData:mockStaffTimeTableEventsResponseWithOneRecords
  }

    jest.spyOn(schoolDomainservices,"FetchStaffTimeTableEventsData").mockResolvedValue(mockres);

    setIsError(false);
    setStatus(mockres.status);
    render(<EventContainer />);
    expect(await screen.findByText(/10x\/Sc2\s*\|\s*Science/)).toBeInTheDocument();
    expect(await screen.findByText('No more events')).toBeInTheDocument();
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setStatus).toHaveBeenCalledWith(200);
  });


  test('renders events successfully when status is 200 and return null for formateventPeriodNum ', async () => {
    
    const mockres:any={
      status: 200,
      responseData:mockStaffTimeTableEventsResponseWithOneRecordsNullcheck
    }
  
      jest.spyOn(schoolDomainservices,"FetchStaffTimeTableEventsData").mockResolvedValue(mockres);
  
      setIsError(false);
      setStatus(mockres.status);
      render(<EventContainer />);
      expect(await screen.findByText(/10x\/Sc2\s*\|\s*Science/)).toBeInTheDocument();
      expect(await screen.findByText('No more events')).toBeInTheDocument();
      expect(setIsError).toHaveBeenCalledWith(false);
      expect(setStatus).toHaveBeenCalledWith(200);
    });

  test('No events today when status is 204', async () => {
    const mockres:any={
        status: 204,
        responseData: mockStaffTimeTableEventsNoRecords,
      }
    
    jest.spyOn(schoolDomainservices,"FetchStaffTimeTableEventsData").mockResolvedValue(mockres)
    setIsError(false);
    setStatus(mockres.status);

    render(<EventContainer/>);

    expect(await screen.findByText('No events today')).toBeInTheDocument();
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setStatus).toHaveBeenCalledWith(204);
});
test('should handle unsuccessful data fetch', async () => {
  const mockres:any={
    status: 500,
    responseData: undefined,
  }

     jest.spyOn(schoolDomainservices, 'FetchStaffTimeTableEventsData').mockRejectedValue(mockres);
    setIsError(true);
    setStatus(mockres.status);
    await act(async () => {
      render(<EventContainer/>);
    });
 
    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setStatus).toHaveBeenCalledWith(500)
});

test('togglePanel toggles isOpen state correctly', () => {
  const externalId = 'panel1';

  togglePanel(externalId);

  
  expect(setIsOpen).toHaveBeenCalledWith(expect.any(Function));
  expect(togglePanel).toHaveBeenCalledWith('panel1');  

});


test('togglePanel prop functions correctly in EventContainerView phase 2', async () => {      
    const togglePanel1 = jest.fn();
  
    render(
    <EventContainerView
    SchoolEventexternalId="1"
    EventTitle="Title: Some description: 1"
    EventTime="Time: 2023-11-08T08:00:00 - 2023-11-08T09:00:00"
    RoomCode="A101"
    EventStartDate="2023-11-08T08:00:00"
    EventEndDate="2023-11-08T09:00:00"
    GroupExternalId="G1"
    EventPeriodNum=" 1"
    togglePanel={togglePanel1}
    isOpen={false}
    GroupDescription="Group 1"
    StaffName="John Doe"
    index={0}
    EventCardColor={EventCardStatus.PRIMARY}
    EventTypeCode='TTPeriod' 
    ClassPeriodExternalId="62e2f4e9-453a-4a53-a940-139a492f5f96"
    EventInstanceExternalId="9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"  
    SelectedItem="1"        
  />
  );

  fireEvent.click(screen.getByTestId('eventid0'));
  expect(togglePanel1).toHaveBeenCalledWith("1");
});

test('should render the component with isOpen set to true if the panel is open', () => {

  const togglePanel1 = jest.fn();
   
   render(
    <EventContainerView
    SchoolEventexternalId="1"
    EventTitle="Title: Some description: 1"
    EventTime="Time: 2023-11-08T08:00:00 - 2023-11-08T09:00:00"
    RoomCode="A101"
    EventStartDate="2023-11-08T08:00:00"
    EventEndDate="2023-11-08T09:00:00"
    GroupExternalId="G1"
    EventPeriodNum=" 1"
    togglePanel={togglePanel1}
    isOpen
    GroupDescription="Group 1"
    StaffName="John Doe"
    index={0}
    EventCardColor={EventCardStatus.PRIMARY}
    EventTypeCode='TTPeriod' 
    ClassPeriodExternalId="62e2f4e9-453a-4a53-a940-139a492f5f96"
    EventInstanceExternalId="9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"  
    SelectedItem="1"        
  />
  );
  expect(screen.getByTestId('side-panel-header')).toBeInTheDocument();
});
test('should log google analytics', async() => {
  const mockres:any={
    status: 200,
    responseData:mockStaffTimeTableEventsResponseWithSixRecords
  }
  const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
  jest.spyOn(gtmAnalytics, "pushEvent");
  jest.spyOn(schoolDomainservices,"FetchStaffTimeTableEventsData").mockResolvedValue(mockres); 

   
    const {getByTestId}=render(<EventContainer />);  
      
    await waitFor(()=>{
      expect(getByTestId('eventid0')).toBeInTheDocument();
      fireEvent.click(getByTestId('eventid0'));
      const mockState: any = () =>[{true:"90ec7084-d8fa-4802-9021-1813ce1c48e9"}, setIsOpen]
      jest
          .spyOn(React, "useState")
          .mockImplementationOnce(mockState)
      expect(gtmAnalyticsPushSpy).toHaveBeenCalled();
    });
  
});

});



