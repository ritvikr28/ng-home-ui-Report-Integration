import React, {  useEffect } from 'react';
import { useFetchSchoolNameData } from '../../services/schoolDomain/schoolServices';
import { capitalizeFirstLetterOfEachWord } from '../../../features/MainPanel/WelcomeUser/utils/newHomePageUtils';
import {ISchoolNameDataResponse} from "../../model/SchoolDomain/responsemodels"
 
 
interface SchoolNameComponentProps {
  setSchoolNames: React.Dispatch<React.SetStateAction<string>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}
 
const SchoolNameComponent: React.FC<SchoolNameComponentProps> = ({ setSchoolNames, setIsError }) => {
  useEffect(() => {
    const fetchSchoolNames:() => Promise<void> = async () => {
      setIsError(false);
      try {
        const schoolData:ISchoolNameDataResponse|undefined = await useFetchSchoolNameData(); 
        if(schoolData!==undefined)
        {
          const name:string = schoolData.schoolName.toLowerCase();
          const schoolName:string = capitalizeFirstLetterOfEachWord(name);
          setSchoolNames(schoolName);
          setIsError(false);
        }
      } catch (error) {
        setIsError(true);
      }
    };
 
    fetchSchoolNames();
  }, [setSchoolNames, setIsError]);
 
  return null; 
};
 
export default SchoolNameComponent;