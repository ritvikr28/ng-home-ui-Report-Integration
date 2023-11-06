import { useEffect } from "react";
import { FetchRegisterEventData } from "../../../../../shared/services/registersDomain/registerEventsDetails";
import TakeRegisterEventView from "./TakeRegisterEvent.view";


const TakeRegisterEvent: () => JSX.Element = () => {

async function fetchRegisterEventDetails() {
   
     await FetchRegisterEventData();
        
}

useEffect(() => {
    fetchRegisterEventDetails();
  }, []);

  return (
    <TakeRegisterEventView
   
    />
  );
};

export default TakeRegisterEvent;