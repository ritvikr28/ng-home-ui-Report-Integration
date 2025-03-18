import "./style.scss";
import { UseTranslationResponse, useTranslation } from "@essnextgen/ui-intl-kit";
import { IWelcomeUserViewProps } from "./WelcomeUserProps";

const WelcomeUserView: (props: IWelcomeUserViewProps) => JSX.Element = (
  props: IWelcomeUserViewProps
) => {
  const { fullName }: IWelcomeUserViewProps = props
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();

  return (
    <>
      <div className="" data-testid="subparent-element">
        <span className="new-user-name-text">
        {t("welcomePage.himsg")} <span className="new-user-name">{fullName}</span>, {t("welcomePage.welcomemsg")}
        </span>
      </div>
    </>
  )
}

export default WelcomeUserView
