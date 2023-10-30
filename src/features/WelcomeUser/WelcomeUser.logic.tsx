import { authService } from "@essnextgen/auth-ui";
import WelcomeUserView from "./WelcomeUser.view";

const WelcomeUser: () => JSX.Element = () => {
 const userFullname: string | null =authService.getUsername();
 const userName = userFullname.split(" ")[0];
  const isLong = userName.length > 30;
  const parentClass = isLong ? "parent2" : "parent1";
  const subparentClass = `${parentClass}-subparent`;

  return (
    <WelcomeUserView
      fullName={userName}
      isLongName={isLong}
      parentClassName={parentClass}
      subparentClassName={subparentClass}
    />
  );
};

export default WelcomeUser;
