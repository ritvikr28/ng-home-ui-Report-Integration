import { RenderResult, fireEvent, render, waitFor } from '@testing-library/react';
import { EventCardStatus } from '@essnextgen/ui-kit';
import EventContainerView from '../EventContainer.view';

describe('EventContainerView component', () => {
const setIsOpen = jest.fn();

const mockProps = {
    SchoolEventexternalId: '123',
    EventTitle: 'Test Event',
    EventTime: '12:00 PM',
    RoomCode: 'Room 101',
    EventStartDate: '2023-11-09',
    EventEndDate: '2023-11-10',
    GroupExternalId: '456',
    EventPeriodNum: "1",
    togglePanel: jest.fn((externalId) => {
        setIsOpen((prevIsOpen:any) => ({
            ...prevIsOpen,
            [externalId]: !prevIsOpen[externalId]
          }));      }),
    isOpen: true,
    GroupDescription: 'Test Group',
    StaffName: 'John Doe',
    index: 0,
    EventTypeCode:'TTPeriod',
    ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
    EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"       
  };


  test('renders EventContainerView component', async() => {
    const { getByTestId }: RenderResult = render(
      <EventContainerView
        SchoolEventexternalId={mockProps.SchoolEventexternalId}
        EventTitle={mockProps.EventTitle}
        EventTime={mockProps.EventTime}
        RoomCode={mockProps.RoomCode}
        EventStartDate={mockProps.EventStartDate}
        EventEndDate={mockProps.EventEndDate}
        GroupExternalId={mockProps.GroupExternalId}
        EventPeriodNum={mockProps.EventPeriodNum}
        togglePanel={mockProps.togglePanel}
        isOpen={mockProps.isOpen}
        GroupDescription={mockProps.GroupDescription}
        StaffName={mockProps.StaffName}
        index={mockProps.index}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode={mockProps.EventTypeCode}  
        ClassPeriodExternalId={mockProps.ClassPeriodExternalId}
        EventInstanceExternalId={mockProps.EventInstanceExternalId}   
        SelectedItem={mockProps.SchoolEventexternalId}        
      />
    );
  
    const rightPanel: HTMLElement = getByTestId("right-panel-sidepanel");
    const eventTime1: HTMLElement = getByTestId("time-value");
    const roomCode1: HTMLElement = getByTestId("location-value");
  

    await waitFor(() => {
    expect(rightPanel).toBeInTheDocument();
    expect(eventTime1).toBeInTheDocument();
    expect(roomCode1).toBeInTheDocument();
    });
  });
  test('renders EventContainerView component with Right Side Panel', async() => {
const togglePanel=jest.fn();

    const { getByTestId }: RenderResult = render(
      <EventContainerView
        SchoolEventexternalId={mockProps.SchoolEventexternalId}
        EventTitle={mockProps.EventTitle}
        EventTime={mockProps.EventTime}
        RoomCode={mockProps.RoomCode}
        EventStartDate={mockProps.EventStartDate}
        EventEndDate={mockProps.EventEndDate}
        GroupExternalId={mockProps.GroupExternalId}
        EventPeriodNum={mockProps.EventPeriodNum}
        togglePanel={togglePanel}
        isOpen={true}
        GroupDescription={mockProps.GroupDescription}
        StaffName={mockProps.StaffName}
        index={mockProps.index}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode={mockProps.EventTypeCode} 
        ClassPeriodExternalId={mockProps.ClassPeriodExternalId}
        EventInstanceExternalId={mockProps.EventInstanceExternalId} 
        SelectedItem={mockProps.SchoolEventexternalId}        
  
      />
    );
    
    const rightPanel: HTMLElement = getByTestId("right-panel-sidepanel");
    const eventTime1: HTMLElement = getByTestId("time-value");
    const roomCode1: HTMLElement = getByTestId("location-value");
    const close: HTMLElement = getByTestId("side-panel-close-button");
    await waitFor(() => {
      expect(rightPanel).toBeInTheDocument();
      expect(eventTime1).toBeInTheDocument();
      expect(roomCode1).toBeInTheDocument();
       
       });
    fireEvent.click(close);

    await waitFor(() => {   
    expect(togglePanel).toHaveBeenCalled();  
    });
  });
})
