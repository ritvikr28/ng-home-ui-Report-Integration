import "./style.scss";

const EarlytAdopter: any = (): JSX.Element => (
  <>
    <div
      className="container earlyadopter-container"
      data-testid="earlyadopter-page"
    >
      <section className="content-wrapper">
        <section
          data-testid="earlyadopter-page-id"
          className="earlyadopter-interest-wrapper"
        >
          <span className="page-heading">User management</span>
          <p>This module is currently in a pilot phase with Early Adopters.</p>
          <p>
            We are currently piloting the 'Manage Permission Groups' module and
            testing the ability to view security group permissions with schools
            participating in the Early Adopter program.
          </p>
          <p>
            Following this pilot phase, we will release the module to Next Gen
            schools.
          </p>
        </section>
      </section>
    </div>
  </>
);

export default EarlytAdopter;
