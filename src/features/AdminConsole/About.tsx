import { HeadingSubHeading } from "@essnextgen/ui-kit";
import "./style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

const About: () => JSX.Element = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    <>
      <HeadingSubHeading
        headingText={t("breadcrumbsadminconsole")}
        subHeadingText={t("adminconsole.abouttext")}
        isShowHeading
        isShowSubHeading
      />
    </>
  );
};

export default About;
