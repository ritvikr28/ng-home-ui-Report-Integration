import { RenderResult, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCardStatus } from '@essnextgen/ui-kit';
import EventContainerView from '../EventContainer.view';


describe('EventContainerView component', () => {
const setIsOpen = jest.fn();
const togglePanel=jest.fn();
const mockProps = {
    SchoolEventexternalId: '123',
    EventTitle: 'Test Event',
    EventTime: {
      truncated: '12:00 PM',
      full: '12:00 PM - 1:00 PM'
    },
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
    isOpenPanel:true,
    GroupDescription: 'Test Group',
    StaffName: 'John Doe',
    CoverStaffName: "Brenda Peters",
    index: 0,
    EventTypeCode:'TTPeriod',
    ClassPeriodExternalId:"62e2f4e9-453a-4a53-a940-139a492f5f96",
    EventInstanceExternalId:"9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
    EventDescription:"test",
    ExternalId:'123'
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
        isOpenPanel={mockProps.isOpenPanel}
        GroupDescription={mockProps.GroupDescription}
        StaffName={mockProps.StaffName}
        CoverStaffName={mockProps.CoverStaffName}
        index={mockProps.index}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode={mockProps.EventTypeCode}
        ClassPeriodExternalId={mockProps.ClassPeriodExternalId}
        EventInstanceExternalId={mockProps.EventInstanceExternalId}
        SelectedItem={mockProps.SchoolEventexternalId} 
        EventDescription={mockProps.EventDescription} 
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
        isOpen
        isOpenPanel
        GroupDescription={mockProps.GroupDescription}
        StaffName={mockProps.StaffName}
        CoverStaffName={mockProps.CoverStaffName}
        index={mockProps.index}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode={mockProps.EventTypeCode}
        ClassPeriodExternalId={mockProps.ClassPeriodExternalId}
        EventInstanceExternalId={mockProps.EventInstanceExternalId}
        SelectedItem={mockProps.SchoolEventexternalId} 
        EventDescription={mockProps.EventDescription} 
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
  it('should have the correct className when SelectedItem is equal to SchoolEventexternalId and index is 0', () => {
 
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
        isOpen
        GroupDescription={mockProps.GroupDescription}
        StaffName={mockProps.StaffName}
        CoverStaffName={mockProps.CoverStaffName}
        index={mockProps.index}
        EventCardColor={EventCardStatus.PRIMARY}
        EventTypeCode={mockProps.EventTypeCode} 
        ClassPeriodExternalId={mockProps.ClassPeriodExternalId}
        EventInstanceExternalId={mockProps.EventInstanceExternalId} 
        SelectedItem={mockProps.SchoolEventexternalId}        
        EventDescription={mockProps.EventDescription}
      />);

    const eventCard = getByTestId('eventid0');
    expect(eventCard).toHaveClass('dynamiceventcard event-primary-text event-highlight-0');
  });
  test('should have the correct styling for selected items with index 1', async() => {
    const togglePanel1 = jest.fn();
    const props = {
       index: 1,
      EventCardColor: 'improvement'
    };
 
    const component = <EventContainerView
      SchoolEventexternalId="1"
      EventTitle="Title: Some description: 1"
      EventTime={{
        truncated: "08:00 AM - 09:00 AM", 
        full: "2023-11-08T08:00:00 - 2023-11-08T09:00:00"
    }}
      RoomCode="A101"
      EventStartDate="2023-11-08T08:00:00"
      EventEndDate="2023-11-08T09:00:00"
      GroupExternalId="G1"
      EventPeriodNum=" 1"
      togglePanel={togglePanel1}
      isOpen={false}
      GroupDescription="Group 1"
      StaffName="John Doe"
      CoverStaffName="Brenda Peters"
      index={2}
      EventCardColor={EventCardStatus.IMPROVEMENT}
      EventTypeCode='TTPeriod'
      ClassPeriodExternalId="62e2f4e9-453a-4a53-a940-139a492f5f96"
      EventInstanceExternalId="9b9fa124-fcda-4db0-ad71-0f73e7c09ea7"
      SelectedItem="1" 
      EventDescription="test" 
      />;
  const { getByTestId } = render(component);
    const element = getByTestId('eventid2');   
    userEvent.click(getByTestId('eventid2'));
  expect(togglePanel1).toHaveBeenCalled();
  expect(togglePanel1).toHaveBeenCalledWith("1");
    expect(element).toHaveClass('essui-event','essui-event--improvement' ,'dynamiceventcard', 'event-primary-text', `event-${props.EventCardColor}-1`);
  });
})
