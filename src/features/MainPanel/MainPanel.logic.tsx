import React,{ useEffect, useState } from "react";
import MainPanelView from "./MainPanel.view";
import { ISchoolNameDataResponse } from "../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../shared/services/schoolDomain/schoolServices";
import { capitalizeFirstLetterOfEachWord } from "./WelcomeUser/utils/newHomePageUtils";

const MainPanel: React.FC = () => {

    const [schoolName, setSchoolName]:[string,React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isSchoolPrimary, setIsSchoolPrimary]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
        useEffect(() => {
          const fetchSchoolNames:() => Promise<void> = async () => {
            setIsError(false);
            try {
              const schoolData:ISchoolNameDataResponse|null = await useFetchSchoolNameData(); 
      
                const name:string = (schoolData==null)?"":schoolData.schoolName.toLowerCase();
                const isSchoolsPrimary = (schoolData==null)?true:schoolData.isSchoolPrimary;
                const schoolNames = capitalizeFirstLetterOfEachWord(name);
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
            />
   </>
  );
  };
  
  export default MainPanel;