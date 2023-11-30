import { useEffect, useState } from "react";
import { FetchRegisterEventData } from "../../../../../shared/services/registersDomain/registerEventsDetails";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

const TakeRegisterEvent: () => JSX.Element = () => {
  const [registerEventData
    , setRegisterEventApiData] = useState<
    IRegistersDetails[] | null
  >(null);

  const [isError, setIsError] = useState<boolean>(false);

  async function fetchRegisterEventDetails() {
    setIsError(true);
    setRegisterEventApiData(null);
    try {
      const RegisterEventDetails = await FetchRegisterEventData();
      setRegisterEventApiData(RegisterEventDetails);
      setIsError(false);
    } catch (error) {
      console.error("Error while fetching data:", error);
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
