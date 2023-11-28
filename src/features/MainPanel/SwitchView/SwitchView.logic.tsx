import { useState } from "react";
import SwitchView from "./SwitchView.view";
import "./style.scss";
import SchoolNameComponent from "../../../shared/components/SchoolName/SchoolName";

const SwitchViewLogic: () => JSX.Element = () => {
  const [schoolNames, setSchoolNames] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

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
