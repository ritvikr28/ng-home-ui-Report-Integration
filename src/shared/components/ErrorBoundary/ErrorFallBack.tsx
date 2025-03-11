import "./Style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

const ErrorFallBack: () => JSX.Element = (): JSX.Element => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    <div className="elr-maindiv">
      <h3 className="elr-loading">{t("errorfallback.error-loading")}</h3>
      <div>{t("errorfallback.error-loading-text")}</div>
    </div>
  );
};

export default ErrorFallBack;
