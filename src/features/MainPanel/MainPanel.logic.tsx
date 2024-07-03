import React,{ useEffect, useState } from "react";
import MainPanelView from "./MainPanel.view";
import { ISchoolNameDataResponse } from "../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../shared/services/schoolDomain/schoolServices";

import { IMainPanelProps } from "./MainPanelProps";

const MainPanel: React.FC<IMainPanelProps> = ({ isOpen, setIsOpen }) => {

    const [schoolName, setSchoolName]:[string,React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isSchoolPrimary, setIsSchoolPrimary]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
        useEffect(() => {
          const fetchSchoolNames:() => Promise<void> = async () => {
            setIsError(false);
            try {
              const schoolData:ISchoolNameDataResponse|null = await useFetchSchoolNameData(); 
      
                const schoolNames:string = (schoolData==null)?"":schoolData.schoolName;
                const isSchoolsPrimary:boolean = (schoolData==null)?true:schoolData.isSchoolPrimary;
                
                setSchoolName(schoolNames);
                setIsError(false);
                setIsSchoolPrimary(isSchoolsPrimary);
              
            } catch (error) {
              setSchoolName("");
              setIsError(true);
            }
          };
       
          fetchSchoolNames();
        }, [setSchoolName, setIsError,setIsSchoolPrimary]);
      
  return (
    <>
            <MainPanelView
            schoolName={schoolName}
            isError={isError}
            isSchoolPrimary={isSchoolPrimary}
            isOpen={isOpen}
            setIsOpen={setIsOpen} 
            />
   </>
  );
  };
  
  export default MainPanel;