import React, { useEffect, useState } from "react";
import { Loader, LoaderType } from "@essnextgen/ui-kit";
import { FetchRegisterEventData } from "../../../../../shared/services/registersDomain/registerEventsDetails";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";
import "./carousalstyle.scss";

/* eslint-disable */
const TakeRegisterEvent: ({ isOpen, setIsOpen }: any) => JSX.Element = ({
  isOpen,
  setIsOpen,
}) => {
  /* eslint-enable */
  const [registerEventData, setRegisterEventApiData]: [
    IRegistersDetails[] | null,
    React.Dispatch<React.SetStateAction<IRegistersDetails[] | null>>
  ] = useState<IRegistersDetails[] | null>(null);

  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [isLoader, setLoader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);

  const fetchRegisterEventDetails: () => Promise<void> = async () => {
    setIsError(true);
    setRegisterEventApiData(null);
    try {
      const RegisterEventDetails: IRegistersDetails[] | null =
        await FetchRegisterEventData();
      setRegisterEventApiData(RegisterEventDetails);
      setIsError(false);
      setLoader(false);
    } catch (error) {
      setIsError(true);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchRegisterEventDetails();
  }, []);

  if (isLoader) {
    return (
      <div style={{ marginTop: "20px", height: "120px" }}>
        <Loader
          dataTestId="reg-error-loader"
          className="reg-loader loader-margin loader-reg-size reg-loader-margin reg-size-margin"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
        />
      </div>
    );
  }
  return (
    <TakeRegisterEventView
      apiRegsiterEventData={registerEventData}
      apiError={isError}
      isOpen={isOpen}
    />
  );
};

export default TakeRegisterEvent;
