import { HeadingSubHeading } from "@essnextgen/ui-kit";
import "./style.scss";

const About: () => JSX.Element = () => (
  <div className="admin-heading heading-text-up admin-heading-psas1334f">
    <HeadingSubHeading
      headingText="Admin console"
      subHeadingText="Manage all background processes and modules' settings centrally from the Admin console."
      isShowHeading={true}
      isShowSubHeading={true}
    />
  </div>
);

export default About;
 