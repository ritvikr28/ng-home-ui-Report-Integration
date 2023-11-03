import { useEffect, useState } from "react";
import { FetchStaffTimeTableEventsData } from "../../../../../shared/services/schoolDomain/schoolServices";
import { EventContainerView } from "./EventContainer.view";

const EventContainer: () => JSX.Element = () => {
    const [isError, setIsError] = useState<boolean>(false);

    
    async function FetchStaffTimeTableEvents() {
        setIsError(false);
    
        try {
          const StaffTimeTableEventsData = await FetchStaffTimeTableEventsData();  
          console.log(JSON.stringify(StaffTimeTableEventsData),"Data:");
          console.log(JSON.stringify(isError),"isError:");
        } catch (error) {
          setIsError(true);
        }
      };
    
      useEffect(() => {
        FetchStaffTimeTableEvents();
      }, []);

      return (
        <EventContainerView          
        />
      )

};

export default EventContainer;