import { useEffect, useState } from "react";
import { FetchRegisterEventData } from "../../../../../shared/services/registersDomain/registerEventsDetails";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import { IRegistersDetails } from "../../model";

const TakeRegisterEvent: () => JSX.Element = () => {

  const [registerEventData, setRegisterEventApiData] = useState<IRegistersDetails[] | null>(
    null
  );
  
  const [isError, setIsError] = useState<boolean>(false);
  
  async function fetchRegisterEventDetails() {
      setIsError(true);
      setRegisterEventApiData(null);
      try {
          const RegisterEventDetails = await FetchRegisterEventData();
          if(RegisterEventDetails !=null)
          {
            setRegisterEventApiData(RegisterEventDetails);
            setIsError(false);
          } 
          
  
        } catch (error) {
          setIsError(true);
        }
  }
  
  useEffect(() => {
      fetchRegisterEventDetails();
    }, []);
  
    return (
      <TakeRegisterEventView
      apiRegsiterEventData={registerEventData}
      apiError = {isError}
        
      />
    );
  };
  
  export default TakeRegisterEvent;
