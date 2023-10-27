import { authService } from "@essnextgen/auth-ui";
import "./style.scss";

const Welcomeview = () => {
  const userFullname: string | null = authService.getUsername();
  const fullNameArray: string[] = userFullname.split(" ");

  const isLongName = fullNameArray[0].length > 60;
  const parentClassName = isLongName ? "parent2" : "parent1";
  const subparentClassName = `${parentClassName}-subparent`;

  return (
    <div className={`welcome-parent ${parentClassName}`}>
      <div>
        {isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`}>
              Hi <strong>{fullNameArray[0]}</strong>,
              <br />
              <span>welcome back!</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`}>
            Hi <strong>{fullNameArray[0]}</strong>, welcome back!
          </div>
        )}
        <div className="schoolname"> </div>
      </div>
    </div>
  );
};

export default Welcomeview;
