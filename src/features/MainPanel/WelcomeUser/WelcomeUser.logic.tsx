import { authService } from "@essnextgen/auth-ui";
import { useMediaQuery } from "@essnextgen/ui-kit";
import React, { useEffect, useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";
import { IWelcomeUserLogicProps } from "./WelcomeUserProps";
import { logger } from "../../../shared/components/AppInsights";

const WelcomeUser: (props: IWelcomeUserLogicProps) => JSX.Element = (
  props: IWelcomeUserLogicProps
) => {
  const {
    isApiError,
    organisationName,
    isOpen,
    isSchoolNameToBeDisplayed
  }: IWelcomeUserLogicProps = props;

  const [userFullname, setUserFullname]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    const fetchData: () => Promise<void> = async () => {
      try {
        const username: string = authService.getUsername();
        if (isMounted) {
          setUserFullname(username);
        }
      } catch (error:any) {
        logger.error({
          error:"Error fetching username",
          code: error.name
        });
        console.error('Error fetching username:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767.9px)"
  );

  const userName: string = (userFullname === null) ? "" : userFullname.split(" ")[0];
  const isLong: boolean = userName.length > 25;
  const mobileparentClass: string = isOpen ? "parent1-open" : "parent1";
  const parentClass: string = isLong ? "parent2" : mobileparentClass;
        /* istanbul ignore next */
  const subparentClass = `${isMobileView ? mobileparentClass : parentClass}-subparent` as string;

  return (
    <>
      
      <WelcomeUserView
       data-testid="subparent-element"
        fullName={userName}
        isLongName={isLong}
        parentClassName={parentClass}
        subparentClassName={subparentClass}
        organisationName={organisationName}
        isApiError={isApiError}
        isOpen={isOpen}
        isSchoolNameToBeDisplayed={isSchoolNameToBeDisplayed}
      />
    </>
  );
};

export default WelcomeUser;
