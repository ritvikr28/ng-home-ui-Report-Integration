import { HeadingSubHeading } from "@essnextgen/ui-kit";
import "./style.scss";

const About: () => JSX.Element = () => (
  <>
    <HeadingSubHeading
      headingText="Admin console"
      subHeadingText="Manage all background processes and modules' settings centrally from the Admin console."
      isShowHeading
      isShowSubHeading
    />
  </>
);

export default About;
