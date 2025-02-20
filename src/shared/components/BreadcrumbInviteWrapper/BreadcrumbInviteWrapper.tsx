import React from "react";
import { Breadcrumbs } from "@essnextgen/ui-kit";


const BreadcrumbInviteWrapper: React.FC = () => (
<Breadcrumbs
      breadcrumbActions={[
        {
          active: true,
          linkName: "Home",
          path: window.location.pathname
        },
        {
          active: false,
          linkName: "Admin console",
          path: "#"
        },
        {
            active: false,
            linkName: "Invite users",
            path: "#"
          }
      ]}
      className="essui-Breadcrumbs"
      dataTestId="breadcrumb-test-id"
      id="element-id"
      onItemClick={() => {}}
    />
  
);

export default BreadcrumbInviteWrapper;