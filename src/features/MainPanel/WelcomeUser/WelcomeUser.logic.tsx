import { authService } from "@essnextgen/auth-ui";
import { useState } from "react";
import WelcomeUserView from "./WelcomeUser.view";

import SchoolNameComponent from "../../../shared/components/SchoolName/SchoolName";

const WelcomeUser: () => JSX.Element = () => {
  const userFullname: string | null = authService.getUsername();
  const userName = userFullname.split(" ")[0];
  const isLong = userName.length > 25;
  const parentClass = isLong ? "parent2" : "parent1";
  const subparentClass = `${parentClass}-subparent`;
  const [schoolNames, setSchoolNames] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

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
