import { HeadingSubHeading } from "@essnextgen/ui-kit";
import "../style.scss";

const RefreshDatabase: () => JSX.Element = () => (
  <>
    <div className="admin-heading heading-text-up admin-heading-psas1334f">
      <HeadingSubHeading
        headingText="Reset the SIMS7 and Next Gen databases"
        subHeadingText="Manage the databases to provide a clean slate for demos. Please complete the 4 steps in order to reset the databases."
        isShowHeading={true}
        isShowSubHeading={true}
      />
    </div>
  </>
);

export default RefreshDatabase;
