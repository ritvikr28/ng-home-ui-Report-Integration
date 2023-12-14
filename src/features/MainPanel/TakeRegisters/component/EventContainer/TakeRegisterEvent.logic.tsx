import React,{ useEffect, useState } from "react";
import { FetchRegisterEventData } from "../../../../../shared/services/registersDomain/registerEventsDetails";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

const TakeRegisterEvent: () => JSX.Element = () => {
  const [registerEventData, setRegisterEventApiData]:[IRegistersDetails[] | null,React.Dispatch<React.SetStateAction<IRegistersDetails[] | null>>]  = useState< IRegistersDetails[] | null>(null);

  const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>]  = useState<boolean>(false); 

    const  fetchRegisterEventDetails:() => Promise<void>= async ()=>{
    setIsError(true);
    setRegisterEventApiData(null);
    try {
      const RegisterEventDetails:IRegistersDetails[]| null  = await FetchRegisterEventData();
      setRegisterEventApiData(RegisterEventDetails);
      setIsError(false);      
    
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
      apiError={isError}      
    />
  );
};

export default TakeRegisterEvent;
