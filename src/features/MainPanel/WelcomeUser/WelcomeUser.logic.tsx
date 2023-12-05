import { authService } from "@essnextgen/auth-ui";
import React,{ useEffect, useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";

import SchoolNameComponent from "../../../shared/components/SchoolName/SchoolName";

const WelcomeUser: () => JSX.Element = () => {
  
  const [userFullname, setUserFullname]:[string | null,React.Dispatch<React.SetStateAction<string | null>>]  = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const fetchData:() => Promise<void> = async () => {
      try {
        const username:string = authService.getUsername();
        if (isMounted) {
          setUserFullname(username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);


  const userName:string = (userFullname===null)?"":userFullname.split(" ")[0];
  const isLong:boolean = userName.length > 25;
  const parentClass:string = isLong ? "parent2" : "parent1";
  const subparentClass = `${parentClass}-subparent` as string;
  const [schoolNames, setSchoolNames]:[string,React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  return (
    <>
      {" "}
      <SchoolNameComponent
        setSchoolNames={setSchoolNames}
        setIsError={setIsError}
      />
      <WelcomeUserView
        fullName={userName}
        isLongName={isLong}
        parentClassName={parentClass}
        subparentClassName={subparentClass}
        organisationName={schoolNames}
        isApiError={isError}
      />
    </>
  );
};

export default WelcomeUser;
