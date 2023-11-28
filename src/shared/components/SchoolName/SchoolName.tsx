import React, {  useEffect } from 'react';
import { useFetchSchoolNameData } from '../../services/schoolDomain/schoolServices';
import { capitalizeFirstLetterOfEachWord } from '../../../features/MainPanel/WelcomeUser/utils/newHomePageUtils';
 
 
interface SchoolNameComponentProps {
  setSchoolNames: React.Dispatch<React.SetStateAction<string>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}
 
const SchoolNameComponent: React.FC<SchoolNameComponentProps> = ({ setSchoolNames, setIsError }) => {
  useEffect(() => {
    const fetchSchoolNames = async () => {
      setIsError(false);
      try {
        const schoolData = await useFetchSchoolNameData(); 
        const name = schoolData.schoolName.toLowerCase();
        const schoolName = capitalizeFirstLetterOfEachWord(name);
        setSchoolNames(schoolName);
        setIsError(false);
      } catch (error) {
        setIsError(true);
      }
    };
 
    fetchSchoolNames();
  }, [setSchoolNames, setIsError]);
 
  return null; 
};
 
export default SchoolNameComponent;