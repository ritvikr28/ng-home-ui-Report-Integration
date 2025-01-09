import "./style.scss";
import { Breadcrumbs } from "@essnextgen/ui-kit";

const EarlytAdopterPage: any = ({}): JSX.Element => (
  <>
    <div
      className="container earlyadopter-container"
      data-testid="earlyadopter-page"
    >
      <section className="content-wrapper">
        <Breadcrumbs
          breadcrumbActions={[
            {
              linkName: "Home",
              path: window.location.origin
            },
            {
              linkName: "Permission groups",
              path: "#"
            }
          ]}
          className="essui-Breadcrumbs"
          dataTestId="breadcrumb-test-id"
          id="element-id"
          onItemClick={() => {}}
        />
        <section
          data-testid="earlyadopter-page-id"
          className="earlyadopter-interest-wrapper"
        >
          <span className="page-heading">
            Permission Groups
          </span>
          <p>
          The 'Permission Groups' module is currently in a pilot phase with Early Adopters. 
          </p>
          <p>
          We are currently testing the ability to view security group permissions with schools participating in the Early Adopter program.
          </p>
          <p>
          Following this pilot phase, we will release the 'Permission Groups' module to Next Gen schools
          </p>
        </section>
      </section>
    </div>
  </>
);

export default EarlytAdopterPage;
