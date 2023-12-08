import { authService } from "@essnextgen/auth-ui";
import React,{ useEffect, useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";
import { IWelcomeUserLogicProps } from "./WelcomeUserProps";

const WelcomeUser:(props: IWelcomeUserLogicProps) => JSX.Element = (
  props: IWelcomeUserLogicProps
) => {
  const {
    isApiError,
    organisationName
  }: IWelcomeUserLogicProps = props;
  
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

  return (
    <>
       {" "}
      {/*
      <SchoolNameComponent
        setSchoolNames={setSchoolNames}
        setIsError={setIsError}
      /> */}
      <WelcomeUserView
        fullName={userName}
        isLongName={isLong}
        parentClassName={parentClass}
        subparentClassName={subparentClass}
        organisationName={organisationName}
        isApiError={isApiError}
      />
    </>
  );
};

export default WelcomeUser;
