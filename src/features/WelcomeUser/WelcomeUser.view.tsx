import "./style.scss";
import { IWelcomeUserViewProps } from "./props";

const WelcomeUserView: (props: IWelcomeUserViewProps) => JSX.Element = (
  props: IWelcomeUserViewProps
) => {
  const {
    fullName,
    isLongName,
    parentClassName,
    subparentClassName
  }: IWelcomeUserViewProps = props;

  return (
    <div className={`welcome-parent ${parentClassName}`}>
      <div>
        {isLongName ? (
          <>
            <div className={`subparent ${subparentClassName}`}>
              <div>Hi <strong>{fullName}</strong>,</div>
              <span>welcome back!</span>
            </div>
          </>
        ) : (
          <div className={`subparent ${subparentClassName}`}>
            Hi <strong>{fullName}</strong>, welcome back!
          </div>
        )}
        <div className="schoolname"> </div>
      </div>
    </div>
  );
};

export default WelcomeUserView;
