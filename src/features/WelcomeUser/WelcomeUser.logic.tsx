import { authService } from "@essnextgen/auth-ui";
import { useEffect, useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";
import { useFetchSchoolNameData } from "../../shared/services/schoolDomain/schoolServices";
import { capitalizeFirstLetterOfEachWord } from "./utils/newHomePageUtils";

const WelcomeUser: () => JSX.Element = () => {
 const userFullname: string | null =authService.getUsername();
 const userName = userFullname.split(" ")[0];
  const isLong = userName.length > 25;
  const parentClass = isLong ? "parent2" : "parent1";
  const subparentClass = `${parentClass}-subparent`;
  const [schoolNames, setSchoolNames] = useState<string>("");
 const [isError, setIsError] = useState<boolean>(false);

  async function fetchSchoolNames() {
    setIsError(false);

    try {
      const schoolData = await useFetchSchoolNameData();
      const name  = schoolData.schoolName.toLowerCase();
      const schoolName= capitalizeFirstLetterOfEachWord(name);
      setSchoolNames(schoolName);
     
    } catch (error) {
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchSchoolNames();
  }, []);

  return (
    <WelcomeUserView
      fullName={userName}
      isLongName={isLong}
      parentClassName={parentClass}
      subparentClassName={subparentClass}
      organisationName={schoolNames} 
      isApiError={isError}
      
    />
  );
};

export default WelcomeUser;
