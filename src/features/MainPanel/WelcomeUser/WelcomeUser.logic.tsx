import { authService } from "@essnextgen/auth-ui";
import React, { useEffect, useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";
import { IWelcomeUserLogicProps } from "./WelcomeUserProps";
import { logger } from "../../../shared/components/AppInsights";

const WelcomeUser: (props: IWelcomeUserLogicProps) => JSX.Element = () => {
  const [userFullname, setUserFullname]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    const fetchData: () => Promise<void> = async () => {
      try {
        const username: string = authService.getUsername();
        if (isMounted) {
          setUserFullname(username);
        }
      } catch (error: any) {
        logger.error({
          error: "Error fetching username",
          code: error.name,
        });
        console.error("Error fetching username:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const userName: string =
    userFullname === null ? "" : userFullname.split(" ")[0];

  return (
    <WelcomeUserView data-testid="subparent-element" fullName={userName} />
  );
};

export default WelcomeUser;
