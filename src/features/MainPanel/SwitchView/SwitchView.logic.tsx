import React,{ useState } from "react";
import SwitchView from "./SwitchView.view";
import "./style.scss";
import SchoolNameComponent from "../../../shared/components/SchoolName/SchoolName";

const SwitchViewLogic: () => JSX.Element = () => {
  const [schoolNames, setSchoolNames]:[string,React.Dispatch<React.SetStateAction<string>>]  = useState<string>("");
  const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>]  = useState<boolean>(false);

  return (
    <div className="switch-view">
      <SchoolNameComponent
        setSchoolNames={setSchoolNames}
        setIsError={setIsError}
      />
      <SwitchView 
      organisationName={schoolNames}
      isApiError={isError} />
    </div>
  );
};

export default SwitchViewLogic;
